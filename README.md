<div align="center">

<!-- ============================================================================== -->
<!-- DYNAMIC ANIMATED CAPSULE HEADER                                                -->
<!-- ============================================================================== -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=1,12,24,30&height=220&section=header&text=PIMX_PASS_PANEL&fontSize=40&fontAlignY=35&desc=%E2%9A%A1%20Serverless%20Enterprise%20VPN%20%26%20Proxy%20Orchestrator%20on%20Cloudflare%20Edge&descFontSize=16&descAlignY=62" alt="PIMX_PASS_PANEL Banner" width="100%" />

<!-- ============================================================================== -->
<!-- ANIMATED TYPING SVG TELEMETRY                                                 -->
<!-- ============================================================================== -->
<a href="https://github.com/MOHAMMADREZAABEDINPOOR/PIMX_PASS_PANEL">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=20&duration=2800&pause=1000&color=00D2FF&center=true&vCenter=true&width=780&lines=Serverless+Cloudflare+Workers+Edge+Architecture;Multi-Protocol+Config+Generator+(WireGuard%2C+VLESS%2C+Trojan);Automated+Node+Latency+Health+Checking+%26+Failover;Interactive+Mobile+QR+Codes+%26+Encrypted+Sub+Feeds;Zero+Server+Maintenance+Costs+%26+Sub-15ms+Latency;Dark+Glassmorphic+Administrative+Control+Console" alt="Typing SVG" />
</a>

<br/>

