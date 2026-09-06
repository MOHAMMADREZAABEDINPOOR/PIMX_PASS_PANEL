# ⚡ راهنمای سریع PIMXPASS

## 🎯 شروع در 3 قدم

### قدم 1️⃣: دسترسی به پنل

پنل شما در آدرس زیر آماده است:

```
https://pimxpass.randyortonrko976.workers.dev
```

### قدم 2️⃣: وارد کردن UUID

برای دسترسی به پنل مدیریت، UUID خود را وارد کنید:

```
https://pimxpass.randyortonrko976.workers.dev/89b3cbba-e6ac-485a-9481-976ad0e3f142
```

> 💡 **نکته**: UUID فعلی: `89b3cbba-e6ac-485a-9481-976ad0e3f142`

### قدم 3️⃣: دریافت کانفیگ

در پنل مدیریت:
1. پروتکل را انتخاب کنید (VLESS توصیه می‌شود)
2. روی "دریافت کانفیگ" کلیک کنید
3. کانفیگ را کپی کنید و در اپلیکیشن VPN خود Paste کنید

---

## 🔗 لینک‌های سریع

### لینک سابسکریپشن

```
https://pimxpass.randyortonrko976.workers.dev/sub/89b3cbba-e6ac-485a-9481-976ad0e3f142
```

این لینک را در نرم‌افزار VPN خود به عنوان Subscription اضافه کنید.

### API Endpoints

- **صفحه اصلی**: `/`
- **پنل مدیریت**: `/{UUID}`
- **سابسکریپشن**: `/sub/{UUID}`
- **کانفیگ مستقیم**: `/{UUID}?config=vless`

---

## 📱 نصب اپلیکیشن‌های VPN

