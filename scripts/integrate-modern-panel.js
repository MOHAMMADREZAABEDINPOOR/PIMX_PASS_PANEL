const fs = require('fs');
const path = require('path');

console.log('🚀 ادغام پنل مدرن در Worker...\n');

const workerPath = path.join(__dirname, '..', 'src', 'worker.js');
const modernPanelPath = path.join(__dirname, '..', 'src', 'modern-panel.html');

// خواندن فایل‌ها
let workerContent = fs.readFileSync(workerPath, 'utf8');
const modernPanel = fs.readFileSync(modernPanelPath, 'utf8');

console.log('📝 پیدا کردن بخش HTML قدیمی...');

// پیدا کردن و جایگزینی صفحه UUID input
const uuidPageStart = workerContent.indexOf('const 终端页面 = `<!DOCTYPE html>');
const uuidPageEnd = workerContent.indexOf('</script>', uuidPageStart) + '</script>'.length + 10;

if (uuidPageStart !== -1 && uuidPageEnd !== -1) {
    console.log('✅ بخش HTML قدیمی یافت شد');
    console.log(`   موقعیت: ${uuidPageStart} تا ${uuidPageEnd}`);
    
    // HTML جدید را escape می‌کنیم
    const escapedHTML = modernPanel
        .replace(/\\/g, '\\\\')
        .replace(/`/g, '\\`')
        .replace(/\$/g, '\\$');
    
    // جایگزینی
    const before = workerContent.substring(0, uuidPageStart);
    const after = workerContent.substring(uuidPageEnd);
    
    workerContent = before + `const 终端页面 = \`${escapedHTML}\`;` + after;
    
    console.log('✅ HTML جدید جایگزین شد');
    
    // ذخیره فایل
    fs.writeFileSync(workerPath, workerContent, 'utf8');
    console.log('✅ فایل ذخیره شد');
    console.log('\n🎉 پنل مدرن با موفقیت ادغام شد!');
    console.log('\n📦 حالا دستور زیر را اجرا کنید:');
    console.log('   npx wrangler deploy');
} else {
    console.log('❌ بخش HTML قدیمی پیدا نشد');
    console.log('💡 از روش دیگری استفاده می‌کنیم...');
    
    // روش دوم: پیدا کردن با regex
    const regex = /const 终端页面 = `<!DOCTYPE html>[\s\S]*?<\/html>`;/;
    if (regex.test(workerContent)) {
        console.log('✅ با regex پیدا شد');
        
        const escapedHTML = modernPanel
            .replace(/\\/g, '\\\\')
            .replace(/`/g, '\\`')
            .replace(/\$/g, '\\$');
        
        workerContent = workerContent.replace(regex, `const 终端页面 = \`${escapedHTML}\`;`);
        
        fs.writeFileSync(workerPath, workerContent, 'utf8');
        console.log('✅ پنل مدرن با موفقیت ادغام شد!');
    } else {
        console.log('❌ هیچ راهی پیدا نشد. لطفاً به صورت دستی ادغام کنید.');
    }
}
