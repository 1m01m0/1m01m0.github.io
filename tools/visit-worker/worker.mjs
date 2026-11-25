/**
 * Portfolio Visit Collector — Cloudflare Worker (zero dependencies)
 *
 * Routes:
 *   POST /event     Receive post-unlock / outbound-click events from the portfolio
 *   OPTIONS /event  CORS preflight
 *   GET /logs       Minimal private HTML log viewer (prompts for ADMIN_TOKEN in memory)
 *   GET /api/logs   Authenticated JSON log listing (?limit=50&k=07&event=unlock)
 *   GET /health     Simple liveness check
 */

const MAX_BODY_BYTES = 2048;
const MAX_LOGS_LIMIT = 200;
const DEFAULT_TTL_DAYS = 180;
const DEDUPE_TTL_SECONDS = 60;
const ALLOWED_EVENTS = new Set(["unlock", "click"]);
const KEY_PREFIX = "v:";

const SECURITY_HEADERS = {
  "X-Robots-Tag": "noindex, nofollow, noarchive",
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
};

function parseAllowedOrigins(env) {
  const raw = (env.ALLOWED_ORIGINS || "https://emohomepage.ccwu.cc").trim();
  return new Set(
    raw
      .split(",")
      .map((item) => item.trim().replace(/\/+$/, ""))
      .filter(Boolean),
  );
}

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function sanitizeToken(value, maxLen, pattern) {
  if (typeof value !== "string") return "";
  const trimmed = value.trim().slice(0, maxLen);
  if (pattern && !pattern.test(trimmed)) return "";
  return trimmed;
}