### اندروید
1. [v2rayNG دانلود کنید](https://github.com/2dust/v2rayNG/releases)
2. باز کنید
3. ➕ (بالا سمت راست) → Import config from clipboard
4. لینک سابسکریپشن را Paste کنید

### iOS
1. Shadowrocket را از App Store دانلود کنید
2. ➕ → Subscribe → Add
3. لینک سابسکریپشن را وارد کنید

### ویندوز
1. [v2rayN دانلود کنید](https://github.com/2dust/v2rayN/releases)
2. باز کنید
3. سرورها → اضافه کردن سرور از کلیپ‌بورد
4. کانفیگ را Paste کنید

---

## 🎨 ویژگی‌های دیزاین جدید

✅ **دیزاین گلس‌مورفیسم**
- پس‌زمینه شفاف با افکت blur
- رنگ‌بندی بنفش و آبی فیروزه‌ای
- انیمیشن‌های نرم و روان

✅ **فونت فارسی**
- فونت Vazirmatn برای متون فارسی
- خوانایی بالا
- زیبایی بصری

✅ **واکنش‌گرا**
- سازگار با موبایل
- سازگار با تبلت
- سازگار با دسکتاپ

---

## ⚙️ تنظیمات پیشرفته

### تغییر UUID

برای تغییر UUID، فایل `src/worker.js` را ویرایش کنید:

```javascript
let 认证令牌 = 'NEW-UUID-HERE';
```

سپس دیپلوی کنید:
```bash
cd d:\code\PIMXPASS
npx wrangler deploy
```

### فعال/غیرفعال کردن پروتکل‌ها

در پنل مدیریت می‌توانید پروتکل‌های مختلف را فعال یا غیرفعال کنید:
- **VLESS**: سریع و امن (پیشنهادی) ✅
- **Trojan**: سازگاری بالا
- **xhttp**: مخصوص شرایط محدودیت شدید

---

## 🚀 به‌روزرسانی

برای دریافت آخرین نسخه:

```bash
cd d:\code\PIMXPASS
git pull
npm install
npx wrangler deploy
```

---

## 🔍 تست کردن اتصال

### تست سریع

```bash
curl -I https://pimxpass.randyortonrko976.workers.dev
```

باید پاسخ `200 OK` دریافت کنید.

### تست UUID

```bash
curl https://pimxpass.randyortonrko976.workers.dev/89b3cbba-e6ac-485a-9481-976ad0e3f142
```

باید صفحه HTML پنل مدیریت را ببینید.

---

## ❓ سوالات متداول

### چرا نمی‌توانم وصل شوم؟

1. **UUID را چک کنید**: مطمئن شوید UUID صحیح است
2. **اینترنت را چک کنید**: اتصال شما به اینترنت باید فعال باشد
3. **Worker را چک کنید**: مطمئن شوید Worker در Cloudflare فعال است
4. **تنظیمات را چک کنید**: در اپلیکیشن VPN تنظیمات صحیح باشد

### چطور UUID جدید بسازم؟

آنلاین:
- https://www.uuidgenerator.net/

یا با دستور:
```bash
npx uuid
```

### چطور چند کاربر اضافه کنم؟

در حال حاضر، هر Worker یک UUID دارد. برای چند کاربر:
1. Worker های متعدد بسازید
2. یا از KV برای ذخیره UUID های مختلف استفاده کنید

---

## 📊 مانیتورینگ

### مشاهده آمار در Cloudflare Dashboard

1. وارد [dash.cloudflare.com](https://dash.cloudflare.com) شوید
2. Workers & Pages → pimxpass
3. تب Metrics را باز کنید

### مشاهده لاگ‌های زنده

```bash
cd d:\code\PIMXPASS
npx wrangler tail
```

---

## 🛡️ امنیت

### ⚠️ هشدارهای امنیتی

1. **UUID را به اشتراک نگذارید**
2. **از HTTPS استفاده کنید** (همیشه)
3. **Worker خود را محافظت کنید**
4. **رمزهای عبور قوی استفاده کنید**

### ✅ توصیه‌های امنیتی

- هر چند وقت UUID را تغییر دهید
- لاگ‌ها را بررسی کنید
- از تنظیمات Cloudflare برای محافظت استفاده کنید
- Firewall Rules تنظیم کنید

---

## 💡 نکات مهم

### کاهش Latency

- از نزدیک‌ترین لوکیشن Cloudflare استفاده کنید
- از IPv6 استفاده کنید اگر ممکن است
- تنظیمات DNS را بهینه کنید

### افزایش سرعت

- پروتکل VLESS با TCP را امتحان کنید
- mux را فعال کنید
- از KCP پرهیز کنید (ping بالا)

### صرفه‌جویی در مصرف

- تعداد connection ها را محدود کنید
- از cache استفاده کنید
- traffic رو مانیتور کنید

---

## 🎯 کاربردها

### استفاده‌های معمول

✅ دسترسی به محتوای محدود شده
✅ حفظ حریم خصوصی آنلاین
✅ امنیت در Wi-Fi عمومی
✅ دور زدن سانسور
✅ کار ریموت امن

---

## 🔧 عیب‌یابی

### Worker کار نمی‌کند

```bash
# چک کردن وضعیت
npx wrangler whoami

# دیپلوی مجدد
npx wrangler deploy

# مشاهده لاگ
npx wrangler tail
```

### KV Namespace خطا می‌دهد

```bash
# لیست KV ها
npx wrangler kv:namespace list

# ساخت KV جدید
npx wrangler kv:namespace create "PIMXPASS_KV"

# به‌روزرسانی wrangler.toml با ID جدید
```

### دیپلوی ناموفق

1. اینترنت را چک کنید
2. Cloudflare token را چک کنید
3. wrangler.toml را چک کنید
4. دوباره login کنید: `npx wrangler login`

---

## 📞 دریافت کمک

مشکل دارید؟

1. ✅ ابتدا این فایل را کامل بخوانید
2. 📖 README_FA.md را مطالعه کنید
3. 🔍 در Issues سایر کاربران را ببینید
4. ❓ Issue جدید باز کنید

---

## 🎉 موفق باشید!

حالا آماده‌اید که از **PIMXPASS ULTIMATE v3.0** استفاده کنید!

```
🌍 دسترسی جهانی
🔒 امنیت کامل
⚡ سرعت بالا
🎨 دیزاین زیبا
```

---

<div align="center">

**PIMXPASS ULTIMATE v3.0**

*The Future of VPN is Here*

[🌟 ستاره بدهید](https://github.com) | [📖 مستندات](README_FA.md) | [🐛 گزارش باگ](https://github.com/issues)

</div>
