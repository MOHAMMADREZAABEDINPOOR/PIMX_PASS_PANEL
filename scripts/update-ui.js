const fs = require('fs');
const path = require('path');

const workerPath = path.join(__dirname, '..', 'src', 'worker.js');
let content = fs.readFileSync(workerPath, 'utf8');

// Update translations to use PIMXPASS branding
content = content.replace(/'终端 v2\.9\.8b'/g, "'PIMXPASS ULTIMATE v3.0'");
content = content.replace(/'ترمینال v2\.9\.8b'/g, "'PIMXPASS ULTIMATE v3.0'");
content = content.replace(/CFnew/g, 'PIMXPASS');

// Replace cyberpunk color scheme with glassmorphism
const oldColors = `--cp-bg: #05030e;
                --cp-bg-2: #0a0820;
                --cp-bg-3: #110835;
                --cp-cyan: #00f0ff;
                --cp-cyan-d: #00b8c4;
                --cp-pink: #ff2bd6;
                --cp-pink-d: #d1239f;
                --cp-purple: #a347ff;
                --cp-yellow: #fff200;
                --cp-mint: #00ff9d;
                --cp-amber: #ffb400;
                --cp-red: #ff3860;
                --cp-text: #e6f5ff;
                --cp-text-dim: #7aa9c4;
                --cp-border: rgba(0, 240, 255, 0.55);
                --cp-border-pink: rgba(255, 43, 214, 0.55);
                --cp-grid: rgba(255, 43, 214, 0.16);`;

const newColors = `--primary-purple: #8b5cf6;
                --primary-cyan: #06b6d4;
                --glass-bg: rgba(139, 92, 246, 0.05);
                --glass-border: rgba(139, 92, 246, 0.3);
                --text-primary: #f0f9ff;
                --text-secondary: #bae6fd;
                --success: #10b981;
                --error: #ef4444;
                --cp-cyan: #06b6d4;
                --cp-pink: #8b5cf6;
                --cp-purple: #8b5cf6;
                --cp-mint: #10b981;
                --cp-yellow: #fbbf24;
                --cp-red: #ef4444;
                --cp-text: #f0f9ff;
                --cp-text-dim: #bae6fd;
                --cp-border: rgba(139, 92, 246, 0.3);`;

content = content.replace(oldColors, newColors);

// Replace cyberpunk background with glassmorphism gradient
content = content.replace(
  /background: radial-gradient\(ellipse at 80% -10%, #2a0040 0%, var\(--cp-bg\) 50%, #000 100%\);/g,
  'background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%);'
);

// Replace terminal/cyberpunk font with modern font
content = content.replace(
  /"JetBrains Mono", "Fira Code", "Courier New", monospace/g,
  "'Vazirmatn', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
);

content = content.replace(
  /"JetBrains Mono", "Courier New", Consolas, monospace/g,
  "'Vazirmatn', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
);

// Add Vazirmatn font import at the beginning of style tags
content = content.replace(
  /<style>/g,
  `<style>\n            @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;700&display=swap');`
);

// Save the updated file
fs.writeFileSync(workerPath, content, 'utf8');

console.log('✅ UI updated successfully!');
console.log('- Branding changed to PIMXPASS ULTIMATE v3.0');
console.log('- Color scheme changed to glassmorphism (purple/cyan)');
console.log('- Font changed to Vazirmatn for Persian support');
