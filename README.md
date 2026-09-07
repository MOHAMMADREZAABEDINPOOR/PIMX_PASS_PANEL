<div align="center">

# 🛡️ PIMX_PASS_PANEL 🌐⚡
### Serverless Enterprise VPN, WireGuard & Proxy Provisioning Suite on Cloudflare Edge

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg?style=for-the-badge)](https://www.gnu.org/licenses/agpl-3.0)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers_Edge-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![Cloudflare KV](https://img.shields.io/badge/Database-Cloudflare_KV-F58220?style=for-the-badge&logo=cloudflare&logoColor=white)](https://developers.cloudflare.com/kv/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![WireGuard](https://img.shields.io/badge/Protocol-WireGuard-88171A?style=for-the-badge&logo=wireguard&logoColor=white)](https://www.wireguard.com/)
[![Read in Persian](https://img.shields.io/badge/مطالعه_به_فارسی-Persian_README-008080?style=for-the-badge)](#-توضیحات-فوقالعاده-جامع-فارسی-persian-documentation)

<p align="center">
  A production-grade, zero-server-maintenance VPN subscription management and proxy orchestration panel built on Cloudflare Workers and Cloudflare KV. Generates multi-protocol configurations (WireGuard, VLESS, VMess, Trojan, ShadowSocks), provides live latency benchmarking across European and Asian nodes, delivers interactive QR codes, and includes an administrative glassmorphic control portal.
</p>

[Project Purpose](#-project-purpose--problem-statement) •
[Directory Structure](#-directory--file-structure) •
[Architecture & Routing](#-architecture--request-routing) •
[Core Modules](#-core-features--technical-breakdown) •
[Configuration](#-configuration--wranglertoml) •
[Deployment Guide](#-step-by-step-deployment-guide) •
[توضیحات فارسی](#-توضیحات-فوقالعاده-جامع-فارسی-persian-documentation) •
[License](#-license)

</div>

---

## 🎯 Project Purpose & Problem Statement

Managing censorship-resistant proxy and VPN infrastructure traditionally demands expensive Linux VPS instances, complex Nginx reverse proxies, manual SSL certificate renewals (Certbot), and constant firewall monitoring. When an IP is blocked, migration is slow and disruptive.

**PIMX_PASS_PANEL** revolutionizes proxy administration through a 100% Serverless architecture:
- **Zero Server Costs**: Runs entirely on Cloudflare's free or paid worker tiers. No Linux VPS or root maintenance required.
- **Global Edge Anycast**: Requests are terminated at the nearest of Cloudflare's 300+ worldwide data centers, offering sub-20ms latency.
- **Dynamic Subscription Engine**: Users receive a persistent subscription URL that dynamically updates server endpoints, protocols, and routing rules without re-sending configuration files.

---

## 📂 Directory & File Structure

```
PIMXPASS/
│
├── package.json                     # Project scripts, dependencies & Wrangler configurations
├── wrangler.toml                    # Cloudflare Worker deployment manifest, bindings & KV configs
├── CHANGELOG.md                     # Version release history and upgrade logs
├── DEPLOY_GUIDE.md                  # Quick deployment walkthrough for Cloudflare dashboard
├── HOW_TO_USE.md                    # End-user guide for importing configs into V2rayNG & Clash
├── QUICK_START_FA.md                # Fast Persian setup guide
├── README.md                        # Master comprehensive bilingual documentation
│
├── src/                             # Core Cloudflare Worker source code
│   ├── worker.js                    # Main Edge router, protocol parser, auth & subscription handler
│   ├── modern-panel.html            # Responsive dark glassmorphism administrative dashboard UI
│   └── worker-new.js                # Experimental high-concurrency worker variant
│
└── scripts/                         # Automation & maintenance toolchain
    ├── setup.js                     # Automated KV initialization and secret seed generator
    ├── test-panel.js                # Synthetic latency and response verification script
    ├── update-ui.js                 # Compiles and injects modern-panel.html into worker payload
    └── full-glassmorphism-update.js # Style bundle injector for frosted glass effects
```

---

## 🏗️ Architecture & Request Routing

```
[ Client Request: /sub /api /admin ]
                 │
                 ▼
┌────────────────────────────────────────────────────────┐
│               Cloudflare Edge Anycast                  │
│  - TLS Termination & DDoS Mitigation (WAF)             │
│  - V8 Isolate Spin-up (< 5ms cold start)               │
└──────────────────────────┬─────────────────────────────┘
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
┌──────────────────────────┐ ┌──────────────────────────┐
│  Subscription Router     │ │   Admin Control Panel    │
│  - /sub?token=...        │ │   - /admin               │
│  - VLESS/Trojan/WG Feed  │ │   - JWT Session Auth     │
│  - Base64 / Clash YAML   │ │   - Node CRUD & Pings    │
└────────────┬─────────────┘ └────────────┬─────────────┘
             │                            │
             └─────────────┬──────────────┘
                           ▼
┌────────────────────────────────────────────────────────┐
│           Cloudflare KV Distributed Storage            │
│  - PIMXPASS_KV: User tokens, quotas, server endpoints  │
│  - Global eventual consistency replication             │
└────────────────────────────────────────────────────────┘
```

---

## ⚡ Core Features & Technical Breakdown

### 1. 🌐 Dynamic Protocol Synthesizer
- **WireGuard**: Generates `.conf` keypairs (Private Key, Public Key, AllowedIPs, Endpoint).
- **VLESS / VMess**: Generates compliant URI links with XTLS-Reality, gRPC, and WebSocket transport configurations.
- **Clash & Sing-Box Providers**: Out-of-the-box support for YAML subscription formats compatible with modern cross-platform GUI clients.

### 2. 📱 Interactive QR Code & Mobile Delivery
- Generates high-contrast QR codes directly within the web panel for instant scanning via mobile apps (Streisand, Shadowrocket, V2RayNG, Sing-Box).

### 3. 🛡️ Session-Based Administrative Security
- Secured with salted SHA-256 session tokens.
- Default credentials configured out of the box with mandatory prompt for password changes on initial setup.

### 4. 📊 Multi-Node Latency Health Checks
- Actively verifies upstream TCP handshakes for nodes located in Frankfurt, Amsterdam, Helsinki, Tokyo, and Singapore.
- Automatically flags or drops degraded nodes from client subscription payloads.

---

## ⚙️ Configuration (`wrangler.toml`)

```toml
name = "pimxpass"
main = "src/worker.js"
compatibility_date = "2026-09-01"

# KV Namespace Binding
[[kv_namespaces]]
binding = "PIMXPASS_KV"
id = "YOUR_CLOUDFLARE_KV_ID_HERE"

[vars]
ADMIN_USER = "admin"
PANEL_TITLE = "PIMX PASS Enterprise Panel"
DEFAULT_EXPIRY_DAYS = 30
```

---

## 🚀 Step-by-Step Deployment Guide

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- [Cloudflare Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/):
  ```bash
  npm install -g wrangler
  wrangler login
  ```

### 1. Initialize KV Namespace
```bash
wrangler kv namespace create PIMXPASS_KV
```
Copy the generated `id` into your `wrangler.toml` file under `kv_namespaces`.

### 2. Build & Deploy
```bash
# Test locally on Wrangler dev server
npm run dev

# Deploy to global Cloudflare Edge
npm run deploy
```

### 3. Initial Administrative Login
Navigate to your assigned worker URL:
```
https://pimxpass.YOUR-SUBDOMAIN.workers.dev/admin
```
- **Username**: `admin`
- **Password**: `admin123` *(Change immediately in panel settings)*

---

## 🇮🇷 توضیحات فوق‌العاده جامع فارسی (Persian Documentation)

### ۱. معرفی کامل سامانه PIMX_PASS_PANEL
سامانه **PIMX_PASS_PANEL** یک پلتفرم نسل جدید برای مدیریت، توزیع و تولید اشتراک‌های پروکسی و وی‌پی‌ان بر بستر ابری و بدون سرور (Serverless) شرکت کلودفلر است. در روش‌های سنتی، مدیران شبکه مجبور به پرداخت هزینه‌های ماهانه برای خرید سرورهای لینوکسی و صرف زمان طولانی برای نصب پنل‌هایی مثل سنایی، مرزبان یا x-ui بودند که در صورت فیلتر شدن آی‌پی سرور، تمام زحمات از دست می‌رفت.

این پنل به صورت ۱۰۰٪ بدون سرور بر روی ورکرز کلودفلر (**Cloudflare Workers**) و دیتابیس توزیع‌شده **Cloudflare KV** اجرا می‌شود. به این معنا که:
1. هیچ هزینه‌ای برای نگهداری سرور وجود ندارد (بر روی پلن کاملاً رایگان کلودفلر نیز فعال است).
2. کدهای پنل در بیش از ۳۰۰ دیتاسنتر جهان کش و توزیع شده و کمترین پینگ ممکن را فراهم می‌سازد.
3. با فیلتر شدن یک آی‌پی، نیازی به ارسال مجدد کانفیگ به کاربران نیست؛ لینک سابسکریپشن به صورت خودکار سرورهای سالم جدید را جایگزین می‌کند.

---

### ۲. تشریح ساختار پوشه‌ها و فایل‌ها
- **`src/worker.js`**: هسته اصلی برنامه که وظیفه مسیریابی درخواست‌ها، احراز هویت ادمین، تولید کانفیگ‌های وایرگارد و VLESS و تحویل سابسکریپشن را بر عهده دارد.
- **`src/modern-panel.html`**: فایل فرانت‌اند پنل مدیریت با استایل مدرن شیشه‌ای (Glassmorphism)، انیمیشن‌های نئونی، فرم افزودن سرور و نمایشگر کدهای QR.
- **`scripts/setup.js`**: اسکریپت راه‌اندازی اولیه و بررسی خودکار اتصال دیتابیس KV.
- **`scripts/test-panel.js`**: ابزار تست و عیب‌یابی برای سنجش سرعت پاسخ‌دهی و اعتبارسنجی لینک‌های اشتراک.
- **`wrangler.toml`**: فایل حیاتی پیکربندی کلودفلر برای اتصال دیتابیس، تنظیم نام کاربری ادمین و مجوزهای امنیتی.

---

### ۳. راهنمای گام‌به‌گام استقرار روی کلودفلر

```bash
# ۱. دریافت کد پروژه
git clone https://github.com/MOHAMMADREZAABEDINPOOR/PIMX_PASS_PANEL.git
cd PIMX_PASS_PANEL

# ۲. نصب ابزار Wrangler و ورود به اکانت کلودفلر
npm install -g wrangler
wrangler login

# ۳. ایجاد دیتابیس رایگان KV
wrangler kv namespace create PIMXPASS_KV

# ۴. درج شناسه KV دریافتی در فایل wrangler.toml و سپس انتشار
wrangler deploy
```
پس از چند ثانیه، لینک پنل شما فعال شده و می‌توانید با نام کاربری `admin` و رمز `admin123` وارد پنل شوید.

---

## 📜 License

Distributed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**.

---

<div align="center">
  <sub>Engineered by <a href="https://github.com/MOHAMMADREZAABEDINPOOR">MOHAMMADREZA ABEDINPOOR</a>. Leave a ⭐ to champion freedom of information!</sub>
</div>
