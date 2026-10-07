<div align="center">

<img src="assets/readme/hero.gif" width="1200" alt="PIMX PASS PANEL — rotating 3D geometry" />

**[English](README.md) · [فارسی](README.fa.md)**

<img src="assets/readme/identity.svg" width="1200" alt="security / English and Persian documentation" />

</div>

# PIMX PASS PANEL

Worker در Cloudflare با رابط مدیریت فارسی، ذخیره وضعیت در KV، تولید اشتراک و اتصال پراکسی WebSocket به TCP.

[GitHub](https://github.com/MOHAMMADREZAABEDINPOOR/PIMX_PASS_PANEL) · [PIMX / Profile](https://github.com/MOHAMMADREZAABEDINPOOR) · [بنر ثابت](assets/readme/hero.png)

## امکانات

- ارائه رابط مدیریت توسط خود Worker
- تنظیمات و مسیرهای API مبتنی بر KV
- تولید تنظیمات اشتراک
- پردازش WebSocket با cloudflare:sockets

## پشته فنی

| ابزار | نسخه یا منبع |
|---|---|
| Node.js | `package.json` |

## شروع کار

Node.js 22.12 یا بالاتر و مدیر پکیج مشخص‌شده در package.json. نسخه وابستگی‌ها را مطابق فایل قفل نصب کنید.

```bash
git clone https://github.com/MOHAMMADREZAABEDINPOOR/PIMX_PASS_PANEL.git
cd PIMX_PASS_PANEL

npm install
npm run dev
```

## تنظیمات

فایل محیط استاندارد تعریف نشده است. برای تمرین‌های مستقل تنظیم خارجی لازم نیست؛ اگر در کد ثابت‌های سرویس یا مسیر وجود دارد، آن‌ها را پیش از اجرا بررسی کنید.

اتصال‌های میزبانی: `PIMXPASS_KV`.

## استفاده

فضای KV اختصاصی با نام اتصال `PIMXPASS_KV` بسازید، شناسه‌ها را در wrangler.toml عوض و Worker محلی را اجرا کنید. پیش از استقرار تنظیمات و کنترل دسترسی را بررسی کنید.

## ساختار پروژه

| مسیر | نقش |
|---|---|
| [`assets/`](assets/) | فایل برند، رسانه و README |
| [`scripts/`](scripts/) | ابزار توسعه و نگهداری |
| [`src/`](src/) | کد برنامه |
| [`package.json`](package.json) | فایل ورودی یا تنظیم پروژه |
| [`wrangler.toml`](wrangler.toml) | فایل ورودی یا تنظیم پروژه |

## فرمان‌ها و بررسی

```bash
npm run dev
npm run start
```

این‌ها فرمان‌های موجود در package.json هستند؛ فهرست بالا گزارش اجرای آزمون نیست. فرمان تست ممکن است مرورگر، سرویس یا دیتابیس آماده بخواهد.

## استقرار

اتصال KV را با شناسه منبع خودتان تنظیم و اسرار را با Wrangler secret ذخیره کنید. Worker را مستقر و در ربات وب‌هوک HTTPS را ثبت کنید. شناسه موجود در تنظیم مخزن را منبع خود فرض نکنید.

## محدودیت‌ها

این نسخه نمونه پراکسی و مدیریت است و محدودیت سوکت Cloudflare را دارد. ظاهر پنل به معنی راه‌اندازی سرور WireGuard یا OpenVPN نیست.

## رفع مشکل

- پکیج غایب: وابستگی را با مدیر پکیج پروژه نصب کنید.
- خطای API یا شبکه: آدرس، سرویس و اتصال میزبانی را بررسی کنید.
- فایل قدیمی: در صورت وجود اسکریپت ساخت، build و کش مرورگر را تازه کنید.

## مشارکت

برای تغییر، شاخه مستقل بسازید، رفتار فعلی را بررسی کنید و توضیح روشن همراه تغییر بفرستید. اطلاعات خصوصی، خروجی build و دیتابیس محلی را commit نکنید.

راهنماهای همراه:

- [DEPLOY_GUIDE.md](DEPLOY_GUIDE.md)

## مجوز

فایل مجوز در این نسخه موجود نیست. نمایش عمومی کد به‌تنهایی مجوز استفاده مجدد نیست؛ برای شرایط استفاده با مالک مخزن هماهنگ کنید.

---

ساخته‌شده در مجموعه **PIMX** · مستندات فارسی و انگلیسی.