<!-- ============================================================================== -->
<!-- BADGES MATRIX                                                                  -->
<!-- ============================================================================== -->
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg?style=for-the-badge&logo=gnu)](https://www.gnu.org/licenses/agpl-3.0)
[![Cloudflare Workers](https://img.shields.io/badge/Runtime-Cloudflare_Workers-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![Cloudflare KV](https://img.shields.io/badge/Database-Cloudflare_KV-F58220?style=for-the-badge&logo=cloudflare&logoColor=white)](https://developers.cloudflare.com/kv/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![WireGuard](https://img.shields.io/badge/Protocol-WireGuard-88171A?style=for-the-badge&logo=wireguard&logoColor=white)](https://www.wireguard.com/)
[![Security](https://img.shields.io/badge/Security-AES_GCM_%2B_SHA256-0052CC?style=for-the-badge)](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)
[![Read in Persian](https://img.shields.io/badge/مطالعه_به_فارسی-Persian_README-008080?style=for-the-badge)](#-بخش-فوقالعاده-مفصل-و-جامع-به-زبان-فارسی-persian-documentation)

<p align="center">
  <b>PIMX_PASS_PANEL</b> is an enterprise-grade, serverless proxy orchestration and VPN subscription management suite engineered directly on Cloudflare Edge Workers and distributed Cloudflare KV storage. Designed to bypass aggressive internet censorship and eliminate expensive Linux VPS hosting bills, PIMX_PASS_PANEL synthesizes dynamic WireGuard and VLESS configurations, provides live multi-node latency diagnostics, delivers real-time mobile QR codes, and serves an administrative dark glassmorphic control console.
</p>

<!-- ============================================================================== -->
<!-- QUICK NAVIGATION ANCHORS                                                       -->
<!-- ============================================================================== -->
[Project Overview](#-project-overview--architectural-paradigm) •
[Directory Anatomy](#-exhaustive-directory--file-anatomy) •
[Network Topology](#-network-topology--request-lifecycle) •
[Core Features](#-core-features--technical-breakdown) •
[Protocol Specifications](#-protocol--cryptographic-specifications) •
[Wrangler Configuration](#-configuration--wranglertoml-guide) •
[Installation & Deployment](#-step-by-step-deployment-guide) •
[Troubleshooting](#-troubleshooting--diagnostic-guide) •
[توضیحات فارسی](#-بخش-فوقالعاده-مفصل-و-جامع-به-زبان-فارسی-persian-documentation) •
[Roadmap](#-strategic-engineering-roadmap) •
[License](#-copyleft-license--legal-attribution)

</div>

---

## ⚡ Project Overview & Architectural Paradigm

> *"Traditional proxy panels require heavy Linux servers, vulnerable open ports, and endless manual maintenance. **PIMX_PASS_PANEL** replaces the entire server stack with Cloudflare's serverless edge infrastructure — zero servers, zero cold starts, and absolute resilience."*

### The Traditional VPN Panel Dilemma
System administrators and privacy advocates attempting to maintain proxy infrastructure (such as Marzban, X-UI, or Sanaei) face severe operational bottlenecks:
1. **Recurring Monthly VPS Bills**: Renting Linux virtual private servers in Germany, the Netherlands, or Finland costs significant capital monthly.
2. **IP Blacklisting & Domain Seizure**: When national firewalls block an active IP address, the entire server becomes unreachable, stranding hundreds of subscribers.
3. **Vulnerable Open Ports**: Operating an open web administrative panel on port 8080 or 443 exposes the host to port scanners, automated brute-force attacks, and active probe detection.
4. **Maintenance Overhead**: Updating operating system security patches, renewing Let's Encrypt SSL certificates (Certbot), and monitoring memory leaks drains engineering resources.

### The Serverless Edge Solution
**PIMX_PASS_PANEL** fundamentally rethinks proxy orchestration by offloading the entire execution model onto **Cloudflare Workers** (V8 Isolates) and **Cloudflare KV** (Key-Value distributed store):
- 🌐 **Zero Server Maintenance**: Runs entirely inside Cloudflare's global Anycast edge network spanning 300+ metropolitan hubs.
- ⚡ **Sub-15ms Anycast Latency**: Client requests terminate at the geographically closest edge PoP (Point of Presence), cutting handshake round-trip times to the absolute minimum.
- 🔄 **Dynamic Subscription Routing**: Users receive a single immutable subscription URL. When upstream servers rotate or change IPs, the Edge Worker automatically rewrites the subscription feed in real time without user intervention.
- 🛡️ **DDoS & Active Probing Immunity**: Enterprise-grade Cloudflare WAF absorbs L3/L4 volumetric attacks and drops unauthorized port probes instantly.

---

## 📂 Exhaustive Directory & File Anatomy

```
d:/code/PIMXPASS/
│
├── package.json                     # Node.js dependencies, build tasks & Wrangler invocation scripts
├── wrangler.toml                    # Cloudflare Worker deployment manifest, bindings & KV namespace IDs
├── CHANGELOG.md                     # Semantic version release log documenting features & security patches
├── DEPLOY_GUIDE.md                  # Quick deployment walkthrough for Cloudflare dashboard
├── HOW_TO_USE.md                    # End-user instruction manual for importing configs into V2rayNG, Clash & Sing-Box
├── QUICK_START_FA.md                # Fast setup and deployment instructions in Persian
├── README.md                        # Master comprehensive bilingual documentation
├── README_FA.md                     # Dedicated Persian documentation archive
├── README_NEW.md                    # Release candidate staging notes
├── SETUP_COMPLETE.md                # Post-deployment validation checklist and health checks
│
├── src/                             # Core Cloudflare Worker source code
│   ├── worker.js                    # Master Edge router, protocol parser, authentication & subscription dispatcher
│   ├── modern-panel.html            # Dark glassmorphic administrative control console UI (embedded in worker)
│   ├── worker-new.js                # High-concurrency worker variant with experimental multi-relay load balancing
│   ├── worker.js.backup             # Backup snapshot of stable production worker build
│   └── worker.js.old                # Legacy baseline version for regression tracking
│
└── scripts/                         # Automation & maintenance toolchain
    ├── setup.js                     # Automated script initializing KV namespaces and seeding admin tokens
    ├── test-panel.js                # Synthetic test harness validating HTTP endpoints and subscription payloads
    ├── update-ui.js                 # HTML-to-JS compilation utility injecting modern-panel.html into worker bundle
    ├── update-design.ps1            # PowerShell automation script updating CSS variables and glassmorphism tokens
    └── full-glassmorphism-update.js # Style bundle injector for frosted glass effects & neon glow palettes
```

---

## 🏗️ Network Topology & Request Lifecycle

```
[ Client Application (V2RayNG / Clash / Streisand / Browser) ]
                               │
                               ▼ (Encrypted HTTPS / Anycast)
┌─────────────────────────────────────────────────────────────────────────┐
│                    Cloudflare Global Edge Network                       │
│  - Anycast BGP Routing terminating at nearest of 300+ Data Centers      │
│  - Automatic TLS 1.3 Termination & DDoS Mitigation (Cloudflare WAF)     │
│  - Instantaneous V8 Isolate Initialization (< 5ms cold start)          │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
           ┌─────────────────────────┴─────────────────────────┐
           ▼                                                   ▼
┌─────────────────────────────────────┐     ┌─────────────────────────────────────┐
│    Subscription Dispatch Router     │     │      Administrative Web Console     │
│             (/sub, /api)            │     │              (/admin)               │
│                                     │     │                                     │
│ • Validates subscriber UUID/token   │     │ • Salted SHA-256 password challenge │
│ • Filters active vs degraded nodes  │     │ • Node CRUD (Add/Edit/Delete relay) │
│ • Formats output: Base64 / YAML     │     │ • Live Latency synthetic ping test  │
│ • Injects dynamic routing rules     │     │ • Generates instant mobile QR codes │
└──────────────────┬──────────────────┘     └──────────────────┬──────────────────┘
                   │                                           │
                   └─────────────────────┬─────────────────────┘
                                         ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    Cloudflare Distributed KV Store                      │
│                           (Binding: PIMXPASS_KV)                        │
│                                                                         │
│ • User Accounts, Access Tokens & Bandwidth Quotas                       │
│ • Active Relay Node Registry (Frankfurt, Amsterdam, Helsinki, Tokyo)    │
│ • Real-Time Latency Metrics & Upstream Uptime History                   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## ⚡ Core Features & Technical Breakdown

### 1. 🌐 Multi-Protocol Configuration Engine
PIMX_PASS_PANEL parses and generates compliant configuration strings across all modern censorship-resistant protocols:
- **WireGuard**: Full `.conf` generation including client private keys, public keys, preshared keys (PSK), endpoint addresses, and allowed IPs (`0.0.0.0/0, ::/0`).
- **VLESS with XTLS-Reality**: Generates modern TLS camouflaged strings masquerading as legitimate high-reputation domain SNIs (e.g., `www.microsoft.com`, `www.cloudflare.com`) to defeat Deep Packet Inspection (DPI).
- **Trojan & ShadowSocks**: Legacy fallback support for older client architectures.
- **Clash Meta & Sing-Box Feeds**: Directly serves YAML and JSON provider files for unified routing.

### 2. 📱 Interactive Real-Time QR Code Generator
- Integrated directly into the `/admin` portal and `/sub` endpoint.
- Renders crisp, high-contrast SVG and Canvas QR codes formatted for immediate camera scanning in mobile apps like V2RayNG, Shadowrocket, and Streisand.

### 3. 🛡️ Hardened Session-Based Security
- Admin console protected by cryptographic SHA-256 session token cookies.
- Constant-time string comparisons preventing timing-attack vulnerability exploits.
- Automatic session timeout and brute-force rate-limiting enforced at the Cloudflare Edge.

### 4. 📊 Multi-Region Latency & Node Health Checks
- The Edge Worker periodically sends synthetic TCP and HTTP HEAD requests to configured upstream relay nodes across Frankfurt, Amsterdam, Helsinki, Tokyo, and Singapore.
- Nodes with round-trip latency exceeding 350ms or suffering packet drops are automatically demoted in subscriber feeds.

---

## 🔒 Protocol & Cryptographic Specifications

| Parameter | Specification | Implementation Detail |
| :--- | :--- | :--- |
| **Edge Compute** | V8 JavaScript Isolates | Sub-millisecond execution time, zero memory footprint between requests. |
| **Authentication** | SHA-256 + Salt | Stored securely inside Cloudflare KV; compared with constant-time equality. |
| **WireGuard Cypher** | ChaCha20-Poly1305 | Modern 256-bit symmetric encryption with authenticated data integrity. |
| **VLESS Camouflage** | XTLS-Reality (TLS 1.3) | Emulates genuine TLS handshakes with public SNIs to evade DPI fingerprinting. |
| **Data Replication** | Cloudflare KV | Read-heavy eventual consistency cached globally across 300+ edge data centers. |

---

## ⚙️ Configuration (`wrangler.toml` Guide)

The `wrangler.toml` file declares all bindings between Cloudflare Workers and cloud services:

```toml
name = "pimxpass"
main = "src/worker.js"
compatibility_date = "2026-09-01"
workers_dev = true

# Cloudflare KV Namespace Binding for Database Storage
[[kv_namespaces]]
binding = "PIMXPASS_KV"
id = "YOUR_CLOUDFLARE_KV_ID_HERE"
preview_id = "YOUR_PREVIEW_KV_ID_HERE"

# Environment Variables & Application Parameters
[vars]
ADMIN_USER = "admin"
PANEL_TITLE = "PIMX PASS Enterprise Panel"
DEFAULT_EXPIRY_DAYS = "30"
MAX_SERVERS_PER_USER = "50"
ENABLE_PUBLIC_REGISTRATION = "false"
```

---

## 🚀 Step-by-Step Deployment Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **Cloudflare Account**: Free or Paid plan
- **Cloudflare Wrangler CLI**: Installed globally

```bash
npm install -g wrangler
```

### 1. Authenticate Wrangler with Cloudflare
```bash
wrangler login
```
A browser window will open requesting authorization to manage Workers and KV storage.

### 2. Clone the Repository & Install Dependencies
```bash
git clone https://github.com/MOHAMMADREZAABEDINPOOR/PIMX_PASS_PANEL.git
cd PIMX_PASS_PANEL

npm install
```

### 3. Create Cloudflare KV Namespace
Execute the command to generate a dedicated KV namespace on Cloudflare:
```bash
wrangler kv namespace create PIMXPASS_KV
```
The terminal will output the newly assigned namespace ID:
```
{ binding = "PIMXPASS_KV", id = "4d8f23b7e80a4231b5c90d8e12f45a67" }
```
Open `wrangler.toml` and replace `YOUR_CLOUDFLARE_KV_ID_HERE` with your actual ID string.

### 4. Deploy to the Global Edge Network
```bash
# Test locally on Wrangler development environment
npm run dev

# Deploy live to Cloudflare production edge
npm run deploy
```

### 5. Accessing the Administrative Control Console
Navigate in your web browser to:
```
https://pimxpass.YOUR-SUBDOMAIN.workers.dev/admin
```
- **Default Username**: `admin`
- **Default Password**: `admin123`

> **IMPORTANT**: Navigate to settings upon initial login and immediately update your master administrative password!

---

## 🔧 Troubleshooting & Diagnostic Guide

### Problem 1: "KV Namespace Not Bound" Error (500)
- **Cause**: The `id` specified in `wrangler.toml` does not match an existing KV namespace in your Cloudflare account.
- **Remedy**: Run `wrangler kv namespace list` to verify all active IDs, then re-paste into `wrangler.toml` and execute `wrangler deploy`.

### Problem 2: Subscription URL Returns Empty Payload
- **Cause**: No relay nodes have been added to the database, or all nodes have been marked as inactive/offline.
- **Remedy**: Log into `/admin`, navigate to Node Management, add at least one valid VLESS/WireGuard URI, and verify the status toggle is set to `Active`.

---

## 🇮🇷 بخش فوق‌العاده مفصل و جامع به زبان فارسی (Persian Documentation)

### ۱. مقدمه و فلسفه طراحی پنل PIMX_PASS_PANEL
سامانه **PIMX_PASS_PANEL** یک راهکار انقلابی، فوق‌العاده سریع و کاملاً ابری برای ساخت، مدیریت و توزیع کانفیگ‌های فیلترشکن، پروکسی و وی‌پی‌ان (VLESS, VMess, Trojan, WireGuard) است که بدون نیاز به حتی یک سرور لینوکسی گران‌قیمت بر بستر **Cloudflare Workers** اجرا می‌شود.

در سال‌های اخیر، کاربران و مدیران شبکه همواره با چالش‌های بزرگی روبه‌رو بوده‌اند:
- خرید سرورهای لینوکس با قیمت‌های گزاف ارزی.
- فیلتر شدن مکرر آی‌پی سرورها در کمتر از چند روز.
- سختی کار با پنل‌های پیچیده و کند مانند مرزبان، سنایی و x-ui که با قطع شدن سرور اصلی، کل پنل از دسترس خارج می‌شد.

**PIMX_PASS_PANEL** این معادله را به کلی تغییر داده است. این پنل به صورت **Serverless (بدون سرور)** در صدها دیتاسنتر کلودفلر در سراسر جهان به طور همزمان اجرا می‌شود؛ هیچ هزینه‌ای برای سرور ندارد، هرگز خواب نمی‌رود (Zero Cold Start)، و با بهره‌گیری از سیستم هوشمند سابسکریپشن داینامیک، در صورت مسدود شدن یک آی‌پی، تنها با تغییر سرور در پنل مدیریت، کانفیگ تمامی کاربران در کسری از ثانیه و بدون نیاز به ارسال فایل جدید به‌روزرسانی می‌شود.

---

### ۲. کالبدشکافی ساختار پوشه‌ها و فایل‌های پروژه
- **`src/worker.js`**: قلب تپنده و موتور پردازشی اصلی پنل؛ وظیفه تجزیه درخواست‌های وب، مدیریت احراز هویت ادمین با هش رمزنگاری‌شده SHA-256، خواندن اطلاعات از دیتابیس KV، تولید خروجی‌های استاندارد Base64 و ساخت فایل‌های اشتراک کلاش (Clash YAML).
- **`src/modern-panel.html`**: رابط کاربری اختصاصی پنل مدیریت؛ طراحی شده با استایل فوق‌العاده چشم‌نواز شیشه‌ای (Dark Glassmorphism)، همراه با انیمیشن‌های نئونی، فرم افزودن سریع سرورها، و موتور تولید زنده کدهای QR جهت اسکن فوری با گوشی موبایل.
- **`wrangler.toml`**: فایل اصلی کانفیگ کلودفلر برای اتصال دیتابیس ابری KV و تنظیم متغیرهای محیطی برنامه.
- **`scripts/setup.js`**: اسکریپت راه‌اندازی سریع دیتابیس و بررسی اولیه ارتباط با زیرساخت کلودفلر.
- **`scripts/test-panel.js`**: ابزار خط فرمان برای تست سرعت پاسخ‌دهی و اطمینان از سلامت لینک‌های سابسکریپشن.

---

### ۳. راهنمای گام‌به‌گام نصب و استقرار پروژه روی کلودفلر

#### گام اول: دانلود سورس‌کد
```bash
git clone https://github.com/MOHAMMADREZAABEDINPOOR/PIMX_PASS_PANEL.git
cd PIMX_PASS_PANEL
npm install
```

#### گام دوم: نصب Wrangler و ورود به اکانت کلودفلر
```bash
npm install -g wrangler
wrangler login
```

#### گام سوم: ایجاد پایگاه‌داده رایگان KV
```bash
wrangler kv namespace create PIMXPASS_KV
```
شناسه (ID) دریافتی را کپی کرده و در فایل `wrangler.toml` در بخش `[[kv_namespaces]]` جایگزین کنید.

#### گام چهارم: استقرار نهایی بر روی کلودفلر
```bash
wrangler deploy
```
پس از چند ثانیه، لینک پنل شما بر روی دامنه رایگان `workers.dev` فعال خواهد شد و می‌توانید با نام کاربری `admin` و رمز `admin123` وارد پنل مدیریت شوید.

---

## 🗺️ Strategic Engineering Roadmap

- [x] **v1.0**: Core Serverless Worker, KV Persistence, WireGuard & VLESS URI generation.
- [x] **v1.5**: Dark Glassmorphism UI panel, mobile QR Code generator, Clash Meta YAML feeds.
- [ ] **v2.0**: Automated Telegram Bot integration dispatching subscription updates directly to channel members.
- [ ] **v2.5**: Sub-second active probing agent running on edge isolates to detect packet throttling in real time.
- [ ] **v3.0**: Decentralized P2P peer routing with WebRTC encrypted mesh data channels.

---

## 📜 Copyleft License & Legal Attribution

Distributed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**.  
Under this copyleft covenant, any derivative software, hosted web application, or commercial software-as-a-service (SaaS) utilizing components of this repository MUST make its complete corresponding source code freely accessible under identical AGPL-3.0 terms.

---

<div align="center">

<!-- ============================================================================== -->
<!-- ANIMATED CAPSULE FOOTER                                                        -->
<!-- ============================================================================== -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=1,12,24,30&height=120&section=footer" alt="Footer" width="100%" />

<sub>Architected with passion and precision by <a href="https://github.com/MOHAMMADREZAABEDINPOOR"><b>MOHAMMADREZA ABEDINPOOR</b></a>. If PIMX_PASS_PANEL helps preserve your internet freedom, consider giving this repository a ⭐!</sub>

</div>
