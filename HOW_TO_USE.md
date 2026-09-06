# 🚀 راهنمای استفاده از PIMXPASS

## ✅ پنل شما آماده است!

**URL پنل:** 
```
https://pimxpass.randyortonrko976.workers.dev/pimxpass-admin-2026
```

## 🔑 UUID شما:
```
pimxpass-admin-2026
```

## 📋 دسترسی به پنل:

### 1. باز کردن صفحه مدیریت:
```
https://pimxpass.randyortonrko976.workers.dev/pimxpass-admin-2026
```

این صفحه به شما امکان می‌دهد:
- ✅ پروتکل‌ها را فعال/غیرفعال کنید (VLESS, Trojan, xhttp)
- ✅ تنظیمات ECH و Fragment
- ✅ انتخاب لوکیشن (کشور)
- ✅ تست delay و انتخاب بهترین IP
- ✅ دریافت لینک subscription

### 2. فعال کردن KV برای ذخیره تنظیمات:

پنل به صورت خودکار از KV استفاده می‌کند. تمام تنظیماتی که در UI تغییر می‌دهید ذخیره می‌شود.

## 🎯 ویژگی‌های موجود:

### 1. **Protocol Management**
- VLESS (Alpha) - پیش‌فرض فعال
- Trojan (Beta) - می‌توانید فعال کنید
- xhttp - پروتکل جدید

### 2. **Optimization**
- تست delay خودکار
- انتخاب بهترین IP
- بهینه‌سازی هر 15 دقیقه

### 3. **Multi-Client Support**
لینک subscription برای:
- v2rayNG
- Clash
- Sing-box
- Shadowrocket
- و 6 کلاینت دیگر!

### 4. **Security**
- ECH (Encrypted Client Hello)
- Fragment براhelp: (عبور از فیلترینگ)
- Custom DNS
- SOCKS5 proxy

## 📱 دریافت کانفیگ:

1. به آدرس UUID خود بروید
2. از قسمت "Client Apps" لینک subscription را کپی کنید
3. در کلاینت VPN خود import کنید

**مثال لینک subscription:**
```
https://pimxpass.randyortonrko976.workers.dev/pimxpass-admin-2026/sub
```

## ⚙️ تنظیمات پیشرفته:

### تغییر UUID:
فایل `src/worker.js` خط 27:
```javascript
let 认证令牌 = 'pimxpass-admin-2026'; // UUID شما
```

### فعال کردن Trojan:
در UI روی دکمه "Enable Trojan" کلیک کنید.

### اضافه کردن Clean IP:
در قسمت "Preferred IPs" می‌توانید IP‌های سفارشی اضافه کنید.

## 🔄 Deploy مجدد:

```bash
cd d:\code\PIMXPASS
npx wrangler deploy
```

## 🆘 رفع مشکل:

### صفحه خالی یا Error:
- مطمئن شوید UUID صحیح است: `pimxpass-admin-2026`
- Cache مرورگر را پاک کنید (Ctrl+Shift+R)

### تنظیمات ذخیره نمی‌شود:
- KV namespace به درستی متصل است (چک کردیم ✅)

### کانفیگ کار نمی‌کند:
- مطمئن شوید حداقل یک پروتکل (VLESS) فعال است
- IP تمیز (Clean IP) را تست کنید

---

**✨ موفق باشید!**
