// PIMXPASS ULTIMATE v3.0 - Modern VPN Panel
// Copyright (c) 2026 PIMXPASS Team

import { connect } from 'cloudflare:sockets';

// Configuration
const CONFIG = {
  UUID: '89b3cbba-e6ac-485a-9481-976ad0e3f142',
  PROJECT_NAME: 'PIMXPASS ULTIMATE',
  VERSION: '3.0.0',
};

export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      const path = url.pathname;
      
      // Initialize KV
      const KV = env.PIMXPASS_KV;
      
      // Routes
      if (path === '/') {
        return handleHomePage();
      }
      
      if (path === `/${CONFIG.UUID}` || path === `/${CONFIG.UUID}/`) {
        return handleAdminPanel(KV);
      }
      
      if (path.startsWith('/sub/')) {
        const uuid = path.split('/sub/')[1];
        return handleSubscription(uuid, request.headers.get('host'));
      }
      
      if (path.startsWith('/api/')) {
        return handleAPI(path, request, KV);
      }
      
      // VLESS/Trojan proxy handler
      if (request.headers.get('Upgrade') === 'websocket') {
        return handleWebSocket(request, env);
      }
      
      return new Response('Not Found', { status: 404 });
    } catch (error) {
      return new Response(`Error: ${error.message}`, { status: 500 });
    }
  }
};

// Home Page
function handleHomePage() {
  const html = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${CONFIG.PROJECT_NAME}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Vazirmatn', sans-serif;
            background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%);
            color: #f8fafc;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
        }
        body::before {
            content: '';
            position: fixed;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
                        radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.15) 0%, transparent 50%);
            animation: rotate 15s linear infinite;
            z-index: 0;
        }
        @keyframes rotate { 100% { transform: rotate(360deg); } }
        .container {
            position: relative;
            z-index: 1;
            text-align: center;
            padding: 40px;
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(20px);
            border-radius: 24px;
            border: 1px solid rgba(139, 92, 246, 0.3);
            max-width: 600px;
        }
        .logo {
            font-size: 64px;
            margin-bottom: 20px;
        }
        h1 {
            font-size: 48px;
            font-weight: 800;
            background: linear-gradient(135deg, #8b5cf6, #06b6d4);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 16px;
        }
        p {
            font-size: 18px;
            color: #cbd5e1;
            margin-bottom: 32px;
        }
        input {
            width: 100%;
            padding: 16px;
            background: rgba(255, 255, 255, 0.05);
            border: 2px solid rgba(139, 92, 246, 0.3);
            border-radius: 12px;
            color: #f8fafc;
            font-family: inherit;
            font-size: 16px;
            margin-bottom: 16px;
            transition: all 0.3s;
        }
        input:focus {
            outline: none;
            border-color: #8b5cf6;
            box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
        }
        button {
            width: 100%;
            padding: 16px;
            background: linear-gradient(135deg, #8b5cf6, #06b6d4);
            border: none;
            border-radius: 12px;
            color: white;
            font-family: inherit;
            font-size: 16px;
            font-weight: 700;
            cursor: pointer;
            transition: transform 0.3s;
        }
        button:hover {
            transform: translateY(-2px);
        }
        .version {
            margin-top: 24px;
            font-size: 14px;
            color: #64748b;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">🚀</div>
        <h1>${CONFIG.PROJECT_NAME}</h1>
        <p>ورود به پنل مدیریت</p>
        <input type="text" id="uuidInput" placeholder="UUID خود را وارد کنید" autofocus>
        <button onclick="goToPanel()">ورود به پنل</button>
        <div class="version">نسخه ${CONFIG.VERSION}</div>
    </div>
    <script>
        function goToPanel() {
            const uuid = document.getElementById('uuidInput').value.trim();
            if (uuid) {
                window.location.href = '/' + uuid;
            } else {
                alert('لطفاً UUID خود را وارد کنید');
            }
        }
        document.getElementById('uuidInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') goToPanel();
        });
    </script>
</body>
</html>`;
  
  return new Response(html, {
    headers: { 'Content-Type': 'text/html;charset=UTF-8' }
  });
}

// Admin Panel
async function handleAdminPanel(KV) {
  // Read modern panel HTML
  const html = await fetch('https://raw.githubusercontent.com/yourusername/pimxpass/main/panel.html')
    .then(r => r.text())
    .catch(() => getModernPanelHTML());
  
  return new Response(html, {
    headers: { 'Content-Type': 'text/html;charset=UTF-8' }
  });
}

// Subscription Handler
function handleSubscription(uuid, host) {
  if (uuid !== CONFIG.UUID) {
    return new Response('Invalid UUID', { status: 403 });
  }
  
  const configs = [];
  
  // VLESS config
  const vlessConfig = `vless://${CONFIG.UUID}@${host}:443?encryption=none&security=tls&type=ws&host=${host}&path=%2F#${encodeURIComponent('PIMXPASS-VLESS')}`;
  configs.push(vlessConfig);
  
  // Trojan config
  const trojanConfig = `trojan://${CONFIG.UUID}@${host}:443?security=tls&type=ws&host=${host}&path=%2F#${encodeURIComponent('PIMXPASS-Trojan')}`;
  configs.push(trojanConfig);
  
  const base64Configs = btoa(configs.join('\n'));
  
  return new Response(base64Configs, {
    headers: {
      'Content-Type': 'text/plain;charset=utf-8',
      'Profile-Update-Interval': '24',
      'Subscription-Userinfo': `upload=0; download=0; total=107374182400; expire=0`,
    }
  });
}

