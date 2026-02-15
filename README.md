# PIMX Panel (Cloudflare Worker)

این پروژه یک اسکریپت تک‌فایل Cloudflare Worker است (`worker.js`) با رابط کاربری دو‌زبانه (فارسی/English).

## لینک‌ها

- کانال تلگرام: `https://t.me/PIMX_PASS`
- بات سرور: `https://t.me/PIMX_PASS_BOT` (V2Ray / NPV Tunnel / HA Tunnel Plus / OpenVPN / HTTP Injector / HTTP Custom + پروکسی تلگرام)
- بات دانلود اندروید: `https://t.me/PIMX_PLAY_BOT`
- یوتیوب: `https://www.youtube.com/@PIMX_PLAY_BOT`
- X: `https://x.com/pimxpass`

## اجرا / Deploy (Cloudflare Dashboard)

1) در Cloudflare Dashboard → Workers & Pages → Create Worker → **Start with Hello World**.  
2) محتوای فایل `worker.js` را کامل جایگزین کنید و Deploy بزنید.  
3) در Settings → **Variables and Secrets**:
   - `U` = UUID شما (اجباری)
   - `D` = مسیر سفارشی مثل `/mypath` (اختیاری)
   - `BRAND` = نام/برند بالای پنل (اختیاری)
4) در **KV**:
   - یک KV Namespace بسازید
   - Binding را با نام `C` وصل کنید

## آدرس‌ها

- پنل: `/{UUID}` یا اگر `D` را تنظیم کرده‌اید: `/{D}`
- اشتراک: `/{UUID}/sub` یا `/{D}/sub`

## نکته‌ها

- اگر KV (`C`) را وصل نکنید، بخش ذخیره تنظیمات محدود می‌شود.
- برای مدیریت Preferred IP از طریق API باید گزینه `ae` را در تنظیمات روشن کنید.

---

## English

This is a single-file Cloudflare Worker (`worker.js`) with a bilingual UI (Persian/English).

### Links

- Telegram channel: `https://t.me/PIMX_PASS`
- Server bot: `https://t.me/PIMX_PASS_BOT` (V2Ray / NPV Tunnel / HA Tunnel Plus / OpenVPN / HTTP Injector / HTTP Custom + Telegram proxy)
- Android download bot: `https://t.me/PIMX_PLAY_BOT`
- YouTube: `https://www.youtube.com/@PIMX_PLAY_BOT`
- X: `https://x.com/pimxpass`

### Run / Deploy (Cloudflare Dashboard)

1) Cloudflare Dashboard → Workers & Pages → Create Worker → **Start with Hello World**.  
2) Replace the worker content with `worker.js` and click Deploy.  
3) Settings → **Variables and Secrets**:
   - `U` = your UUID (required)
   - `D` = custom path like `/mypath` (optional)
   - `BRAND` = header brand name (optional)
4) **KV**:
   - Create a KV namespace
   - Bind it as `C`

### Routes

- Panel: `/{UUID}` (or `/{D}` if set)
- Subscription: `/{UUID}/sub` (or `/{D}/sub`)

