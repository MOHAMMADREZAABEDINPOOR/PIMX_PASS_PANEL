# 🚀 PIMXPASS ULTIMATE v3.0

**The Most Advanced VPN Panel on Cloudflare Workers**

یک پنل VPN کامل و حرفه‌ای با ترکیب بهترین ویژگی‌های BPB-Panel، Nahan و CFnew!

## ✨ ویژگی‌های منحصربفرد

### 🎯 هسته اصلی
- ✅ **VLESS + Trojan + xhttp** - سه پروتکل در یک پنل
- ✅ **Auto Optimization** - بهینه‌سازی خودکار هر 15 دقیقه
- ✅ **ECH Support** - Encrypted Client Hello
- ✅ **Fragment Support** - عبور از فیلترینگ عمیق
- ✅ **Multi-Location** - چندین کشور با انتخاب خودکار
- ✅ **Clean IP Selector** - انتخاب خودکار بهترین IP

### 👥 مدیریت کاربران
- ✅ **Multi-User** - کاربران نامحدود
- ✅ **Multiplier System** - ضریب مصرف برای هر کاربر
- ✅ **Per-Config Usage** - ردیابی مصرف هر کانفیگ
- ✅ **Bandwidth Limit** - محدودیت حجم
- ✅ **Expiry Date** - تاریخ انقضا

### 📊 آمار و گزارش
- ✅ **Real-time Analytics** - آمار لحظه‌ای
- ✅ **Usage by Config** - مصرف هر کانفیگ جداگانه
- ✅ **Connection Logs** - لاگ اتصالات
- ✅ **Daily/Weekly Reports** - گزارش‌های دوره‌ای

### 🔗 Subscription
- ✅ **Universal Subscription** - لینک سابسکریپشن یکپارچه
- ✅ **10+ Client Support** - v2rayNG, Clash, Sing-box, ...
- ✅ **Auto Client Detection** - تشخیص خودکار کلاینت
- ✅ **QR Code Generation** - QR Code برای موبایل

### 🎨 رابط کاربری
- ✅ **Modern Dark UI** - طراحی مدرن و زیبا
- ✅ **Responsive** - سازگار با موبایل
- ✅ **Multi-language** - فارسی + English
- ✅ **Real-time Updates** - بروزرسانی بدون رفرش

## 🚀 نصب فوری (یک دستور!)

```bash
cd d:\code\PIMXPASS
wrangler deploy
```

**تمام!** دیگر نیازی به ساخت KV یا تنظیمات اضافی نیست! 🎉

## 📋 مراحل بعد از Deploy

1. **وارد پنل شوید:**
   ```
   https://your-worker.workers.dev/login
   نام کاربری: admin
   رمز عبور: admin123
   ```

2. **تغییر رمز ادمین (اجباری!):**
   - تب "Settings" → "Change Admin Password"

3. **افزودن کاربر:**
   - تب "Users" → "Add User"
   - نام کاربری، رمز، ضریب و محدودیت را تنظیم کنید

4. **دریافت Subscription:**
   - کاربر وارد `/user` می‌شود
   - لینک سابسکریپشن را کپی می‌کند
   - در کلاینت VPN import می‌کند

## 🌟 ویژگی‌های پیشرفته

### Multiplier System
هر کاربر یک ضریب دارد (مثلاً 1.5x یا 2x). اگر ضریب 2x باشد:
- 1GB مصرف واقعی = 2GB محاسبه می‌شود
- برای فروش پلن‌های VIP مناسب است

### Per-Config Usage
هر کانفیگ (VLESS، Trojan، ...) مصرف جداگانه دارد:
- ببینید کدام پروتکل بیشتر استفاده می‌شود
- بهینه‌سازی براساس آمار واقعی

### Auto Location Selection
براساس ping و بار سرور، بهترین لوکیشن انتخاب می‌شود:
- تست delay خودکار
- انتخاب نزدیک‌ترین سرور
- Fallback به لوکیشن دیگر در صورت خرابی

### ECH + Fragment
ترکیب ECH و Fragment برای عبور از فیلترینگ:
- ECH: رمزنگاری Client Hello
- Fragment: تکه‌تکه کردن پکت‌ها

## 📊 Dashboard Screenshot

```
┌─────────────────────────────────────────────────────┐
│ PIMXPASS ULTIMATE                    👤 admin ▾    │
├─────────────────────────────────────────────────────┤
│  📊 Overview  │  👥 Users  │  📈 Analytics  │  ⚙️   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  💎 Active Users: 15                                │
│  📡 Total Configs: 45                               │
│  📊 Total Usage: 125.3 GB                           │
│  🔄 Optimization: AUTO (Next in 12min)              │
│                                                     │
│  📈 Usage by Protocol:                              │
│  ├─ VLESS:  65.2 GB (52%)  ████████░░               │
│  ├─ Trojan: 45.1 GB (36%)  ██████░░░░               │
│  └─ xhttp:  15.0 GB (12%)  ███░░░░░░░               │
│                                                     │
│  🌍 Top Locations:                                  │
│  1. 🇸🇬 Singapore  45.2 GB                          │
│  2. 🇺🇸 USA         38.1 GB                          │
│  3. 🇩🇪 Germany     32.0 GB                          │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## 🔧 تنظیمات پیشرفته

تمام تنظیمات از طریق UI قابل تغییر است:

### Protocol Settings
- Enable/Disable VLESS, Trojan, xhttp
- Custom ports
- TLS/non-TLS
- ALPN configuration

### Optimization
- Auto optimization interval
- Delay test settings
- Clean IP sources
- Fallback servers

### Security
- Enable ECH
- Fragment size
- Custom DNS
- SOCKS5 proxy

## 🆘 پشتیبانی

**Documentation:** [Wiki](https://github.com/yourusername/PIMXPASS/wiki)  
**Issues:** [GitHub Issues](https://github.com/yourusername/PIMXPASS/issues)  
**Telegram:** [@PIMXPASS_Support](https://t.me/PIMXPASS_Support)

## 📜 License

MIT License - ساخته شده با ❤️ برای جامعه ایرانی

---

**⭐ اگر این پروژه را دوست داشتید، یک Star بدهید!**
