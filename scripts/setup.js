#!/usr/bin/env node
/**
 * PIMX VPN Panel — Automatic Setup Script
 * This script automatically:
 *   1. Checks wrangler login
 *   2. Creates KV namespace (if not exists)
 *   3. Updates wrangler.toml with real KV IDs
 *   4. Runs `wrangler dev` or `wrangler deploy`
 */

const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ─── Colors ───────────────────────────────────────────────────────
const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  magenta: '\x1b[35m',
  blue: '\x1b[34m',
  gray: '\x1b[90m',
};
const log = (color, icon, msg) => console.log(`${color}${C.bold}${icon}${C.reset} ${msg}`);
const info  = (msg) => log(C.cyan,    'ℹ', msg);
const ok    = (msg) => log(C.green,   '✓', msg);
const warn  = (msg) => log(C.yellow,  '⚠', msg);
const error = (msg) => log(C.red,     '✗', msg);
const step  = (msg) => log(C.magenta, '→', msg);
const title = (msg) => console.log(`\n${C.bold}${C.blue}${'─'.repeat(50)}${C.reset}\n${C.bold}${C.cyan}  🛡️  ${msg}${C.reset}\n${C.bold}${C.blue}${'─'.repeat(50)}${C.reset}\n`);

// ─── Helpers ──────────────────────────────────────────────────────
function run(cmd, opts = {}) {
  try {
    const result = execSync(cmd, {
      encoding: 'utf8',
      stdio: opts.silent ? 'pipe' : ['pipe', 'pipe', 'pipe'],
      ...opts
    });
    return { ok: true, output: result || '' };
  } catch (e) {
    return { ok: false, output: e.stderr || e.stdout || e.message || '' };
  }
}

function runLive(cmd) {
  // Run with stdio inherited (shows output live)
  const result = spawnSync(cmd, { shell: true, stdio: 'inherit' });
  return result.status === 0;
}

function ask(question) {
  return new Promise(resolve => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(`${C.yellow}${C.bold}?${C.reset} ${question} `, ans => {
      rl.close();
      resolve(ans.trim());
    });
  });
}

// ─── Check wrangler ───────────────────────────────────────────────
function checkWrangler() {
  const res = run('wrangler --version', { silent: true });
  if (!res.ok) {
    error('wrangler پیدا نشد!');
    info('اجرا کن: npm install -g wrangler');
    process.exit(1);
  }
  const ver = res.output.trim().split('\n')[0];
  ok(`Wrangler: ${ver}`);
}

// ─── Check login ──────────────────────────────────────────────────
function checkLogin() {
  const res = run('wrangler whoami', { silent: true });
  if (!res.ok || res.output.includes('not authenticated') || res.output.includes('You are not')) {
    warn('هنوز وارد Cloudflare نشدی!');
    step('در حال باز کردن صفحه لاگین...');
    runLive('wrangler login');
    // Re-check
    const re = run('wrangler whoami', { silent: true });
    if (!re.ok || re.output.includes('not authenticated')) {
      error('لاگین ناموفق بود. دوباره تلاش کن.');
      process.exit(1);
    }
  }
  // Extract account info
  const match = res.output.match(/You are logged in with an API Token/i) ||
                res.output.match(/Logged in as (.+)/i) ||
                res.output.match(/email:\s*(.+)/i);
  ok(`Cloudflare: لاگین شدی ✓`);
}

