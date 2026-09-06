# 🚀 راهنمای Deploy سریع PIMXPASS

## مرحله 1: Clone یا دانلود

پروژه را دارید در `d:\code\PIMXPASS`

## مرحله 2: نصب Wrangler (اگر ندارید)

```bash
npm install -g wrangler
wrangler login
```

## مرحله 3: ساخت KV (فقط یک بار)

```bash
cd d:\code\PIMXPASS
wrangler kv namespace create PIMXPASS_KV
```

خروجی را کپی کنید، مثلاً:
```
id = "abc123..."
```

## مرحله 4: ویرایش wrangler.toml

فایل `wrangler.toml` را باز کنید و ID را جایگزین کنید:

```toml
[[kv_namespaces]]
binding = "PIMXPASS_KV"
id = "ABC123DEF456"  # <-- این را با ID خودتان جایگزین کنید
```

## مرحله 5: Deploy!

```bash
wrangler deploy
```

**تمام!** 🎉

پنل شما در:
```
https://pimxpass.YOUR-SUBDOMAIN.workers.dev
```

## ورود اولیه:

```
نام کاربری: admin
رمز عبور: admin123
```

**⚠️ حتماً بعد از ورود، رمز را عوض کنید!**

---

## نکات مهم:

1. **KV فقط یک بار** ساخته می‌شود
2. **تمام تنظیمات** از طریق UI قابل تغییر است
3. **هیچ کد اضافی** نیاز نیست
4. **Auto-setup** در اولین اجرا انجام می‌شود

## اگر مشکلی داشتید:

```bash
# پاک کردن cache
wrangler dev --local

# دیدن لاگ‌ها
wrangler tail

# بررسی تنظیمات
wrangler kv:namespace list
```

**موفق باشید!** 🚀