function formatBeijingTime(date) {
  try {
    return new Intl.DateTimeFormat("sv-SE", {
      timeZone: "Asia/Shanghai",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(date);
  } catch {
    return date.toISOString();
  }
}

function summarizeUserAgent(ua) {
  if (!ua) return "Unknown";
  const os = /iPhone|iPad|iPod/i.test(ua)
    ? "iOS"
    : /Android/i.test(ua)
      ? "Android"
      : /Mac OS X/i.test(ua)
        ? "macOS"
        : /Windows/i.test(ua)
          ? "Windows"
          : /Linux/i.test(ua)
            ? "Linux"
            : "Other OS";

  const browser = /MicroMessenger/i.test(ua)
    ? "WeChat"
    : /Edg\//i.test(ua)
      ? "Edge"
      : /Firefox\//i.test(ua)
        ? "Firefox"
        : /Chrome\//i.test(ua) && !/Edg\//i.test(ua)
          ? "Chrome"
          : /Safari\//i.test(ua) && !/Chrome\//i.test(ua)
            ? "Safari"
            : "Browser";

  return `${os} · ${browser}`;
}

function parseInviteMap(env) {
  if (!env.INVITE_MAP) return {};
  try {
    const parsed = JSON.parse(env.INVITE_MAP);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

async function sha256Hex(input) {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

async function timingSafeTokenEqual(expected, actual) {
  if (typeof expected !== "string" || typeof actual !== "string" || expected.length === 0) {
    return false;
  }
  const [a, b] = await Promise.all([
    crypto.subtle.digest("SHA-256", new TextEncoder().encode(expected)),
    crypto.subtle.digest("SHA-256", new TextEncoder().encode(actual)),
  ]);
  const bytesA = new Uint8Array(a);
  const bytesB = new Uint8Array(b);
  let diff = 0;
  for (let i = 0; i < bytesA.length; i += 1) {
    diff |= bytesA[i] ^ bytesB[i];
  }
  return diff === 0;
}

function extractAdminToken(request) {
  const auth = request.headers.get("Authorization") || "";
  if (auth.toLowerCase().startsWith("bearer ")) {
    return auth.slice(7).trim();
  }
  return (request.headers.get("X-Admin-Token") || "").trim();
}

function formatNotification(record) {
  const who = record.label
    ? `${record.label} [${record.k}]`
    : record.k
      ? `邀请码 [${record.k}]`
      : "直接访问（无邀请码）";

  const action = record.event === "unlock" ? "解锁了主页" : `点击了 ${record.target || "链接"}`;
  const title = `${who} ${action}`;

  const lines = [
    `时间：${record.time} (UTC+8)`,
    `来源：${who}`,
    `事件：${record.event}${record.target ? ` → ${record.target}` : ""}`,
    `IP：${record.ip}`,
  ];
  if (record.org || record.asn) {
    lines.push(`机构/网络：${[record.org, record.asn].filter(Boolean).join(" ")}`);
  }
  if (record.location) {
    lines.push(`地区：${record.location}`);
  }
  lines.push(`语言/设备：${record.lang || "-"} · ${record.device}${record.vp ? ` (${record.vp})` : ""}`);

  return { title, body: lines.join("\n") };
}

async function sendNotifications(record, env) {
  const notifyEvents = new Set(
    (env.NOTIFY_EVENTS || "unlock")
      .split(",")
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean),
  );
  if (!notifyEvents.has(record.event)) return;

  const { title, body } = formatNotification(record);
  const tasks = [];

  // 1. Bark (iOS)
  if (env.BARK_URL) {
    const endpoint = env.BARK_URL.trim().replace(/\/+$/, "");
    tasks.push(
      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({ title, body, group: "Portfolio" }),
      }),
    );
  }

  // 2. ServerChan (Turbo & ServerChan³)
  if (env.SERVERCHAN_SENDKEY) {
    const sendKey = env.SERVERCHAN_SENDKEY.trim();
    const sc3Match = sendKey.match(/^sctp(\d+)t/i);
    const endpoint = sc3Match
      ? `https://${sc3Match[1]}.push.ft07.com/send/${encodeURIComponent(sendKey)}.send`
      : `https://sctapi.ftqq.com/${encodeURIComponent(sendKey)}.send`;
    const form = new URLSearchParams({
      title,
      desp: body.replace(/\n/g, "\n\n"),
    });
    tasks.push(
      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
        body: form.toString(),
      }),
    );
  }

  // 3. Feishu / Lark webhook
  if (env.FEISHU_WEBHOOK_URL) {
    tasks.push(
      fetch(env.FEISHU_WEBHOOK_URL.trim(), {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          msg_type: "text",
          content: { text: `${title}\n${body}` },
        }),
      }),
    );
  }

  // 4. Telegram Bot
  if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) {
    const endpoint = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN.trim()}/sendMessage`;
    tasks.push(
      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          chat_id: env.TELEGRAM_CHAT_ID.trim(),
          text: `${title}\n\n${body}`,
          disable_web_page_preview: true,
        }),
      }),
    );
  }

  if (tasks.length > 0) {
    await Promise.allSettled(tasks);
  }
}

async function persistAndNotify(record, env) {
  const kv = env.VISITS_KV;
  let isDuplicate = false;

  if (kv) {
    const dedupeDigest = await sha256Hex(`${record.ip}|${record.event}|${record.k}|${record.target}`);
    const dedupeKey = `d:${dedupeDigest.slice(0, 24)}`;
    const existing = await kv.get(dedupeKey);
    if (existing) {
      isDuplicate = true;
    } else {
      await kv.put(dedupeKey, "1", { expirationTtl: DEDUPE_TTL_SECONDS });
    }

    const ttlDays = Math.max(1, Number(env.LOG_TTL_DAYS) || DEFAULT_TTL_DAYS);
    const revTs = String(9999999999999 - record.ts).padStart(13, "0");
    const rand = crypto.randomUUID().slice(0, 8);
    await kv.put(`${KEY_PREFIX}${revTs}:${rand}`, JSON.stringify(record), {
      expirationTtl: ttlDays * 86400,
    });
  }

  if (!isDuplicate) {
    await sendNotifications(record, env);
  }
}

async function handleEvent(request, env, ctx) {
  const allowedOrigins = parseAllowedOrigins(env);
  const origin = (request.headers.get("Origin") || "").replace(/\/+$/, "");

  if (!origin || !allowedOrigins.has(origin)) {
    return new Response("Forbidden", { status: 403, headers: SECURITY_HEADERS });
  }

  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: { ...SECURITY_HEADERS, ...corsHeaders(origin) },
    });
  }

  if (request.method !== "POST") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: { ...SECURITY_HEADERS, ...corsHeaders(origin) },
    });
  }

  let rawBody;
  try {
    rawBody = await request.text();
  } catch {
    return new Response("Bad Request", {
      status: 400,
      headers: { ...SECURITY_HEADERS, ...corsHeaders(origin) },
    });
  }

  if (rawBody.length === 0 || rawBody.length > MAX_BODY_BYTES) {
    return new Response("Payload Too Large", {
      status: rawBody.length === 0 ? 400 : 413,
      headers: { ...SECURITY_HEADERS, ...corsHeaders(origin) },
    });
  }

  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return new Response("Invalid JSON", {
      status: 400,
      headers: { ...SECURITY_HEADERS, ...corsHeaders(origin) },
    });
  }

  const event = sanitizeToken(payload?.event, 16, /^[a-z]+$/);
  if (!ALLOWED_EVENTS.has(event)) {
    return new Response("Unsupported event", {
      status: 400,
      headers: { ...SECURITY_HEADERS, ...corsHeaders(origin) },
    });
  }

  const now = new Date();
  const cf = request.cf || {};
  const inviteCode = sanitizeToken(payload?.k, 32, /^[a-zA-Z0-9_-]+$/);
  const inviteMap = parseInviteMap(env);
  const label = inviteCode && typeof inviteMap[inviteCode] === "string" ? inviteMap[inviteCode] : "";

  const record = {
    ts: now.getTime(),
    time: formatBeijingTime(now),
    iso: now.toISOString(),
    event,
    k: inviteCode,
    label,
    target: sanitizeToken(payload?.target, 200),
    lang: sanitizeToken(payload?.lang, 16, /^[a-zA-Z0-9_-]+$/),
    path: sanitizeToken(payload?.path, 120),
    tz: sanitizeToken(payload?.tz, 64),
    vp: sanitizeToken(payload?.vp, 24, /^\d{1,5}x\d{1,5}$/),
    ip:
      request.headers.get("cf-connecting-ip") ||
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown",
    asn: cf.asn ? `AS${cf.asn}` : "",
    org: typeof cf.asOrganization === "string" ? cf.asOrganization : "",
    location: [cf.country, cf.region, cf.city].filter(Boolean).join(" · "),
    device: summarizeUserAgent(request.headers.get("User-Agent") || ""),
  };

  ctx.waitUntil(persistAndNotify(record, env));

  return new Response(null, {
    status: 204,
    headers: { ...SECURITY_HEADERS, ...corsHeaders(origin) },
  });
}

async function handleApiLogs(request, env) {
  if (!env.ADMIN_TOKEN) {
    return new Response(JSON.stringify({ error: "ADMIN_TOKEN is not configured" }), {
      status: 503,
      headers: { ...SECURITY_HEADERS, "Content-Type": "application/json; charset=utf-8" },
    });
  }

  const provided = extractAdminToken(request);
  const authorized = await timingSafeTokenEqual(env.ADMIN_TOKEN, provided);
  if (!authorized) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...SECURITY_HEADERS, "Content-Type": "application/json; charset=utf-8" },
    });
  }

  if (!env.VISITS_KV) {
    return new Response(JSON.stringify({ error: "VISITS_KV binding is not configured", items: [] }), {
      status: 200,
      headers: { ...SECURITY_HEADERS, "Content-Type": "application/json; charset=utf-8" },
    });
  }

  const url = new URL(request.url);
  const limit = Math.min(MAX_LOGS_LIMIT, Math.max(1, Number(url.searchParams.get("limit")) || 50));
  const filterK = sanitizeToken(url.searchParams.get("k") || "", 32, /^[a-zA-Z0-9_-]+$/);
  const filterEvent = sanitizeToken(url.searchParams.get("event") || "", 16, /^[a-z]+$/);

  const listLimit = filterK || filterEvent ? MAX_LOGS_LIMIT : limit;
  const listed = await env.VISITS_KV.list({ prefix: KEY_PREFIX, limit: listLimit });
  const rawItems = await Promise.all(listed.keys.map((entry) => env.VISITS_KV.get(entry.name, "json")));

  const items = rawItems
    .filter(Boolean)
    .filter((item) => (!filterK || item.k === filterK) && (!filterEvent || item.event === filterEvent))
    .slice(0, limit);

  return new Response(JSON.stringify({ count: items.length, items }), {
    status: 200,
    headers: { ...SECURITY_HEADERS, "Content-Type": "application/json; charset=utf-8" },
  });
}

function renderLogsPage() {
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex, nofollow" />
  <title>Portfolio Visit Logs · emo</title>
  <style>
    :root { --page:#f7f5ef; --surface:#fffefb; --ink:#202a33; --soft:#49565f; --muted:#626e78; --navy:#22405e; --accent:#8a4b32; --line:#dedbd2; --strong:#b7b09e; }
    * { box-sizing: border-box; }
    body { margin: 0; padding: 36px 20px 64px; background: var(--page); color: var(--ink); font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Segoe UI", sans-serif; line-height: 1.6; }
    main { max-width: 1120px; margin: 0 auto; }
    h1 { margin: 0 0 8px; font: 600 1.9rem/1.2 "Iowan Old Style", "Songti SC", Georgia, serif; color: var(--navy); }
    p.sub { margin: 0 0 24px; color: var(--muted); font-size: 0.9rem; }
    .bar { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; padding: 16px; border: 1px solid var(--line); border-radius: 8px; background: var(--surface); margin-bottom: 20px; }
    input, select, button { min-height: 40px; border-radius: 5px; font: inherit; font-size: 0.88rem; }
    input, select { border: 1px solid var(--strong); padding: 0 12px; background: #fff; color: var(--ink); }
    input[type="password"] { flex: 1 1 240px; }
    button { border: 0; padding: 0 18px; background: var(--navy); color: #fff; font-weight: 600; cursor: pointer; }
    button:hover { background: #193149; }
    .status { font-size: 0.85rem; color: var(--muted); margin: 0 0 12px; min-height: 1.4em; }
    .status.err { color: #a63b32; }
    .table-wrap { overflow-x: auto; border: 1px solid var(--line); border-radius: 8px; background: var(--surface); }
    table { width: 100%; border-collapse: collapse; font-size: 0.84rem; }
    th, td { text-align: left; padding: 11px 12px; border-bottom: 1px solid var(--line); vertical-align: top; }
    th { font-family: ui-monospace, Menlo, monospace; font-size: 0.72rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); background: #f2efe7; }
    tr:last-child td { border-bottom: 0; }
    .tag { display: inline-block; padding: 2px 7px; border-radius: 4px; font-family: ui-monospace, Menlo, monospace; font-size: 0.76rem; background: #edeae0; color: var(--navy); }
    .ev-unlock { background: #e8eef4; color: var(--navy); font-weight: 600; }
    .ev-click { background: #f5ebe6; color: var(--accent); }
    .mono { font-family: ui-monospace, Menlo, monospace; font-size: 0.78rem; }
    .muted { color: var(--muted); }
  </style>
</head>
<body>
  <main>
    <h1>访问记录 · Visit Logs</h1>
    <p class="sub">Token 仅保存在当前页面内存中，不会写入浏览器本地存储或 URL。</p>
    <form class="bar" id="query-form">
      <input id="token" type="password" placeholder="输入 ADMIN_TOKEN" autocomplete="off" required />
      <input id="filter-k" type="text" placeholder="按邀请码筛选 (如 07)" />
      <select id="filter-event">
        <option value="">全部事件</option>
        <option value="unlock">仅解锁 (unlock)</option>
        <option value="click">仅点击 (click)</option>
      </select>
      <button type="submit">加载日志</button>
    </form>
    <p class="status" id="status"></p>
    <div class="table-wrap">
      <table>
        <thead>
          <tr><th>时间 (UTC+8)</th><th>来源 / 邀请码</th><th>事件 / 目标</th><th>IP</th><th>机构 / 网络</th><th>地区</th><th>设备 / 语言</th></tr>
        </thead>
        <tbody id="rows"><tr><td colspan="7" class="muted">请输入 ADMIN_TOKEN 后点击「加载日志」。</td></tr></tbody>
      </table>
    </div>
  </main>
  <script>
    const form = document.getElementById("query-form");
    const statusEl = document.getElementById("status");
    const rowsEl = document.getElementById("rows");
    const esc = (s) => String(s || "").replace(/[&<>"']/g, (c) => ({ "&":"&amp;","<":"&lt;",">":"&gt;","\\"":"&quot;","'":"&#39;" }[c]));

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const token = document.getElementById("token").value.trim();
      const k = document.getElementById("filter-k").value.trim();
      const ev = document.getElementById("filter-event").value;
      if (!token) return;
      statusEl.className = "status";
      statusEl.textContent = "加载中…";

      const params = new URLSearchParams({ limit: "100" });
      if (k) params.set("k", k);
      if (ev) params.set("event", ev);

      try {
        const res = await fetch("/api/logs?" + params.toString(), {
          headers: { Authorization: "Bearer " + token },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || ("HTTP " + res.status));
        statusEl.textContent = "共加载 " + data.count + " 条记录（最新在前）。";
        if (!data.items.length) {
          rowsEl.innerHTML = '<tr><td colspan="7" class="muted">暂无匹配记录。</td></tr>';
          return;
        }
        rowsEl.innerHTML = data.items.map((item) => {
          const who = item.label
            ? esc(item.label) + ' <span class="tag">' + esc(item.k) + "</span>"
            : item.k
              ? '<span class="tag">' + esc(item.k) + "</span>"
              : '<span class="muted">直接访问</span>';
          const evBadge = '<span class="tag ev-' + esc(item.event) + '">' + esc(item.event) + "</span>" +
            (item.target ? '<div class="mono muted" style="margin-top:4px;word-break:break-all">' + esc(item.target) + "</div>" : "");
          return "<tr>"
            + '<td class="mono">' + esc(item.time) + "</td>"
            + "<td>" + who + "</td>"
            + "<td>" + evBadge + "</td>"
            + '<td class="mono">' + esc(item.ip) + "</td>"
            + "<td>" + esc([item.org, item.asn].filter(Boolean).join(" ")) + "</td>"
            + "<td>" + esc(item.location) + "</td>"
            + "<td>" + esc(item.device) + (item.lang ? ' · <span class="mono">' + esc(item.lang) + "</span>" : "") + "</td>"
            + "</tr>";
        }).join("");
      } catch (err) {
        statusEl.className = "status err";
        statusEl.textContent = "加载失败：" + err.message;
      }
    });
  </script>
</body>
</html>`;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/event") {
      return handleEvent(request, env, ctx);
    }
    if (url.pathname === "/api/logs" && request.method === "GET") {
      return handleApiLogs(request, env);
    }
    if (url.pathname === "/logs" && request.method === "GET") {
      return new Response(renderLogsPage(), {
        status: 200,
        headers: { ...SECURITY_HEADERS, "Content-Type": "text/html; charset=utf-8" },
      });
    }
    if (url.pathname === "/health" && request.method === "GET") {
      return new Response("ok", { status: 200, headers: SECURITY_HEADERS });
    }

    return new Response("Not Found", { status: 404, headers: SECURITY_HEADERS });
  },
};
