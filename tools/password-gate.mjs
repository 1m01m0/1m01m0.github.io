#!/usr/bin/env node

import {
  createCipheriv,
  createDecipheriv,
  pbkdf2Sync,
  randomBytes,
} from "node:crypto";
import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const TOOL_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(TOOL_DIR, "..");
const INDEX_PATH = path.join(ROOT_DIR, "index.html");
const TEMP_INDEX_PATH = path.join(ROOT_DIR, "index.html.tmp");
const PUBLIC_SCRIPT_PATH = path.join(ROOT_DIR, "script.js");
const TEMPLATE_PATH = path.join(TOOL_DIR, "gate-template.html");
const PRIVATE_DIR = path.join(ROOT_DIR, ".private");
const PRIVATE_HTML_PATH = path.join(PRIVATE_DIR, "index.html");
const PRIVATE_SCRIPT_PATH = path.join(PRIVATE_DIR, "script.js");

const PAYLOAD_MARKER = "__PROTECTED_PAYLOAD__";
const PAYLOAD_ID = "protected-payload";
const AAD = Buffer.from("emo-static-gate:v1", "utf8");
const ITERATIONS = 600_000;
const MIN_PASSWORD_LENGTH = 1;
const RECOMMENDED_PASSWORD_LENGTH = 16;

const command = process.argv[2];
const flags = new Set(process.argv.slice(3));

function usage(exitCode = 0) {
  const message = `
Password gate maintenance

Usage:
  node tools/password-gate.mjs init --generate-password
  node tools/password-gate.mjs refresh
  node tools/password-gate.mjs unpack
  node tools/password-gate.mjs pack
  node tools/password-gate.mjs rotate
  node tools/password-gate.mjs rotate --generate-password

Commands:
  init     Encrypt the current public index.html and script.js once.
  refresh  Rebuild the public gate shell without changing its encrypted payload.
  unpack   Decrypt the payload into .private/index.html and .private/script.js.
  pack     Encrypt .private sources and remove .private after a successful write.
  rotate   Re-encrypt the current payload without writing plaintext to disk.

Passwords cannot be empty; ${RECOMMENDED_PASSWORD_LENGTH}+ high-entropy characters are strongly recommended.
Passwords are read from SITE_PASSWORD (and NEW_SITE_PASSWORD for rotation). Export
them with a hidden shell prompt; never place a password directly in the command.
`;
  process.stdout.write(message.trimStart());
  process.exit(exitCode);
}

function normalizePassword(value, label) {
  if (typeof value !== "string" || value.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`${label} must not be empty.`);
  }

  return value.normalize("NFKC");
}

function warnIfWeak(password) {
  if (password.length < RECOMMENDED_PASSWORD_LENGTH) {
    process.stderr.write(
      `Warning: passwords shorter than ${RECOMMENDED_PASSWORD_LENGTH} characters are vulnerable to offline guessing.\n`,
    );
  }
}

function generatedPassword() {
  return randomBytes(18).toString("base64url");
}

function encryptionPassword() {
  if (flags.has("--generate-password")) {
    const password = generatedPassword();
    return { password, generated: true };
  }

  return {
    password: normalizePassword(process.env.SITE_PASSWORD, "SITE_PASSWORD"),
    generated: false,
  };
}

function encryptBundle(bundle, password) {
  const salt = randomBytes(16);
  const iv = randomBytes(12);
  const key = pbkdf2Sync(password, salt, ITERATIONS, 32, "sha256");
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  cipher.setAAD(AAD);

  const plaintext = Buffer.from(JSON.stringify(bundle), "utf8");
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return {
    version: 1,
    algorithm: "AES-256-GCM",
    kdf: "PBKDF2-SHA-256",
    iterations: ITERATIONS,
    salt: salt.toString("base64"),
    iv: iv.toString("base64"),
    ciphertext: Buffer.concat([ciphertext, authTag]).toString("base64"),
  };
}

function decryptBundle(payload, password) {
  validatePayload(payload);

  const salt = Buffer.from(payload.salt, "base64");
  const iv = Buffer.from(payload.iv, "base64");
  const encrypted = Buffer.from(payload.ciphertext, "base64");
  const ciphertext = encrypted.subarray(0, -16);
  const authTag = encrypted.subarray(-16);
  const key = pbkdf2Sync(password, salt, payload.iterations, 32, "sha256");
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAAD(AAD);
  decipher.setAuthTag(authTag);

  const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  const bundle = JSON.parse(plaintext.toString("utf8"));

  if (bundle?.version !== 1 || typeof bundle.html !== "string" || typeof bundle.script !== "string") {
    throw new Error("Decrypted payload has an unsupported structure.");
  }

  return bundle;
}

function validatePayload(payload) {
  if (
    payload?.version !== 1 ||
    payload.algorithm !== "AES-256-GCM" ||
    payload.kdf !== "PBKDF2-SHA-256" ||
    !Number.isInteger(payload.iterations) ||
    payload.iterations < 100_000 ||
    typeof payload.salt !== "string" ||
    typeof payload.iv !== "string" ||
    typeof payload.ciphertext !== "string"
  ) {
    throw new Error("The encrypted payload is missing or unsupported.");
  }
}

