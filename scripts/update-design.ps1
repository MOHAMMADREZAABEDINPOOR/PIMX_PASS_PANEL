# PowerShell script to update the design from cyberpunk to glassmorphism
$filePath = "d:\code\PIMXPASS\src\worker.js"
$content = Get-Content $filePath -Raw -Encoding UTF8

# Replace the page title
$content = $content -replace '<title>\$\{翻译值659\.terminal\}</title>', '<title>PIMXPASS ULTIMATE v3.0</title>'

# Replace cyberpunk CSS variables with glassmorphism
$oldCss = @"
            :root {
                --cp-cyan:   #00f0ff;
                --cp-pink:   #ff2bd6;
                --cp-purple: #a347ff;
                --cp-mint:   #00ff9d;
                --cp-yellow: #ffd700;
                --cp-red:    #ff3838;
                --cp-bg:     #05020f;
                --cp-bg-2:   #120828;
                --cp-border: rgba\(0,240,255,0\.35\);
                --cp-text-dim: #8e74c1;
            }
"@

$newCss = @"
            @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;700&display=swap');
            
            :root {
                --primary-purple: #8b5cf6;
                --primary-cyan: #06b6d4;
                --glass-bg: rgba(139, 92, 246, 0.05);
                --glass-border: rgba(139, 92, 246, 0.2);
                --text-primary: #f0f9ff;
                --text-secondary: #bae6fd;
                --success: #10b981;
                --error: #ef4444;
            }
"@

$content = $content -replace [regex]::Escape($oldCss), $newCss

# Save the updated content
Set-Content $filePath -Value $content -Encoding UTF8 -NoNewline

Write-Host "Design updated successfully!" -ForegroundColor Green