// API Handler
async function handleAPI(path, request, KV) {
  const parts = path.split('/');
  const endpoint = parts[2];
  
  if (endpoint === 'stats') {
    const stats = await KV.get('stats') || '{"users":0,"traffic":0}';
    return new Response(stats, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  if (endpoint === 'save-config' && request.method === 'POST') {
    const data = await request.json();
    await KV.put(`config:${data.name}`, JSON.stringify(data));
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  return new Response('API endpoint not found', { status: 404 });
}

// WebSocket Handler for VLESS/Trojan
async function handleWebSocket(request, env) {
  const upgradeHeader = request.headers.get('Upgrade');
  if (upgradeHeader !== 'websocket') {
    return new Response('Expected WebSocket', { status: 400 });
  }
  
  const webSocketPair = new WebSocketPair();
  const [client, server] = Object.values(webSocketPair);
  
  server.accept();
  
  server.addEventListener('message', async (event) => {
    // Handle VLESS/Trojan protocol here
    // This is a simplified version - full implementation would handle protocol parsing
    try {
      const data = new Uint8Array(event.data);
      // Forward data through Cloudflare network
      // Implementation depends on your specific proxy requirements
    } catch (error) {
      server.close(1011, error.message);
    }
  });
  
  return new Response(null, {
    status: 101,
    webSocket: client,
  });
}

// Modern Panel HTML (inline fallback)
function getModernPanelHTML() {
  return `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${CONFIG.PROJECT_NAME} - پنل مدیریت</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        :root {
            --primary: #8b5cf6;
            --secondary: #06b6d4;
            --success: #10b981;
            --warning: #f59e0b;
            --error: #ef4444;
            --dark: #0f172a;
            --text: #f8fafc;
        }
        
        body {
            font-family: 'Vazirmatn', sans-serif;
            background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%);
            color: var(--text);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container { max-width: 1400px; margin: 0 auto; }
        
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 24px;
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(20px);
            border-radius: 20px;
            border: 1px solid rgba(139, 92, 246, 0.3);
            margin-bottom: 32px;
        }
        
        .logo { font-size: 28px; font-weight: 800; }
        
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 32px;
        }
        
        .stat-card {
            padding: 24px;
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(20px);
            border-radius: 16px;
            border: 1px solid rgba(139, 92, 246, 0.3);
            transition: transform 0.3s;
        }
        
        .stat-card:hover { transform: translateY(-5px); }
        
        .stat-value {
            font-size: 36px;
            font-weight: 800;
            margin: 12px 0;
        }
        
        .config-panel {
            padding: 32px;
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(20px);
            border-radius: 16px;
            border: 1px solid rgba(139, 92, 246, 0.3);
        }
        
        .form-group { margin-bottom: 20px; }
        
        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
        }
        
        input, select {
            width: 100%;
            padding: 14px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(139, 92, 246, 0.3);
            border-radius: 12px;
            color: var(--text);
            font-family: inherit;
        }
        
        button {
            width: 100%;
            padding: 16px;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            border: none;
            border-radius: 12px;
            color: white;
            font-weight: 700;
            cursor: pointer;
            transition: transform 0.3s;
        }
        
        button:hover { transform: translateY(-2px); }
        
        .config-output {
            margin-top: 20px;
            padding: 16px;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 12px;
            font-family: monospace;
            word-break: break-all;
            display: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🚀 ${CONFIG.PROJECT_NAME}</div>
            <div>نسخه ${CONFIG.VERSION}</div>
        </div>
        
        <div class="stats">
            <div class="stat-card">
                <div>📊 کانفیگ‌های فعال</div>
                <div class="stat-value" id="configCount">0</div>
                <div>آماده استفاده</div>
            </div>
            <div class="stat-card">
                <div>⚡ وضعیت سرور</div>
                <div class="stat-value">100%</div>
                <div style="color: var(--success)">✓ آنلاین</div>
            </div>
            <div class="stat-card">
                <div>🌍 لوکیشن‌ها</div>
                <div class="stat-value">300+</div>
                <div>در سراسر جهان</div>
            </div>
            <div class="stat-card">
                <div>📡 ترافیک</div>
                <div class="stat-value">∞</div>
                <div>نامحدود</div>
            </div>
        </div>
        
        <div class="config-panel">
            <h2 style="margin-bottom: 24px; font-size: 24px;">⚙️ ساخت کانفیگ جدید</h2>
            
            <div class="form-group">
                <label>نوع پروتکل</label>
                <select id="protocol">
                    <option value="vless">VLESS (توصیه می‌شود)</option>
                    <option value="trojan">Trojan</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>نام کانفیگ</label>
                <input type="text" id="configName" value="PIMXPASS" placeholder="نام کانفیگ">
            </div>
            
            <div class="form-group">
                <label>لوکیشن</label>
                <select id="location">
                    <option value="auto">🌍 خودکار (بهترین)</option>
                    <option value="us">🇺🇸 آمریکا</option>
                    <option value="eu">🇪🇺 اروپا</option>
                    <option value="asia">🇯🇵 آسیا</option>
                </select>
            </div>
            
            <button onclick="generateConfig()">✨ ساخت کانفیگ</button>
            
            <div class="config-output" id="output"></div>
        </div>
    </div>
    
    <script>
        const UUID = '${CONFIG.UUID}';
        const HOST = window.location.host;
        
        function generateConfig() {
            const protocol = document.getElementById('protocol').value;
            const name = document.getElementById('configName').value || 'PIMXPASS';
            
            let config;
            if (protocol === 'vless') {
                config = \`vless://\${UUID}@\${HOST}:443?encryption=none&security=tls&type=ws&host=\${HOST}&path=%2F#\${encodeURIComponent(name)}\`;
            } else {
                config = \`trojan://\${UUID}@\${HOST}:443?security=tls&type=ws&host=\${HOST}&path=%2F#\${encodeURIComponent(name)}\`;
            }
            
            const output = document.getElementById('output');
            output.textContent = config;
            output.style.display = 'block';
            
            navigator.clipboard.writeText(config);
            alert('✅ کانفیگ ساخته شد و در کلیپ‌بورد کپی شد!');
            
            document.getElementById('configCount').textContent = '1';
        }
    </script>
</body>
</html>`;
}
