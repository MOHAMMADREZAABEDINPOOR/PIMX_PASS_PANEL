const fs = require('fs');
const path = require('path');

const workerPath = path.join(__dirname, '..', 'src', 'worker.js');
let content = fs.readFileSync(workerPath, 'utf8');

console.log('✨ پولیش نهایی دیزاین گلس‌مورفیسم...\n');

// 1. حذف کامل کدهای مربوط به ماتریکس و افکت‌های سایبرپانک از JavaScript
console.log('1️⃣ حذف کدهای JavaScript ماتریکس...');
content = content.replace(/function 创建矩阵雨\(\)[^}]*\{[\s\S]*?\n\}/g, 'function 创建矩阵雨() { /* Disabled */ }');
content = content.replace(/const 矩阵值[^;]*;[\s\S]*?矩阵值\.appendChild\(列10005\);[\s\S]*?\}/g, '');

// 2. ساده‌سازی background برای همه بخش‌ها
console.log('2️⃣ ساده‌سازی background...');
content = content.replace(
  /background:\s*linear-gradient\(90deg, rgba\(255,43,214[^;]*;/g,
  'background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(6, 182, 212, 0.2));'
);

// 3. حذف تمام text-shadow های سایبرپانک
console.log('3️⃣ حذف text-shadow های سایبرپانک...');
content = content.replace(/text-shadow:\s*0 0 [0-9]+px [^;]*;/g, '');

// 4. تبدیل box-shadow های نئون به سایه‌های نرم
console.log('4️⃣ نرم‌سازی box-shadow ها...');
content = content.replace(/box-shadow:\s*0 0 [0-9]+px var\(--cp-[^)]*\);/g, 'box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);');
content = content.replace(/box-shadow:\s*0 0 [0-9]+px rgba\([^)]*\);/g, 'box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);');

// 5. حذف انیمیشن‌های خاص سایبرپانک
console.log('5️⃣ حذف انیمیشن‌های سایبرپانک...');
content = content.replace(/@keyframes cp-blink[^}]*\{[^}]*\}/g, 
  `@keyframes cp-blink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }`
);

// 6. اضافه کردن استایل‌های گلس‌مورفیسم برای کارت‌ها
console.log('6️⃣ بهبود استایل کارت‌ها...');
const glassCardStyle = `
            .glass-card {
                background: rgba(255, 255, 255, 0.05);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                border-radius: 16px;
                border: 1px solid rgba(139, 92, 246, 0.2);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            }`;

if (!content.includes('.glass-card')) {
  content = content.replace('</style>', glassCardStyle + '\n        </style>');
}

// 7. حذف ویژگی‌های خاص ترمینال که شبیه cmd/terminal هستند
console.log('7️⃣ مدرن‌سازی المان‌های ترمینال...');
content = content.replace(/\.terminal-prompt::before[^}]*\{[^}]*\}/g,
  `.terminal-prompt::before {
                content: "▸";
                color: var(--primary-cyan);
                margin-right: 8px;
            }`
);

// 8. تبدیل cursor از block به line
console.log('8️⃣ بهبود cursor...');
content = content.replace(/\.terminal-cursor[^}]*\{[^}]*width: 9px;[^}]*\}/gs,
  `.terminal-cursor {
                display: inline-block;
                width: 2px;
                height: 20px;
                background: var(--primary-cyan);
                margin-left: 4px;
                animation: cp-blink 1s ease-in-out infinite;
            }`
);

// 9. حذف استایل‌های مربوط به FX off که دیگر نیاز نیست
console.log('9️⃣ پاکسازی کدهای غیرضروری FX...');
content = content.replace(/body\.fx-off [^}]*\{[^}]*\}/g, '');

// 10. اضافه کردن smooth transitions
console.log('🔟 اضافه کردن transitions نرم...');
content = content.replace(
  /\* \{ margin: 0; padding: 0; box-sizing: border-box; \}/g,
  `* { 
                margin: 0; 
                padding: 0; 
                box-sizing: border-box;
                transition: all 0.3s ease;
            }`
);

// 11. بهبود hover effects
console.log('1️⃣1️⃣ بهبود hover effects...');
if (!content.includes('.terminal-input:hover')) {
  const hoverStyles = `
            .terminal-input:hover {
                background: rgba(255, 255, 255, 0.08);
            }
            .terminal-button:hover {
                transform: scale(1.1);
            }`;
  content = content.replace('</style>', hoverStyles + '\n        </style>');
}

// 12. حذف کامل cp-lang-wrapper اگر وجود دارد
console.log('1️⃣2️⃣ ساده‌سازی language selector...');
content = content.replace(/\.cp-lang-wrapper[^}]*\{[^}]*\}/g, '');
content = content.replace(/\.cp-lang-tag[^}]*\{[^}]*\}/g, '');
content = content.replace(/<div class="cp-lang-wrapper">[^<]*<span class="cp-lang-tag">[^<]*<\/span>/g, '');

// 13. تبدیل رنگ‌های باقی‌مانده
console.log('1️⃣3️⃣ تبدیل نهایی رنگ‌ها...');
content = content.replace(/var\(--cp-cyan\)/g, 'var(--primary-cyan)');
content = content.replace(/var\(--cp-pink\)/g, 'var(--primary-purple)');
content = content.replace(/var\(--cp-purple\)/g, 'var(--primary-purple)');
content = content.replace(/var\(--cp-mint\)/g, 'var(--success)');
content = content.replace(/var\(--cp-red\)/g, 'var(--error)');
content = content.replace(/var\(--cp-text\)/g, 'var(--text-primary)');
content = content.replace(/var\(--cp-text-dim\)/g, 'var(--text-secondary)');

// ذخیره فایل
fs.writeFileSync(workerPath, content, 'utf8');

console.log('\n✅ پولیش نهایی با موفقیت انجام شد!');
console.log('━'.repeat(50));
console.log('تغییرات اعمال شده:');
console.log('  ✓ حذف کدهای JavaScript ماتریکس');
console.log('  ✓ ساده‌سازی background ها');
console.log('  ✓ حذف text-shadow های نئون');
console.log('  ✓ نرم‌سازی box-shadow ها');
console.log('  ✓ بهینه‌سازی انیمیشن‌ها');
console.log('  ✓ بهبود استایل کارت‌ها');
console.log('  ✓ مدرن‌سازی المان‌های ترمینال');
console.log('  ✓ بهبود cursor');
console.log('  ✓ اضافه کردن transitions نرم');
console.log('  ✓ بهبود hover effects');
console.log('  ✓ تبدیل تمام متغیرهای رنگ');
console.log('\n🚀 آماده دیپلوی نهایی!');
