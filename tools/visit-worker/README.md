# Visit Collector (Cloudflare Worker)

用于接收主页**解锁后**的访问通知与关键链接点击日志：

- **100% 过滤邮件扫描机器人**：只在访客正确输入密码解锁后才上报，且前端零第三方查 IP 请求。
- **自动隐藏邀请参数**：发邮件时使用 `https://emohomepage.ccwu.cc/?k=07`（或 `?ref=07`），访客打开页面瞬间前端会用 `history.replaceState` 自动清洗为干净的 `https://emohomepage.ccwu.cc/`。
- **服务端边缘识别**：Cloudflare Worker 自动记录真实 `IP`、所属机构/高校（`asOrganization` / `ASN`）、城市地区与设备类型。
- **实时推送 + KV 日志**：默认仅在 `unlock` 时推送提醒，避免点击链接刷屏；`unlock` 和 `click` 都会存入 `VISITS_KV`，可在 `https://你的Worker域名/logs` 查看完整记录。

---

## 第一步：部署 Cloudflare Worker（网页后台 3 分钟即可完成）

> 不需要安装 npm/wrangler 也能直接部署。

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create Worker**，命名如 `emo-portfolio-visit`。
2. 点击 **Edit code**，把 [worker.mjs](worker.mjs) 的全部代码粘贴进去并点击 **Deploy**。
3. 创建并绑定 KV 存储：
   - 左侧 **Storage & Databases → KV** → **Create a namespace**，命名为 `VISITS_KV`。
   - 回到 Worker → **Settings → Bindings → Add → KV namespace**：
     - Variable name 填 `VISITS_KV`（必须一致）
     - Namespace 选刚创建的 `VISITS_KV`
4. 绑定自定义子域名（**强烈推荐**，国内高校网络直连更稳）：
   - Worker → **Settings → Domains & Routes → Add → Custom domain**
   - 填写如 `visit.ccwu.cc`（前提是 `ccwu.cc` DNS 托管在 Cloudflare；Cloudflare 会自动签发 HTTPS 证书）。

---

## 第二步：配置环境变量与密钥（仅存在 Cloudflare，切勿写入仓库）

进入 Worker → **Settings → Variables and Secrets**：

### 普通环境变量（Text）
| 变量名 | 示例值 | 说明 |
| --- | --- | --- |
| `ALLOWED_ORIGINS` | `https://emohomepage.ccwu.cc` | 允许上报的前端域名（多个用英文逗号分隔） |
| `NOTIFY_EVENTS` | `unlock` | 哪些事件发手机推送（`unlock` 或 `unlock,click`） |
| `LOG_TTL_DAYS` | `180` | KV 日志保留天数 |

### 机密变量（Secret — 加密保存）
| 密钥名 | 说明 |
| --- | --- |
| `ADMIN_TOKEN` | 查看 `/logs` 日志后台的私密口令（建议 24 位以上随机字符串） |
| `INVITE_MAP` | *(可选)* 邀请码到老师的私密映射 JSON，例如 `{"07":"张教授（南大）","12":"Prof. Li (THU)"}`，只在推送和日志里展示，永不出现在前端源码或 URL 中 |

**推送通道（按你常用的任选一个或多个配置即可）：**
- **iOS Bark**：`BARK_URL` = `https://api.day.app/你的Key`
- **微信 Server酱（Turbo / Server酱³ 均支持）**：`SERVERCHAN_SENDKEY` = `你的SendKey`
- **飞书群机器人**：`FEISHU_WEBHOOK_URL` = `https://open.feishu.cn/open-apis/bot/v2/hook/xxx`
- **Telegram Bot**：`TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID`

---

## 第三步：在主页启用上报

1. 打开 [../gate-template.html](../gate-template.html)，把 `<meta name="visit-endpoint" content="" />` 填入你的 Worker 地址（带 `/event` 路径）：
   ```html
   <meta name="visit-endpoint" content="https://visit.ccwu.cc/event" />
   ```
2. 在项目根目录执行以下命令刷新公开的 `index.html`（不会修改密码或加密内容）：
   ```bash
   node tools/password-gate.mjs refresh
   ```
3. 提交并推送到 GitHub Pages。

---

## 日常套磁使用方式

1. 给不同老师发邮件时，随手分配一个无意义短编号并附在链接末尾（**无需改动代码或重新部署**）：
   - 发给 A 老师：`https://emohomepage.ccwu.cc/?k=01`
   - 发给 B 老师：`https://emohomepage.ccwu.cc/?k=02`
2. 在本地备忘录（或 Cloudflare Worker 的 `INVITE_MAP` Secret）记下编号与老师的对应关系。
3. 老师打开链接后地址栏会自动恢复成干净的 `https://emohomepage.ccwu.cc/`；当老师输入密码解锁主页时，你会立刻收到推送提醒，也可以随时打开 `https://visit.ccwu.cc/logs` 输入 `ADMIN_TOKEN` 查看历次解锁 IP、高校机构与点过的项目链接。
