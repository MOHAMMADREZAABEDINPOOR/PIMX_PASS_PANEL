<div align="center">

# 🛡️ PIMX VPN PANEL v2.0 🌐⚡

### Enterprise-Grade Serverless VPN & Proxy Management Suite for Cloudflare Workers

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg?style=for-the-badge)](https://www.gnu.org/licenses/agpl-3.0)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![Cloudflare KV](https://img.shields.io/badge/Storage-Cloudflare_KV-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://developers.cloudflare.com/kv/)
[![Protocol: WireGuard](https://img.shields.io/badge/Protocol-WireGuard-88171A?style=for-the-badge&logo=wireguard&logoColor=white)](https://www.wireguard.com/)
[![Protocol: OpenVPN](https://img.shields.io/badge/Protocol-OpenVPN-EA7E20?style=for-the-badge&logo=openvpn&logoColor=white)](https://openvpn.net/)
[![Read in Persian](https://img.shields.io/badge/مطالعه_به_فارسی-Persian_README-008080?style=for-the-badge)](#-توضیحات-فارسی-persian-description)

<p align="center">
  A fully serverless, multi-location proxy and VPN administration console. Run directly on Cloudflare Edge with zero VPS infrastructure required. Features automatic WireGuard keypair synthesis, standard OpenVPN profile generation, per-node telemetry tracking, and sleek dark glassmorphism.
</p>

[Key Capabilities](#-key-capabilities) •
[Deployment Guide](#-deployment-guide) •
[توضیحات فارسی](#-توضیحات-فارسی-persian-description) •
[License](#-license)

</div>

---

## ⚡ Key Capabilities

- 🌍 **Multi-Location Ingress Clustering**: Configure and cycle between unlimited overseas egress endpoints (Germany, Netherlands, Finland, USA, etc.).
- 🔒 **Native WireGuard & OpenVPN Generators**:
  - Automatic cryptographic private/public keypair synthesis on the Edge.
  - Generates ready-to-import `.conf` (WireGuard) and `.ovpn` (OpenVPN) client profiles.
- 👥 **Multi-Tenant User Authorization**: Granular user accounts with custom access tokens, expiration limits, and bandwidth caps.
- 📊 **Real-Time Traffic Accounting**: Per-location ingress/egress metrics backed by Cloudflare KV.
- 🎛️ **Advanced Anti-Censorship Tuning**: Configurable MTU tuning, packet fragmentation, keepalive intervals, and DNS fallback overrides.
- 🎨 **Glassmorphic Responsive Web Console**: Ultra-fast, zero-dependency dashboard built for both mobile and desktop browsers.

---

## 🚀 Deployment Guide

### Prerequisites
- Free Cloudflare Account
- Node.js 18+ & Wrangler CLI installed:
  ```bash
  npm install -g wrangler
  wrangler login
  ```

### 1. Clone & Setup
```bash
git clone https://github.com/MOHAMMADREZAABEDINPOOR/PIMX_PASS_PANEL.git
cd PIMX_PASS_PANEL
npm install
```

### 2. Create KV Namespace
```bash
wrangler kv:namespace create "PIMX_KV"
```
Copy the generated binding ID into `wrangler.toml`.

### 3. Deploy to Edge
```bash
wrangler deploy
```

---

## 🇮🇷 توضیحات فارسی (Persian Description)

### معرفی پروژه PIMX VPN Panel v2.0
پنل **PIMX VPN Panel** یک سیستم مدیریت وی‌پی‌ان و پروکسی کاملاً بدون سرور (Serverless) است که مستقیماً روی بستر شبکه لبه **Cloudflare Workers** مستقر می‌شود؛ بدون اینکه نیاز به پرداخت هزینه یا نگهداری از سرورهای اختصاصی گران‌قیمت داشته باشید!

### قابلیت‌های برجسته نسخه ۲.۰:
1. **پشتیبانی از چندین لوکیشن همزمان (Multi-Location):**
   * تعریف سرورها در کشورهای مختلف با قابلیت سوییچ هوشمند و مانیتور وضعیت سلامت.
2. **پشتیبانی بومی از WireGuard و OpenVPN:**
   * ساخت خودکار و بلادرنگ پروفایل‌های استاندارد `.conf` برای وایرگارد و `.ovpn` برای اوپن‌وی‌پی‌ان.
   * تولید خودکار کلیدهای عمومی و خصوصی کریپتوگرافیک در لحظه.
3. **تنظیمات ضد فیلترینگ و دور زدن اختلالات:**
   * قابلیت فرگمنت کردن پکت‌ها (Fragmentation) برای عبور از فایروال‌های DPI.
   * تنظیم سفارشی مقادیر MTU و فواصل زمانی Keepalive.
4. **رابط کاربری مدرن شیشه‌ای (Glassmorphism):**
   * طراحی چشم‌نواز با تم تاریک، انیمیشن‌های نرم و سرعت لود زیر ۵۰ میلی‌ثانیه.

---

## 📜 License & Intellectual Property

This project is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**.

> **Copyright (c) 2026 MOHAMMADREZA ABEDINPOOR.**  
> Any public deployment, SaaS offering, or derivative redistribution must openly disclose its complete source code under the identical AGPL-3.0 terms. Unauthorized proprietary rebranding is strictly forbidden.

---

<div align="center">
  <sub>Engineered by <a href="https://github.com/MOHAMMADREZAABEDINPOOR">MOHAMMADREZA ABEDINPOOR</a>. Leave a ⭐ to support open privacy tools!</sub>
</div>
