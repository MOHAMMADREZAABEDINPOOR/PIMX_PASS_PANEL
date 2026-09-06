const fs = require('fs');
const path = require('path');

const workerPath = path.join(__dirname, '..', 'src', 'worker.js');
let content = fs.readFileSync(workerPath, 'utf8');

console.log('🎨 Applying full glassmorphism design transformation...\n');

// 1. Remove cyberpunk matrix effects and scanlines
console.log('1️⃣ Removing cyberpunk matrix rain effects...');
content = content.replace(/\.matrix-bg[^}]*\{[^}]*\}/gs, '');
content = content.replace(/\.matrix-code-rain[^}]*\{[^}]*\}/gs, '');
content = content.replace(/\.matrix-column[^}]*\{[^}]*\}/gs, '');
content = content.replace(/@keyframes cp-drop[^}]*\{[^}]*\}/gs, '');
content = content.replace(/<div class="matrix-bg"><\/div>/g, '');
content = content.replace(/<div class="matrix-code-rain"[^>]*><\/div>/g, '');

// 2. Remove cyberpunk HUD elements
console.log('2️⃣ Removing cyberpunk HUD elements...');
content = content.replace(/\.cp-hud[^}]*\{[^}]*\}/gs, '');
content = content.replace(/<div class="cp-hud">[^<]*<\/div>/gs, '');

// 3. Replace cyberpunk grid animation with subtle glass effect
console.log('3️⃣ Replacing cyberpunk grid with glassmorphism effects...');
content = content.replace(
  /@keyframes cp-grid-slide[^}]*\{[^}]*\}/gs,
  `@keyframes glass-float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
            }`
);

// 4. Replace cyberpunk terminal styling with glass cards
console.log('4️⃣ Updating terminal/card styling to glassmorphism...');

// Replace terminal box shadow with glass effect
content = content.replace(
  /box-shadow:\s*0 0 0 1px rgba\(255,43,214[^;]*;[^;]*;[^;]*;[^;]*inset[^;]*;/gs,
  `box-shadow: 
                    0 8px 32px rgba(0, 0, 0, 0.3),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1);`
);

// Replace terminal border
content = content.replace(
  /border: 1px solid var\(--cp-border\);/g,
  'border: 1px solid rgba(139, 92, 246, 0.3);'
);

// Replace cyberpunk clip-path with rounded corners
content = content.replace(
  /clip-path: polygon\([^)]*\);/g,
  'border-radius: 24px;'
);

// 5. Update backdrop filter for glassmorphism
console.log('5️⃣ Adding backdrop-filter blur effects...');
content = content.replace(
  /background:\s*linear-gradient\(180deg, rgba\(8,4,28[^;]*;/g,
  `background: rgba(255, 255, 255, 0.05);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);`
);

// 6. Remove cyberpunk scan line effects
console.log('6️⃣ Removing cyberpunk scan effects...');
content = content.replace(/@keyframes cp-scan-line[^}]*\{[^}]*\}/gs, '');
content = content.replace(/@keyframes cp-scan-flicker[^}]*\{[^}]*\}/gs, '');
content = content.replace(/\.terminal::before[^}]*\{[^}]*\}/gs, '');
content = content.replace(/\.terminal-header::after[^}]*\{[^}]*\}/gs, '');

// 7. Remove glitch effects
console.log('7️⃣ Removing glitch effects...');
content = content.replace(/\.cp-glitch[^}]*\{[^}]*\}/gs, '');
content = content.replace(/ cp-glitch/g, '');

// 8. Simplify button styling
console.log('8️⃣ Updating button styles...');
content = content.replace(
  /\.terminal-button[^}]*\{[^}]*transform: rotate\(45deg\);[^}]*\}/gs,
  `.terminal-button {
                width: 12px; height: 12px;
                border-radius: 50%;
                border: none;
            }`
);

// 9. Remove FX toggle cyberpunk styling
console.log('9️⃣ Simplifying FX toggle...');
content = content.replace(
  /\.cp-fx-toggle[^}]*\{[^}]*clip-path[^;]*;[^}]*\}/gs,
  `.cp-fx-toggle {
                position: fixed; top: 68px; left: 22px; z-index: 1001;
                background: rgba(139, 92, 246, 0.1);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(139, 92, 246, 0.3);
                border-radius: 12px;
                color: var(--text-primary);
                padding: 8px 16px;
                font-family: inherit;
                font-size: 11px;
                letter-spacing: 0.1em;
                text-transform: uppercase;
                cursor: pointer;
                transition: all 0.3s ease;
                display: inline-flex; align-items: center; gap: 8px;
            }`
);

// 10. Update language selector styling
console.log('🔟 Updating language selector...');
content = content.replace(
  /#languageSelector[^}]*\{[^}]*clip-path[^;]*;[^}]*\}/gs,
  `#languageSelector {
                background: rgba(139, 92, 246, 0.1);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(139, 92, 246, 0.3);
                border-radius: 8px;
                color: var(--text-primary);
                padding: 8px 12px;
                font-family: inherit;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.3s ease;
            }`
);

// 11. Update body background effects
console.log('1️⃣1️⃣ Finalizing glassmorphism background...');
content = content.replace(
  /body::before[^}]*\{[^}]*animation: cp-grid-slide[^;]*;[^}]*\}/gs,
  `body::before {
                content: ''; position: fixed; top: -50%; left: -50%;
                width: 200%; height: 200%;
                background: 
                    radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
                    radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.3) 0%, transparent 50%);
                animation: gradient-rotate 20s linear infinite;
                z-index: -1;
                pointer-events: none;
            }
            @keyframes gradient-rotate {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }`
);

content = content.replace(
  /body::after[^}]*\{[^}]*animation: cp-scan-flicker[^;]*;[^}]*\}/gs,
  ''
);

// 12. Clean up remaining cyberpunk elements
console.log('1️⃣2️⃣ Cleaning up remaining cyberpunk artifacts...');
content = content.replace(/text-shadow:\s*0 0 [^;]*var\(--cp-[^)]*\)[^;]*;/g, '');
content = content.replace(/NIGHT_CITY/g, 'PIMXPASS');
content = content.replace(/SECURE \/ ENC/g, 'SECURE CONNECTION');

// Save the updated file
fs.writeFileSync(workerPath, content, 'utf8');

console.log('\n✅ Full glassmorphism transformation complete!');
console.log('━'.repeat(50));
console.log('Changes applied:');
console.log('  ✓ Removed matrix rain effects');
console.log('  ✓ Removed cyberpunk HUD');
console.log('  ✓ Replaced grid animations with glass float');
console.log('  ✓ Updated to glass card styling');
console.log('  ✓ Added backdrop-filter blur');
console.log('  ✓ Removed scan line effects');
console.log('  ✓ Removed glitch effects');
console.log('  ✓ Simplified buttons to circles');
console.log('  ✓ Updated all UI elements to glassmorphism');
console.log('  ✓ Applied purple/cyan gradient background');
console.log('\n📦 Ready to deploy!');
