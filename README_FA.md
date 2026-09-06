# 🚀 PIMXPASS ULTIMATE v3.0

## پنل پیشرفته VPN مبتنی بر Cloudflare Workers

### ✨ ویژگی‌ها

- 🎨 **دیزاین گلس‌مورفیسم**: طراحی مدرن با افکت‌های شیشه‌ای و بلور
- 🌐 **پروتکل‌های پشتیبانی شده**: VLESS، Trojan، xhttp
- 🔒 **امنیت بالا**: رمزگذاری end-to-end
- ⚡ **سرعت بالا**: بهره‌گیری از شبکه جهانی Cloudflare
- 📱 **واکنش‌گرا**: سازگار با موبایل، تبلت و دسکتاپ
- 🌍 **چند زبانه**: پشتیبانی از فارسی و چینی
- 📊 **مدیریت آسان**: پنل مدیریت کاربرپسند

---

## 🔧 نصب و راه‌اندازی

### پیش‌نیازها

- Node.js (نسخه 18 یا بالاتر)
- حساب Cloudflare
- Wrangler CLI

### مراحل نصب

1. **Clone کردن پروژه**
   \`\`\`bash
   git clone <repository-url>
   cd PIMXPASS
   \`\`\`

2. **نصب وابستگی‌ها**
   \`\`\`bash
   npm install
   \`\`\`

3. **ورود به Cloudflare**
   \`\`\`bash
   npx wrangler login
   \`\`\`

4. **دیپلوی پروژه**
   \`\`\`bash
   npx wrangler deploy
   \`\`\`

---

## 📖 نحوه استفاده

### دسترسی به پنل

پس از دیپلوی موفق، به آدرس زیر بروید:

\`\`\`
https://pimxpass.randyortonrko976.workers.dev/89b3cbba-e6ac-485a-9481-976ad0e3f142
\`\`\`

> ⚠️ **توجه**: UUID خود را جایگزین کنید

### ساخت کانفیگ

1. وارد پنل شوید
2. UUID خود را وارد کنید
3. تنظیمات مورد نظر را انتخاب کنید:
   - نوع پروتکل (VLESS/Trojan/xhttp)
   - لوکیشن سرور
   - تنظیمات DNS (اختیاری)
4. روی "ساخت کانفیگ" کلیک کنید
5. کانفیگ ساخته شده را در اپلیکیشن VPN خود import کنید

### لینک سابسکریپشن

برای دریافت لینک سابسکریپشن:

\`\`\`
https://pimxpass.randyortonrko976.workers.dev/sub/YOUR-UUID
\`\`\`

این لینک را در نرم‌افزارهای VPN مانند:
- v2rayN
- v2rayNG
- Clash
- Shadowrocket

استفاده کنید.

---

## ⚙️ پیکربندی

### تنظیمات محیطی (wrangler.toml)

\`\`\`toml
name = "pimxpass"
main = "src/worker.js"
compatibility_date = "2026-01-20"

[vars]
PROJECT_NAME = "PIMXPASS"
VERSION = "3.0.0"

[[kv_namespaces]]
binding = "PIMXPASS_KV"
id = "YOUR-KV-NAMESPACE-ID"
\`\`\`

### UUID خود را تغییر دهید

فایل \`src/worker.js\` را باز کنید و خط زیر را پیدا کنید:

\`\`\`javascript
let 认证令牌 = 'YOUR-NEW-UUID';
\`\`\`

---

## 🎨 تغییر دیزاین

برای تغییر رنگ‌های دیزاین، متغیرهای CSS را در فایل \`worker.js\` ویرایش کنید:

\`\`\`css
:root {
    --primary-purple: #8b5cf6;  /* رنگ بنفش اصلی */
    --primary-cyan: #06b6d4;    /* رنگ آبی فیروزه‌ای */
    --glass-bg: rgba(139, 92, 246, 0.05);
    --glass-border: rgba(139, 92, 246, 0.3);
}
\`\`\`

---

## 📊 مدیریت و نظارت

### مشاهده آمار مصرف

در پنل Cloudflare:
1. وارد بخش Workers & Pages شوید
2. روی \`pimxpass\` کلیک کنید
3. آمار را در تب Metrics مشاهده کنید

### لاگ‌ها

برای مشاهده لاگ‌های زنده:

\`\`\`bash
npx wrangler tail
\`\`\`

---

## 🔒 امنیت

### توصیه‌های امنیتی

1. **UUID را خصوصی نگه دارید**: UUID شما مانند رمز عبور است
2. **از HTTPS استفاده کنید**: همیشه از اتصال امن استفاده کنید
3. **به‌روزرسانی منظم**: پروژه را به‌روز نگه دارید
4. **محدودسازی دسترسی**: در صورت امکان، IP allowlist تنظیم کنید

---

## 🛠️ اسکریپت‌های کمکی

### به‌روزرسانی دیزاین

برای اعمال آخرین تغییرات دیزاین:

\`\`\`bash
node scripts/update-ui.js
node scripts/full-glassmorphism-update.js
node scripts/final-polish.js
npx wrangler deploy
\`\`\`

---

## 🐛 رفع مشکلات

### خطا: KV Namespace not found

اگر این خطا را دریافت کردید:

\`\`\`bash
npx wrangler kv:namespace create "PIMXPASS_KV"
\`\`\`

سپس ID دریافت شده را در \`wrangler.toml\` قرار دهید.

### خطا: Worker exceeded CPU time

Worker شما CPU زیادی مصرف کرده. سعی کنید:
- کش را بهینه کنید
- درخواست‌های زائد را کاهش دهید
- از CDN برای فایل‌های استاتیک استفاده کنید

---

## 📱 نرم‌افزارهای پشتیبانی شده

- **ویندوز**: v2rayN, Clash for Windows
- **اندروید**: v2rayNG, Clash for Android
- **iOS**: Shadowrocket, Stash
- **macOS**: ClashX, V2RayX
- **لینوکس**: v2ray-core, Clash

---

## 🤝 مشارکت

برای مشارکت در توسعه:

1. Fork کنید
2. شاخه جدید بسازید (\`git checkout -b feature/amazing-feature\`)
3. تغییرات را commit کنید (\`git commit -m 'Add amazing feature'\`)
4. Push کنید (\`git push origin feature/amazing-feature\`)
5. Pull Request باز کنید

---

## 📄 لایسنس

این پروژه تحت لایسنس MIT منتشر شده است.

---

## 🌟 ستاره‌دار کنید!

اگر این پروژه برایتان مفید بود، لطفاً ⭐ ستاره بدهید!

---

## 📞 پشتیبانی

برای دریافت پشتیبانی:
- Issue باز کنید
- به بخش Discussions مراجعه کنید

---

## 🔗 لینک‌های مفید

- [مستندات Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [مستندات Wrangler](https://developers.cloudflare.com/workers/wrangler/)
- [پروتکل VLESS](https://github.com/XTLS/Xray-core)

---

<div dir="ltr">
<p align="center">
  ساخته شده با ❤️ توسط تیم PIMXPASS
</p>
<p align="center">
  <strong>PIMXPASS ULTIMATE v3.0</strong> - The Future of VPN
</p>
</div>