async function renderGate(payload) {
  const template = await readFile(TEMPLATE_PATH, "utf8");
  const markerCount = template.split(PAYLOAD_MARKER).length - 1;

  if (markerCount !== 1) {
    throw new Error(`Gate template must contain exactly one ${PAYLOAD_MARKER} marker.`);
  }

  return template.replace(PAYLOAD_MARKER, JSON.stringify(payload));
}

function extractPayload(html) {
  const pattern = new RegExp(
    `<script\\s+id=["']${PAYLOAD_ID}["']\\s+type=["']application/json["']>([\\s\\S]*?)<\\/script>`,
    "i",
  );
  const match = html.match(pattern);

  if (!match) {
    throw new Error(`Could not find #${PAYLOAD_ID} in index.html.`);
  }

  return JSON.parse(match[1]);
}

async function writeEncryptedSite(bundle, password) {
  warnIfWeak(password);
  const payload = encryptBundle(bundle, password);
  const gateHtml = await renderGate(payload);
  await writeIndex(gateHtml);
}

async function writeIndex(html) {
  await writeFile(TEMP_INDEX_PATH, html, "utf8");
  await rename(TEMP_INDEX_PATH, INDEX_PATH);
}

async function init() {
  const publicHtml = await readFile(INDEX_PATH, "utf8");

  if (publicHtml.includes(`id="${PAYLOAD_ID}"`)) {
    throw new Error("index.html is already protected. Use unpack, pack, or rotate instead.");
  }

  const appScript = await readFile(PUBLIC_SCRIPT_PATH, "utf8");
  const { password, generated } = encryptionPassword();
  const normalized = normalizePassword(password, "Generated password");

  await writeEncryptedSite(
    { version: 1, html: publicHtml, script: appScript },
    normalized,
  );

  process.stdout.write("Protected index.html created successfully.\n");
  if (generated) process.stdout.write(`INITIAL_PASSWORD=${password}\n`);
}

async function unpack() {
  const password = normalizePassword(process.env.SITE_PASSWORD, "SITE_PASSWORD");
  const gateHtml = await readFile(INDEX_PATH, "utf8");
  const bundle = decryptBundle(extractPayload(gateHtml), password);

  await mkdir(PRIVATE_DIR, { recursive: true, mode: 0o700 });
  await writeFile(PRIVATE_HTML_PATH, bundle.html, { encoding: "utf8", mode: 0o600 });
  await writeFile(PRIVATE_SCRIPT_PATH, bundle.script, { encoding: "utf8", mode: 0o600 });
  process.stdout.write("Decrypted sources written to .private/. Do not deploy or commit this directory.\n");
}

async function refresh() {
  const gateHtml = await readFile(INDEX_PATH, "utf8");
  const payload = extractPayload(gateHtml);
  validatePayload(payload);
  await writeIndex(await renderGate(payload));
  process.stdout.write("Public gate shell refreshed without changing the password.\n");
}

async function pack() {
  const password = normalizePassword(process.env.SITE_PASSWORD, "SITE_PASSWORD");
  const [html, script] = await Promise.all([
    readFile(PRIVATE_HTML_PATH, "utf8"),
    readFile(PRIVATE_SCRIPT_PATH, "utf8"),
  ]);

  await writeEncryptedSite({ version: 1, html, script }, password);
  await rm(PRIVATE_DIR, { recursive: true, force: true });
  process.stdout.write("Protected site updated. Plaintext .private/ sources were removed.\n");
}

async function rotate() {
  const oldPassword = normalizePassword(process.env.SITE_PASSWORD, "SITE_PASSWORD");
  const gateHtml = await readFile(INDEX_PATH, "utf8");
  const bundle = decryptBundle(extractPayload(gateHtml), oldPassword);

  let nextPassword;
  let generated = false;
  if (flags.has("--generate-password")) {
    nextPassword = generatedPassword();
    generated = true;
  } else {
    nextPassword = normalizePassword(process.env.NEW_SITE_PASSWORD, "NEW_SITE_PASSWORD");
  }

  await writeEncryptedSite(bundle, normalizePassword(nextPassword, "New password"));
  process.stdout.write("Password rotated successfully. Existing browser sessions are invalidated.\n");
  if (generated) process.stdout.write(`NEW_PASSWORD=${nextPassword}\n`);
}

try {
  if (!command || command === "help" || flags.has("--help")) usage();
  if (command === "init") await init();
  else if (command === "refresh") await refresh();
  else if (command === "unpack") await unpack();
  else if (command === "pack") await pack();
  else if (command === "rotate") await rotate();
  else usage(1);
} catch (error) {
  process.stderr.write(`Password gate error: ${error.message}\n`);
  process.exit(1);
}
