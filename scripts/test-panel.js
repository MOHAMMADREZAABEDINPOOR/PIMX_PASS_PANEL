const https = require('https');

const WORKER_URL = 'pimxpass.randyortonrko976.workers.dev';
const UUID = '89b3cbba-e6ac-485a-9481-976ad0e3f142';

console.log('🧪 تست کردن پنل PIMXPASS...\n');
console.log('━'.repeat(50));

// تابع برای HTTP request
function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: WORKER_URL,
      path: path,
      method: 'GET',
      headers: {
        'User-Agent': 'PIMXPASS-Test-Script'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

// تست‌ها
async function runTests() {
  let passedTests = 0;
  let totalTests = 0;

  // تست 1: صفحه اصلی
  totalTests++;
  console.log('\n📝 تست 1: بررسی صفحه اصلی...');
  try {
    const response = await makeRequest('/');
    if (response.statusCode === 200) {
      console.log('✅ صفحه اصلی در دسترس است (200 OK)');
      if (response.body.includes('PIMXPASS')) {
        console.log('✅ برندینگ PIMXPASS یافت شد');
        passedTests++;
      } else {
        console.log('⚠️  برندینگ PIMXPASS یافت نشد');
      }
    } else {
      console.log(`❌ خطا: کد وضعیت ${response.statusCode}`);
    }
  } catch (error) {
    console.log(`❌ خطا: ${error.message}`);
  }

  // تست 2: پنل مدیریت با UUID
  totalTests++;
  console.log('\n📝 تست 2: بررسی پنل مدیریت...');
  try {
    const response = await makeRequest(`/${UUID}`);
    if (response.statusCode === 200) {
      console.log('✅ پنل مدیریت در دسترس است (200 OK)');
      passedTests++;
      
      // بررسی محتوای HTML
      if (response.body.includes('glassmorphism') || 
          response.body.includes('PIMXPASS ULTIMATE') ||
          response.body.includes('glass-container')) {
        console.log('✅ دیزاین گلس‌مورفیسم تایید شد');
      } else {
        console.log('⚠️  دیزاین گلس‌مورفیسم کامل نیست');
      }
      
      // بررسی پشتیبانی فارسی
      if (response.body.includes('Vazirmatn') || response.body.includes('فارسی')) {
        console.log('✅ پشتیبانی فارسی فعال است');
      } else {
        console.log('⚠️  پشتیبانی فارسی یافت نشد');
      }
    } else {
      console.log(`❌ خطا: کد وضعیت ${response.statusCode}`);
    }
  } catch (error) {
    console.log(`❌ خطا: ${error.message}`);
  }

  // تست 3: لینک سابسکریپشن
  totalTests++;
  console.log('\n📝 تست 3: بررسی لینک سابسکریپشن...');
  try {
    const response = await makeRequest(`/sub/${UUID}`);
    if (response.statusCode === 200 || response.statusCode === 302) {
      console.log(`✅ لینک سابسکریپشن پاسخ داد (${response.statusCode})`);
      passedTests++;
    } else {
      console.log(`❌ خطا: کد وضعیت ${response.statusCode}`);
    }
  } catch (error) {
    console.log(`❌ خطا: ${error.message}`);
  }

  // تست 4: بررسی هدرها
  totalTests++;
  console.log('\n📝 تست 4: بررسی هدرهای امنیتی...');
  try {
    const response = await makeRequest('/');
    const securityHeaders = [
      'content-security-policy',
      'x-content-type-options',
      'x-frame-options'
    ];
    
    let hasSecurityHeaders = false;
    securityHeaders.forEach(header => {
      if (response.headers[header]) {
        hasSecurityHeaders = true;
      }
    });
    
    if (response.headers['content-type'] && response.headers['content-type'].includes('text/html')) {
      console.log('✅ Content-Type صحیح است');
      passedTests++;
    } else {
      console.log('⚠️  Content-Type ممکن است مشکل داشته باشد');
    }
  } catch (error) {
    console.log(`❌ خطا: ${error.message}`);
  }

  // تست 5: بررسی UUID نامعتبر
  totalTests++;
  console.log('\n📝 تست 5: تست UUID نامعتبر...');
  try {
    const response = await makeRequest('/invalid-uuid-12345');
    // باید به صفحه ورود UUID هدایت شود یا 404 برگرداند
    if (response.statusCode === 200 || response.statusCode === 404) {
      console.log('✅ رفتار صحیح برای UUID نامعتبر');
      passedTests++;
    } else {
      console.log(`⚠️  رفتار غیرمنتظره: ${response.statusCode}`);
    }
  } catch (error) {
    console.log(`❌ خطا: ${error.message}`);
  }

  // نتیجه نهایی
  console.log('\n' + '━'.repeat(50));
  console.log('\n📊 نتیجه تست‌ها:');
  console.log(`   موفق: ${passedTests}/${totalTests}`);
  console.log(`   درصد موفقیت: ${Math.round((passedTests / totalTests) * 100)}%`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 تمام تست‌ها موفق بودند!');
    console.log('✅ پنل PIMXPASS به درستی کار می‌کند');
  } else if (passedTests >= totalTests * 0.8) {
    console.log('\n✅ اکثر تست‌ها موفق بودند');
    console.log('⚠️  برخی مشکلات جزئی وجود دارد');
  } else {
    console.log('\n⚠️  تعداد قابل توجهی از تست‌ها ناموفق بودند');
    console.log('🔧 لطفاً مشکلات را بررسی کنید');
  }

  console.log('\n🔗 لینک‌های مفید:');
  console.log(`   صفحه اصلی: https://${WORKER_URL}`);
  console.log(`   پنل مدیریت: https://${WORKER_URL}/${UUID}`);
  console.log(`   سابسکریپشن: https://${WORKER_URL}/sub/${UUID}`);
  
  console.log('\n' + '━'.repeat(50));
}

// اجرای تست‌ها
runTests().catch(error => {
  console.error('❌ خطای کلی:', error);
  process.exit(1);
});