// ─── KV Namespace ─────────────────────────────────────────────────
async function setupKV() {
  step('بررسی KV Namespace...');

  // List existing namespaces
  const listRes = run('wrangler kv namespace list', { silent: true });
  let existingId = null;
  let existingPreviewId = null;

  if (listRes.ok) {
    try {
      // wrangler outputs JSON
      const list = JSON.parse(listRes.output.trim());
      const found = list.find(ns => ns.title === 'pimxpass-panel-PIMXPASS_KV');
      const foundPreview = list.find(ns => ns.title === 'pimxpass-panel-PIMXPASS_KV_preview');
      if (found) {
        existingId = found.id;
        ok(`KV Namespace موجوده: ${found.title} (${existingId.slice(0, 8)}...)`);
      }
      if (foundPreview) {
        existingPreviewId = foundPreview.id;
      }
    } catch {}
  }

  // Create main namespace if not exists
  if (!existingId) {
    step('در حال ساخت KV Namespace...');
    const createRes = run('wrangler kv namespace create PIMXPASS_KV', { silent: true });
    if (!createRes.ok) {
      error('خطا در ساخت KV:');
      console.log(createRes.output);
      process.exit(1);
    }
    // Parse the ID from output
    // Output example: { binding = "PIMXPASS_KV", id = "abc123..." }
    const idMatch = createRes.output.match(/id\s*=\s*["']?([a-f0-9]{32})["']?/i);
    if (!idMatch) {
      error('نتوانستم ID را از خروجی بخوانم:');
      console.log(createRes.output);
      process.exit(1);
    }
    existingId = idMatch[1];
    ok(`KV Namespace ساخته شد: ${existingId.slice(0, 8)}...`);
  }

  // Create preview namespace if not exists
  if (!existingPreviewId) {
    step('در حال ساخت KV Preview Namespace...');
    const previewRes = run('wrangler kv namespace create PIMXPASS_KV --preview', { silent: true });
    if (previewRes.ok) {
      const pidMatch = previewRes.output.match(/id\s*=\s*["']?([a-f0-9]{32})["']?/i);
      if (pidMatch) {
        existingPreviewId = pidMatch[1];
        ok(`KV Preview Namespace ساخته شد`);
      }
    }
    if (!existingPreviewId) {
      // Fallback: use same ID for preview
      existingPreviewId = existingId;
    }
  }

  return { id: existingId, previewId: existingPreviewId };
}

// ─── Update wrangler.toml ─────────────────────────────────────────
function updateToml(kvId, previewId) {
  const tomlPath = path.join(__dirname, '..', 'wrangler.toml');
  let content = fs.readFileSync(tomlPath, 'utf8');

  content = content.replace(/\bid\b\s*=\s*["']?([a-f0-9]{32}|YOUR_KV_NAMESPACE_ID_HERE)["']?/i, `id = "${kvId}"`);
  content = content.replace(/\bpreview_id\b\s*=\s*["']?([a-f0-9]{32}|YOUR_KV_NAMESPACE_ID_HERE)["']?/i, `preview_id = "${previewId}"`);

  fs.writeFileSync(tomlPath, content, 'utf8');
  ok(`wrangler.toml آپدیت شد`);
}

// ─── MAIN ─────────────────────────────────────────────────────────
async function main() {
  const deployMode = process.argv.includes('--deploy');

  title('PIMX VPN Panel — راه‌اندازی خودکار');

  console.log(`${C.gray}این اسکریپت همه چیز رو برات آماده می‌کنه...${C.reset}\n`);

  // Step 1: Check wrangler
  step('بررسی wrangler...');
  checkWrangler();

  // Step 2: Check login
  step('بررسی حساب Cloudflare...');
  checkLogin();

  // Step 3: Setup KV
  const { id: kvId, previewId } = await setupKV();

  // Step 4: Update wrangler.toml
  step('آپدیت wrangler.toml...');
  updateToml(kvId, previewId);

  console.log(`\n${C.bold}${C.green}${'═'.repeat(50)}${C.reset}`);
  console.log(`${C.bold}${C.green}  ✅ همه چیز آماده‌ست!${C.reset}`);
  console.log(`${C.bold}${C.green}${'═'.repeat(50)}${C.reset}\n`);

  if (deployMode) {
    // Deploy to Cloudflare
    step('در حال deploy روی Cloudflare...');
    const success = runLive('wrangler deploy');
    if (success) {
      console.log(`\n${C.bold}${C.green}🎉 Deploy موفق!${C.reset}`);
      console.log(`${C.cyan}پنل ادمین: ${C.bold}https://pimxpass-panel.YOUR-SUBDOMAIN.workers.dev/panel${C.reset}`);
      console.log(`${C.gray}لاگین: admin / admin123 (حتماً عوضش کن!)${C.reset}\n`);
    } else {
      error('Deploy ناموفق بود. لاگ بالا رو چک کن.');
      process.exit(1);
    }
  } else {
    // Run locally
    console.log(`${C.cyan}${C.bold}اطلاعات پنل:${C.reset}`);
    console.log(`  ${C.gray}آدرس لوکال:${C.reset}  ${C.bold}http://localhost:8787${C.reset}`);
    console.log(`  ${C.gray}پنل ادمین:${C.reset}   ${C.bold}http://localhost:8787/panel${C.reset}`);
    console.log(`  ${C.gray}نام کاربری:${C.reset}  ${C.bold}admin${C.reset}`);
    console.log(`  ${C.gray}رمز عبور:${C.reset}    ${C.bold}admin123${C.reset}`);
    console.log(`\n${C.yellow}برای deploy روی Cloudflare:${C.reset} ${C.bold}npm run deploy${C.reset}\n`);

    step('در حال اجرای پنل بصورت لوکال...');
    console.log(`${C.gray}(Ctrl+C برای خروج)${C.reset}\n`);
    runLive('wrangler dev');
  }
}

main().catch(err => {
  error('خطای غیرمنتظره: ' + err.message);
  process.exit(1);
});
