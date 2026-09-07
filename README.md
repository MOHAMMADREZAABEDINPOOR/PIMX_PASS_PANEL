<div align="center">

# 🛡️ PIMX_PASS_PANEL 🌐⚡
### Serverless Enterprise VPN & Proxy Provisioning Suite on Cloudflare Edge

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg?style=for-the-badge)](https://www.gnu.org/licenses/agpl-3.0)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers_Edge-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![Cloudflare KV](https://img.shields.io/badge/Database-Cloudflare_KV-F58220?style=for-the-badge&logo=cloudflare&logoColor=white)](https://developers.cloudflare.com/kv/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![WireGuard](https://img.shields.io/badge/Protocol-WireGuard-88171A?style=for-the-badge&logo=wireguard&logoColor=white)](https://www.wireguard.com/)
[![Read in Persian](https://img.shields.io/badge/مطالعه_به_فارسی-Persian_README-008080?style=for-the-badge)](#-توضیحات-کامل-فارسی-persian-documentation)

<p align="center">
  An ultra-lightweight, zero-server-cost VPN and secure tunneling gateway panel built directly on Cloudflare Edge Infrastructure. Provides multi-protocol configuration provisioning (WireGuard, OpenVPN, Shadowsocks, VLESS), dynamic node health checks, encrypted subscription generation, and an administrative glassmorphic management portal.
</p>

[Key Features](#-core-features) •
[Architecture](#-network-topology--architecture) •
[Quick Start](#-quick-deployment-guide) •
[توضیحات فارسی](#-توضیحات-کامل-فارسی-persian-documentation) •
[License](#-license)

</div>

---

## ⚡ Core Features

- 🌐 **Global Node Aggregator**: Real-time management and status verification of relay endpoints across Frankfurt, Amsterdam, Helsinki, Tokyo, and Singapore.
- 🔑 **Multi-Protocol Subscription Delivery**:
  - Direct QR Code generation for mobile clients (v2rayNG, Streisand, Clash, WireGuard).
  - Encrypted Base64 and YAML configuration feeds.
- ⚡ **Zero Cold Starts**: Deployed on Cloudflare V8 isolates, providing sub-15ms response latency worldwide.
- 🛡️ **Edge Auth & Quota Enforcement**: High-speed token authentication backed by Cloudflare KV (Key-Value) store with automatic rate limiting.
- 📊 **Real-Time Latency Benchmark**: Live ping and packet transmission checks to dynamically route clients through the healthiest nodes.

---

## 🏗️ Network Topology & Architecture

```
[ Client App ] 
      │ (Sub URL / QR Request)
      ▼
┌──────────────────────────────────────────────┐
│        Cloudflare Edge Worker                │
│  - JWT / Auth Token Verification             │
│  - Dynamic Node Health Poller                │
│  - Config Template Engine (WireGuard/VLESS)  │
└──────────────────────┬───────────────────────┘
                       │
         ┌─────────────┴─────────────┐
         ▼                           ▼
┌──────────────────┐       ┌──────────────────┐
│  Cloudflare KV   │       │ Remote Relay Hub │
│  - User Quotas   │       │ - Frankfurt Node │
│  - Access Keys   │       │ - Helsinki Node  │
└──────────────────┘       └──────────────────┘
```

---

## 🚀 Quick Deployment Guide

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- [Cloudflare Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/): `npm i -g wrangler`
- A free or paid Cloudflare account

### 1. Clone & Install
```bash
git clone https://github.com/MOHAMMADREZAABEDINPOOR/PIMX_PASS_PANEL.git
cd PIMX_PASS_PANEL

npm install
```

### 2. Configure Cloudflare Wrangler
Authenticate your Wrangler CLI with Cloudflare:
```bash
npx wrangler login
```

Create a Cloudflare KV namespace for user data:
```bash
npx wrangler kv:namespace create "PIMX_PANEL_KV"
```
Copy the returned `id` and update your `wrangler.toml`:
```toml
name = "pimx-pass-panel"
main = "src/index.ts"
compatibility_date = "2026-09-01"

[[kv_namespaces]]
binding = "CONFIG_KV"
id = "YOUR_KV_NAMESPACE_ID_HERE"
```

### 3. Deploy to Cloudflare
```bash
# Run locally with edge simulation
npm run dev

# Deploy to global production edge
npm run deploy
```

---

## 🇮🇷 توضیحات کامل فارسی (Persian Documentation)

### معرفی پنل PIMX_PASS_PANEL
سامانه **PIMX_PASS_PANEL** یک پنل مدیریت پروکسی و سرویس‌های تونلینگ ابری است که به صورت کاملاً **Serverless** و بر روی بستر زیرساخت لبه (Edge) شرکت کلودفلر (Cloudflare Workers) پیاده‌سازی شده است. این سیستم به شما امکان می‌دهد بدون نیاز به اجاره سرورهای گران‌قیمت یا نگهداری سیستم‌عامل، اشتراک‌های رمزگذاری‌شده، کدهای QR و پیکربندی‌های WireGuard و VLESS را مدیریت و توزیع نمایید.

### قابلیت‌های مهندسی پروژه:
1. **معماری بدون سرور (Serverless Edge):**
   * اجرای کدها در صدها دیتاسنتر کلودفلر با کمترین تأخیر (زیر ۲۰ میلی‌ثانیه) و مقاومت کامل در برابر حملات DDOS.
2. **پشتیبانی از چندین پروتکل شبکه:**
   * تولید کانفیگ‌های استاندارد برای کلاینت‌های V2Ray، کلاش (Clash)، سینگ‌باکس (Sing-box) و وایرگارد.
3. **لینک‌های اشتراک داینامیک:**
   * امکان تولید لینک‌های اشتراک با خروجی‌های فرمت Base64، JSON و YAML به همراه قابلیت بروزرسانی خودکار سرورها در سمت کلاینت.
4. **دیتابیس ابری سریع (Cloudflare KV):**
   * ذخیره‌سازی کلیدها، ترافیک مصرفی کاربران و وضعیت سرورها با سرعت خواندن بسیار بالا.
5. **رابط کاربری مدرن شیشه‌ای (Glassmorphism UI):**
   * پنل مدیریت سبک و ریسپانسیو با امکان اسکن QR Code در موبایل و دسکتاپ.

---

## 📜 License & Copyleft

Distributed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**.  
Commercial deployment or hosted SaaS providers are required to distribute source code publicly.

---

<div align="center">
  <sub>Engineered by <a href="https://github.com/MOHAMMADREZAABEDINPOOR">MOHAMMADREZA ABEDINPOOR</a>. Star ⭐ this repository if you support free and open internet protocols!</sub>
</div>
