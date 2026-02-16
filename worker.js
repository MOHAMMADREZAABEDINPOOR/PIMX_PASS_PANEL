    // CFnew - Terminal v2.9.3
    // Version: v2.9.3
    import { connect } from 'cloudflare:sockets';

    // Optional branding (set in Workers Variables as BRAND/brand/NAME/name)
    let panelBrand = 'PIMXPASS PANEL';
    let at = '351c9981-04b6-4103-aa4b-864aa9c91469';
    let fallbackAddress = '';
    let socks5Config = '';
    let customPreferredIPs = [];
    let customPreferredDomains = [];
    let enableSocksDowngrade = false;
    let disableNonTLS = false;
    let disablePreferred = false;

    let enableRegionMatching = true;
    let currentWorkerRegion = '';
    let manualWorkerRegion = '';
    let piu = '';
    let cp = '';  

    let ev = true;   
    let et = false; 
    let ex = false;  
    let tp = '';
    // Enable ECH (true = enable, false = disable)
    let enableECH = false;  
    // Custom DNS server for DoH (default: https://dns.joeyblog.eu.org/joeyblog)
    let customDNS = 'https://dns.joeyblog.eu.org/joeyblog';
    // Custom ECH domain (default: cloudflare-ech.com)
    let customECHDomain = 'cloudflare-ech.com';

    let scu = 'https://url.v1.mk/sub';  
    // Remote config URL (hard-coded)
    const remoteConfigUrl = 'https://raw.githubusercontent.com/byJoey/test/refs/heads/main/tist.ini';

    let epd = false;   // Preferred domains disabled by default
    let epi = true;       
    let egi = true;          

    let kvStore = null;
    let kvConfig = {};

    const REGION_CODES = [
        'US', 'CA', 'MX', 'BR', 'AR', 'CL',
        'GB', 'IE', 'DE', 'FR', 'NL', 'BE', 'SE', 'NO', 'FI', 'CH', 'IT', 'ES', 'PL', 'TR',
        'AE', 'SA', 'IN', 'PK', 'BD', 'RU', 'KZ',
        'SG', 'JP', 'KR', 'HK', 'TW', 'TH', 'MY', 'AU', 'NZ'
    ];
    const PROVIDER_REGION_CODES = ['Oracle', 'DigitalOcean', 'Vultr', 'Multacom'];

    const regionRouteMap = {
        US: 'US', CA: 'US', MX: 'US', BR: 'US', AR: 'US', CL: 'US',
        GB: 'GB', IE: 'GB', DE: 'DE', FR: 'DE', NL: 'NL', BE: 'NL', SE: 'SE', NO: 'SE', FI: 'FI', CH: 'DE', IT: 'DE', ES: 'DE', PL: 'DE', TR: 'DE',
        AE: 'SG', SA: 'SG', IN: 'SG', PK: 'SG', BD: 'SG', RU: 'DE', KZ: 'DE',
        SG: 'SG', JP: 'JP', KR: 'KR', HK: 'SG', TW: 'JP', TH: 'SG', MY: 'SG', AU: 'SG', NZ: 'SG'
    };

    const regionLabelEn = {
        US: '🇺🇸 United States',
        CA: '🇨🇦 Canada',
        MX: '🇲🇽 Mexico',
        BR: '🇧🇷 Brazil',
        AR: '🇦🇷 Argentina',
        CL: '🇨🇱 Chile',
        GB: '🇬🇧 United Kingdom',
        IE: '🇮🇪 Ireland',
        DE: '🇩🇪 Germany',
        FR: '🇫🇷 France',
        NL: '🇳🇱 Netherlands',
        BE: '🇧🇪 Belgium',
        SE: '🇸🇪 Sweden',
        NO: '🇳🇴 Norway',
        FI: '🇫🇮 Finland',
        CH: '🇨🇭 Switzerland',
        IT: '🇮🇹 Italy',
        ES: '🇪🇸 Spain',
        PL: '🇵🇱 Poland',
        TR: '🇹🇷 Turkey',
        AE: '🇦🇪 UAE',
        SA: '🇸🇦 Saudi Arabia',
        IN: '🇮🇳 India',
        PK: '🇵🇰 Pakistan',
        BD: '🇧🇩 Bangladesh',
        RU: '🇷🇺 Russia',
        KZ: '🇰🇿 Kazakhstan',
        SG: '🇸🇬 Singapore',
        JP: '🇯🇵 Japan',
        KR: '🇰🇷 South Korea',
        HK: '🇭🇰 Hong Kong',
        TW: '🇹🇼 Taiwan',
        TH: '🇹🇭 Thailand',
        MY: '🇲🇾 Malaysia',
        AU: '🇦🇺 Australia',
        NZ: '🇳🇿 New Zealand'
    };

    const regionMapping = Object.fromEntries(
        [
            ...REGION_CODES.map((code) => [code, [regionLabelEn[code], code, regionLabelEn[code].replace(/^[^\s]+\s/, '')]]),
            ['Oracle', ['Oracle', 'Oracle']],
            ['DigitalOcean', ['DigitalOcean', 'DigitalOcean']],
            ['Vultr', ['Vultr', 'Vultr']],
            ['Multacom', ['Multacom', 'Multacom']]
        ]
    );

    const hubDomainMap = {
        US: 'ProxyIP.US.CMLiussss.net',
        SG: 'ProxyIP.SG.CMLiussss.net',
        JP: 'ProxyIP.JP.CMLiussss.net',
        KR: 'ProxyIP.KR.CMLiussss.net',
        DE: 'ProxyIP.DE.CMLiussss.net',
        SE: 'ProxyIP.SE.CMLiussss.net',
        NL: 'ProxyIP.NL.CMLiussss.net',
        FI: 'ProxyIP.FI.CMLiussss.net',
        GB: 'ProxyIP.GB.CMLiussss.net'
    };

    let backupIPs = [
        ...REGION_CODES.map((code) => ({
            domain: hubDomainMap[regionRouteMap[code] || 'SG'],
            region: code,
            regionCode: code,
            port: 443
        })),
        { domain: 'ProxyIP.Oracle.cmliussss.net', region: 'Oracle', regionCode: 'Oracle', port: 443 },
        { domain: 'ProxyIP.DigitalOcean.CMLiussss.net', region: 'DigitalOcean', regionCode: 'DigitalOcean', port: 443 },
        { domain: 'ProxyIP.Vultr.CMLiussss.net', region: 'Vultr', regionCode: 'Vultr', port: 443 },
        { domain: 'ProxyIP.Multacom.CMLiussss.net', region: 'Multacom', regionCode: 'Multacom', port: 443 }
    ];

    const directDomains = [
        { name: "cloudflare.182682.xyz", domain: "cloudflare.182682.xyz" }, { name: "speed.marisalnc.com", domain: "speed.marisalnc.com" },
        { domain: "freeyx.cloudflare88.eu.org" }, { domain: "bestcf.top" }, { domain: "cdn.2020111.xyz" }, { domain: "cfip.cfcdn.vip" },
        { domain: "cf.0sm.com" }, { domain: "cf.090227.xyz" }, { domain: "cf.zhetengsha.eu.org" }, { domain: "cloudflare.9jy.cc" },
        { domain: "cf.zerone-cdn.pp.ua" }, { domain: "cfip.1323123.xyz" }, { domain: "cnamefuckxxs.yuchen.icu" }, { domain: "cloudflare-ip.mofashi.ltd" },
        { domain: "115155.xyz" }, { domain: "cname.xirancdn.us" }, { domain: "f3058171cad.002404.xyz" }, { domain: "8.889288.xyz" },
        { domain: "cdn.tzpro.xyz" }, { domain: "cf.877771.xyz" }, { domain: "xn--b6gac.eu.org" }
    ];

    const E_INVALID_DATA = atob('aW52YWxpZCBkYXRh');
    const E_INVALID_USER = atob('aW52YWxpZCB1c2Vy');
    const E_UNSUPPORTED_CMD = atob('Y29tbWFuZCBpcyBub3Qgc3VwcG9ydGVk');
    const E_UDP_DNS_ONLY = atob('VURQIHByb3h5IG9ubHkgZW5hYmxlIGZvciBETlMgd2hpY2ggaXMgcG9ydCA1Mw==');
    const E_INVALID_ADDR_TYPE = atob('aW52YWxpZCBhZGRyZXNzVHlwZQ==');
    const E_EMPTY_ADDR = atob('YWRkcmVzc1ZhbHVlIGlzIGVtcHR5');
    const E_WS_NOT_OPEN = atob('d2ViU29ja2V0LmVhZHlTdGF0ZSBpcyBub3Qgb3Blbg==');
    const E_INVALID_ID_STR = atob('U3RyaW5naWZpZWQgaWRlbnRpZmllciBpcyBpbnZhbGlk');
    const E_INVALID_SOCKS_ADDR = atob('SW52YWxpZCBTT0NLUyBhZGRyZXNzIGZvcm1hdA==');
    const E_SOCKS_NO_METHOD = atob('bm8gYWNjZXB0YWJsZSBtZXRob2Rz');
    const E_SOCKS_AUTH_NEEDED = atob('c29ja3Mgc2VydmVyIG5lZWRzIGF1dGg=');
    const E_SOCKS_AUTH_FAIL = atob('ZmFpbCB0byBhdXRoIHNvY2tzIHNlcnZlcg==');
    const E_SOCKS_CONN_FAIL = atob('ZmFpbCB0byBvcGVuIHNvY2tzIGNvbm5lY3Rpb24=');

    let parsedSocks5Config = {};
    let isSocksEnabled = false;

    const ADDRESS_TYPE_IPV4 = 1;
    const ADDRESS_TYPE_URL = 2;
    const ADDRESS_TYPE_IPV6 = 3;

    function isValidFormat(str) {
        const userRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        return userRegex.test(str);
    }

    function isAuthorizedPathIdentifier(pathIdentifier) {
        const identifier = String(pathIdentifier || '');
        const identifierLower = identifier.toLowerCase();

        // Always allow owner UUID path, even when running in custom-path mode.
        if (isValidFormat(identifierLower) && identifierLower === at) return true;

        if (cp && cp.trim()) {
            const cleanCustomPath = cp.trim().startsWith('/') ? cp.trim().substring(1) : cp.trim();
            return identifier === cleanCustomPath;
        }

        return false;
    }

    function isValidIP(ip) {
        const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        if (ipv4Regex.test(ip)) return true;
        
        const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
        if (ipv6Regex.test(ip)) return true;
        
        const ipv6ShortRegex = /^::1$|^::$|^(?:[0-9a-fA-F]{1,4}:)*::(?:[0-9a-fA-F]{1,4}:)*[0-9a-fA-F]{1,4}$/;
        if (ipv6ShortRegex.test(ip)) return true;
        
        return false;
    }

    async function initKVStore(env) {
        
        if (env.C) {
            try {
                kvStore = env.C;
                await loadKVConfig();
            } catch (error) {
                kvStore = null;
            }
        } else {
        }
    }

    async function loadKVConfig() {
        
        if (!kvStore) {
            return;
        }
        
        try {
            const configData = await kvStore.get('c');
            
            if (configData) {
                kvConfig = JSON.parse(configData);
            } else {
            }
        } catch (error) {
            kvConfig = {};
        }
    }

    async function saveKVConfig() {
        if (!kvStore) {
            return;
        }
        
        try {
            const configString = JSON.stringify(kvConfig);
            await kvStore.put('c', configString);
        } catch (error) {
            throw error; 
        }
    }

    function getConfigValue(key, defaultValue = '') {
        
        if (kvConfig[key] !== undefined) {
            return kvConfig[key];
        }
        return defaultValue;
    }

    async function setConfigValue(key, value) {
        kvConfig[key] = value;
        await saveKVConfig();
    }

    async function detectWorkerRegion(request) {
        try {
            const cfCountry = request.cf?.country;
            
            if (cfCountry) {
                const countryToRegion = {
                    'US': 'US', 'SG': 'SG', 'JP': 'JP', 'KR': 'KR',
                    'DE': 'DE', 'SE': 'SE', 'NL': 'NL', 'FI': 'FI', 'GB': 'GB',
                    'CA': 'CA', 'MX': 'MX', 'BR': 'BR', 'AR': 'AR', 'CL': 'CL',
                    'IE': 'IE', 'FR': 'FR', 'BE': 'BE', 'NO': 'NO', 'CH': 'CH',
                    'IT': 'IT', 'ES': 'ES', 'PL': 'PL', 'TR': 'TR',
                    'AE': 'AE', 'SA': 'SA', 'IN': 'IN', 'PK': 'PK', 'BD': 'BD',
                    'RU': 'RU', 'KZ': 'KZ',
                    'HK': 'HK', 'TW': 'TW', 'TH': 'TH', 'MY': 'MY', 'AU': 'AU', 'NZ': 'NZ',
                    'CN': 'SG', 'AT': 'DE', 'DK': 'SE'
                };
                
                if (countryToRegion[cfCountry]) {
                    return countryToRegion[cfCountry];
                }
            }
            
            return 'SG';
            
        } catch (error) {
            return 'SG';
        }
    }

    async function checkIPAvailability(domain, port = 443, timeout = 2000) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);
            
            const response = await fetch(`https://${domain}`, {
                method: 'HEAD',
                signal: controller.signal,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; CF-IP-Checker/1.0)'
                }
            });
            
            clearTimeout(timeoutId);
            return response.status < 500;
        } catch (error) {
            return true;
        }
    }

    async function getBestBackupIP(workerRegion = '') {
        
        if (backupIPs.length === 0) {
            return null;
        }
        
        const availableIPs = backupIPs.map(ip => ({ ...ip, available: true }));
        
        if (enableRegionMatching && workerRegion) {
            const sortedIPs = getSmartRegionSelection(workerRegion, availableIPs);
            if (sortedIPs.length > 0) {
                const selectedIP = sortedIPs[0];
                return selectedIP;
            }
        }
        
        const selectedIP = availableIPs[0];
        return selectedIP;
    }

    function getNearbyRegions(region) {
        const nearbyHubMap = {
            US: ['GB', 'DE', 'SG'],
            SG: ['JP', 'KR', 'US'],
            JP: ['KR', 'SG', 'US'],
            KR: ['JP', 'SG', 'US'],
            DE: ['NL', 'GB', 'SE', 'FI'],
            SE: ['FI', 'DE', 'NL', 'GB'],
            NL: ['DE', 'GB', 'SE', 'FI'],
            FI: ['SE', 'DE', 'NL', 'GB'],
            GB: ['DE', 'NL', 'SE', 'FI']
        };
        const currentHub = regionRouteMap[region] || region;
        const nearbyHubs = nearbyHubMap[currentHub] || [];
        const sameHub = REGION_CODES.filter((code) => code !== region && (regionRouteMap[code] || code) === currentHub);
        const nearby = REGION_CODES.filter((code) => {
            if (code === region) return false;
            const codeHub = regionRouteMap[code] || code;
            return nearbyHubs.includes(codeHub) && codeHub !== currentHub;
        });
        return [...sameHub, ...nearby];
    }

    function getAllRegionsByPriority(region) {
        const nearbyRegions = getNearbyRegions(region);
        return [
            region,
            ...nearbyRegions,
            ...REGION_CODES.filter((r) => r !== region && !nearbyRegions.includes(r)),
            ...PROVIDER_REGION_CODES
        ];
    }

    function getSmartRegionSelection(workerRegion, availableIPs) {
        
        if (!enableRegionMatching || !workerRegion) {
            return availableIPs;
        }
        
        const priorityRegions = getAllRegionsByPriority(workerRegion);
        
        const sortedIPs = [];
        
        for (const region of priorityRegions) {
            const regionIPs = availableIPs.filter(ip => ip.regionCode === region);
            sortedIPs.push(...regionIPs);
        }
        
        return sortedIPs;
    }

    function parseAddressAndPort(input) {
        if (input.includes('[') && input.includes(']')) {
            const match = input.match(/^\[([^\]]+)\](?::(\d+))?$/);
            if (match) {
                return {
                    address: match[1],
                    port: match[2] ? parseInt(match[2], 10) : null
                };
            }
        }
        
        const lastColonIndex = input.lastIndexOf(':');
        if (lastColonIndex > 0) {
            const address = input.substring(0, lastColonIndex);
            const portStr = input.substring(lastColonIndex + 1);
            const port = parseInt(portStr, 10);
            
            if (!isNaN(port) && port > 0 && port <= 65535) {
                return { address, port };
            }
        }
        
        return { address: input, port: null };
    }

    export default {
        async fetch(request, env, ctx) {
            try {
                
                await initKVStore(env);

                const brandVar =
                    (env && (env.brand || env.BRAND || env.name || env.NAME)) ||
                    globalThis.brand || globalThis.BRAND || globalThis.name || globalThis.NAME;
                panelBrand = String(brandVar || panelBrand || '').trim() || panelBrand;

                const uuidVar = (env && (env.u || env.U)) || globalThis.u || globalThis.U;
                at = String(uuidVar || at).toLowerCase();

                const dVar = (env && (env.d || env.D)) || globalThis.d || globalThis.D;
                const subPath = String(dVar || at).toLowerCase();
                
                const ci = getConfigValue('p', env.p || env.P);
                let useCustomIP = false;
                
                const manualRegion = getConfigValue('wk', env.wk || env.WK);
                if (manualRegion && manualRegion.trim()) {
                    manualWorkerRegion = manualRegion.trim().toUpperCase();
                    currentWorkerRegion = manualWorkerRegion;
                } else if (ci && ci.trim()) {
                    useCustomIP = true;
                    currentWorkerRegion = 'CUSTOM';
                } else {
                    // Avoid slow region detection during initial page loads (especially in `wrangler dev`).
                    // The UI can fetch region status asynchronously via the existing endpoints.
                    currentWorkerRegion = '';
                }
                
                const regionMatchingControl = env.rm || env.RM;
                if (regionMatchingControl && regionMatchingControl.toLowerCase() === 'no') {
                    enableRegionMatching = false;
                }
                
                const envFallback = getConfigValue('p', env.p || env.P);
                if (envFallback) {
                    fallbackAddress = envFallback.trim();
                }

                socks5Config = getConfigValue('s', env.s || env.S) || socks5Config;
                if (socks5Config) {
                    try {
                        parsedSocks5Config = parseSocksConfig(socks5Config);
                        isSocksEnabled = true;
                    } catch (err) {
                        isSocksEnabled = false;
                    }
                }

                const customPreferred = getConfigValue('yx', env.yx || env.YX);
                if (customPreferred) {
                    try {
                        const preferredList = customPreferred.split(',').map(item => item.trim()).filter(item => item);
                        customPreferredIPs = [];
                        customPreferredDomains = [];
                        
                        preferredList.forEach(item => {
                            
                            let nodeName = '';
                            let addressPart = item;
                            
                            if (item.includes('#')) {
                                const parts = item.split('#');
                                addressPart = parts[0].trim();
                                nodeName = parts[1].trim();
                            }
                            
                            const { address, port } = parseAddressAndPort(addressPart);
                            
                            if (!nodeName) {
                                nodeName = 'CustomPreferred-' + address + (port ? ':' + port : '');
                            }
                            
                            if (isValidIP(address)) {
                                customPreferredIPs.push({ 
                                    ip: address, 
                                    port: port,
                                    isp: nodeName
                                });
                            } else {
                                customPreferredDomains.push({ 
                                    domain: address, 
                                    port: port,
                                    name: nodeName
                                });
                            }
                        });
                    } catch (err) {
                        customPreferredIPs = [];
                        customPreferredDomains = [];
                    }
                }

                const downgradeControl = getConfigValue('qj', env.qj || env.QJ);
                if (downgradeControl && downgradeControl.toLowerCase() === 'no') {
                    enableSocksDowngrade = true;
                }

                const dkbyControl = getConfigValue('dkby', env.dkby || env.DKBY);
                if (dkbyControl && dkbyControl.toLowerCase() === 'yes') {
                    disableNonTLS = true;
                }

                const yxbyControl = env.yxby || env.YXBY;
                if (yxbyControl && yxbyControl.toLowerCase() === 'yes') {
                    disablePreferred = true;
                }

                const vlessControl = getConfigValue('ev', env.ev);
                if (vlessControl !== undefined && vlessControl !== '') {
                    ev = vlessControl === 'yes' || vlessControl === true || vlessControl === 'true';
                }
                
            const tjControl = getConfigValue('et', env.et);
            if (tjControl !== undefined && tjControl !== '') {
                et = tjControl === 'yes' || tjControl === true || tjControl === 'true';
            }
                
                tp = getConfigValue('tp', env.tp) || '';
                
                const xhttpControl = getConfigValue('ex', env.ex);
                if (xhttpControl !== undefined && xhttpControl !== '') {
                    ex = xhttpControl === 'yes' || xhttpControl === true || xhttpControl === 'true';
                }
                
                scu = getConfigValue('scu', env.scu) || 'https://url.v1.mk/sub';
                
                const preferredDomainsControl = getConfigValue('epd', env.epd || 'no');
                if (preferredDomainsControl !== undefined && preferredDomainsControl !== '') {
                    epd = preferredDomainsControl !== 'no' && preferredDomainsControl !== false && preferredDomainsControl !== 'false';
                }
                
                const preferredIPsControl = getConfigValue('epi', env.epi);
                if (preferredIPsControl !== undefined && preferredIPsControl !== '') {
                    epi = preferredIPsControl !== 'no' && preferredIPsControl !== false && preferredIPsControl !== 'false';
                }
                
                const githubIPsControl = getConfigValue('egi', env.egi);
                if (githubIPsControl !== undefined && githubIPsControl !== '') {
                    egi = githubIPsControl !== 'no' && githubIPsControl !== false && githubIPsControl !== 'false';
                }
                
                const echControl = getConfigValue('ech', env.ech);
                if (echControl !== undefined && echControl !== '') {
                    enableECH = echControl === 'yes' || echControl === true || echControl === 'true';
                }
                
                // Load custom DNS + ECH domain
                const customDNSValue = getConfigValue('customDNS', '');
                if (customDNSValue && customDNSValue.trim()) {
                    customDNS = customDNSValue.trim();
                }
                
                const customECHDomainValue = getConfigValue('customECHDomain', '');
                if (customECHDomainValue && customECHDomainValue.trim()) {
                    customECHDomain = customECHDomainValue.trim();
                }
                
                // If ECH is enabled, force TLS-only mode (avoid port 80 interference).
                // ECH requires TLS, so non‑TLS nodes must be disabled.
                if (enableECH) {
                    disableNonTLS = true;
                    // Ensure dkby=yes is set in KV when ECH is enabled
                    const currentDkby = getConfigValue('dkby', '');
                    if (currentDkby !== 'yes') {
                        await setConfigValue('dkby', 'yes');
                    }
                }
                
                if (!ev && !et && !ex) {
                    ev = true;
                }

            piu = getConfigValue('yxURL', env.yxURL || env.YXURL) || 'https://raw.githubusercontent.com/qwer-search/bestip/refs/heads/main/kejilandbestip.txt';
            
            const envD = (env && (env.d || env.D)) || globalThis.d || globalThis.D;
            cp = getConfigValue('d', envD) || '';
            
                const defaultURL = 'https://raw.githubusercontent.com/qwer-search/bestip/refs/heads/main/kejilandbestip.txt';
            if (piu !== defaultURL) {
                    directDomains.length = 0;
                    customPreferredIPs = [];
                    customPreferredDomains = [];
                }

                const url = new URL(request.url);

                if (url.pathname === '/favicon.ico') {
                    return new Response(null, {
                        status: 204,
                        headers: { 'Cache-Control': 'public, max-age=86400' }
                    });
                }

                if ((url.hostname === '127.0.0.1' || url.hostname === 'localhost') && url.pathname === '/__debug') {
                    return new Response(JSON.stringify({
                        at,
                        cp,
                        env_u: env && env.u,
                        env_U: env && env.U,
                        global_u: globalThis.u,
                        global_U: globalThis.U,
                        global_vars: Object.keys(globalThis).filter(k => ['u', 'U', 'BRAND', 'brand', 'NAME', 'name', 'd', 'D'].includes(k))
                    }), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
                }

                if (url.pathname.includes('/api/config')) {
                    const pathParts = url.pathname.split('/').filter(p => p);
                    
                    const apiIndex = pathParts.indexOf('api');
                    if (apiIndex > 0) {
                        const pathSegments = pathParts.slice(0, apiIndex);
                        const pathIdentifier = pathSegments.join('/');
                        
                    const isValid = isAuthorizedPathIdentifier(pathIdentifier);
                        
                        if (isValid) {
                            return await handleConfigAPI(request);
                        } else {
                            return new Response(JSON.stringify({ error: 'Path validation failed' }), { 
                                status: 403,
                                headers: { 'Content-Type': 'application/json' }
                            });
                        }
                    }
                    
                    return new Response(JSON.stringify({ error: 'Invalid API path' }), { 
                        status: 404,
                        headers: { 'Content-Type': 'application/json' }
                    });
                }
                
                if (url.pathname.includes('/api/preferred-ips')) {
                    const pathParts = url.pathname.split('/').filter(p => p);
                
                    const apiIndex = pathParts.indexOf('api');
                    if (apiIndex > 0) {
                    const pathSegments = pathParts.slice(0, apiIndex);
                    const pathIdentifier = pathSegments.join('/');
                    
                    const isValid = isAuthorizedPathIdentifier(pathIdentifier);
                    
                    if (isValid) {
                            return await handlePreferredIPsAPI(request);
                    } else {
                        return new Response(JSON.stringify({ error: 'Path validation failed' }), { 
                                status: 403,
                                headers: { 'Content-Type': 'application/json' }
                            });
                        }
                    }
                
                    return new Response(JSON.stringify({ error: 'Invalid API path' }), { 
                        status: 404,
                        headers: { 'Content-Type': 'application/json' }
                    });
                }
            
            if (request.method === 'POST' && ex) {
                const r = await handleXhttpPost(request);
                if (r) {
                    ctx.waitUntil(r.closed);
                    return new Response(r.readable, {
                        headers: {
                            'X-Accel-Buffering': 'no',
                            'Cache-Control': 'no-store',
                            Connection: 'keep-alive',
                            'User-Agent': 'Go-http-client/2.0',
                            'Content-Type': 'application/grpc',
                        },
                    });
                }
                return new Response('Internal Server Error', { status: 500 });
            }

            if (request.headers.get('Upgrade') === atob('d2Vic29ja2V0')) {
                return await handleWsRequest(request);
                }
                
                if (request.method === 'GET') {
                    // Handle /{UUID}/region or /{customPath}/region
                    if (url.pathname.endsWith('/region')) {
                        const pathParts = url.pathname.split('/').filter(p => p);
                        
                        if (pathParts.length === 2 && pathParts[1] === 'region') {
                            const pathIdentifier = pathParts[0];
                            const isValid = isAuthorizedPathIdentifier(pathIdentifier);
                            
                            if (isValid) {
                                const ci = getConfigValue('p', env.p || env.P);
                                const manualRegion = getConfigValue('wk', env.wk || env.WK);
                                
                                if (manualRegion && manualRegion.trim()) {
                                    return new Response(JSON.stringify({
                                        region: manualRegion.trim().toUpperCase(),
                                        detectionMethod: 'Manual region',
                                        manualRegion: manualRegion.trim().toUpperCase(),
                                        timestamp: new Date().toISOString()
                                    }), {
                                        headers: { 'Content-Type': 'application/json' }
                                    });
                                } else if (ci && ci.trim()) {
                                    return new Response(JSON.stringify({
                                        region: 'CUSTOM',
                                        detectionMethod: 'Custom ProxyIP mode', ci: ci,
                                        timestamp: new Date().toISOString()
                                    }), {
                                        headers: { 'Content-Type': 'application/json' }
                                    });
                                } else {
                                    const detectedRegion = await detectWorkerRegion(request);
                                    return new Response(JSON.stringify({
                                        region: detectedRegion,
                                        detectionMethod: 'API detection',
                                        timestamp: new Date().toISOString()
                                    }), {
                                        headers: { 'Content-Type': 'application/json' }
                                    });
                                }
                            } else {
                                return new Response(JSON.stringify({ 
                                    error: 'Access denied',
                                    message: 'Path validation failed'
                                }), { 
                                    status: 403,
                                    headers: { 'Content-Type': 'application/json' }
                                });
                            }
                        }
                    }
                    
                    // Handle /{UUID}/test-api or /{customPath}/test-api
                    if (url.pathname.endsWith('/test-api')) {
                        const pathParts = url.pathname.split('/').filter(p => p);
                        
                        if (pathParts.length === 2 && pathParts[1] === 'test-api') {
                            const pathIdentifier = pathParts[0];
                            const isValid = isAuthorizedPathIdentifier(pathIdentifier);
                            
                            if (isValid) {
                                try {
                                    const testRegion = await detectWorkerRegion(request);
                                    return new Response(JSON.stringify({
                                        detectedRegion: testRegion,
                                        message: 'API test completed',
                                        timestamp: new Date().toISOString()
                                    }), {
                                        headers: { 'Content-Type': 'application/json' }
                                    });
                                } catch (error) {
                                    return new Response(JSON.stringify({
                                        error: error.message,
                                        message: 'API test failed'
                                    }), {
                                        status: 500,
                                        headers: { 'Content-Type': 'application/json' }
                                    });
                                }
                            } else {
                                return new Response(JSON.stringify({ 
                                    error: 'Access denied',
                                    message: 'Path validation failed'
                                }), { 
                                    status: 403,
                                    headers: { 'Content-Type': 'application/json' }
                                });
                            }
                        }
                    }
                    
                    if (url.pathname === '/') {
                        // Check whether a custom homepage URL is configured
                        const customHomepage = getConfigValue('homepage', env.homepage || env.HOMEPAGE);
                        if (customHomepage && customHomepage.trim()) {
                            try {
                                // Fetch custom homepage content
                                const homepageResponse = await fetch(customHomepage.trim(), {
                                    method: 'GET',
                                    headers: {
                                        'User-Agent': request.headers.get('User-Agent') || 'Mozilla/5.0',
                                        'Accept': request.headers.get('Accept') || '*/*',
                                        'Accept-Language': request.headers.get('Accept-Language') || 'en-US,en;q=0.9',
                                    },
                                    redirect: 'follow'
                                });
                                
                                if (homepageResponse.ok) {
                                    // Read response body
                                    const contentType = homepageResponse.headers.get('Content-Type') || 'text/html; charset=utf-8';
                                    const content = await homepageResponse.text();
                                    
                                    // Return the custom homepage content
                                    return new Response(content, {
                                        status: homepageResponse.status,
                                        headers: {
                                            'Content-Type': contentType,
                                            'Cache-Control': 'no-cache, no-store, must-revalidate',
                                        }
                                    });
                                }
                            } catch (error) {
                                // If fetching the custom homepage fails, fall back to the default page
                                console.error('Failed to fetch custom homepage:', error);
                            }
                        }
                        // Prefer cookie language if present
                        const cookieHeader = request.headers.get('Cookie') || '';
                        let langFromCookie = null;
                        if (cookieHeader) {
                            const cookies = cookieHeader.split(';').map(c => c.trim());
                            for (const cookie of cookies) {
                                if (cookie.startsWith('preferredLanguage=')) {
                                    langFromCookie = cookie.split('=')[1];
                                    break;
                                }
                            }
                        }
                        
                        let isFarsi = false;
                        
                        if (langFromCookie === 'fa' || langFromCookie === 'fa-IR') {
                            isFarsi = true;
                        } else {
                            // If no cookie, use browser language detection
                            const acceptLanguage = request.headers.get('Accept-Language') || '';
                            const browserLang = acceptLanguage.split(',')[0].split('-')[0].toLowerCase();
                            isFarsi = browserLang === 'fa' || acceptLanguage.includes('fa-IR') || acceptLanguage.includes('fa');
                        }
                            
                            const lang = isFarsi ? 'fa' : 'en';
                            const langAttr = isFarsi ? 'fa-IR' : 'en-US';
                            
                            const translations = {
                                en: {
                                    title: 'Welcome',
                                    subtitle: 'Enter your UID to open the panel',
                                    uidLabel: 'UID (UUID)',
                                    uidPlaceholder: 'e.g. 92f0edc2-81e2-4712-816d-bc72d64794e3',
                                    uidHint: 'This is the UUID you configured as variable U.',
                                    pathLabel: 'Path',
                                    pathPlaceholder: 'e.g. mypath or /mypath',
                                    pathHint: 'This Worker is configured to use a custom path (D).',
                                    continueBtn: 'Continue',
                                    invalidUid: 'Invalid UID format. Please paste a valid UUID.',
                                    linksTitle: 'Links',
                                    telegramChannel: 'Telegram Channel',
                                    serverBot: 'Server Bot',
                                    androidBot: 'Android Download Bot',
                                    youtube: 'YouTube',
                                    theme: 'Theme',
                                    language: 'Language'
                                },
                                fa: {
                                    title: 'خوش آمدید',
                                    subtitle: 'برای ورود به پنل، UID را وارد کنید',
                                    uidLabel: 'UID (UUID)',
                                    uidPlaceholder: 'مثال: 92f0edc2-81e2-4712-816d-bc72d64794e3',
                                    uidHint: 'این همان UUID است که در متغیر U تنظیم کرده‌اید.',
                                    pathLabel: 'مسیر',
                                    pathPlaceholder: 'مثال: mypath یا /mypath',
                                    pathHint: 'این Worker روی حالت مسیر سفارشی (D) تنظیم شده است.',
                                    continueBtn: 'ادامه',
                                    invalidUid: 'فرمت UID اشتباه است. لطفاً یک UUID معتبر وارد کنید.',
                                    linksTitle: 'لینک‌ها',
                                    telegramChannel: 'کانال تلگرام',
                                    serverBot: 'بات سرور',
                                    androidBot: 'بات دانلود اندروید',
                                    youtube: 'یوتیوب',
                                    theme: 'تم',
                                    language: 'زبان'
                                }
                            };

                            const t = translations[isFarsi ? 'fa' : 'en'];
                            const expectsPath = !!(cp && cp.trim());
                            const inputLabel = expectsPath ? t.pathLabel : t.uidLabel;
                            const inputPlaceholder = expectsPath ? t.pathPlaceholder : t.uidPlaceholder;
                            const inputHint = expectsPath ? t.pathHint : t.uidHint;

                            const startHtml = `<!DOCTYPE html>
<html lang="${langAttr}" dir="${isFarsi ? 'rtl' : 'ltr'}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${panelBrand} — ${t.title}</title>
    <style>
      :root{--bg0:#0b1020;--bg1:#0f1733;--fg:#e9ecf6;--muted:rgba(233,236,246,.72);--card:rgba(255,255,255,.06);--border:rgba(255,255,255,.14);--shadow:0 30px 70px rgba(0,0,0,.45);--accent:#7c5cff;--accent2:#22d3ee;--radius:18px}
      html[data-theme="light"]{--bg0:#f6f7fb;--bg1:#eef2ff;--fg:#0b1020;--muted:rgba(11,16,32,.7);--card:rgba(255,255,255,.8);--border:rgba(11,16,32,.12);--shadow:0 20px 50px rgba(15,23,42,.12)}
      *{box-sizing:border-box}
      body{margin:0;min-height:100vh;font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Tahoma,Arial,sans-serif;color:var(--fg);background:radial-gradient(1200px 900px at 15% 10%,rgba(124,92,255,.25),transparent 55%),radial-gradient(1100px 900px at 85% 20%,rgba(34,211,238,.18),transparent 60%),linear-gradient(180deg,var(--bg0),var(--bg1));display:flex;align-items:center;justify-content:center;padding:28px}
      .shell{width:min(980px,100%);display:grid;gap:18px}
      .top{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 14px;border:1px solid var(--border);border-radius:999px;background:rgba(0,0,0,.18);backdrop-filter:blur(14px);box-shadow:var(--shadow)}
      html[data-theme="light"] .top{background:rgba(255,255,255,.55)}
      .brand{display:flex;align-items:center;gap:10px;min-width:0}
      .dot{width:10px;height:10px;border-radius:50%;background:linear-gradient(180deg,var(--accent),var(--accent2));box-shadow:0 0 24px rgba(124,92,255,.55)}
      .name{font-weight:900;letter-spacing:.2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .pill{padding:8px 12px;border-radius:999px;border:1px solid var(--border);background:rgba(255,255,255,.08);color:var(--muted);font-size:.92rem}
      .actions{display:flex;gap:10px;align-items:center}
      .icon{width:40px;height:40px;border-radius:999px;border:1px solid var(--border);background:rgba(255,255,255,.08);color:var(--fg);cursor:pointer}
      .select{height:40px;border-radius:999px;border:1px solid var(--border);background:rgba(255,255,255,.08);color:var(--fg);padding:0 12px;cursor:pointer}
      .card{border:1px solid var(--border);border-radius:var(--radius);background:var(--card);backdrop-filter:blur(14px);box-shadow:var(--shadow);overflow:hidden}
      .card-inner{padding:22px}
      h1{margin:0 0 6px;font-size:2.0rem;letter-spacing:-.02em}
      .sub{margin:0;color:var(--muted);line-height:1.7}
      .grid{display:grid;grid-template-columns:1.25fr .75fr;gap:16px}
      @media (max-width:860px){.grid{grid-template-columns:1fr}}
      label{display:block;font-weight:800;margin:14px 0 8px}
      input{width:100%;height:48px;border-radius:14px;border:1px solid var(--border);background:rgba(255,255,255,.08);color:var(--fg);padding:0 14px;font-size:1rem;outline:none}
      input:focus{box-shadow:0 0 0 4px rgba(124,92,255,.22);border-color:rgba(124,92,255,.45)}
      .hint{margin:8px 0 0;color:var(--muted);font-size:.95rem;line-height:1.6}
      .row{display:flex;gap:12px;align-items:center;margin-top:16px;flex-wrap:wrap}
      .btn{height:48px;border-radius:14px;border:1px solid rgba(124,92,255,.45);background:linear-gradient(180deg,rgba(124,92,255,.95),rgba(34,211,238,.55));color:#0b1020;font-weight:900;padding:0 18px;cursor:pointer;box-shadow:0 20px 60px rgba(124,92,255,.22)}
      .btn:hover{transform:translateY(-1px)}
      .err{display:none;margin-top:12px;padding:12px 14px;border-radius:14px;border:1px solid rgba(255,70,70,.35);background:rgba(255,70,70,.10);color:rgba(255,230,230,.95)}
      .links a{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:12px 14px;border-radius:14px;border:1px solid var(--border);background:rgba(255,255,255,.06);text-decoration:none;color:var(--fg)}
      .links a:hover{border-color:rgba(124,92,255,.45)}
      .links small{color:var(--muted)}
    </style>
  </head>
  <body>
    <div class="shell">
      <div class="top">
        <div class="brand">
          <div class="dot"></div>
          <div class="name">${panelBrand}</div>
          <div class="pill">v2.9.3</div>
        </div>
        <div class="actions">
          <button class="icon" id="themeToggle" type="button" aria-label="${t.theme}"></button>
          <select class="select" id="languageSelector" aria-label="${t.language}">
            <option value="en" ${!isFarsi ? 'selected' : ''}>English</option>
            <option value="fa" ${isFarsi ? 'selected' : ''}>فارسی</option>
          </select>
        </div>
      </div>

      <div class="grid">
        <div class="card"><div class="card-inner">
          <h1>${t.title}</h1>
          <p class="sub">${t.subtitle}</p>

          <form id="startForm">
            <label for="uidInput">${inputLabel}</label>
            <input id="uidInput" autocomplete="off" spellcheck="false" placeholder="${inputPlaceholder}" />
            <p class="hint">${inputHint}</p>
            <div class="err" id="uidErr"></div>
            <div class="row">
              <button class="btn" type="submit">${t.continueBtn}</button>
            </div>
          </form>
        </div></div>

        <div class="card"><div class="card-inner">
          <h1 style="font-size:1.25rem;margin-bottom:10px">${t.linksTitle}</h1>
          <div class="links" style="display:grid;gap:10px">
            <a href="https://t.me/PIMX_PASS" target="_blank" rel="noreferrer"><span>${t.telegramChannel}</span><small>@PIMX_PASS</small></a>
            <a href="https://t.me/PIMX_PASS_BOT" target="_blank" rel="noreferrer"><span>${t.serverBot}</span><small>@PIMX_PASS_BOT</small></a>
            <a href="https://t.me/PIMX_SONIC_BOT" target="_blank" rel="noreferrer"><span>${t.androidBot}</span><small>@PIMX_SONIC_BOT</small></a>
            <a href="https://t.me/PIMX_PLAY_BOT" target="_blank" rel="noreferrer"><span>${isFarsi ? 'بات موزیک' : 'Music Bot'}</span><small>@PIMX_PLAY_BOT</small></a>
            <a href="https://www.youtube.com/@PIMX_PLAY_BOT" target="_blank" rel="noreferrer"><span>${t.youtube}</span><small>@PIMX_PLAY_BOT</small></a>
            <a href="https://x.com/pimxpass" target="_blank" rel="noreferrer"><span>X</span><small>@pimxpass</small></a>
          </div>
          <p class="hint" style="margin-top:14px">${isFarsi ? 'بات سرور: V2Ray / NPV Tunnel / HA Tunnel Plus / OpenVPN / HTTP Injector / HTTP Custom + پروکسی تلگرام • اندروید: @PIMX_SONIC_BOT • موزیک: @PIMX_PLAY_BOT' : 'Server Bot: V2Ray / NPV Tunnel / HA Tunnel Plus / OpenVPN / HTTP Injector / HTTP Custom + Telegram proxy • Android: @PIMX_SONIC_BOT • Music bot: @PIMX_PLAY_BOT'}</p>
        </div></div>
      </div>
    </div>

    <script>
      (function(){
        function setCookie(name, value){
          var d = new Date(); d.setFullYear(d.getFullYear()+1);
          document.cookie = name + '=' + value + '; path=/; expires=' + d.toUTCString() + '; SameSite=Lax';
        }
        function getCookie(name){
          var value = '; ' + document.cookie;
          var parts = value.split('; ' + name + '=');
          if(parts.length === 2) return parts.pop().split(';').shift();
          return null;
        }
        function isValidUUID(v){ return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v); }

        var expectsPath = ${expectsPath ? 'true' : 'false'};
        var input = document.getElementById('uidInput');
        var err = document.getElementById('uidErr');

        var saved = localStorage.getItem('pimx_uid') || '';
        if(saved) input.value = saved;

        document.getElementById('startForm').addEventListener('submit', function(e){
          e.preventDefault();
          err.style.display = 'none';
          var v = (input.value || '').trim();
          if(!v) return;
          if(!expectsPath && !isValidUUID(v)){
            err.textContent = ${JSON.stringify(t.invalidUid)};
            err.style.display = 'block';
            return;
          }
          localStorage.setItem('pimx_uid', v);
          if(expectsPath && v.startsWith('/')) v = v.slice(1);
          window.location.href = '/' + v;
        });

        var themeToggle = document.getElementById('themeToggle');
        function setTheme(theme){
          document.documentElement.setAttribute('data-theme', theme);
          localStorage.setItem('preferredTheme', theme);
          themeToggle.textContent = (theme === 'light') ? '☀️' : '🌙';
        }
        var savedTheme = localStorage.getItem('preferredTheme');
        if(savedTheme){ setTheme(savedTheme); } else {
          var prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
          setTheme(prefersLight ? 'light' : 'dark');
        }
        themeToggle.addEventListener('click', function(){
          var current = document.documentElement.getAttribute('data-theme') || 'dark';
          setTheme(current === 'light' ? 'dark' : 'light');
        });

        var langSel = document.getElementById('languageSelector');
        langSel.addEventListener('change', function(){
          var lang = langSel.value;
          localStorage.setItem('preferredLanguage', lang);
          setCookie('preferredLanguage', lang);
          document.documentElement.setAttribute('lang', lang === 'fa' ? 'fa-IR' : 'en-US');
          document.documentElement.setAttribute('dir', lang === 'fa' ? 'rtl' : 'ltr');
        });

        var savedLang = localStorage.getItem('preferredLanguage') || getCookie('preferredLanguage');
        if(savedLang) setCookie('preferredLanguage', savedLang);
      })();
    </script>
  </body>
</html>`;

                            return new Response(startHtml, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
                    }
                
            if (cp && cp.trim()) {
                const cleanCustomPath = cp.trim().startsWith('/') ? cp.trim() : '/' + cp.trim();
                const normalizedCustomPath = cleanCustomPath.endsWith('/') && cleanCustomPath.length > 1 ? cleanCustomPath.slice(0, -1) : cleanCustomPath;
                const normalizedPath = url.pathname.endsWith('/') && url.pathname.length > 1 ? url.pathname.slice(0, -1) : url.pathname;
                    
                    if (normalizedPath === normalizedCustomPath) {
                        return await handleSubscriptionPage(request, at);
                    }
                    
                    if (normalizedPath === normalizedCustomPath + '/sub') {
                        return await handleSubscriptionRequest(request, at, url);
                    }

                    const ownerPath = '/' + at;
                    if (normalizedPath === ownerPath) {
                        return await handleSubscriptionPage(request, at);
                    }

                    if (normalizedPath === ownerPath + '/sub') {
                        return await handleSubscriptionRequest(request, at, url);
                    }
                    
                    if (url.pathname.length > 1 && url.pathname !== '/') {
                        const user = url.pathname.replace(/\/$/, '').replace('/sub', '').substring(1);
                        if (isValidFormat(user)) {
                            return new Response(JSON.stringify({ 
                                error: 'Access denied',
                                message: 'This Worker is running in custom-path mode; UUID access is disabled.'
                            }), { 
                                status: 403,
                                headers: { 'Content-Type': 'application/json' }
                            });
                        }
                    }
                } else {
                    
                    if (url.pathname.length > 1 && url.pathname !== '/' && !url.pathname.includes('/sub')) {
                        const user = url.pathname.replace(/\/$/, '').substring(1);
                        if (isValidFormat(user)) {
                            if (user === at) {
                                return await handleSubscriptionPage(request, user);
                            } else {
                                return new Response(JSON.stringify({ error: 'Invalid UUID. Note: the variable name is `u`, not `uuid`.' }), { 
                                    status: 403,
                                    headers: { 'Content-Type': 'application/json' }
                                });
                            }
                        }
                    }
                    if (url.pathname.includes('/sub')) {
                        const pathParts = url.pathname.split('/');
                        if (pathParts.length === 2 && pathParts[1] === 'sub') {
                            const user = pathParts[0].substring(1);
                            if (isValidFormat(user)) {
                                if (user === at) {
                                    return await handleSubscriptionRequest(request, user, url);
                                } else {
                                    return new Response(JSON.stringify({ error: 'Invalid UUID' }), { 
                                        status: 403,
                                        headers: { 'Content-Type': 'application/json' }
                                    });
                                }
                                }
                            }
                        }
                    }
                    if (url.pathname.toLowerCase().includes(`/${subPath}`)) {
                        return await handleSubscriptionRequest(request, at);
                    }
                }
                return new Response(JSON.stringify({ error: 'Not Found' }), { 
                    status: 404,
                    headers: { 'Content-Type': 'application/json' }
                });
            } catch (err) {
                return new Response(err.toString(), { status: 500 });
            }
        },
    };

    function generateQuantumultConfig(links) {
        return btoa(links.join('\n'));
    }

    // Parse VLESS/Trojan links into Clash nodes
    function parseLinkToClashNode(link) {
        try {
            // Parse VLESS link
            if (link.startsWith('vless://')) {
                const url = new URL(link);
                const name = decodeURIComponent(url.hash.substring(1));
                const uuid = url.username;
                const server = url.hostname;
                const port = parseInt(url.port) || 443;
                const params = new URLSearchParams(url.search);
                
                const tls = params.get('security') === 'tls' || params.get('tls') === 'true';
                const network = params.get('type') || 'ws';
                const path = params.get('path') || '/?ed=2048';
                const host = params.get('host') || server;
                const servername = params.get('sni') || host;
                const alpn = params.get('alpn') || 'h3,h2,http/1.1';
                const fingerprint = params.get('fp') || params.get('client-fingerprint') || 'chrome';
                const ech = params.get('ech');
                
                const node = {
                    name: name,
                    type: 'vless',
                    server: server,
                    port: port,
                    uuid: uuid,
                    tls: tls,
                    network: network,
                    'client-fingerprint': fingerprint
                };
                
                if (tls) {
                    node.servername = servername;
                    node.alpn = alpn.split(',').map(a => a.trim());
                    node['skip-cert-verify'] = false;
                }
                
                if (network === 'ws') {
                    node['ws-opts'] = {
                        path: path,
                        headers: {
                            Host: host
                        }
                    };
                }
                
                if (ech) {
                    const echDomain = customECHDomain || 'cloudflare-ech.com';
                    node['ech-opts'] = {
                        enable: true,
                        'query-server-name': echDomain
                    };
                }
                
                return node;
            }
            
            // Parse Trojan link
            if (link.startsWith('trojan://')) {
                const url = new URL(link);
                const name = decodeURIComponent(url.hash.substring(1));
                const password = url.username;
                const server = url.hostname;
                const port = parseInt(url.port) || 443;
                const params = new URLSearchParams(url.search);
                
                const network = params.get('type') || 'ws';
                const path = params.get('path') || '/?ed=2048';
                const host = params.get('host') || server;
                const sni = params.get('sni') || host;
                const alpn = params.get('alpn') || 'h3,h2,http/1.1';
                const ech = params.get('ech');
                
                const node = {
                    name: name,
                    type: 'trojan',
                    server: server,
                    port: port,
                    password: password,
                    network: network,
                    sni: sni,
                    alpn: alpn.split(',').map(a => a.trim()),
                    'skip-cert-verify': false
                };
                
                if (network === 'ws') {
                    node['ws-opts'] = {
                        path: path,
                        headers: {
                            Host: host
                        }
                    };
                }
                
                if (ech) {
                    const echDomain = customECHDomain || 'cloudflare-ech.com';
                    node['ech-opts'] = {
                        enable: true,
                        'query-server-name': echDomain
                    };
                }
                
                return node;
            }
        } catch (e) {
            return null;
        }
        return null;
    }

    // Generate Clash config
    async function generateClashConfig(links, request, user) {
        // Fetch Clash config via subscription converter
        const subscriptionUrl = new URL(request.url);
        subscriptionUrl.pathname = subscriptionUrl.pathname.replace(/\/sub$/, '') + '/sub';
        subscriptionUrl.searchParams.set('target', 'base64');
        const encodedUrl = encodeURIComponent(subscriptionUrl.toString());
        const converterUrl = `${scu}?target=clash&url=${encodedUrl}&insert=false&emoji=true&list=false&xudp=false&udp=false&tfo=false&expand=true&scv=false&fdn=false&new_name=true`;
        
        try {
            const response = await fetch(converterUrl);
            if (!response.ok) {
                throw new Error('Subscription converter failed');
            }
            
            let clashConfig = await response.text();
            
            // If ECH is enabled, append ECH options for all nodes
            if (enableECH) {
                // Handle single-line nodes: - {name: ..., server: ..., ...}
                // Must handle nested braces (e.g. ws-opts: {path: "...", headers: {Host: ...}})
                clashConfig = clashConfig.split('\n').map(line => {
                    // Check whether this looks like a node line
                    if (/^\s*-\s*\{/.test(line) && line.includes('name:') && line.includes('server:')) {
                        // Skip if ech-opts already exists
                        if (line.includes('ech-opts')) {
                            return line; // Already has ech-opts
                        }
                        // Find the last } (handle nested braces)
                        const lastBraceIndex = line.lastIndexOf('}');
                        if (lastBraceIndex > 0) {
                            // Validate content before the last }
                            const beforeBrace = line.substring(0, lastBraceIndex).trim();
                            if (beforeBrace.length > 0) {
                                // Insert ech-opts: {enable: true, query-server-name: ...} before the final }
                                const echDomain = customECHDomain || 'cloudflare-ech.com';
                                const needsComma = !beforeBrace.endsWith(',') && !beforeBrace.endsWith('{');
                                return line.substring(0, lastBraceIndex) + (needsComma ? ', ' : ' ') + `ech-opts: {enable: true, query-server-name: ${echDomain}}` + line.substring(lastBraceIndex);
                            }
                        }
                    }
                    return line;
                }).join('\n');
            }
            
            // Replace DNS nameserver with the configured DoH endpoint
            clashConfig = clashConfig.replace(/^(\s*nameserver:\s*\n)((?:\s*-\s*[^\n]+\n)*)/m, (match, header, items) => {
                const dnsServer = customDNS || 'https://dns.joeyblog.eu.org/joeyblog';
                return header + `    - ${dnsServer}\n`;
            });
            
            return clashConfig;
        } catch (e) {
            throw new Error('Failed to build Clash config: ' + e.message);
        }
    }

    // Global ECH debug info
    let echDebugInfo = '';
    
    async function fetchECHConfig(domain) {
        if (!enableECH) {
            echDebugInfo = 'ECH is disabled.';
            return null;
        }
        
        echDebugInfo = '';
        const debugSteps = [];
        
        try {
            // Try Google DNS first for cloudflare-ech.com ECH config
            debugSteps.push('Trying Google DNS for cloudflare-ech.com…');
            const echDomainUrl = `https://v.recipes/dns/dns.google/dns-query?name=cloudflare-ech.com&type=65`;
            const echResponse = await fetch(echDomainUrl, {
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            debugSteps.push(`Google DNS status: ${echResponse.status}`);
            
            if (echResponse.ok) {
                const echData = await echResponse.json();
                debugSteps.push(`Google DNS payload: ${JSON.stringify(echData).substring(0, 200)}...`);
                
                if (echData.Answer && echData.Answer.length > 0) {
                    debugSteps.push(`Found ${echData.Answer.length} answer record(s)`);
                    for (const answer of echData.Answer) {
                        if (answer.data) {
                            debugSteps.push(`Answer data type: ${typeof answer.data}, length: ${String(answer.data).length}`);
                            const dataStr = typeof answer.data === 'string' ? answer.data : JSON.stringify(answer.data);
                            const echMatch = dataStr.match(/ech=([^\s"']+)/);
                            if (echMatch && echMatch[1]) {
                                echDebugInfo = debugSteps.join('\\n') + '\\n✅ ECH config fetched from Google DNS';
                                return echMatch[1];
                            }
                            // If not present, try base64 decode
                            if (answer.data && !dataStr.includes('ech=')) {
                                try {
                                    const decoded = atob(answer.data);
                                    debugSteps.push(`Base64 decoded length: ${decoded.length}`);
                                    const decodedMatch = decoded.match(/ech=([^\s"']+)/);
                                    if (decodedMatch && decodedMatch[1]) {
                                        echDebugInfo = debugSteps.join('\\n') + '\\n✅ ECH config fetched from Google DNS (base64)';
                                        return decodedMatch[1];
                                    }
                                } catch (e) {
                                    debugSteps.push(`Base64 decode failed: ${e.message}`);
                                }
                            }
                        }
                    }
                } else {
                    debugSteps.push('Google DNS returned no answer records');
                }
            } else {
                debugSteps.push(`Google DNS request failed: ${echResponse.status}`);
            }
            
            // If cloudflare-ech.com fails, try target domain
            debugSteps.push(`Trying Google DNS for target domain: ${domain}…`);
            const dohUrl = `https://v.recipes/dns/dns.google/dns-query?name=${encodeURIComponent(domain)}&type=65`;
            const response = await fetch(dohUrl, {
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            debugSteps.push(`Google DNS (target) status: ${response.status}`);
            
            if (response.ok) {
                const data = await response.json();
                debugSteps.push(`Google DNS (target) payload: ${JSON.stringify(data).substring(0, 200)}...`);
                
                if (data.Answer && data.Answer.length > 0) {
                    debugSteps.push(`Found ${data.Answer.length} answer record(s)`);
                    for (const answer of data.Answer) {
                        if (answer.data) {
                            const dataStr = typeof answer.data === 'string' ? answer.data : JSON.stringify(answer.data);
                            const echMatch = dataStr.match(/ech=([^\s"']+)/);
                            if (echMatch && echMatch[1]) {
                                echDebugInfo = debugSteps.join('\\n') + '\\n✅ ECH config fetched from Google DNS (target)';
                                return echMatch[1];
                            }
                            // Try base64 decode
                            try {
                                const decoded = atob(answer.data);
                                const decodedMatch = decoded.match(/ech=([^\s"']+)/);
                                if (decodedMatch && decodedMatch[1]) {
                                    echDebugInfo = debugSteps.join('\\n') + '\\n✅ ECH config fetched from Google DNS (target, base64)';
                                    return decodedMatch[1];
                                }
                            } catch (e) {
                                debugSteps.push(`Base64 decode failed: ${e.message}`);
                            }
                        }
                    }
                } else {
                    debugSteps.push('Google DNS (target) returned no answer records');
                }
            } else {
                debugSteps.push(`Google DNS (target) request failed: ${response.status}`);
            }
            
            // If Google fails, try Cloudflare DNS
            debugSteps.push('Trying Cloudflare DNS…');
            const cfEchUrl = `https://cloudflare-dns.com/dns-query?name=cloudflare-ech.com&type=65`;
            const cfResponse = await fetch(cfEchUrl, {
                headers: {
                    'Accept': 'application/dns-json'
                }
            });
            
            debugSteps.push(`Cloudflare DNS status: ${cfResponse.status}`);
            
            if (cfResponse.ok) {
                const cfData = await cfResponse.json();
                debugSteps.push(`Cloudflare DNS payload: ${JSON.stringify(cfData).substring(0, 200)}...`);
                
                if (cfData.Answer && cfData.Answer.length > 0) {
                    debugSteps.push(`Found ${cfData.Answer.length} answer record(s)`);
                    for (const answer of cfData.Answer) {
                        if (answer.data) {
                            const echMatch = answer.data.match(/ech=([^\s"']+)/);
                            if (echMatch && echMatch[1]) {
                                echDebugInfo = debugSteps.join('\\n') + '\\n✅ ECH config fetched from Cloudflare DNS';
                                return echMatch[1];
                            }
                        }
                    }
                } else {
                    debugSteps.push('Cloudflare DNS returned no answer records');
                }
            } else {
                debugSteps.push(`Cloudflare DNS request failed: ${cfResponse.status}`);
            }
            
            echDebugInfo = debugSteps.join('\\n') + '\\n❌ All DNS queries failed; no ECH config found.';
            return null;
        } catch (error) {
            echDebugInfo = debugSteps.join('\\n') + '\\n❌ Error while fetching ECH config: ' + error.message;
            return null;
        }
    }

    async function handleSubscriptionRequest(request, user, url = null) {
        if (!url) url = new URL(request.url);
        
        const finalLinks = [];
        const workerDomain = url.hostname;
        const target = url.searchParams.get('target') || 'base64';

        // If ECH is enabled, use custom values
        let echConfig = null;
        if (enableECH) {
            const dnsServer = customDNS || 'https://dns.joeyblog.eu.org/joeyblog';
            const echDomain = customECHDomain || 'cloudflare-ech.com';
            echConfig = `${echDomain}+${dnsServer}`;
        }

        async function addNodesFromList(list) {
            if (ev) {
                finalLinks.push(...generateLinksFromSource(list, user, workerDomain, echConfig));
            }
            if (et) {
                finalLinks.push(...await generateTrojanLinksFromSource(list, user, workerDomain, echConfig));
            }
            if (ex) {
                finalLinks.push(...generateXhttpLinksFromSource(list, user, workerDomain, echConfig));
            }
        }

        if (currentWorkerRegion === 'CUSTOM') {
            const nativeList = [{ ip: workerDomain, isp: 'Native' }];
            await addNodesFromList(nativeList);
        } else {
            try {
                const nativeList = [{ ip: workerDomain, isp: 'Native' }];
                await addNodesFromList(nativeList);
            } catch (error) {
                if (!currentWorkerRegion) {
                    currentWorkerRegion = await detectWorkerRegion(request);
                }
                
                const bestBackupIP = await getBestBackupIP(currentWorkerRegion);
                if (bestBackupIP) {
                    fallbackAddress = bestBackupIP.domain + ':' + bestBackupIP.port;
                    const backupList = [{ ip: bestBackupIP.domain, isp: 'ProxyIP-' + currentWorkerRegion }];
                    await addNodesFromList(backupList);
                } else {
                    const nativeList = [{ ip: workerDomain, isp: 'Native' }];
                    await addNodesFromList(nativeList);
                }
            }
        }

        const hasCustomPreferred = customPreferredIPs.length > 0 || customPreferredDomains.length > 0;
        
        if (disablePreferred) {
        } else if (hasCustomPreferred) {
            
            if (customPreferredIPs.length > 0 && epi) {
                await addNodesFromList(customPreferredIPs);
            }
            
            if (customPreferredDomains.length > 0 && epd) {
                const customDomainList = customPreferredDomains.map(d => ({ ip: d.domain, isp: d.name || d.domain }));
                await addNodesFromList(customDomainList);
            }
        } else {
            
            if (epd) {
            const domainList = directDomains.map(d => ({ ip: d.domain, isp: d.name || d.domain }));
                await addNodesFromList(domainList);
            }

            if (epi) {
            const defaultURL = 'https://raw.githubusercontent.com/qwer-search/bestip/refs/heads/main/kejilandbestip.txt';
                if (piu === defaultURL) {
                try {
                    const dynamicIPList = await fetchDynamicIPs();
                    if (dynamicIPList.length > 0) {
                            await addNodesFromList(dynamicIPList);
                    }
                } catch (error) {
                    if (!currentWorkerRegion) {
                        currentWorkerRegion = await detectWorkerRegion(request);
                    }
                    
                    const bestBackupIP = await getBestBackupIP(currentWorkerRegion);
                    if (bestBackupIP) {
                        fallbackAddress = bestBackupIP.domain + ':' + bestBackupIP.port;
                        
                        const backupList = [{ ip: bestBackupIP.domain, isp: 'ProxyIP-' + currentWorkerRegion }];
                            await addNodesFromList(backupList);
                        }
                    }
                }
            }

            if (egi) {
            try {
                const newIPList = await fetchAndParseNewIPs();
                if (newIPList.length > 0) {
                        if (ev) {
                    finalLinks.push(...generateLinksFromNewIPs(newIPList, user, workerDomain, echConfig));
                        }
                        if (et) {
                            finalLinks.push(...await generateTrojanLinksFromNewIPs(newIPList, user, workerDomain, echConfig));
                        }
                }
            } catch (error) {
                if (!currentWorkerRegion) {
                    currentWorkerRegion = await detectWorkerRegion(request);
                }
                
                const bestBackupIP = await getBestBackupIP(currentWorkerRegion);
                if (bestBackupIP) {
                    fallbackAddress = bestBackupIP.domain + ':' + bestBackupIP.port;
                    
                    const backupList = [{ ip: bestBackupIP.domain, isp: 'ProxyIP-' + currentWorkerRegion }];
                        await addNodesFromList(backupList);
                    }
                }
            }
        }

        if (finalLinks.length === 0) {
            const errorRemark = "All nodes failed to load";
            const proto = atob('dmxlc3M=');
            const errorLink = `${proto}://00000000-0000-0000-0000-000000000000@127.0.0.1:80?encryption=none&security=none&type=ws&host=error.com&path=%2F#${encodeURIComponent(errorRemark)}`;
            finalLinks.push(errorLink);
        }

        let subscriptionContent;
        let contentType = 'text/plain; charset=utf-8';
        
        switch (target.toLowerCase()) {
            case atob('Y2xhc2g='):
            case atob('Y2xhc2hy'):
                subscriptionContent = await generateClashConfig(finalLinks, request, user);
                contentType = 'text/yaml; charset=utf-8';
                break;
            case atob('c3VyZ2U='):
            case atob('c3VyZ2Uy'):
            case atob('c3VyZ2Uz'):
            case atob('c3VyZ2U0'):
                subscriptionContent = generateSurgeConfig(finalLinks);
                break;
            case atob('cXVhbnR1bXVsdA=='):
            case atob('cXVhbng='):
            case 'quanx':
                subscriptionContent = generateQuantumultConfig(finalLinks);
                break;
            case atob('c3M='):
            case atob('c3Ny'):
                subscriptionContent = generateSSConfig(finalLinks);
                break;
            case atob('djJyYXk='):
                subscriptionContent = generateV2RayConfig(finalLinks);
                break;
            case atob('bG9vbg=='):
                subscriptionContent = generateLoonConfig(finalLinks);
                break;
            default:
                subscriptionContent = btoa(finalLinks.join('\n'));
        }
        
        const responseHeaders = { 
            'Content-Type': contentType,
            'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        };
        
        // Add ECH status to response headers
        if (enableECH) {
            responseHeaders['X-ECH-Status'] = 'ENABLED';
            if (echConfig) {
                responseHeaders['X-ECH-Config-Length'] = String(echConfig.length);
            }
        }
        
        return new Response(subscriptionContent, {
            headers: responseHeaders,
        });
    }

    function generateLinksFromSource(list, user, workerDomain, echConfig = null) {
        
        const CF_HTTP_PORTS = [80, 8080, 8880, 2052, 2082, 2086, 2095];
        const CF_HTTPS_PORTS = [443, 2053, 2083, 2087, 2096, 8443];
        
        const defaultHttpsPorts = [443];
        const defaultHttpPorts = disableNonTLS ? [] : [80];
        const links = [];
        const wsPath = '/?ed=2048';
        const proto = atob('dmxlc3M=');

        list.forEach(item => {
            let nodeNameBase = item.isp.replace(/\s/g, '_');
            if (item.colo && item.colo.trim()) {
                nodeNameBase = `${nodeNameBase}-${item.colo.trim()}`;
            }
            const safeIP = item.ip.includes(':') ? `[${item.ip}]` : item.ip;
            
            let portsToGenerate = [];
            
            if (item.port) {
                
                const port = item.port;
                
                if (CF_HTTPS_PORTS.includes(port)) {
                    
                    portsToGenerate.push({ port: port, tls: true });
                } else if (CF_HTTP_PORTS.includes(port)) {
                    
                    if (!disableNonTLS) {
                        portsToGenerate.push({ port: port, tls: false });
                    }
                } else {
                    
                    portsToGenerate.push({ port: port, tls: true });
                }
            } else {
                
                defaultHttpsPorts.forEach(port => {
                    portsToGenerate.push({ port: port, tls: true });
                });
                defaultHttpPorts.forEach(port => {
                    portsToGenerate.push({ port: port, tls: false });
                });
            }

            portsToGenerate.forEach(({ port, tls }) => {
                if (tls) {
                    
                    const wsNodeName = `${nodeNameBase}-${port}-WS-TLS`;
                    const wsParams = new URLSearchParams({ 
                        encryption: 'none', 
                        security: 'tls', 
                        sni: workerDomain, 
                        fp: enableECH ? 'chrome' : 'randomized',
                        type: 'ws', 
                        host: workerDomain, 
                        path: wsPath
                    });
                    
                    // If ECH is enabled, append the ech parameter (requires Chrome fingerprint)
                    if (enableECH) {
                        const dnsServer = customDNS || 'https://dns.joeyblog.eu.org/joeyblog';
                        const echDomain = customECHDomain || 'cloudflare-ech.com';
                        wsParams.set('alpn', 'h3,h2,http/1.1');
                        wsParams.set('ech', `${echDomain}+${dnsServer}`);
                    }
                    
                    links.push(`${proto}://${user}@${safeIP}:${port}?${wsParams.toString()}#${encodeURIComponent(wsNodeName)}`);
                } else {
                    
                    const wsNodeName = `${nodeNameBase}-${port}-WS`;
                    const wsParams = new URLSearchParams({
                        encryption: 'none',
                        security: 'none',
                        type: 'ws',
                        host: workerDomain,
                        path: wsPath
                    });
                    links.push(`${proto}://${user}@${safeIP}:${port}?${wsParams.toString()}#${encodeURIComponent(wsNodeName)}`);
                }
            });
        });
        return links;
    }

    async function generateTrojanLinksFromSource(list, user, workerDomain, echConfig = null) {
        
        const CF_HTTP_PORTS = [80, 8080, 8880, 2052, 2082, 2086, 2095];
        const CF_HTTPS_PORTS = [443, 2053, 2083, 2087, 2096, 8443];
        
        const defaultHttpsPorts = [443];
        const defaultHttpPorts = disableNonTLS ? [] : [80];
        const links = [];
        const wsPath = '/?ed=2048';
        
        const password = tp || user;

        list.forEach(item => {
            let nodeNameBase = item.isp.replace(/\s/g, '_');
            if (item.colo && item.colo.trim()) {
                nodeNameBase = `${nodeNameBase}-${item.colo.trim()}`;
            }
            const safeIP = item.ip.includes(':') ? `[${item.ip}]` : item.ip;
            
            let portsToGenerate = [];
            
            if (item.port) {
                const port = item.port;
                
                if (CF_HTTPS_PORTS.includes(port)) {
                    portsToGenerate.push({ port: port, tls: true });
                } else if (CF_HTTP_PORTS.includes(port)) {
                    if (!disableNonTLS) {
                        portsToGenerate.push({ port: port, tls: false });
                    }
                } else {
                    portsToGenerate.push({ port: port, tls: true });
                }
            } else {
                defaultHttpsPorts.forEach(port => {
                    portsToGenerate.push({ port: port, tls: true });
                });
                defaultHttpPorts.forEach(port => {
                    portsToGenerate.push({ port: port, tls: false });
                });
            }

            portsToGenerate.forEach(({ port, tls }) => {
                if (tls) {
                    
                    const wsNodeName = `${nodeNameBase}-${port}-${atob('VHJvamFu')}-WS-TLS`;
                    const wsParams = new URLSearchParams({ 
                        security: 'tls', 
                        sni: workerDomain, 
                        fp: 'chrome',
                        type: 'ws', 
                        host: workerDomain, 
                        path: wsPath
                    });
                    
                    // If ECH is enabled, append the ech parameter (requires Chrome fingerprint)
                    if (enableECH) {
                        const dnsServer = customDNS || 'https://dns.joeyblog.eu.org/joeyblog';
                        const echDomain = customECHDomain || 'cloudflare-ech.com';
                        wsParams.set('alpn', 'h3,h2,http/1.1');
                        wsParams.set('ech', `${echDomain}+${dnsServer}`);
                    }
                    
                    links.push(`${atob('dHJvamFuOi8v')}${password}@${safeIP}:${port}?${wsParams.toString()}#${encodeURIComponent(wsNodeName)}`);
                } else {
                    
                    const wsNodeName = `${nodeNameBase}-${port}-${atob('VHJvamFu')}-WS`;
                    const wsParams = new URLSearchParams({
                        security: 'none',
                        type: 'ws',
                        host: workerDomain,
                        path: wsPath
                    });
                    links.push(`${atob('dHJvamFuOi8v')}${password}@${safeIP}:${port}?${wsParams.toString()}#${encodeURIComponent(wsNodeName)}`);
                }
            });
        });
        return links;
    }

    async function fetchDynamicIPs() {
        const v4Url1 = "https://www.wetest.vip/page/cloudflare/address_v4.html";
        const v6Url1 = "https://www.wetest.vip/page/cloudflare/address_v6.html";
        let results = [];

        // Read filter settings (default: enabled)
        const ipv4Enabled = getConfigValue('ipv4', '') === '' || getConfigValue('ipv4', 'yes') !== 'no';
        const ipv6Enabled = getConfigValue('ipv6', '') === '' || getConfigValue('ipv6', 'yes') !== 'no';
        const ispMobile = getConfigValue('ispMobile', '') === '' || getConfigValue('ispMobile', 'yes') !== 'no';
        const ispUnicom = getConfigValue('ispUnicom', '') === '' || getConfigValue('ispUnicom', 'yes') !== 'no';
        const ispTelecom = getConfigValue('ispTelecom', '') === '' || getConfigValue('ispTelecom', 'yes') !== 'no';

        try {
            const fetchPromises = [];
            if (ipv4Enabled) {
                fetchPromises.push(fetchAndParseWetest(v4Url1));
            } else {
                fetchPromises.push(Promise.resolve([]));
            }
            if (ipv6Enabled) {
                fetchPromises.push(fetchAndParseWetest(v6Url1));
            } else {
                fetchPromises.push(Promise.resolve([]));
            }

            const [ipv4List, ipv6List] = await Promise.all(fetchPromises);
            results = [...ipv4List, ...ipv6List];
            
            // Filter by ISP keywords (best-effort)
            if (results.length > 0) {
                results = results.filter(item => {
                    const isp = item.isp || '';
                    const ispLower = isp.toLowerCase();
                    if ((ispLower.includes('mobile') || ispLower.includes('cmcc')) && !ispMobile) return false;
                    if ((ispLower.includes('unicom') || ispLower.includes('cucc')) && !ispUnicom) return false;
                    if ((ispLower.includes('telecom') || ispLower.includes('ctcc')) && !ispTelecom) return false;
                    return true;
                });
            }
            
            if (results.length > 0) {
                return results;
            }
        } catch (e) {
        }

                return [];
            }

    async function fetchAndParseWetest(url) {
        try {
            const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
            if (!response.ok) {
                return [];
            }
            const html = await response.text();
            const results = [];
            const rowRegex = /<tr[\s\S]*?<\/tr>/g;
            const cellRegex = /<td[^>]*data-label="[^"]*"[^>]*>(.+?)<\/td>[\s\S]*?<td[^>]*data-label="[^"]*"[^>]*>([\d.:a-fA-F]+)<\/td>[\s\S]*?<td[^>]*data-label="[^"]*"[^>]*>(.+?)<\/td>/;

            let match;
            while ((match = rowRegex.exec(html)) !== null) {
                const rowHtml = match[0];
                const cellMatch = rowHtml.match(cellRegex);
                if (cellMatch && cellMatch[1] && cellMatch[2]) {
                    const colo = cellMatch[3] ? cellMatch[3].trim().replace(/<.*?>/g, '') : '';
                    results.push({
                        isp: cellMatch[1].trim().replace(/<.*?>/g, ''),
                        ip: cellMatch[2].trim(),
                        colo: colo
                    });
                }
            }
            
            if (results.length === 0) {
            }

            return results;
        } catch (error) {
            return [];
        }
    }

    async function handleWsRequest(request) {
        // Ensure current Worker region is set (used for proximity matching)
        if (!currentWorkerRegion || currentWorkerRegion === '') {
            if (manualWorkerRegion && manualWorkerRegion.trim()) {
                currentWorkerRegion = manualWorkerRegion.trim().toUpperCase();
            } else {
                currentWorkerRegion = await detectWorkerRegion(request);
            }
        }
        
        const wsPair = new WebSocketPair();
        const [clientSock, serverSock] = Object.values(wsPair);
        serverSock.accept();

        let remoteConnWrapper = { socket: null };
        let isDnsQuery = false;
        let protocolType = null; 

        const earlyData = request.headers.get(atob('c2VjLXdlYnNvY2tldC1wcm90b2NvbA==')) || '';
        const readable = makeReadableStream(serverSock, earlyData);

        readable.pipeTo(new WritableStream({
            async write(chunk) {
                if (isDnsQuery) return await forwardUDP(chunk, serverSock, null);
                if (remoteConnWrapper.socket) {
                    const writer = remoteConnWrapper.socket.writable.getWriter();
                    await writer.write(chunk);
                    writer.releaseLock();
                    return;
                }
                
                if (!protocolType) {
                    
                    if (ev && chunk.byteLength >= 24) {
                        const vlessResult = parseWsPacketHeader(chunk, at);
                        if (!vlessResult.hasError) {
                            protocolType = 'vless';
                            const { addressType, port, hostname, rawIndex, version, isUDP } = vlessResult;
                if (isUDP) {
                    if (port === 53) isDnsQuery = true;
                    else throw new Error(E_UDP_DNS_ONLY);
                }
                const respHeader = new Uint8Array([version[0], 0]);
                const rawData = chunk.slice(rawIndex);
                if (isDnsQuery) return forwardUDP(rawData, serverSock, respHeader);
                await forwardTCP(addressType, hostname, port, rawData, serverSock, respHeader, remoteConnWrapper);
                            return;
                        }
                    }
                    
                    if (et && chunk.byteLength >= 56) {
                        const tjResult = await parseTrojanHeader(chunk, at);
                        if (!tjResult.hasError) {
                            protocolType = atob('dHJvamFu');
                            const { addressType, port, hostname, rawClientData } = tjResult;
                            await forwardTCP(addressType, hostname, port, rawClientData, serverSock, null, remoteConnWrapper);
                            return;
                        }
                    }
                    
                    throw new Error('Invalid protocol or authentication failed');
                }
            },
        })).catch((err) => { });

        return new Response(null, { status: 101, webSocket: clientSock });
    }

    async function forwardTCP(addrType, host, portNum, rawData, ws, respHeader, remoteConnWrapper) {
        async function connectAndSend(address, port, useSocks = false) {
            const remoteSock = useSocks ?
                await establishSocksConnection(addrType, address, port) :
                connect({ hostname: address, port: port });
            const writer = remoteSock.writable.getWriter();
            await writer.write(rawData);
            writer.releaseLock();
            return remoteSock;
        }
        
        async function retryConnection() {
            if (enableSocksDowngrade && isSocksEnabled) {
                try {
                    const socksSocket = await connectAndSend(host, portNum, true);
                    remoteConnWrapper.socket = socksSocket;
                    socksSocket.closed.catch(() => {}).finally(() => closeSocketQuietly(ws));
                    connectStreams(socksSocket, ws, respHeader, null);
                    return;
                } catch (socksErr) {
                    let backupHost, backupPort;
                    if (fallbackAddress && fallbackAddress.trim()) {
                        const parsed = parseAddressAndPort(fallbackAddress);
                        backupHost = parsed.address;
                        backupPort = parsed.port || portNum;
                    } else {
                        const bestBackupIP = await getBestBackupIP(currentWorkerRegion);
                        backupHost = bestBackupIP ? bestBackupIP.domain : host;
                        backupPort = bestBackupIP ? bestBackupIP.port : portNum;
                    }
                    
                    try {
                        const fallbackSocket = await connectAndSend(backupHost, backupPort, false);
                        remoteConnWrapper.socket = fallbackSocket;
                        fallbackSocket.closed.catch(() => {}).finally(() => closeSocketQuietly(ws));
                        connectStreams(fallbackSocket, ws, respHeader, null);
                    } catch (fallbackErr) {
                        closeSocketQuietly(ws);
                    }
                }
            } else {
                let backupHost, backupPort;
                if (fallbackAddress && fallbackAddress.trim()) {
                    const parsed = parseAddressAndPort(fallbackAddress);
                    backupHost = parsed.address;
                    backupPort = parsed.port || portNum;
                } else {
                    const bestBackupIP = await getBestBackupIP(currentWorkerRegion);
                    backupHost = bestBackupIP ? bestBackupIP.domain : host;
                    backupPort = bestBackupIP ? bestBackupIP.port : portNum;
                }
                
                try {
                    const fallbackSocket = await connectAndSend(backupHost, backupPort, isSocksEnabled);
                    remoteConnWrapper.socket = fallbackSocket;
                    fallbackSocket.closed.catch(() => {}).finally(() => closeSocketQuietly(ws));
                    connectStreams(fallbackSocket, ws, respHeader, null);
                } catch (fallbackErr) {
                    closeSocketQuietly(ws);
                }
            }
        }
        
        try {
            const initialSocket = await connectAndSend(host, portNum, enableSocksDowngrade ? false : isSocksEnabled);
            remoteConnWrapper.socket = initialSocket;
            connectStreams(initialSocket, ws, respHeader, retryConnection);
        } catch (err) {
            retryConnection();
        }
    }

    function parseWsPacketHeader(chunk, token) {
        if (chunk.byteLength < 24) return { hasError: true, message: E_INVALID_DATA };
        const version = new Uint8Array(chunk.slice(0, 1));
        if (formatIdentifier(new Uint8Array(chunk.slice(1, 17))) !== token) return { hasError: true, message: E_INVALID_USER };
        const optLen = new Uint8Array(chunk.slice(17, 18))[0];
        const cmd = new Uint8Array(chunk.slice(18 + optLen, 19 + optLen))[0];
        let isUDP = false;
        if (cmd === 1) {} else if (cmd === 2) { isUDP = true; } else { return { hasError: true, message: E_UNSUPPORTED_CMD }; }
        const portIdx = 19 + optLen;
        const port = new DataView(chunk.slice(portIdx, portIdx + 2)).getUint16(0);
        let addrIdx = portIdx + 2, addrLen = 0, addrValIdx = addrIdx + 1, hostname = '';
        const addressType = new Uint8Array(chunk.slice(addrIdx, addrValIdx))[0];
        switch (addressType) {
            case ADDRESS_TYPE_IPV4: addrLen = 4; hostname = new Uint8Array(chunk.slice(addrValIdx, addrValIdx + addrLen)).join('.'); break;
            case ADDRESS_TYPE_URL: addrLen = new Uint8Array(chunk.slice(addrValIdx, addrValIdx + 1))[0]; addrValIdx += 1; hostname = new TextDecoder().decode(chunk.slice(addrValIdx, addrValIdx + addrLen)); break;
            case ADDRESS_TYPE_IPV6: addrLen = 16; const ipv6 = []; const ipv6View = new DataView(chunk.slice(addrValIdx, addrValIdx + addrLen)); for (let i = 0; i < 8; i++) ipv6.push(ipv6View.getUint16(i * 2).toString(16)); hostname = ipv6.join(':'); break;
            default: return { hasError: true, message: `${E_INVALID_ADDR_TYPE}: ${addressType}` };
        }
        if (!hostname) return { hasError: true, message: `${E_EMPTY_ADDR}: ${addressType}` };
        return { hasError: false, addressType, port, hostname, isUDP, rawIndex: addrValIdx + addrLen, version };
    }

    function makeReadableStream(socket, earlyDataHeader) {
        let cancelled = false;
        return new ReadableStream({
            start(controller) {
                socket.addEventListener('message', (event) => { if (!cancelled) controller.enqueue(event.data); });
                socket.addEventListener('close', () => { if (!cancelled) { closeSocketQuietly(socket); controller.close(); } });
                socket.addEventListener('error', (err) => controller.error(err));
                const { earlyData, error } = base64ToArray(earlyDataHeader);
                if (error) controller.error(error); else if (earlyData) controller.enqueue(earlyData);
            },
            cancel() { cancelled = true; closeSocketQuietly(socket); }
        });
    }

    async function connectStreams(remoteSocket, webSocket, headerData, retryFunc) {
        let header = headerData, hasData = false;
        await remoteSocket.readable.pipeTo(
            new WritableStream({
                async write(chunk, controller) {
                    hasData = true;
                    if (webSocket.readyState !== 1) controller.error(E_WS_NOT_OPEN);
                    if (header) { webSocket.send(await new Blob([header, chunk]).arrayBuffer()); header = null; } 
                    else { webSocket.send(chunk); }
                },
                abort(reason) { },
            })
        ).catch((error) => { closeSocketQuietly(webSocket); });
        if (!hasData && retryFunc) retryFunc();
    }

    async function forwardUDP(udpChunk, webSocket, respHeader) {
        try {
            const tcpSocket = connect({ hostname: '8.8.4.4', port: 53 });
            let header = respHeader;
            const writer = tcpSocket.writable.getWriter();
            await writer.write(udpChunk);
            writer.releaseLock();
            await tcpSocket.readable.pipeTo(new WritableStream({
                async write(chunk) {
                    if (webSocket.readyState === 1) {
                        if (header) { webSocket.send(await new Blob([header, chunk]).arrayBuffer()); header = null; } 
                        else { webSocket.send(chunk); }
                    }
                },
            }));
        } catch (error) { }
    }

    async function establishSocksConnection(addrType, address, port) {
        const { username, password, hostname, socksPort } = parsedSocks5Config;
        const socket = connect({ hostname, port: socksPort });
        const writer = socket.writable.getWriter();
        await writer.write(new Uint8Array(username ? [5, 2, 0, 2] : [5, 1, 0]));
        const reader = socket.readable.getReader();
        let res = (await reader.read()).value;
        if (res[0] !== 5 || res[1] === 255) throw new Error(E_SOCKS_NO_METHOD);
        if (res[1] === 2) {
            if (!username || !password) throw new Error(E_SOCKS_AUTH_NEEDED);
            const encoder = new TextEncoder();
            const authRequest = new Uint8Array([1, username.length, ...encoder.encode(username), password.length, ...encoder.encode(password)]);
            await writer.write(authRequest);
            res = (await reader.read()).value;
            if (res[0] !== 1 || res[1] !== 0) throw new Error(E_SOCKS_AUTH_FAIL);
        }
        const encoder = new TextEncoder(); let DSTADDR;
        switch (addrType) {
            case ADDRESS_TYPE_IPV4: DSTADDR = new Uint8Array([1, ...address.split('.').map(Number)]); break;
            case ADDRESS_TYPE_URL: DSTADDR = new Uint8Array([3, address.length, ...encoder.encode(address)]); break;
            case ADDRESS_TYPE_IPV6: DSTADDR = new Uint8Array([4, ...address.split(':').flatMap(x => [parseInt(x.slice(0, 2), 16), parseInt(x.slice(2), 16)])]); break;
            default: throw new Error(E_INVALID_ADDR_TYPE);
        }
        await writer.write(new Uint8Array([5, 1, 0, ...DSTADDR, port >> 8, port & 255]));
        res = (await reader.read()).value;
        if (res[1] !== 0) throw new Error(E_SOCKS_CONN_FAIL);
        writer.releaseLock(); reader.releaseLock();
        return socket;
    }

    function parseSocksConfig(address) {
        let [latter, former] = address.split("@").reverse(); 
        let username, password, hostname, socksPort;
        
        if (former) { 
            const formers = former.split(":"); 
            if (formers.length !== 2) throw new Error(E_INVALID_SOCKS_ADDR);
            [username, password] = formers; 
        }
        
        const latters = latter.split(":"); 
        socksPort = Number(latters.pop()); 
        if (isNaN(socksPort)) throw new Error(E_INVALID_SOCKS_ADDR);
        
        hostname = latters.join(":"); 
        if (hostname.includes(":") && !/^\[.*\]$/.test(hostname)) throw new Error(E_INVALID_SOCKS_ADDR);
        
        return { username, password, hostname, socksPort };
    }

    async function handleSubscriptionPage(request, user = null) {
        if (!user) user = at;
        
        const url = new URL(request.url);
        // Prefer cookie language if present
        const cookieHeader = request.headers.get('Cookie') || '';
        let langFromCookie = null;
        if (cookieHeader) {
            const cookies = cookieHeader.split(';').map(c => c.trim());
            for (const cookie of cookies) {
                if (cookie.startsWith('preferredLanguage=')) {
                    langFromCookie = cookie.split('=')[1];
                    break;
                }
            }
        }
        
        let isFarsi = false;
        
        if (langFromCookie === 'fa' || langFromCookie === 'fa-IR') {
            isFarsi = true;
        } else {
            // If no cookie, use browser language detection
            const acceptLanguage = request.headers.get('Accept-Language') || '';
            const browserLang = acceptLanguage.split(',')[0].split('-')[0].toLowerCase();
            isFarsi = browserLang === 'fa' || acceptLanguage.includes('fa-IR') || acceptLanguage.includes('fa');
        }
            
            const langAttr = isFarsi ? 'fa-IR' : 'en-US';
            
            const translations = {
                en: {
                    title: 'Subscription Center',
                    subtitle: 'Multi-client support • Smart selection • One-click generate',
                    selectClient: '[ Select Client ]',
                    systemStatus: '[ System Status ]',
                    configManagement: '[ Settings ]',
                    relatedLinks: '[ Links ]',
                    checking: 'Checking…',
                    workerRegion: 'Worker region: ',
                    detectionMethod: 'Detection: ',
                    proxyIPStatus: 'ProxyIP: ',
                    currentIP: 'Current IP: ',
                    regionMatch: 'Region matching: ',
                    selectionLogic: 'Selection logic: ',
                    kvStatusChecking: 'Checking KV…',
                    kvEnabled: '✅ KV enabled — settings UI is available',
                    kvDisabled: '⚠️ KV not enabled/configured',
                    specifyRegion: 'Set region (wk):',
                    autoDetect: 'Auto detect',
                    saveRegion: 'Save region',
                    protocolSelection: 'Protocols:',
                    enableVLESS: 'Enable VLESS',
                    enableTrojan: 'Enable Trojan',
                    enableXhttp: 'Enable xhttp',
                    trojanPassword: 'Trojan password (optional):',
                    customPath: 'Custom path (d):',
                    customIP: 'Custom ProxyIP (p):',
                    preferredIPs: 'Preferred list (yx):',
                    preferredIPsURL: 'Preferred source URL (yxURL):',
                    latencyTest: 'Latency test',
                    latencyTestIP: 'Targets:',
                    latencyTestIPPlaceholder: 'Enter IP/domain, comma-separated',
                    latencyTestPort: 'Port:',
                    startTest: 'Start test',
                    stopTest: 'Stop',
                    testResult: 'Results:',
                    addToYx: 'Add to preferred list',
                    addSelectedToYx: 'Add selected to preferred list',
                    selectAll: 'Select all',
                    deselectAll: 'Clear selection',
                    testingInProgress: 'Testing…',
                    testComplete: 'Done',
                    latencyMs: 'Latency',
                    timeout: 'Timeout',
                    ipSource: 'IP source:',
                    manualInput: 'Manual',
                    cfRandomIP: 'CF random IPs',
                    urlFetch: 'Fetch from URL',
                    randomCount: 'Count:',
                    fetchURL: 'URL:',
                    fetchURLPlaceholder: 'Enter a URL that contains IPs/domains',
                    generateIP: 'Generate',
                    fetchIP: 'Fetch',
                    socks5Config: 'SOCKS5 (s):',
                    customHomepage: 'Custom homepage URL (homepage):',
                    customHomepagePlaceholder: 'Example: https://example.com',
                    customHomepageHint: 'When set, visiting `/` will proxy this URL content as a camouflage homepage.',
                    saveConfig: 'Save settings',
                    advancedControl: 'Advanced',
                    subscriptionConverter: 'Subscription converter:',
                    builtinPreferred: 'Built-in preferred sources:',
                    enablePreferredDomain: 'Enable preferred domains',
                    enablePreferredIP: 'Enable preferred IPs',
                    enableGitHubPreferred: 'Enable GitHub preferred list',
                    allowAPIManagement: 'Allow API management (ae):',
                    regionMatching: 'Region matching (rm):',
                    downgradeControl: 'SOCKS downgrade (qj):',
                    tlsControl: 'TLS-only (dkby):',
                    preferredControl: 'Preferred mode (yxby):',
                    saveAdvanced: 'Save advanced',
                    loading: 'Loading…',
                    currentConfig: '📍 Current path config',
                    refreshConfig: 'Refresh',
                    resetConfig: 'Reset',
                    subscriptionCopied: 'Subscription link copied.',
                    autoSubscriptionCopied: 'Auto-detect link copied. When your client fetches it, the server returns the right format based on User‑Agent.',
                    trojanPasswordPlaceholder: 'Leave empty to use UUID',
                    trojanPasswordHint: 'If empty, UUID is used as the password.',
                    protocolHint: 'Tip: enable at least one protocol. Saved settings take effect immediately.',
                    enableECH: 'Enable ECH (Encrypted Client Hello)',
                    enableECHHint: 'When enabled, ECH config is fetched via DoH and appended to links on each refresh.',
                    customDNS: 'Custom DNS (DoH)',
                    customDNSPlaceholder: 'Example: https://dns.example/dns-query',
                    customDNSHint: 'DoH endpoint used to fetch ECH config.',
                    customECHDomain: 'Custom ECH domain',
                    customECHDomainPlaceholder: 'Example: cloudflare-ech.com',
                    customECHDomainHint: 'ECH domain used in generated configs/links.',
                    saveProtocol: 'Save protocol settings',
                    subscriptionConverterPlaceholder: 'Default: https://url.v1.mk/sub',
                    subscriptionConverterHint: 'Converter API used for Clash generation.',
                    builtinPreferredHint: 'Choose which built-in preferred nodes to include.',
                    apiEnabledDefault: 'Default (API disabled)',
                    apiEnabledYes: 'Enable API management',
                    apiEnabledHint: 'Security warning: enabling allows adding/removing preferred targets via API.',
                    regionMatchingDefault: 'Default (enabled)',
                    regionMatchingNo: 'Disable region matching',
                    regionMatchingHint: 'When disabled, smart region ordering is turned off.',
                    downgradeControlDefault: 'Default (off)',
                    downgradeControlNo: 'Enable downgrade mode',
                    downgradeControlHint: 'Direct → SOCKS5 → fallback address.',
                    tlsControlDefault: 'Default (keep all nodes)',
                    tlsControlYes: 'TLS only',
                    tlsControlHint: 'When enabled, non‑TLS nodes (e.g. port 80) are not generated.',
                    preferredControlDefault: 'Default (preferred enabled)',
                    preferredControlYes: 'Disable preferred',
                    preferredControlHint: 'When disabled, only the native address is used.',
                    regionNames: {
                        US: '🇺🇸 United States', SG: '🇸🇬 Singapore', JP: '🇯🇵 Japan',
                        KR: '🇰🇷 South Korea', DE: '🇩🇪 Germany', SE: '🇸🇪 Sweden', NL: '🇳🇱 Netherlands',
                        FI: '🇫🇮 Finland', GB: '🇬🇧 United Kingdom'
                    },
                    terminal: 'Terminal v2.9.3',
                    githubProject: 'GitHub',
                    autoDetectClient: 'Auto-detect',
                selectionLogicText: 'Same region → nearby region → other regions',
                customIPDisabledHint: 'When using a custom ProxyIP, region selection is disabled',
                customIPMode: 'Custom ProxyIP mode (p enabled)',
                customIPModeDesc: 'Custom IP mode (region matching disabled)',
                usingCustomProxyIP: 'Using custom ProxyIP: ',
                customIPConfig: ' (p config)',
                customIPModeDisabled: 'Custom IP mode; region selection disabled',
                manualRegion: 'Manual region',
                manualRegionDesc: ' (manual)',
                proxyIPAvailable: '10/10 available (default ProxyIP domain reachable)',
                smartSelection: 'Smart selection in progress',
                sameRegionIP: 'Same-region target available (1)',
                cloudflareDetection: 'Cloudflare built-in detection',
                detectionFailed: 'Detection failed',
                apiTestResult: 'API detection result: ',
                apiTestTime: 'Time: ',
                apiTestFailed: 'API detection failed: ',
                unknownError: 'Unknown error',
                apiTestError: 'API test failed: ',
                kvNotConfigured: 'KV is not configured. Create a KV namespace and bind it as `C`.',
                kvNotEnabled: 'KV is not enabled.',
                kvCheckFailed: 'KV check failed: invalid response format',
                kvCheckFailedStatus: 'KV check failed - status: ',
                kvCheckFailedError: 'KV check failed - error: '
            },
                fa: {
                    title: 'مرکز اشتراک',
                    subtitle: 'پشتیبانی چند کلاینت • انتخاب هوشمند • تولید یک کلیکی',
                    selectClient: '[ انتخاب کلاینت ]',
                    systemStatus: '[ وضعیت سیستم ]',
                    configManagement: '[ مدیریت تنظیمات ]',
                    relatedLinks: '[ لینک‌های مرتبط ]',
                    checking: 'در حال بررسی...',
                    workerRegion: 'منطقه Worker: ',
                    detectionMethod: 'روش تشخیص: ',
                    proxyIPStatus: 'وضعیت ProxyIP: ',
                    currentIP: 'IP فعلی: ',
                    regionMatch: 'تطبیق منطقه: ',
                    selectionLogic: 'منطق انتخاب: ',
                    kvStatusChecking: 'در حال بررسی وضعیت KV...',
                    kvEnabled: '✅ ذخیره‌سازی KV فعال است، می‌توانید از مدیریت تنظیمات استفاده کنید',
                    kvDisabled: '⚠️ ذخیره‌سازی KV فعال نیست یا پیکربندی نشده است',
                    specifyRegion: 'تعیین منطقه (wk):',
                    autoDetect: 'تشخیص خودکار',
                    saveRegion: 'ذخیره تنظیمات منطقه',
                    protocolSelection: 'انتخاب پروتکل:',
                    enableVLESS: 'فعال‌سازی پروتکل VLESS',
                    enableTrojan: 'فعال‌سازی پروتکل Trojan',
                    enableXhttp: 'فعال‌سازی پروتکل xhttp',
                    enableECH: 'فعال‌سازی ECH (Encrypted Client Hello)',
                    enableECHHint: 'پس از فعال‌سازی، در هر بار تازه‌سازی اشتراک، پیکربندی ECH به‌روز به‌طور خودکار از DoH دریافت شده و به لینک‌ها اضافه می‌شود',
                    customDNS: 'سرور DNS سفارشی',
                    customDNSPlaceholder: 'مثال: https://dns.joeyblog.eu.org/joeyblog',
                    customDNSHint: 'آدرس سرور DNS برای جستجوی پیکربندی ECH (فرمت DoH)',
                    customECHDomain: 'دامنه ECH سفارشی',
                    customECHDomainPlaceholder: 'مثال: cloudflare-ech.com',
                    customECHDomainHint: 'دامنه استفاده شده در پیکربندی ECH، خالی بگذارید تا از مقدار پیش‌فرض استفاده شود',
                    trojanPassword: 'رمز عبور Trojan (اختیاری):',
                    customPath: 'مسیر سفارشی (d):',
                    customIP: 'ProxyIP سفارشی (p):',
                    preferredIPs: 'لیست IP ترجیحی (yx):',
                    preferredIPsURL: 'URL منبع IP ترجیحی (yxURL):',
                    latencyTest: 'تست تاخیر',
                    latencyTestIP: 'IP/دامنه تست:',
                    latencyTestIPPlaceholder: 'IP یا دامنه وارد کنید، چند مورد با کاما جدا شوند',
                    latencyTestPort: 'پورت:',
                    startTest: 'شروع تست',
                    stopTest: 'توقف تست',
                    testResult: 'نتیجه تست:',
                    addToYx: 'افزودن به لیست ترجیحی',
                    addSelectedToYx: 'افزودن موارد انتخاب شده',
                    selectAll: 'انتخاب همه',
                    deselectAll: 'لغو انتخاب',
                    testingInProgress: 'در حال تست...',
                    testComplete: 'تست کامل شد',
                    latencyMs: 'تاخیر',
                    timeout: 'زمان تمام شد',
                    ipSource: 'منبع IP:',
                    manualInput: 'ورودی دستی',
                    cfRandomIP: 'IP تصادفی CF',
                    urlFetch: 'دریافت از URL',
                    randomCount: 'تعداد تولید:',
                    fetchURL: 'URL دریافت:',
                    fetchURLPlaceholder: 'آدرس URL لیست IP را وارد کنید',
                    generateIP: 'تولید IP',
                    fetchIP: 'دریافت IP',
                    socks5Config: 'تنظیمات SOCKS5 (s):',
                    customHomepage: 'URL صفحه اصلی سفارشی (homepage):',
                    customHomepagePlaceholder: 'مثال: https://example.com',
                    customHomepageHint: 'تنظیم URL سفارشی به عنوان استتار صفحه اصلی. هنگام دسترسی به مسیر اصلی / محتوای این URL نمایش داده می‌شود. اگر خالی بگذارید صفحه ترمینال پیش‌فرض نمایش داده می‌شود.',
                    saveConfig: 'ذخیره تنظیمات',
                    advancedControl: 'کنترل پیشرفته',
                    subscriptionConverter: 'آدرس تبدیل اشتراک:',
                    builtinPreferred: 'نوع ترجیحی داخلی:',
                    enablePreferredDomain: 'فعال‌سازی دامنه ترجیحی',
                    enablePreferredIP: 'فعال‌سازی IP ترجیحی',
                    enableGitHubPreferred: 'فعال‌سازی ترجیح پیش‌فرض GitHub',
                    allowAPIManagement: 'اجازه مدیریت API (ae):',
                    regionMatching: 'تطبیق منطقه (rm):',
                    downgradeControl: 'کنترل کاهش سطح (qj):',
                    tlsControl: 'کنترل TLS (dkby):',
                    preferredControl: 'کنترل ترجیحی (yxby):',
                    saveAdvanced: 'ذخیره تنظیمات پیشرفته',
                    loading: 'در حال بارگذاری...',
                    currentConfig: '📍 پیکربندی مسیر فعلی',
                    refreshConfig: 'تازه‌سازی تنظیمات',
                    resetConfig: 'بازنشانی تنظیمات',
                    subscriptionCopied: 'لینک اشتراک کپی شد',
                    autoSubscriptionCopied: 'لینک اشتراک تشخیص خودکار کپی شد، کلاینت هنگام دسترسی بر اساس User-Agent به طور خودکار تشخیص داده و قالب مربوطه را برمی‌گرداند',
                    trojanPasswordPlaceholder: 'خالی بگذارید تا از UUID استفاده شود',
                    trojanPasswordHint: 'رمز عبور Trojan سفارشی را تنظیم کنید. اگر خالی بگذارید از UUID استفاده می‌شود. کلاینت به طور خودکار رمز عبور را با SHA224 هش می‌کند.',
                    protocolHint: 'می‌توانید چندین پروتکل را همزمان فعال کنید. اشتراک گره‌های پروتکل‌های انتخاب شده را تولید می‌کند.<br>• VLESS WS: پروتکل استاندارد مبتنی بر WebSocket<br>• Trojan: احراز هویت با رمز عبور SHA224<br>• xhttp: پروتکل استتار مبتنی بر HTTP POST (نیاز به اتصال دامنه سفارشی و فعال‌سازی gRPC دارد)',
                    saveProtocol: 'ذخیره تنظیمات پروتکل',
                    subscriptionConverterPlaceholder: 'پیش‌فرض: https://url.v1.mk/sub',
                    subscriptionConverterHint: 'آدرس API تبدیل اشتراک سفارشی، اگر خالی بگذارید از آدرس پیش‌فرض استفاده می‌شود',
                    builtinPreferredHint: 'کنترل اینکه کدام گره‌های ترجیحی داخلی در اشتراک گنجانده شوند. به طور پیش‌فرض همه فعال هستند.',
                    apiEnabledDefault: 'پیش‌فرض (بستن API)',
                    apiEnabledYes: 'فعال‌سازی مدیریت API',
                    apiEnabledHint: '⚠️ هشدار امنیتی: فعال‌سازی این گزینه اجازه می‌دهد IP های ترجیحی از طریق API به طور پویا اضافه شوند. توصیه می‌شود فقط در صورت نیاز فعال کنید.',
                    regionMatchingDefault: 'پیش‌فرض (فعال‌سازی تطبیق منطقه)',
                    regionMatchingNo: 'بستن تطبیق منطقه',
                    regionMatchingHint: 'وقتی "بستن" تنظیم شود، تطبیق هوشمند منطقه انجام نمی‌شود',
                    downgradeControlDefault: 'پیش‌فرض (عدم فعال‌سازی کاهش سطح)',
                    downgradeControlNo: 'فعال‌سازی حالت کاهش سطح',
                    downgradeControlHint: 'وقتی "فعال" تنظیم شود: اتصال مستقیم CF ناموفق → اتصال SOCKS5 → آدرس fallback',
                    tlsControlDefault: 'پیش‌فرض (حفظ همه گره‌ها)',
                    tlsControlYes: 'فقط گره‌های TLS',
                    tlsControlHint: 'وقتی "فقط گره‌های TLS" تنظیم شود، فقط گره‌های با TLS تولید می‌شوند، گره‌های غیر TLS (مانند پورت 80) تولید نمی‌شوند',
                    preferredControlDefault: 'پیش‌فرض (فعال‌سازی ترجیح)',
                    preferredControlYes: 'بستن ترجیح',
                    preferredControlHint: 'وقتی "بستن ترجیح" تنظیم شود، فقط از آدرس اصلی استفاده می‌شود، گره‌های IP و دامنه ترجیحی تولید نمی‌شوند',
                    regionNames: {
                        US: '🇺🇸 آمریکا', SG: '🇸🇬 سنگاپور', JP: '🇯🇵 ژاپن',
                        KR: '🇰🇷 کره جنوبی', DE: '🇩🇪 آلمان', SE: '🇸🇪 سوئد', NL: '🇳🇱 هلند',
                        FI: '🇫🇮 فنلاند', GB: '🇬🇧 بریتانیا'
                    },
                    terminal: 'ترمینال v2.9.3',
                    githubProject: 'پروژه GitHub',
                    autoDetectClient: 'تشخیص خودکار',
                selectionLogicText: 'هم‌منطقه → منطقه مجاور → سایر مناطق',
                customIPDisabledHint: 'هنگام استفاده از ProxyIP سفارشی، انتخاب منطقه غیرفعال است',
                customIPMode: 'حالت ProxyIP سفارشی (متغیر p فعال است)',
                customIPModeDesc: 'حالت IP سفارشی (تطبیق منطقه غیرفعال است)',
                usingCustomProxyIP: 'استفاده از ProxyIP سفارشی: ',
                customIPConfig: ' (پیکربندی متغیر p)',
                customIPModeDisabled: 'حالت IP سفارشی، انتخاب منطقه غیرفعال است',
                manualRegion: 'تعیین منطقه دستی',
                manualRegionDesc: ' (تعیین دستی)',
                proxyIPAvailable: '10/10 در دسترس (دامنه پیش‌فرض ProxyIP در دسترس است)',
                smartSelection: 'انتخاب هوشمند نزدیک در حال انجام است',
                sameRegionIP: 'IP هم‌منطقه در دسترس است (1)',
                cloudflareDetection: 'تشخیص داخلی Cloudflare',
                detectionFailed: 'تشخیص ناموفق',
                apiTestResult: 'نتیجه تشخیص API: ',
                apiTestTime: 'زمان تشخیص: ',
                apiTestFailed: 'تشخیص API ناموفق: ',
                unknownError: 'خطای ناشناخته',
                apiTestError: 'تست API ناموفق: ',
                kvNotConfigured: 'ذخیره‌سازی KV پیکربندی نشده است، نمی‌توانید از عملکرد مدیریت تنظیمات استفاده کنید.\\n\\nلطفا در Cloudflare Workers:\\n1. فضای نام KV ایجاد کنید\\n2. متغیر محیطی C را پیوند دهید\\n3. کد را دوباره مستقر کنید',
                kvNotEnabled: 'ذخیره‌سازی KV پیکربندی نشده است',
                kvCheckFailed: 'بررسی ذخیره‌سازی KV ناموفق: خطای فرمت پاسخ',
                kvCheckFailedStatus: 'بررسی ذخیره‌سازی KV ناموفق - کد وضعیت: ',
                kvCheckFailedError: 'بررسی ذخیره‌سازی KV ناموفق - خطا: '
            }
        };

            // Ensure English strings are present
            Object.assign(translations.en, {
                title: 'Subscription Center',
                subtitle: 'Multi-client support • Smart selection • One-click generate',
                selectClient: '[ Select Client ]',
                systemStatus: '[ System Status ]',
                configManagement: '[ Settings ]',
                relatedLinks: '[ Links ]',
                checking: 'Checking…',
                workerRegion: 'Worker region: ',
                detectionMethod: 'Detection: ',
                proxyIPStatus: 'ProxyIP: ',
                currentIP: 'Current IP: ',
                regionMatch: 'Region matching: ',
                selectionLogic: 'Selection logic: ',
                kvStatusChecking: 'Checking KV…',
                kvEnabled: '✅ KV enabled — settings UI is available',
                kvDisabled: '⚠️ KV not enabled/configured',
                specifyRegion: 'Set region (wk):',
                autoDetect: 'Auto detect',
                saveRegion: 'Save region',
                protocolSelection: 'Protocols:',
                enableVLESS: 'Enable VLESS',
                enableTrojan: 'Enable Trojan',
                enableXhttp: 'Enable xhttp',
                enableECH: 'Enable ECH (Encrypted Client Hello)',
                enableECHHint: 'When enabled, ECH config is fetched via DoH and appended to links on each refresh.',
                customDNS: 'Custom DNS (DoH)',
                customDNSPlaceholder: 'Example: https://dns.example/dns-query',
                customDNSHint: 'DoH endpoint used to fetch ECH config.',
                customECHDomain: 'Custom ECH domain',
                customECHDomainPlaceholder: 'Example: cloudflare-ech.com',
                customECHDomainHint: 'ECH domain used in generated configs/links.',
                trojanPassword: 'Trojan password (optional):',
                trojanPasswordPlaceholder: 'Leave empty to use UUID',
                trojanPasswordHint: 'If empty, UUID is used as the password.',
                protocolHint: 'Tip: enable at least one protocol. Saved settings take effect immediately.',
                saveProtocol: 'Save protocol settings',
                customHomepage: 'Custom homepage URL (homepage):',
                customHomepagePlaceholder: 'Example: https://example.com',
                customHomepageHint: 'When set, visiting `/` will proxy this URL content as a camouflage homepage.',
                customPath: 'Custom path (d):',
                customIP: 'Custom ProxyIP (p):',
                preferredIPs: 'Preferred list (yx):',
                preferredIPsURL: 'Preferred source URL (yxURL):',
                latencyTest: 'Latency test',
                latencyTestIP: 'Targets:',
                latencyTestIPPlaceholder: 'Enter IP/domain, comma-separated',
                latencyTestPort: 'Port:',
                startTest: 'Start test',
                stopTest: 'Stop',
                testResult: 'Results:',
                addToYx: 'Add to preferred list',
                addSelectedToYx: 'Add selected to preferred list',
                selectAll: 'Select all',
                deselectAll: 'Clear selection',
                testingInProgress: 'Testing…',
                testComplete: 'Done',
                latencyMs: 'Latency',
                timeout: 'Timeout',
                ipSource: 'IP source:',
                manualInput: 'Manual',
                cfRandomIP: 'CF random IPs',
                urlFetch: 'Fetch from URL',
                randomCount: 'Count:',
                fetchURL: 'URL:',
                fetchURLPlaceholder: 'Enter a URL that contains IPs/domains',
                generateIP: 'Generate',
                fetchIP: 'Fetch',
                socks5Config: 'SOCKS5 (s):',
                saveConfig: 'Save settings',
                advancedControl: 'Advanced',
                subscriptionConverter: 'Subscription converter:',
                subscriptionConverterPlaceholder: 'Default: https://url.v1.mk/sub',
                subscriptionConverterHint: 'Converter API used for Clash generation.',
                builtinPreferred: 'Built-in preferred sources:',
                builtinPreferredHint: 'Choose which built-in preferred nodes to include.',
                enablePreferredDomain: 'Enable preferred domains',
                enablePreferredIP: 'Enable preferred IPs',
                enableGitHubPreferred: 'Enable GitHub preferred list',
                allowAPIManagement: 'Allow API management (ae):',
                apiEnabledDefault: 'Default (API disabled)',
                apiEnabledYes: 'Enable API management',
                apiEnabledHint: 'Security warning: enabling allows adding/removing preferred targets via API.',
                regionMatching: 'Region matching (rm):',
                regionMatchingDefault: 'Default (enabled)',
                regionMatchingNo: 'Disable region matching',
                regionMatchingHint: 'When disabled, smart region ordering is turned off.',
                downgradeControl: 'SOCKS downgrade (qj):',
                downgradeControlDefault: 'Default (off)',
                downgradeControlNo: 'Enable downgrade mode',
                downgradeControlHint: 'Direct → SOCKS5 → fallback address.',
                tlsControl: 'TLS-only (dkby):',
                tlsControlDefault: 'Default (keep all nodes)',
                tlsControlYes: 'TLS only',
                tlsControlHint: 'When enabled, non‑TLS nodes (e.g. port 80) are not generated.',
                preferredControl: 'Preferred mode (yxby):',
                preferredControlDefault: 'Default (preferred enabled)',
                preferredControlYes: 'Disable preferred',
                preferredControlHint: 'When disabled, only the native address is used.',
                regionNames: {
                    US: '🇺🇸 United States', SG: '🇸🇬 Singapore', JP: '🇯🇵 Japan',
                    KR: '🇰🇷 South Korea', DE: '🇩🇪 Germany', SE: '🇸🇪 Sweden', NL: '🇳🇱 Netherlands',
                    FI: '🇫🇮 Finland', GB: '🇬🇧 United Kingdom'
                },
                terminal: 'Terminal v2.9.3',
                githubProject: 'GitHub project',
                autoDetectClient: 'Auto detect',
                selectionLogicText: 'Same region → Nearby → Others',
                customIPDisabledHint: 'When ProxyIP is set, region selection is disabled.',
                customIPMode: 'Custom ProxyIP mode (p is set)',
                customIPModeDesc: 'Custom IP mode (region matching disabled)',
                usingCustomProxyIP: 'Using ProxyIP: ',
                customIPConfig: ' (p variable)',
                customIPModeDisabled: 'Custom IP mode: region selection disabled',
                manualRegion: 'Manual region',
                manualRegionDesc: ' (manual)',
                proxyIPAvailable: '10/10 available (default ProxyIP domain reachable)',
                smartSelection: 'Smart selection in progress',
                sameRegionIP: 'Same-region target available (1)',
                cloudflareDetection: 'Cloudflare built-in detection',
                detectionFailed: 'Detection failed',
                apiTestResult: 'API detection result: ',
                apiTestTime: 'Time: ',
                apiTestFailed: 'API detection failed: ',
                unknownError: 'Unknown error',
                apiTestError: 'API test failed: ',
                kvNotConfigured: 'KV is not configured. Create a KV namespace and bind it as `C`.',
                kvNotEnabled: 'KV is not enabled.',
                kvCheckFailed: 'KV check failed: invalid response format',
                kvCheckFailedStatus: 'KV check failed - status: ',
                kvCheckFailedError: 'KV check failed - error: ',
                currentConfig: '📍 Current path config',
                loading: 'Loading…',
                refreshConfig: 'Refresh',
                resetConfig: 'Reset',
                saveAdvanced: 'Save advanced'
            });
            
            const t = translations[isFarsi ? 'fa' : 'en'];
            const regionLabelFa = {
                US: '🇺🇸 آمریکا',
                CA: '🇨🇦 کانادا',
                MX: '🇲🇽 مکزیک',
                BR: '🇧🇷 برزیل',
                AR: '🇦🇷 آرژانتین',
                CL: '🇨🇱 شیلی',
                GB: '🇬🇧 بریتانیا',
                IE: '🇮🇪 ایرلند',
                DE: '🇩🇪 آلمان',
                FR: '🇫🇷 فرانسه',
                NL: '🇳🇱 هلند',
                BE: '🇧🇪 بلژیک',
                SE: '🇸🇪 سوئد',
                NO: '🇳🇴 نروژ',
                FI: '🇫🇮 فنلاند',
                CH: '🇨🇭 سوئیس',
                IT: '🇮🇹 ایتالیا',
                ES: '🇪🇸 اسپانیا',
                PL: '🇵🇱 لهستان',
                TR: '🇹🇷 ترکیه',
                AE: '🇦🇪 امارات',
                SA: '🇸🇦 عربستان',
                IN: '🇮🇳 هند',
                PK: '🇵🇰 پاکستان',
                BD: '🇧🇩 بنگلادش',
                RU: '🇷🇺 روسیه',
                KZ: '🇰🇿 قزاقستان',
                SG: '🇸🇬 سنگاپور',
                JP: '🇯🇵 ژاپن',
                KR: '🇰🇷 کره جنوبی',
                HK: '🇭🇰 هنگ‌کنگ',
                TW: '🇹🇼 تایوان',
                TH: '🇹🇭 تایلند',
                MY: '🇲🇾 مالزی',
                AU: '🇦🇺 استرالیا',
                NZ: '🇳🇿 نیوزیلند'
            };
            const regionOptionsHtml = REGION_CODES
                .map((code) => {
                    const label = isFarsi ? (regionLabelFa[code] || regionLabelEn[code] || code) : (regionLabelEn[code] || code);
                    return `<option value="${code}">${label}</option>`;
                })
                .join('');
        
        const pageHtml = `<!DOCTYPE html>
        <html lang="${langAttr}" dir="${isFarsi ? 'rtl' : 'ltr'}">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${panelBrand} — ${t.title}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;800&family=Sora:wght@400;600;700&family=Vazirmatn:wght@400;600;700&display=swap" rel="stylesheet">
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
                font-family: "Courier New", monospace;
                background: #000; color: #00ff00; min-height: 100vh;
                overflow-x: hidden; position: relative;
            }
            .matrix-bg {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: #000;
                z-index: -1;
            }
            @keyframes bg-pulse {
                0%, 100% { background: linear-gradient(45deg, #000 0%, #001100 50%, #000 100%); }
                50% { background: linear-gradient(45deg, #000 0%, #002200 50%, #000 100%); }
            }
            .matrix-rain {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: transparent;
                z-index: -1;
                display: none;
            }
            @keyframes matrix-fall {
                0% { transform: translateY(-100%); }
                100% { transform: translateY(100vh); }
            }
            .matrix-code-rain {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                pointer-events: none; z-index: -1;
                overflow: hidden;
                display: none;
            }
            .matrix-column {
                position: absolute; top: -100%; left: 0;
                color: #00ff00; font-family: "Courier New", monospace;
                font-size: 14px; line-height: 1.2;
                text-shadow: 0 0 5px #00ff00;
            }
            @keyframes matrix-drop {
                0% { top: -100%; opacity: 1; }
                10% { opacity: 1; }
                90% { opacity: 0.3; }
                100% { top: 100vh; opacity: 0; }
            }
            .matrix-column:nth-child(odd) {
                animation-duration: 12s;
                animation-delay: -2s;
            }
            .matrix-column:nth-child(even) {
                animation-duration: 18s;
                animation-delay: -5s;
            }
            .matrix-column:nth-child(3n) {
                animation-duration: 20s;
                animation-delay: -8s;
            }
            .container { max-width: 900px; margin: 0 auto; padding: 20px; position: relative; z-index: 1; }
            .header { text-align: center; margin-bottom: 40px; }
            .title {
                font-size: 3.5rem; font-weight: bold;
                text-shadow: 0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00, 0 0 40px #00ff00;
                margin-bottom: 10px;
                position: relative;
                color: #00ff00;
            }
            @keyframes matrix-glow {
                from { text-shadow: 0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00, 0 0 40px #00ff00; }
                to { text-shadow: 0 0 20px #00ff00, 0 0 30px #00ff00, 0 0 40px #00ff00, 0 0 50px #00ff00; }
            }
            @keyframes matrix-pulse {
                0%, 100% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
            }
            .subtitle { color: #00aa00; margin-bottom: 30px; font-size: 1.2rem; }
            .card {
                background: rgba(0, 20, 0, 0.9);
                border: 2px solid #00ff00;
                border-radius: 0; padding: 30px; margin-bottom: 20px;
                box-shadow: 0 0 30px rgba(0, 255, 0, 0.5), inset 0 0 20px rgba(0, 255, 0, 0.1);
                position: relative;
                backdrop-filter: blur(10px);
                box-sizing: border-box;
                width: 100%;
                max-width: 100%;
            }
            @keyframes card-glow {
                0%, 100% { box-shadow: 0 0 30px rgba(0, 255, 0, 0.5), inset 0 0 20px rgba(0, 255, 0, 0.1); }
                50% { box-shadow: 0 0 40px rgba(0, 255, 0, 0.7), inset 0 0 30px rgba(0, 255, 0, 0.2); }
            }
            .card::before {
                content: ""; position: absolute; top: 0; left: 0;
                width: 100%; height: 100%;
                background: none;
                opacity: 0; pointer-events: none;
            }
            @keyframes scan-line {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }
            .card-title {
                font-size: 1.8rem; margin-bottom: 20px;
                color: #00ff00; text-shadow: 0 0 5px #00ff00;
            }
            .client-grid {
                display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
                gap: 15px; margin: 20px 0;
            }
            .client-btn {
                background: rgba(0, 20, 0, 0.8);
                border: 2px solid #00ff00;
                padding: 15px 20px; color: #00ff00;
                font-family: "Courier New", monospace; font-weight: bold;
                cursor: pointer; transition: all 0.4s ease;
                text-align: center; position: relative;
                overflow: hidden;
                text-shadow: 0 0 5px #00ff00;
                box-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
            }
            .client-btn::before {
                content: ""; position: absolute; top: 0; left: -100%;
                width: 100%; height: 100%;
                background: linear-gradient(90deg, transparent, rgba(0,255,0,0.4), transparent);
                transition: left 0.6s ease;
            }
            .client-btn::after {
                content: ""; position: absolute; top: 0; left: 0;
                width: 100%; height: 100%;
                background: linear-gradient(45deg, transparent 30%, rgba(0,255,0,0.1) 50%, transparent 70%);
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            .client-btn:hover::before { left: 100%; }
            .client-btn:hover::after { opacity: 1; }
            .client-btn:hover {
                background: rgba(0, 255, 0, 0.3);
                box-shadow: 0 0 25px #00ff00, 0 0 35px rgba(0, 255, 0, 0.5);
                transform: translateY(-3px) scale(1.05);
                text-shadow: 0 0 10px #00ff00, 0 0 20px #00ff00;
            }
            .generate-btn {
                background: rgba(0, 255, 0, 0.15);
                border: 2px solid #00ff00; padding: 15px 30px;
                color: #00ff00; font-family: "Courier New", monospace;
                font-weight: bold; cursor: pointer;
                transition: all 0.4s ease; margin-right: 15px;
                text-shadow: 0 0 8px #00ff00;
                box-shadow: 0 0 15px rgba(0, 255, 0, 0.4);
                position: relative;
                overflow: hidden;
            }
            .generate-btn::before {
                content: ""; position: absolute; top: 0; left: -100%;
                width: 100%; height: 100%;
                background: linear-gradient(90deg, transparent, rgba(0,255,0,0.5), transparent);
                transition: left 0.8s ease;
            }
            .generate-btn:hover::before { left: 100%; }
            .generate-btn:hover {
                background: rgba(0, 255, 0, 0.4);
                box-shadow: 0 0 30px #00ff00, 0 0 40px rgba(0, 255, 0, 0.6);
                transform: translateY(-4px) scale(1.08);
                text-shadow: 0 0 15px #00ff00, 0 0 25px #00ff00;
            }
            .subscription-url {
                background: rgba(0, 0, 0, 0.9);
                border: 2px solid #00ff00; padding: 15px;
                word-break: break-all; font-family: "Courier New", monospace;
                color: #00ff00; margin-top: 20px; display: none;
                box-shadow: inset 0 0 15px rgba(0, 255, 0, 0.4), 0 0 20px rgba(0, 255, 0, 0.3);
                border-radius: 5px;
                position: relative;
                overflow-wrap: break-word;
                overflow-x: auto;
                max-width: 100%;
                box-sizing: border-box;
            }
            @keyframes url-glow {
                from { box-shadow: inset 0 0 15px rgba(0, 255, 0, 0.4), 0 0 20px rgba(0, 255, 0, 0.3); }
                to { box-shadow: inset 0 0 20px rgba(0, 255, 0, 0.6), 0 0 30px rgba(0, 255, 0, 0.5); }
            }
            .subscription-url::before {
                content: ""; position: absolute; top: 0; left: -100%;
                width: 100%; height: 100%;
                background: none;
            }
            @keyframes url-scan {
                0% { left: -100%; }
                100% { left: 100%; }
            }
            .matrix-text {
                position: fixed; top: 20px; right: 20px;
                color: #00ff00; font-family: "Courier New", monospace;
                font-size: 0.8rem; opacity: 0.6;
            }
            @keyframes matrix-flicker {
                0%, 100% { opacity: 0.6; }
                50% { opacity: 1; }
            }

            /* Modern UI overrides (Dark/Light + subtle animation) */
            :root {
                --bg0: #0b1020;
                --bg1: #0f1733;
                --fg: #e9ecf6;
                --muted: rgba(233, 236, 246, 0.72);
                --card: rgba(255, 255, 255, 0.06);
                --border: rgba(255, 255, 255, 0.14);
                --shadow: 0 24px 60px rgba(0, 0, 0, 0.45);
                --accent: #7c5cff;
                --accent2: #22d3ee;
                --radius: 18px;
            }
            html[data-theme="light"] {
                --bg0: #f6f7fb;
                --bg1: #eef2ff;
                --fg: #0b1020;
                --muted: rgba(11, 16, 32, 0.7);
                --card: rgba(255, 255, 255, 0.75);
                --border: rgba(11, 16, 32, 0.12);
                --shadow: 0 20px 50px rgba(15, 23, 42, 0.12);
            }

            body {
                font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Tahoma, Arial, sans-serif !important;
                background: radial-gradient(1200px 900px at 15% 10%, rgba(124, 92, 255, 0.25), transparent 55%),
                            radial-gradient(1100px 900px at 85% 20%, rgba(34, 211, 238, 0.18), transparent 60%),
                            linear-gradient(180deg, var(--bg0), var(--bg1)) !important;
                color: var(--fg) !important;
            }
            .matrix-bg, .matrix-rain, .matrix-code-rain, .matrix-text { display: none !important; }

            .container { max-width: 1040px !important; padding: 22px 16px !important; }
            .header { margin: 10px 0 26px 0 !important; }
            .title { color: var(--fg) !important; text-shadow: none !important; letter-spacing: -0.02em; }
            .subtitle { color: var(--muted) !important; text-shadow: none !important; }
            .hero-hint { margin-top: 10px; color: var(--muted); max-width: 70ch; margin-left: auto; margin-right: auto; line-height: 1.6; }

            .topbar {
                position: sticky;
                top: 10px;
                z-index: 1000;
                max-width: 1040px;
                margin: 10px auto 0;
                padding: 10px 12px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 12px;
                border-radius: 999px;
                border: 1px solid var(--border);
                background: rgba(0, 0, 0, 0.18);
                backdrop-filter: blur(14px);
                box-shadow: var(--shadow);
            }
            html[data-theme="light"] .topbar { background: rgba(255, 255, 255, 0.55); }
            .topbar .group { display: flex; align-items: center; gap: 10px; }
            .badge {
                padding: 8px 12px;
                border-radius: 999px;
                border: 1px solid var(--border);
                background: rgba(255, 255, 255, 0.08);
                color: var(--muted);
                font-size: 0.9rem;
                white-space: nowrap;
            }
            .icon-btn {
                width: 40px; height: 40px;
                border-radius: 999px;
                border: 1px solid var(--border);
                background: rgba(255, 255, 255, 0.08);
                color: var(--fg);
                cursor: pointer;
                transition: transform 150ms ease, border-color 150ms ease, background 150ms ease;
            }
            .icon-btn:hover { transform: translateY(-1px); border-color: rgba(124, 92, 255, 0.45); }
            .select {
                border-radius: 999px !important;
                border: 1px solid var(--border) !important;
                background: rgba(255, 255, 255, 0.08) !important;
                color: var(--fg) !important;
                padding: 10px 12px !important;
                cursor: pointer;
            }

            .card {
                background: var(--card) !important;
                border: 1px solid var(--border) !important;
                border-radius: var(--radius) !important;
                box-shadow: var(--shadow) !important;
            }
            .card-title { color: var(--fg) !important; text-shadow: none !important; margin-bottom: 10px !important; }
            .card-help { margin: 0 0 16px 0; color: var(--muted) !important; line-height: 1.6; }
            .card label { color: var(--fg) !important; text-shadow: none !important; }
            .card small { color: var(--muted) !important; }

            input, select, textarea, button { font-family: inherit !important; }
            input, select, textarea {
                border-radius: 12px !important;
                border: 1px solid var(--border) !important;
                background: rgba(255, 255, 255, 0.08) !important;
                color: var(--fg) !important;
                outline: none;
            }
            input:focus, select:focus, textarea:focus { box-shadow: 0 0 0 4px rgba(124, 92, 255, 0.22) !important; border-color: rgba(124, 92, 255, 0.45) !important; }
            input::placeholder, textarea::placeholder { color: rgba(233, 236, 246, 0.55) !important; }
            html[data-theme="light"] input::placeholder, html[data-theme="light"] textarea::placeholder { color: rgba(11, 16, 32, 0.45) !important; }

            .client-btn, .generate-btn {
                border-radius: 14px !important;
                border: 1px solid var(--border) !important;
                background: linear-gradient(180deg, rgba(255, 255, 255, 0.10), rgba(255, 255, 255, 0.06)) !important;
                color: var(--fg) !important;
                text-shadow: none !important;
                box-shadow: none !important;
            }
            .client-btn:hover, .generate-btn:hover {
                transform: translateY(-2px) scale(1.01) !important;
                border-color: rgba(124, 92, 255, 0.55) !important;
                box-shadow: 0 18px 45px rgba(0, 0, 0, 0.25) !important;
            }
            .client-btn::before, .client-btn::after, .generate-btn::before, .generate-btn::after { display: none !important; }

            .subscription-url {
                display: none;
                margin-top: 14px;
                padding: 14px;
                background: rgba(0, 0, 0, 0.18);
                border: 1px solid var(--border);
                border-radius: 14px;
                color: var(--fg);
            }
            html[data-theme="light"] .subscription-url { background: rgba(255, 255, 255, 0.55); }

            .wizard-steps { display: flex; gap: 10px; flex-wrap: wrap; }
            .step-btn {
                height: 42px;
                padding: 0 14px;
                border-radius: 999px;
                border: 1px solid var(--border);
                background: rgba(255, 255, 255, 0.08);
                color: var(--fg);
                cursor: pointer;
                font-weight: 700;
                transition: transform 150ms ease, border-color 150ms ease, background 150ms ease;
            }
            .step-btn:hover { transform: translateY(-1px); border-color: rgba(124, 92, 255, 0.55); }
            .step-btn[aria-current="true"] {
                border-color: rgba(124, 92, 255, 0.7);
                background: linear-gradient(180deg, rgba(124, 92, 255, 0.30), rgba(34, 211, 238, 0.12));
            }
            .wizard-hidden { display: none !important; }

            @media (prefers-reduced-motion: reduce) {
                * { animation: none !important; transition: none !important; }
            }

            /* Neo redesign */
            :root {
                --neo-bg-0: #04070f;
                --neo-bg-1: #09162b;
                --neo-bg-2: #0e2b45;
                --neo-fg: #eaf2ff;
                --neo-muted: #9eb4cd;
                --neo-card: rgba(8, 16, 30, 0.72);
                --neo-border: rgba(130, 190, 255, 0.24);
                --neo-primary: #00d4ff;
                --neo-secondary: #5bff8a;
                --neo-hot: #ff7f50;
                --neo-shadow: 0 22px 55px rgba(0, 0, 0, 0.45);
            }
            html[data-theme="light"] {
                --neo-bg-0: #f0f6ff;
                --neo-bg-1: #dff0ff;
                --neo-bg-2: #c9e7ff;
                --neo-fg: #082036;
                --neo-muted: #33536f;
                --neo-card: rgba(255, 255, 255, 0.76);
                --neo-border: rgba(11, 71, 112, 0.2);
                --neo-shadow: 0 20px 50px rgba(14, 28, 43, 0.16);
            }

            body {
                font-family: ${isFarsi ? "'Vazirmatn', 'Sora', sans-serif" : "'Sora', 'Vazirmatn', sans-serif"} !important;
                background:
                    radial-gradient(1200px 900px at 6% 8%, rgba(0, 212, 255, 0.2), transparent 52%),
                    radial-gradient(900px 700px at 90% 12%, rgba(91, 255, 138, 0.15), transparent 48%),
                    linear-gradient(160deg, var(--neo-bg-0) 0%, var(--neo-bg-1) 52%, var(--neo-bg-2) 100%) !important;
                color: var(--neo-fg) !important;
                letter-spacing: 0.01em;
            }
            body::before {
                content: "";
                position: fixed;
                inset: -30% -20%;
                background: conic-gradient(from 210deg, rgba(0, 212, 255, 0.08), transparent, rgba(91, 255, 138, 0.08), transparent);
                filter: blur(30px);
                pointer-events: none;
                z-index: 0;
                animation: neo-spin 18s linear infinite;
            }
            @keyframes neo-spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }

            .topbar {
                background: linear-gradient(120deg, rgba(8, 20, 37, 0.76), rgba(16, 40, 66, 0.6)) !important;
                border: 1px solid var(--neo-border) !important;
            }
            html[data-theme="light"] .topbar {
                background: linear-gradient(120deg, rgba(255, 255, 255, 0.8), rgba(232, 247, 255, 0.86)) !important;
            }
            .badge {
                color: var(--neo-fg) !important;
                border-color: var(--neo-border) !important;
                background: rgba(255, 255, 255, 0.05) !important;
            }
            .icon-btn, .select {
                border-color: var(--neo-border) !important;
                color: var(--neo-fg) !important;
                background: rgba(255, 255, 255, 0.06) !important;
            }

            .container {
                max-width: 1280px !important;
                display: grid !important;
                grid-template-columns: repeat(12, minmax(0, 1fr));
                gap: 18px;
                position: relative;
                z-index: 1;
                padding-top: 18px !important;
                padding-bottom: 36px !important;
            }
            .header, #card-wizard, #configCard, #card-links { grid-column: 1 / -1; }
            #card-client { grid-column: 1 / span 7; }
            #card-status { grid-column: 8 / -1; }
            @media (max-width: 1100px) {
                .container { grid-template-columns: 1fr; }
                .header, #card-wizard, #card-client, #card-status, #configCard, #card-links { grid-column: 1 / -1; }
            }

            .header {
                text-align: center !important;
                border-radius: 28px;
                padding: 24px 24px 6px;
                background: linear-gradient(130deg, rgba(7, 23, 41, 0.56), rgba(16, 34, 56, 0.36));
                border: 1px solid var(--neo-border);
                box-shadow: var(--neo-shadow);
            }
            html[data-theme="light"] .header {
                background: linear-gradient(130deg, rgba(255, 255, 255, 0.72), rgba(228, 244, 255, 0.76));
            }
            .title {
                font-family: "Orbitron", "Sora", sans-serif !important;
                font-size: clamp(2.2rem, 4.4vw, 4.1rem) !important;
                color: var(--neo-fg) !important;
                text-shadow: 0 0 32px rgba(0, 212, 255, 0.26) !important;
                letter-spacing: 0.04em;
                margin-bottom: 12px !important;
            }
            .subtitle {
                color: var(--neo-primary) !important;
                min-height: 1.7em;
                font-weight: 700;
            }
            .subtitle.typing::after {
                content: "▋";
                color: var(--neo-secondary);
                margin-inline-start: 4px;
                animation: blink-caret 0.9s steps(1, end) infinite;
            }
            @keyframes blink-caret { 50% { opacity: 0; } }
            .hero-hint {
                color: var(--neo-muted) !important;
                max-width: 900px !important;
                font-size: 1.02rem;
            }

            .card {
                background: var(--neo-card) !important;
                border: 1px solid var(--neo-border) !important;
                border-radius: 22px !important;
                box-shadow: var(--neo-shadow) !important;
                position: relative;
                overflow: hidden;
                isolation: isolate;
                transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease !important;
            }
            .card::after {
                content: "";
                position: absolute;
                inset: 0;
                background: linear-gradient(120deg, rgba(0, 212, 255, 0.12), transparent 38%, rgba(91, 255, 138, 0.12));
                opacity: 0.24;
                pointer-events: none;
                z-index: -1;
            }
            .card:hover {
                border-color: rgba(0, 212, 255, 0.4) !important;
                box-shadow: 0 28px 65px rgba(0, 0, 0, 0.5) !important;
                transform: translateY(-2px);
            }
            .card-title {
                font-family: "Orbitron", "Sora", sans-serif !important;
                letter-spacing: 0.03em;
                color: var(--neo-fg) !important;
            }
            .card-help { color: var(--neo-muted) !important; }

            .wizard-steps {
                display: grid !important;
                grid-template-columns: repeat(4, minmax(0, 1fr));
                gap: 10px !important;
            }
            @media (max-width: 760px) {
                .wizard-steps { grid-template-columns: repeat(2, minmax(0, 1fr)); }
            }
            .step-btn {
                height: 46px !important;
                border-radius: 999px !important;
                border: 1px solid var(--neo-border) !important;
                color: var(--neo-fg) !important;
                background: linear-gradient(135deg, rgba(0, 212, 255, 0.24), rgba(91, 255, 138, 0.18)) !important;
                font-weight: 700 !important;
            }
            .step-btn:hover { transform: translateY(-1px) scale(1.01) !important; }
            .step-btn[aria-current="true"] {
                border-color: rgba(255, 127, 80, 0.65) !important;
                box-shadow: 0 0 0 3px rgba(255, 127, 80, 0.2) !important;
            }
            .wizard-hidden { display: block !important; }

            .client-grid {
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)) !important;
                gap: 12px !important;
            }
            .client-btn,
            .generate-btn,
            #saveProtocolBtn,
            #overwriteSelectedToYx,
            #appendSelectedToYx,
            #configCard button {
                border-radius: 14px !important;
                border: 1px solid rgba(0, 212, 255, 0.42) !important;
                color: #ecfbff !important;
                background: linear-gradient(135deg, rgba(0, 212, 255, 0.48), rgba(8, 99, 191, 0.55), rgba(91, 255, 138, 0.34)) !important;
                box-shadow: 0 10px 26px rgba(0, 0, 0, 0.28) !important;
                font-weight: 700 !important;
                transition: transform 180ms ease, filter 180ms ease, box-shadow 180ms ease !important;
            }
            .client-btn:hover,
            .generate-btn:hover,
            #saveProtocolBtn:hover,
            #overwriteSelectedToYx:hover,
            #appendSelectedToYx:hover,
            #configCard button:hover {
                transform: translateY(-2px) !important;
                filter: saturate(1.12) brightness(1.07);
                box-shadow: 0 18px 34px rgba(0, 0, 0, 0.34) !important;
            }

            input, select, textarea {
                border-radius: 12px !important;
                border: 1px solid var(--neo-border) !important;
                color: var(--neo-fg) !important;
                background: rgba(7, 19, 33, 0.6) !important;
            }
            html[data-theme="light"] input,
            html[data-theme="light"] select,
            html[data-theme="light"] textarea {
                background: rgba(255, 255, 255, 0.75) !important;
            }

            #systemStatus,
            #kvStatus,
            #currentConfig,
            #pathTypeInfo,
            #statusMessage {
                background: linear-gradient(140deg, rgba(8, 22, 40, 0.8), rgba(18, 46, 70, 0.54)) !important;
                border: 1px solid rgba(0, 212, 255, 0.3) !important;
                border-radius: 14px !important;
                color: var(--neo-fg) !important;
                box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 12px 24px rgba(0, 0, 0, 0.22) !important;
            }
            html[data-theme="light"] #systemStatus,
            html[data-theme="light"] #kvStatus,
            html[data-theme="light"] #currentConfig,
            html[data-theme="light"] #pathTypeInfo,
            html[data-theme="light"] #statusMessage {
                background: linear-gradient(140deg, rgba(255, 255, 255, 0.78), rgba(226, 243, 255, 0.8)) !important;
            }

            .social-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                gap: 12px;
                margin: 18px 0;
            }
            .social-link {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px 14px;
                border: 1px solid var(--neo-border);
                border-radius: 14px;
                text-decoration: none !important;
                color: var(--neo-fg) !important;
                background: rgba(255, 255, 255, 0.06);
                transition: transform 180ms ease, border-color 180ms ease, background 180ms ease;
            }
            .social-link:hover {
                transform: translateY(-2px);
                border-color: rgba(0, 212, 255, 0.5);
                background: rgba(255, 255, 255, 0.11);
            }
            .social-icon {
                width: 38px;
                height: 38px;
                border-radius: 11px;
                display: grid;
                place-items: center;
                flex: 0 0 38px;
                color: #fff;
            }
            .social-link-telegram .social-icon {
                background: linear-gradient(145deg, #33b6ff, #0a84ff);
            }
            .social-link-x .social-icon {
                background: linear-gradient(145deg, #111, #000);
            }
            .social-icon svg {
                width: 22px;
                height: 22px;
                fill: currentColor;
            }
            .social-text {
                display: flex;
                flex-direction: column;
                line-height: 1.25;
            }
            .social-text small { color: var(--neo-muted) !important; }
            .utility-links {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                justify-content: center;
                margin-top: 10px;
            }
            .utility-links a {
                border: 1px solid var(--neo-border);
                border-radius: 999px;
                padding: 8px 12px;
                text-decoration: none !important;
                color: var(--neo-fg) !important;
                background: rgba(255, 255, 255, 0.05);
            }

            #pageLoader {
                position: fixed;
                inset: 0;
                background: radial-gradient(circle at 20% 20%, rgba(0, 212, 255, 0.2), transparent 45%), #02050d;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 3000;
                opacity: 1;
                transition: opacity 500ms ease, visibility 500ms ease;
            }
            #pageLoader.is-hidden {
                opacity: 0;
                visibility: hidden;
                pointer-events: none;
            }
            .loader-core {
                width: min(360px, 82vw);
                aspect-ratio: 1 / 1;
                border-radius: 50%;
                display: grid;
                place-items: center;
                position: relative;
            }
            .loader-ring {
                position: absolute;
                inset: 10%;
                border-radius: 50%;
                border: 2px solid transparent;
                border-top-color: var(--neo-primary);
                border-right-color: rgba(91, 255, 138, 0.8);
                animation: loader-spin 1.2s linear infinite;
            }
            .loader-ring.ring-b {
                inset: 20%;
                border-top-color: rgba(255, 127, 80, 0.9);
                border-right-color: rgba(0, 212, 255, 0.8);
                animation-duration: 1.8s;
                animation-direction: reverse;
            }
            .loader-ring.ring-c {
                inset: 30%;
                border-top-color: rgba(91, 255, 138, 0.95);
                border-right-color: rgba(255, 127, 80, 0.85);
                animation-duration: 2.2s;
            }
            @keyframes loader-spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            .loader-brand {
                font-family: "Orbitron", "Sora", sans-serif;
                font-size: 1.35rem;
                font-weight: 700;
                color: #e8f8ff;
                text-shadow: 0 0 22px rgba(0, 212, 255, 0.45);
                margin-top: -6px;
            }
            .loader-text {
                position: absolute;
                bottom: 18%;
                color: #9dd7ff;
                font-size: 0.95rem;
                letter-spacing: 0.04em;
            }

            .card {
                opacity: 0;
                transform: translateY(10px);
                transition: transform 440ms ease, opacity 440ms ease;
                transition-delay: var(--reveal-delay, 0ms);
            }
            body.loaded .card {
                opacity: 1;
                transform: translateY(0);
            }

            :root {
                --bg: #060c16;
                --bg-soft: #0c1627;
                --panel: rgba(14, 27, 46, 0.78);
                --panel-2: rgba(22, 40, 68, 0.72);
                --text: #e7efff;
                --muted: #b5c4e1;
                --border: rgba(118, 170, 255, 0.3);
                --glow: 0 22px 48px rgba(8, 20, 41, 0.45);
            }
            :root[data-theme='light'] {
                --bg: #f3f8ff;
                --bg-soft: #eaf1fb;
                --panel: rgba(255, 255, 255, 0.9);
                --panel-2: rgba(244, 249, 255, 0.95);
                --text: #13233e;
                --muted: #38537d;
                --border: rgba(37, 86, 163, 0.2);
                --glow: 0 18px 36px rgba(43, 85, 145, 0.14);
            }
            body {
                font-family: ${isFarsi ? "'Vazirmatn','Sora',sans-serif" : "'Sora','Vazirmatn',sans-serif"} !important;
                color: var(--text) !important;
                background:
                    radial-gradient(1000px 700px at 12% -10%, rgba(0, 180, 255, 0.2), transparent 65%),
                    radial-gradient(900px 600px at 85% 10%, rgba(255, 111, 145, 0.16), transparent 60%),
                    linear-gradient(155deg, var(--bg), var(--bg-soft)) !important;
            }
            .matrix-bg,
            .matrix-rain,
            .matrix-code-rain {
                display: none !important;
            }
            .topbar,
            .card,
            .subscription-url,
            #kvStatus,
            #currentConfig,
            #pathTypeInfo,
            #statusMessage,
            #systemStatus {
                border: 1px solid var(--border) !important;
                background: var(--panel) !important;
                color: var(--text) !important;
                box-shadow: var(--glow) !important;
                text-shadow: none !important;
                border-radius: 18px !important;
                backdrop-filter: blur(10px);
            }
            .header { margin-bottom: 24px !important; }
            .title {
                text-shadow: 0 10px 36px rgba(0, 180, 255, 0.22) !important;
                color: var(--text) !important;
                font-size: clamp(2rem, 5vw, 3.2rem) !important;
                letter-spacing: 0.02em;
            }
            .subtitle,
            .hero-hint,
            .card-help {
                color: var(--muted) !important;
                text-shadow: none !important;
            }
            .card-title { color: var(--text) !important; text-shadow: none !important; }
            .client-grid { gap: 10px !important; }
            .client-btn,
            button[type='submit'],
            button[type='button'],
            .utility-links a {
                border-radius: 14px !important;
                border: 1px solid var(--border) !important;
                background: linear-gradient(120deg, rgba(0, 180, 255, 0.16), rgba(255, 111, 145, 0.14)) !important;
                color: var(--text) !important;
                text-shadow: none !important;
                transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease !important;
            }
            .client-btn:hover,
            button[type='submit']:hover,
            button[type='button']:hover,
            .utility-links a:hover {
                transform: translateY(-2px);
                border-color: rgba(255, 179, 71, 0.66) !important;
                box-shadow: 0 14px 24px rgba(0, 180, 255, 0.2);
            }
            select,
            input[type='text'],
            input[type='number'],
            textarea {
                background: var(--panel-2) !important;
                color: var(--text) !important;
                border: 1px solid var(--border) !important;
                border-radius: 12px !important;
                text-shadow: none !important;
            }
            small,
            label,
            #systemStatus [id],
            #currentConfig {
                color: var(--muted) !important;
                text-shadow: none !important;
            }
            .card [style*="#00ff00"],
            .card [style*="#00aa00"],
            .card [style*="0, 255, 0"],
            .card [style*="0, 170, 0"] {
                color: var(--muted) !important;
                border-color: var(--border) !important;
                text-shadow: none !important;
                box-shadow: none !important;
            }
            .card [style*="0, 20, 0"],
            .card [style*="0, 40, 0"] {
                background: var(--panel-2) !important;
            }
            .social-link {
                border-radius: 16px !important;
                border: 1px solid var(--border) !important;
                background: linear-gradient(130deg, rgba(0, 180, 255, 0.12), rgba(255, 179, 71, 0.12)) !important;
            }
            .social-text strong, .social-text small { color: var(--text) !important; }
            .social-icon { color: var(--text) !important; }
            .social-link-x {
                background: linear-gradient(130deg, rgba(255, 111, 145, 0.16), rgba(0, 180, 255, 0.14)) !important;
            }
            .wizard-steps .step-btn[aria-current='true'] {
                border-color: rgba(255, 179, 71, 0.78) !important;
                box-shadow: 0 12px 26px rgba(255, 179, 71, 0.2);
                transform: translateY(-2px);
            }
            label > input[type='checkbox'] {
                position: absolute !important;
                opacity: 0 !important;
                width: 0 !important;
                height: 0 !important;
            }
            label > input[type='checkbox'] + span {
                display: inline-flex !important;
                align-items: center;
                justify-content: center;
                min-height: 38px;
                padding: 8px 12px;
                border: 1px solid var(--border);
                border-radius: 12px;
                background: rgba(255, 255, 255, 0.03);
                color: var(--muted) !important;
                transition: all .24s ease;
            }
            label > input[type='checkbox']:checked + span {
                border-color: rgba(255, 179, 71, 0.7);
                background: linear-gradient(120deg, rgba(0, 180, 255, 0.18), rgba(255, 111, 145, 0.17));
                color: var(--text) !important;
                box-shadow: 0 10px 20px rgba(0, 180, 255, 0.16);
            }
            .op-card-grid {
                display: grid;
                grid-template-columns: repeat(3, minmax(0, 1fr));
                gap: 10px;
                margin-bottom: 14px;
            }
            .op-card-btn {
                border: 1px solid var(--border);
                border-radius: 14px;
                background: rgba(255, 255, 255, 0.02);
                color: var(--muted);
                padding: 12px 10px;
                cursor: pointer;
                transition: all .25s ease;
            }
            .op-card-btn.active {
                color: var(--text);
                border-color: rgba(255, 179, 71, 0.76);
                background: linear-gradient(120deg, rgba(0, 180, 255, 0.2), rgba(255, 111, 145, 0.2));
                box-shadow: 0 12px 22px rgba(11, 89, 166, 0.22);
            }
            #toastWrap {
                position: fixed;
                z-index: 9999;
                inset-inline-end: 18px;
                bottom: 18px;
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            .toast-item {
                min-width: 240px;
                max-width: min(88vw, 430px);
                padding: 11px 12px;
                border-radius: 12px;
                border: 1px solid var(--border);
                background: var(--panel);
                color: var(--text);
                box-shadow: var(--glow);
                animation: toast-in .28s ease;
            }
            .toast-item.success { border-color: rgba(111, 231, 178, 0.7); }
            .toast-item.error { border-color: rgba(255, 138, 128, 0.7); }
            @keyframes toast-in {
                from { opacity: 0; transform: translateY(10px) scale(0.97); }
                to { opacity: 1; transform: translateY(0) scale(1); }
            }
            .section-head {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 10px;
            }
            .help-btn {
                border: 1px solid var(--border);
                color: var(--muted);
                background: rgba(255, 255, 255, 0.02);
                border-radius: 999px;
                padding: 5px 11px;
                font-size: 12px;
                cursor: pointer;
            }
            .help-modal {
                position: fixed;
                inset: 0;
                background: rgba(4, 9, 17, 0.6);
                display: none;
                align-items: center;
                justify-content: center;
                z-index: 9500;
                padding: 18px;
            }
            .help-modal.is-open { display: flex; }
            .help-panel {
                width: min(760px, 95vw);
                max-height: 86vh;
                overflow-y: auto;
                border-radius: 16px;
                border: 1px solid var(--border);
                background: var(--panel);
                box-shadow: var(--glow);
                padding: 18px;
            }
            .help-panel h3 { margin-bottom: 8px; }
            .help-panel p { color: var(--muted); line-height: 1.8; }
            .logs-wrap {
                margin-top: 14px;
                border-radius: 14px;
                border: 1px solid var(--border);
                background: var(--panel-2);
                overflow: hidden;
            }
            .log-row {
                display: grid;
                grid-template-columns: 170px 120px 1fr;
                gap: 10px;
                padding: 10px 12px;
                border-top: 1px solid var(--border);
                font-size: 13px;
            }
            .log-row:first-child { border-top: 0; }
            .log-row span:last-child { color: var(--muted); }
            .log-type { font-weight: 700; color: var(--text); }
            body.await-scroll .container > .header,
            body.await-scroll .container > .card {
                opacity: 0 !important;
                transform: translateY(20px);
            }
            body.await-scroll.scrolled .container > .header {
                opacity: 1 !important;
                transform: translateY(0);
                transition: opacity .55s ease, transform .55s ease;
            }
            body.await-scroll.scrolled .container > .card {
                opacity: 0 !important;
                transform: translateY(20px);
            }
            body.await-scroll.scrolled .container > .card.is-visible {
                opacity: 1 !important;
                transform: translateY(0);
                transition: opacity .55s ease, transform .55s ease;
            }
            @media (max-width: 920px) {
                .op-card-grid { grid-template-columns: 1fr; }
                .log-row { grid-template-columns: 1fr; gap: 4px; }
            }
        </style>
    </head>
    <body>
        <div id="pageLoader">
            <div class="loader-core">
                <span class="loader-ring ring-a"></span>
                <span class="loader-ring ring-b"></span>
                <span class="loader-ring ring-c"></span>
                <div class="loader-brand">${panelBrand}</div>
                <div class="loader-text">${isFarsi ? 'در حال آماده‌سازی پنل...' : 'Booting control panel...'}</div>
            </div>
        </div>
        <div class="matrix-bg"></div>
        <div class="matrix-rain"></div>
        <div class="matrix-code-rain" id="matrixCodeRain"></div>
        <div class="topbar">
            <div class="group">
                <div class="badge">v2.9.3</div>
            </div>
            <div class="group">
                <button type="button" id="themeToggle" class="icon-btn" aria-label="${isFarsi ? 'تغییر تم' : 'Toggle theme'}"></button>
                <select id="languageSelector" class="select" onchange="changeLanguage(this.value)">
                    <option value="en" ${!isFarsi ? 'selected' : ''}>🇺🇸 English</option>
                    <option value="fa" ${isFarsi ? 'selected' : ''}>🇮🇷 فارسی</option>
                </select>
            </div>
        </div>
        <div class="container">
            <div class="header">
                    <h1 class="title">${panelBrand}</h1>
                    <p class="subtitle">${t.title} • ${t.subtitle}</p>
                    <p class="hero-hint">${isFarsi ? 'کنسول هوشمند تولید اشتراک: انتخاب کلاینت، تنظیمات لحظه‌ای KV، و مدیریت مسیرها در یک نمای یکپارچه و سریع.' : 'Smart subscription command center: client targeting, live KV settings, and route management in one streamlined interface.'}</p>
            </div>
            <div class="card" id="card-wizard">
                    <h2 class="card-title">${isFarsi ? 'شروع سریع' : 'Quick Start'}</h2>
                    <p class="card-help">${isFarsi ? 'قدم ۱: سرور را تنظیم/بررسی کنید. قدم ۲: کلاینت را انتخاب کنید و لینک اشتراک بگیرید.' : 'Step 1: configure/check your server. Step 2: pick your client and get the subscription link.'}</p>
                    <div class="wizard-steps">
                        <button type="button" class="step-btn" data-step="server">${isFarsi ? '۱) سرور' : '1) Server'}</button>
                        <button type="button" class="step-btn" data-step="client">${isFarsi ? '۲) کلاینت' : '2) Client'}</button>
                        <button type="button" class="step-btn" data-step="advanced">${isFarsi ? '۳) پیشرفته' : '3) Advanced'}</button>
                        <button type="button" class="step-btn" data-step="links">${isFarsi ? '۴) لینک‌ها' : '4) Links'}</button>
                    </div>
            </div>
            <div class="card" id="card-client">
                    <h2 class="card-title">${t.selectClient}</h2>
                    <p class="card-help">${isFarsi ? 'کلاینت خود را انتخاب کنید تا لینک اشتراک مناسب ساخته و کپی شود. گزینهٔ «تشخیص خودکار» یک لینک عمومی کپی می‌کند و کلاینت بر اساس User-Agent قالب مناسب را می‌گیرد.' : 'Pick your client to generate and copy a ready-to-import subscription link. “Auto detect” copies a universal link and the server returns the right format based on User‑Agent.'}</p>
                <div class="client-grid">
                    <button class="client-btn" onclick="generateClientLink(atob('Y2xhc2g='), 'CLASH')">CLASH</button>
                    <button class="client-btn" onclick="generateClientLink(atob('Y2xhc2g='), 'STASH')">STASH</button>
                    <button class="client-btn" onclick="generateClientLink(atob('c3VyZ2U='), 'SURGE')">SURGE</button>
                    <button class="client-btn" onclick="generateClientLink(atob('c2luZ2JveA=='), 'SING-BOX')">SING-BOX</button>
                    <button class="client-btn" onclick="generateClientLink(atob('bG9vbg=='), 'LOON')">LOON</button>
                    <button class="client-btn" onclick="generateClientLink(atob('cXVhbng='), 'QUANTUMULT X')">QUANTUMULT X</button>
                    <button class="client-btn" onclick="generateClientLink(atob('djJyYXk='), 'V2RAY')">V2RAY</button>
                    <button class="client-btn" onclick="generateClientLink(atob('djJyYXk='), 'V2RAYNG')">V2RAYNG</button>
                    <button class="client-btn" onclick="generateClientLink(atob('djJyYXk='), 'NEKORAY')">NEKORAY</button>
                    <button class="client-btn" onclick="generateClientLink(atob('djJyYXk='), 'Shadowrocket')">Shadowrocket</button>
                </div>
                <div class="subscription-url" id="clientSubscriptionUrl"></div>
            </div>
            <div class="card" id="card-status">
                    <h2 class="card-title">${t.systemStatus}</h2>
                    <p class="card-help">${isFarsi ? 'این بخش وضعیت Worker، منطقه، و حالت ProxyIP/Matching را نشان می‌دهد تا بدانید اشتراک از کجا و با چه منطقی تولید می‌شود.' : 'This section shows Worker region, detection method, and ProxyIP/region‑matching state so you know what the generator is doing.'}</p>
                <div id="systemStatus" style="margin: 20px 0; padding: 15px; background: rgba(0, 20, 0, 0.8); border: 2px solid #00ff00; box-shadow: 0 0 20px rgba(0, 255, 0, 0.3), inset 0 0 15px rgba(0, 255, 0, 0.1); position: relative; overflow: hidden;">
                        <div style="color: #00ff00; margin-bottom: 15px; font-weight: bold; text-shadow: 0 0 5px #00ff00;">[ ${t.checking} ]</div>
                        <div id="regionStatus" style="margin: 8px 0; color: #00ff00; font-family: 'Courier New', monospace; text-shadow: 0 0 3px #00ff00;">${t.workerRegion}${t.checking}</div>
                        <div id="geoInfo" style="margin: 8px 0; color: #00aa00; font-family: 'Courier New', monospace; font-size: 0.9rem; text-shadow: 0 0 3px #00aa00;">${t.detectionMethod}${t.checking}</div>
                        <div id="backupStatus" style="margin: 8px 0; color: #00ff00; font-family: 'Courier New', monospace; text-shadow: 0 0 3px #00ff00;">${t.proxyIPStatus}${t.checking}</div>
                        <div id="currentIP" style="margin: 8px 0; color: #00ff00; font-family: 'Courier New', monospace; text-shadow: 0 0 3px #00ff00;">${t.currentIP}${t.checking}</div>
                <div id="echStatus" style="margin: 8px 0; color: #00ff00; font-family: 'Courier New', monospace; text-shadow: 0 0 3px #00ff00; font-size: 0.9rem;">${isFarsi ? 'وضعیت ECH:' : 'ECH status:'} ${t.checking}</div>
                        <div id="regionMatch" style="margin: 8px 0; color: #00ff00; font-family: 'Courier New', monospace; text-shadow: 0 0 3px #00ff00;">${t.regionMatch}${t.checking}</div>
                        <div id="selectionLogic" style="margin: 8px 0; color: #00aa00; font-family: 'Courier New', monospace; font-size: 0.9rem; text-shadow: 0 0 3px #00aa00;">${t.selectionLogic}${t.selectionLogicText}</div>
                </div>
            </div>
            <div class="card" id="configCard" style="display: none;">
                    <h2 class="card-title">${t.configManagement}</h2>
                    <p class="card-help">${isFarsi ? 'اگر KV (Binding با نام C) فعال باشد، تغییرات را اینجا ذخیره کنید تا همان لحظه اعمال شوند. اولویت: KV > متغیرهای محیطی > مقدار پیش‌فرض.' : 'If KV is enabled (binding named C), save your changes here to apply instantly. Priority: KV > environment variables > defaults.'}</p>
                <div id="kvStatus" style="margin-bottom: 20px; padding: 10px; background: rgba(0, 20, 0, 0.8); border: 1px solid #00ff00; color: #00ff00;">
                        ${t.kvStatusChecking}
                </div>
                <div id="configContent" style="display: none;">
                    <form id="regionForm" style="margin-bottom: 20px;">
                        <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 8px; color: #00ff00; font-weight: bold; text-shadow: 0 0 3px #00ff00;">${t.specifyRegion}</label>
                            <select id="wkRegion" style="width: 100%; padding: 12px; background: rgba(0, 0, 0, 0.8); border: 2px solid #00ff00; color: #00ff00; font-family: 'Courier New', monospace; font-size: 14px;">
                                    <option value="">${t.autoDetect}</option>
                                    ${regionOptionsHtml}
                            </select>
                                <small id="wkRegionHint" style="color: #00aa00; font-size: 0.85rem; display: none;">⚠️ ${t.customIPDisabledHint}</small>
                        </div>
                            <button type="submit" style="background: rgba(0, 255, 0, 0.15); border: 2px solid #00ff00; padding: 12px 24px; color: #00ff00; font-family: 'Courier New', monospace; font-weight: bold; cursor: pointer; margin-right: 10px; text-shadow: 0 0 8px #00ff00; transition: all 0.4s ease;">${t.saveRegion}</button>
                    </form>
                    <form id="otherConfigForm" style="margin-bottom: 20px;">
                        <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 8px; color: #00ff00; font-weight: bold; text-shadow: 0 0 3px #00ff00;">${t.protocolSelection}</label>
                            <div style="padding: 15px; background: rgba(0, 20, 0, 0.6); border: 1px solid #00ff00; border-radius: 5px;">
                                <div style="margin-bottom: 10px;">
                                    <label style="display: inline-flex; align-items: center; cursor: pointer; color: #00ff00;">
                                        <input type="checkbox" id="ev" checked style="margin-right: 8px; width: 18px; height: 18px; cursor: pointer;">
                                            <span style="font-size: 1.1rem;">${t.enableVLESS}</span>
                                    </label>
                                </div>
                                <div style="margin-bottom: 10px;">
                                    <label style="display: inline-flex; align-items: center; cursor: pointer; color: #00ff00;">
                                        <input type="checkbox" id="et" style="margin-right: 8px; width: 18px; height: 18px; cursor: pointer;">
                                            <span style="font-size: 1.1rem;">${t.enableTrojan}</span>
                                    </label>
                                </div>
                                <div style="margin-bottom: 10px;">
                                    <label style="display: inline-flex; align-items: center; cursor: pointer; color: #00ff00;">
                                        <input type="checkbox" id="ex" style="margin-right: 8px; width: 18px; height: 18px; cursor: pointer;">
                                            <span style="font-size: 1.1rem;">${t.enableXhttp}</span>
                                    </label>
                                </div>
                                <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(0, 255, 0, 0.3);">
                                    <div style="margin-bottom: 10px;">
                                        <label style="display: inline-flex; align-items: center; cursor: pointer; color: #00ff00;">
                                            <input type="checkbox" id="ech" style="margin-right: 8px; width: 18px; height: 18px; cursor: pointer;">
                                                <span style="font-size: 1.1rem;">${t.enableECH}</span>
                                        </label>
                                        <small style="color: #00aa00; font-size: 0.8rem; display: block; margin-top: 5px; margin-left: 26px;">${t.enableECHHint}</small>
                                    </div>
                                    <div style="margin-top: 15px; margin-bottom: 10px;">
                                        <label style="display: block; margin-bottom: 8px; color: #00ff00; font-size: 0.95rem;">${t.customDNS}</label>
                                        <input type="text" id="customDNS" placeholder="${t.customDNSPlaceholder}" style="width: 100%; padding: 10px; background: rgba(0, 0, 0, 0.8); border: 1px solid #00ff00; color: #00ff00; font-family: 'Courier New', monospace; font-size: 13px;">
                                        <small style="color: #00aa00; font-size: 0.8rem; display: block; margin-top: 5px;">${t.customDNSHint}</small>
                                    </div>
                                    <div style="margin-bottom: 10px;">
                                        <label style="display: block; margin-bottom: 8px; color: #00ff00; font-size: 0.95rem;">${t.customECHDomain}</label>
                                        <input type="text" id="customECHDomain" placeholder="${t.customECHDomainPlaceholder}" style="width: 100%; padding: 10px; background: rgba(0, 0, 0, 0.8); border: 1px solid #00ff00; color: #00ff00; font-family: 'Courier New', monospace; font-size: 13px;">
                                        <small style="color: #00aa00; font-size: 0.8rem; display: block; margin-top: 5px;">${t.customECHDomainHint}</small>
                                    </div>
                                </div>
                                <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(0, 255, 0, 0.3);">
                                        <label style="display: block; margin-bottom: 8px; color: #00ff00; font-size: 0.95rem;">${t.trojanPassword}</label>
                                        <input type="text" id="tp" placeholder="${t.trojanPasswordPlaceholder}" style="width: 100%; padding: 10px; background: rgba(0, 0, 0, 0.8); border: 1px solid #00ff00; color: #00ff00; font-family: 'Courier New', monospace; font-size: 13px;">
                                        <small style="color: #00aa00; font-size: 0.8rem; display: block; margin-top: 5px;">${t.trojanPasswordHint}</small>
                                </div>
                                    <small style="color: #00aa00; font-size: 0.85rem; display: block; margin-top: 10px;">${t.protocolHint}</small>
                                    <button type="button" id="saveProtocolBtn" style="margin-top: 15px; background: rgba(0, 255, 0, 0.15); border: 2px solid #00ff00; padding: 10px 20px; color: #00ff00; font-family: 'Courier New', monospace; font-weight: bold; cursor: pointer; text-shadow: 0 0 8px #00ff00; transition: all 0.4s ease; width: 100%;">${t.saveProtocol}</button>
                            </div>
                        </div>
                        <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 8px; color: #00ff00; font-weight: bold; text-shadow: 0 0 3px #00ff00;">${t.customHomepage}</label>
                                <input type="text" id="customHomepage" placeholder="${t.customHomepagePlaceholder}" style="width: 100%; padding: 12px; background: rgba(0, 0, 0, 0.8); border: 2px solid #00ff00; color: #00ff00; font-family: 'Courier New', monospace; font-size: 14px;">
                                <small style="color: #00aa00; font-size: 0.85rem;">${t.customHomepageHint}</small>
                        </div>
                        <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 8px; color: #00ff00; font-weight: bold; text-shadow: 0 0 3px #00ff00;">${t.customPath}</label>
                                <input type="text" id="customPath" placeholder="${isFarsi ? 'مثال: /mypath یا خالی بگذارید تا از UUID استفاده شود' : 'Example: /mypath (leave empty to use UUID)'}" style="width: 100%; padding: 12px; background: rgba(0, 0, 0, 0.8); border: 2px solid #00ff00; color: #00ff00; font-family: 'Courier New', monospace; font-size: 14px;">
                                <small style="color: #00aa00; font-size: 0.85rem;">${isFarsi ? 'مسیر اشتراک سفارشی. اگر خالی بگذارید از UUID به عنوان مسیر استفاده می‌شود.' : 'Custom subscription path. Leave empty to use your UUID.'}</small>
                        </div>
                        <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 8px; color: #00ff00; font-weight: bold; text-shadow: 0 0 3px #00ff00;">${t.customIP}</label>
                                <input type="text" id="customIP" placeholder="${isFarsi ? 'مثال: 1.2.3.4:443' : 'Example: 1.2.3.4:443'}" style="width: 100%; padding: 12px; background: rgba(0, 0, 0, 0.8); border: 2px solid #00ff00; color: #00ff00; font-family: 'Courier New', monospace; font-size: 14px;">
                                <small style="color: #00aa00; font-size: 0.85rem;">${isFarsi ? 'آدرس و پورت ProxyIP سفارشی' : 'Custom ProxyIP address and port.'}</small>
                        </div>
                        <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 8px; color: #00ff00; font-weight: bold; text-shadow: 0 0 3px #00ff00;">${t.preferredIPs}</label>
                                <input type="text" id="yx" placeholder="${isFarsi ? 'مثال: 1.2.3.4:443#گره هنگ‌کنگ,5.6.7.8:80#گره آمریکا,example.com:8443#گره سنگاپور' : 'Example: 1.2.3.4:443#Japan,5.6.7.8:80#US,example.com:8443#Singapore'}" style="width: 100%; padding: 12px; background: rgba(0, 0, 0, 0.8); border: 2px solid #00ff00; color: #00ff00; font-family: 'Courier New', monospace; font-size: 14px;">
                                <small style="color: #00aa00; font-size: 0.85rem;">${isFarsi ? 'فرمت: IP:پورت#نام گره یا IP:پورت (بدون # از نام پیش‌فرض استفاده می‌شود). پشتیبانی از چندین مورد، با کاما جدا می‌شوند. <span style="color: #ffaa00;">IP های اضافه شده از طریق API به طور خودکار در اینجا نمایش داده می‌شوند.</span>' : 'Format: host:port#name or host:port. Multiple items separated by commas. Items added via API will appear here automatically.'}</small>
                        </div>
                        <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 8px; color: #00ff00; font-weight: bold; text-shadow: 0 0 3px #00ff00;">${t.preferredIPsURL}</label>
                                <input type="text" id="yxURL" placeholder="${isFarsi ? 'پیش‌فرض: https://raw.githubusercontent.com/qwer-search/bestip/refs/heads/main/kejilandbestip.txt' : 'Default: https://raw.githubusercontent.com/qwer-search/bestip/refs/heads/main/kejilandbestip.txt'}" style="width: 100%; padding: 12px; background: rgba(0, 0, 0, 0.8); border: 2px solid #00ff00; color: #00ff00; font-family: 'Courier New', monospace; font-size: 14px;">
                                <small style="color: #00aa00; font-size: 0.85rem;">${isFarsi ? 'URL منبع لیست IP ترجیحی سفارشی، اگر خالی بگذارید از آدرس پیش‌فرض استفاده می‌شود' : 'Preferred IP list source URL. Leave empty to use the default.'}</small>
                        </div>
                        
                        <div style="margin-bottom: 20px; padding: 15px; background: rgba(0, 40, 0, 0.6); border: 2px solid #00aa00; border-radius: 8px;">
                            <h4 style="color: #00ff00; margin: 0 0 15px 0; font-size: 1.1rem; text-shadow: 0 0 5px #00ff00;">⚡ ${t.latencyTest}</h4>
                            <div style="display: flex; gap: 10px; margin-bottom: 12px; flex-wrap: wrap; align-items: center;">
                                <div style="min-width: 120px;">
                                    <label style="display: block; margin-bottom: 5px; color: #00ff00; font-size: 0.9rem;">${t.ipSource}</label>
                                    <select id="ipSourceSelect" style="width: 100%; padding: 10px; background: rgba(0, 0, 0, 0.8); border: 1px solid #00ff00; color: #00ff00; font-family: 'Courier New', monospace; font-size: 13px; cursor: pointer;">
                                        <option value="manual">${t.manualInput}</option>
                                        <option value="cfRandom">${t.cfRandomIP}</option>
                                        <option value="urlFetch">${t.urlFetch}</option>
                                    </select>
                                </div>
                                <div style="width: 100px;">
                                    <label style="display: block; margin-bottom: 5px; color: #00ff00; font-size: 0.9rem;">${t.latencyTestPort}</label>
                                    <input type="number" id="latencyTestPort" value="443" min="1" max="65535" style="width: 100%; padding: 10px; background: rgba(0, 0, 0, 0.8); border: 1px solid #00ff00; color: #00ff00; font-family: 'Courier New', monospace; font-size: 13px;">
                                </div>
                                <div id="randomCountDiv" style="width: 100px; display: none;">
                                    <label style="display: block; margin-bottom: 5px; color: #00ff00; font-size: 0.9rem;">${t.randomCount}</label>
                                    <input type="number" id="randomIPCount" value="20" min="1" max="100" style="width: 100%; padding: 10px; background: rgba(0, 0, 0, 0.8); border: 1px solid #00ff00; color: #00ff00; font-family: 'Courier New', monospace; font-size: 13px;">
                                </div>
                                <div style="width: 80px;">
                                    <label style="display: block; margin-bottom: 5px; color: #00ff00; font-size: 0.9rem;">${isFarsi ? 'رشته‌ها' : 'Threads'}</label>
                                    <input type="number" id="testThreads" value="5" min="1" max="50" style="width: 100%; padding: 10px; background: rgba(0, 0, 0, 0.8); border: 1px solid #00ff00; color: #00ff00; font-family: 'Courier New', monospace; font-size: 13px;">
                                </div>
                            </div>
                            <div id="manualInputDiv" style="margin-bottom: 10px;">
                                <label style="display: block; margin-bottom: 5px; color: #00ff00; font-size: 0.9rem;">${t.latencyTestIP}</label>
                                <input type="text" id="latencyTestInput" placeholder="${t.latencyTestIPPlaceholder}" style="width: 100%; padding: 10px; background: rgba(0, 0, 0, 0.8); border: 1px solid #00ff00; color: #00ff00; font-family: 'Courier New', monospace; font-size: 13px;">
                            </div>
                            <div id="urlFetchDiv" style="margin-bottom: 10px; display: none;">
                                <label style="display: block; margin-bottom: 5px; color: #00ff00; font-size: 0.9rem;">${t.fetchURL}</label>
                                <div style="display: flex; gap: 8px;">
                                    <input type="text" id="fetchURLInput" placeholder="${t.fetchURLPlaceholder}" style="flex: 1; padding: 10px; background: rgba(0, 0, 0, 0.8); border: 1px solid #00ff00; color: #00ff00; font-family: 'Courier New', monospace; font-size: 13px;">
                                    <button type="button" id="fetchIPBtn" style="background: rgba(0, 200, 255, 0.2); border: 1px solid #00aaff; padding: 8px 16px; color: #00aaff; font-family: 'Courier New', monospace; cursor: pointer; white-space: nowrap;">⬇ ${t.fetchIP}</button>
                                </div>
                            </div>
                            <div id="cfRandomDiv" style="margin-bottom: 10px; display: none;">
                                <button type="button" id="generateCFIPBtn" style="background: rgba(0, 255, 0, 0.15); border: 1px solid #00ff00; padding: 10px 20px; color: #00ff00; font-family: 'Courier New', monospace; cursor: pointer; width: 100%; transition: all 0.3s;">🎲 ${t.generateIP}</button>
                            </div>
                            <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                                <button type="button" id="startLatencyTest" style="background: rgba(0, 255, 0, 0.2); border: 1px solid #00ff00; padding: 8px 16px; color: #00ff00; font-family: 'Courier New', monospace; cursor: pointer; transition: all 0.3s;">▶ ${t.startTest}</button>
                                <button type="button" id="stopLatencyTest" style="background: rgba(255, 0, 0, 0.2); border: 1px solid #ff4444; padding: 8px 16px; color: #ff4444; font-family: 'Courier New', monospace; cursor: pointer; display: none; transition: all 0.3s;">⏹ ${t.stopTest}</button>
                            </div>
                            <div id="latencyTestStatus" style="color: #00aa00; font-size: 0.9rem; margin-bottom: 10px; display: none;"></div>
                            <div id="latencyTestResults" style="max-height: 250px; overflow-y: auto; display: none;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                                    <span style="color: #00ff00; font-weight: bold;">${t.testResult}</span>
                                    <div style="display: flex; gap: 8px;">
                                        <button type="button" id="selectAllResults" style="background: transparent; border: 1px solid #00aa00; padding: 4px 10px; color: #00aa00; font-size: 0.8rem; cursor: pointer;">${t.selectAll}</button>
                                        <button type="button" id="deselectAllResults" style="background: transparent; border: 1px solid #00aa00; padding: 4px 10px; color: #00aa00; font-size: 0.8rem; cursor: pointer;">${t.deselectAll}</button>
                                    </div>
                                </div>
                                <div id="cityFilterContainer" style="margin-bottom: 10px; padding: 10px; background: rgba(0, 20, 0, 0.6); border: 1px solid #00aa00; border-radius: 4px; display: none;">
                                    <div style="margin-bottom: 8px;">
                                        <label style="display: inline-flex; align-items: center; cursor: pointer; color: #00ff00; font-size: 0.9rem;">
                                            <input type="radio" name="cityFilterMode" value="all" checked style="margin-right: 6px; width: 16px; height: 16px; cursor: pointer;">
                                            <span>${isFarsi ? 'همه شهرها' : 'All cities'}</span>
                                        </label>
                                        <label style="display: inline-flex; align-items: center; cursor: pointer; color: #00ff00; font-size: 0.9rem; margin-left: 15px;">
                                            <input type="radio" name="cityFilterMode" value="fastest10" style="margin-right: 6px; width: 16px; height: 16px; cursor: pointer;">
                                            <span>${isFarsi ? 'فقط ۱۰ مورد سریع‌تر' : 'Only fastest 10'}</span>
                                        </label>
                                    </div>
                                    <div id="cityCheckboxesContainer" style="display: flex; flex-wrap: wrap; gap: 8px; max-height: 80px; overflow-y: auto; padding: 5px;"></div>
                                </div>
                                <div id="latencyResultsList" style="background: rgba(0, 0, 0, 0.5); border: 1px solid #004400; border-radius: 4px; padding: 10px;"></div>
                                <div style="margin-top: 10px; display: flex; gap: 10px;">
                                    <button type="button" id="overwriteSelectedToYx" style="flex: 1; background: rgba(0, 200, 0, 0.3); border: 1px solid #00ff00; padding: 10px 20px; color: #00ff00; font-family: 'Courier New', monospace; font-weight: bold; cursor: pointer; transition: all 0.3s;">${isFarsi ? 'جایگزین' : 'Replace'}</button>
                                    <button type="button" id="appendSelectedToYx" style="flex: 1; background: rgba(0, 150, 0, 0.3); border: 1px solid #00aa00; padding: 10px 20px; color: #00aa00; font-family: 'Courier New', monospace; font-weight: bold; cursor: pointer; transition: all 0.3s;">${isFarsi ? 'اضافه کردن' : 'Append'}</button>
                                </div>
                            </div>
                        </div>
                        
                        <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 8px; color: #00ff00; font-weight: bold; text-shadow: 0 0 3px #00ff00;">${t.socks5Config}</label>
                                <input type="text" id="socksConfig" placeholder="${isFarsi ? 'مثال: user:pass@host:port یا host:port' : 'Example: user:pass@host:port or host:port'}" style="width: 100%; padding: 12px; background: rgba(0, 0, 0, 0.8); border: 2px solid #00ff00; color: #00ff00; font-family: 'Courier New', monospace; font-size: 14px;">
                                <small style="color: #00aa00; font-size: 0.85rem;">${isFarsi ? 'آدرس پروکسی SOCKS5، برای انتقال تمام ترافیک خروجی استفاده می‌شود' : 'SOCKS5 proxy for forwarding all outbound traffic.'}</small>
                        </div>
                            <button type="submit" style="background: rgba(0, 255, 0, 0.15); border: 2px solid #00ff00; padding: 12px 24px; color: #00ff00; font-family: 'Courier New', monospace; font-weight: bold; cursor: pointer; margin-right: 10px; text-shadow: 0 0 8px #00ff00; transition: all 0.4s ease;">${t.saveConfig}</button>
                    </form>
                    
                        <h3 style="color: #00ff00; margin: 20px 0 15px 0; font-size: 1.2rem;">${t.advancedControl}</h3>
                    <form id="advancedConfigForm" style="margin-bottom: 20px;">
                        <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 8px; color: #00ff00; font-weight: bold; text-shadow: 0 0 3px #00ff00;">${t.subscriptionConverter}</label>
                                <input type="text" id="scu" placeholder="${t.subscriptionConverterPlaceholder}" style="width: 100%; padding: 12px; background: rgba(0, 0, 0, 0.8); border: 2px solid #00ff00; color: #00ff00; font-family: 'Courier New', monospace; font-size: 14px;">
                                <small style="color: #00aa00; font-size: 0.85rem;">${t.subscriptionConverterHint}</small>
                        </div>
                        <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 8px; color: #00ff00; font-weight: bold; text-shadow: 0 0 3px #00ff00;">${t.builtinPreferred}</label>
                            <div style="padding: 15px; background: rgba(0, 20, 0, 0.6); border: 1px solid #00ff00; border-radius: 5px;">
                                <div style="margin-bottom: 10px;">
                                    <label style="display: inline-flex; align-items: center; cursor: pointer; color: #00ff00;">
                                        <input type="checkbox" id="epd" style="margin-right: 8px; width: 18px; height: 18px; cursor: pointer;">
                                            <span style="font-size: 1.1rem;">${t.enablePreferredDomain}</span>
                                    </label>
                                </div>
                                <div style="margin-bottom: 10px;">
                                    <label style="display: inline-flex; align-items: center; cursor: pointer; color: #00ff00;">
                                        <input type="checkbox" id="epi" checked style="margin-right: 8px; width: 18px; height: 18px; cursor: pointer;">
                                            <span style="font-size: 1.1rem;">${t.enablePreferredIP}</span>
                                    </label>
                                </div>
                                <div style="margin-bottom: 10px;">
                                    <label style="display: inline-flex; align-items: center; cursor: pointer; color: #00ff00;">
                                        <input type="checkbox" id="egi" checked style="margin-right: 8px; width: 18px; height: 18px; cursor: pointer;">
                                            <span style="font-size: 1.1rem;">${t.enableGitHubPreferred}</span>
                                    </label>
                                </div>
                                    <small style="color: #00aa00; font-size: 0.85rem; display: block; margin-top: 10px;">${t.builtinPreferredHint}</small>
                            </div>
                        </div>
                        <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 8px; color: #00ff00; font-weight: bold; text-shadow: 0 0 3px #00ff00;">${isFarsi ? 'تنظیمات فیلتر IP ترجیحی' : 'Preferred IP filters'}</label>
                            <div style="padding: 15px; background: rgba(0, 20, 0, 0.6); border: 1px solid #00ff00; border-radius: 5px;">
                                <div style="margin-bottom: 15px;">
                                    <label style="display: block; margin-bottom: 8px; color: #00ff00; font-weight: bold; text-shadow: 0 0 3px #00ff00;">${isFarsi ? 'انتخاب نسخه IP' : 'IP version'}</label>
                                    <div style="display: flex; gap: 20px; flex-wrap: wrap;">
                                        <label style="display: inline-flex; align-items: center; cursor: pointer; color: #00ff00;">
                                            <input type="checkbox" id="ipv4Enabled" checked style="margin-right: 8px; width: 18px; height: 18px; cursor: pointer;">
                                            <span style="font-size: 1rem;">IPv4</span>
                                        </label>
                                        <label style="display: inline-flex; align-items: center; cursor: pointer; color: #00ff00;">
                                            <input type="checkbox" id="ipv6Enabled" checked style="margin-right: 8px; width: 18px; height: 18px; cursor: pointer;">
                                            <span style="font-size: 1rem;">IPv6</span>
                                        </label>
                                    </div>
                                </div>
                                <div style="margin-bottom: 10px;">
                                    <label style="display: block; margin-bottom: 8px; color: #00ff00; font-weight: bold; text-shadow: 0 0 3px #00ff00;">${isFarsi ? 'فیلتر اپراتور' : 'ISP filter'}</label>
                                    <div style="display: flex; gap: 20px; flex-wrap: wrap;">
                                        <label style="display: inline-flex; align-items: center; cursor: pointer; color: #00ff00;">
                                            <input type="checkbox" id="ispMobile" checked style="margin-right: 8px; width: 18px; height: 18px; cursor: pointer;">
                                            <span style="font-size: 1rem;">${isFarsi ? 'موبایل' : 'Mobile'}</span>
                                        </label>
                                        <label style="display: inline-flex; align-items: center; cursor: pointer; color: #00ff00;">
                                            <input type="checkbox" id="ispUnicom" checked style="margin-right: 8px; width: 18px; height: 18px; cursor: pointer;">
                                            <span style="font-size: 1rem;">${isFarsi ? 'یونیکام' : 'Unicom'}</span>
                                        </label>
                                        <label style="display: inline-flex; align-items: center; cursor: pointer; color: #00ff00;">
                                            <input type="checkbox" id="ispTelecom" checked style="margin-right: 8px; width: 18px; height: 18px; cursor: pointer;">
                                            <span style="font-size: 1rem;">${isFarsi ? 'تلکام' : 'Telecom'}</span>
                                        </label>
                                    </div>
                                </div>
                                    <small style="color: #00aa00; font-size: 0.85rem; display: block; margin-top: 10px;">${isFarsi ? 'نسخه IP و اپراتور را انتخاب کنید؛ موارد انتخاب‌نشده فیلتر می‌شوند.' : 'Select IP version and ISP; unchecked items will be filtered out.'}</small>
                            </div>
                        </div>
                        <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 8px; color: #00ff00; font-weight: bold; text-shadow: 0 0 3px #00ff00;">${t.allowAPIManagement}</label>
                            <select id="apiEnabled" style="width: 100%; padding: 12px; background: rgba(0, 0, 0, 0.8); border: 2px solid #00ff00; color: #00ff00; font-family: 'Courier New', monospace; font-size: 14px;">
                                    <option value="">${t.apiEnabledDefault}</option>
                                    <option value="yes">${t.apiEnabledYes}</option>
                            </select>
                                <small style="color: #ffaa00; font-size: 0.85rem;">${t.apiEnabledHint}</small>
                        </div>
                        <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 8px; color: #00ff00; font-weight: bold; text-shadow: 0 0 3px #00ff00;">${t.regionMatching}</label>
                            <select id="regionMatching" style="width: 100%; padding: 12px; background: rgba(0, 0, 0, 0.8); border: 2px solid #00ff00; color: #00ff00; font-family: 'Courier New', monospace; font-size: 14px;">
                                    <option value="">${t.regionMatchingDefault}</option>
                                    <option value="no">${t.regionMatchingNo}</option>
                            </select>
                                <small style="color: #00aa00; font-size: 0.85rem;">${t.regionMatchingHint}</small>
                        </div>
                        <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 8px; color: #00ff00; font-weight: bold; text-shadow: 0 0 3px #00ff00;">${t.downgradeControl}</label>
                            <select id="downgradeControl" style="width: 100%; padding: 12px; background: rgba(0, 0, 0, 0.8); border: 2px solid #00ff00; color: #00ff00; font-family: 'Courier New', monospace; font-size: 14px;">
                                    <option value="">${t.downgradeControlDefault}</option>
                                    <option value="no">${t.downgradeControlNo}</option>
                            </select>
                                <small style="color: #00aa00; font-size: 0.85rem;">${t.downgradeControlHint}</small>
                        </div>
                        <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 8px; color: #00ff00; font-weight: bold; text-shadow: 0 0 3px #00ff00;">${t.tlsControl}</label>
                            <select id="portControl" style="width: 100%; padding: 12px; background: rgba(0, 0, 0, 0.8); border: 2px solid #00ff00; color: #00ff00; font-family: 'Courier New', monospace; font-size: 14px;">
                                    <option value="">${t.tlsControlDefault}</option>
                                    <option value="yes">${t.tlsControlYes}</option>
                            </select>
                                <small style="color: #00aa00; font-size: 0.85rem;">${t.tlsControlHint}</small>
                        </div>
                        <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 8px; color: #00ff00; font-weight: bold; text-shadow: 0 0 3px #00ff00;">${t.preferredControl}</label>
                            <select id="preferredControl" style="width: 100%; padding: 12px; background: rgba(0, 0, 0, 0.8); border: 2px solid #00ff00; color: #00ff00; font-family: 'Courier New', monospace; font-size: 14px;">
                                    <option value="">${t.preferredControlDefault}</option>
                                    <option value="yes">${t.preferredControlYes}</option>
                            </select>
                                <small style="color: #00aa00; font-size: 0.85rem;">${t.preferredControlHint}</small>
                        </div>
                            <button type="submit" style="background: rgba(0, 255, 0, 0.15); border: 2px solid #00ff00; padding: 12px 24px; color: #00ff00; font-family: 'Courier New', monospace; font-weight: bold; cursor: pointer; margin-right: 10px; text-shadow: 0 0 8px #00ff00; transition: all 0.4s ease;">${t.saveAdvanced}</button>
                    </form>
                    <div id="currentConfig" style="background: rgba(0, 0, 0, 0.9); border: 1px solid #00ff00; padding: 15px; margin: 10px 0; font-family: 'Courier New', monospace; color: #00ff00;">
                            ${t.loading}
                    </div>
                    <div id="pathTypeInfo" style="background: rgba(0, 20, 0, 0.7); border: 1px solid #00ff00; padding: 15px; margin: 10px 0; font-family: 'Courier New', monospace; color: #00ff00;">
                            <div style="font-weight: bold; margin-bottom: 8px; color: #44ff44; text-shadow: 0 0 5px #44ff44;">${t.currentConfig}</div>
                            <div id="pathTypeStatus">${t.checking}</div>
                    </div>
                        <button onclick="loadCurrentConfig()" style="background: rgba(0, 255, 0, 0.15); border: 2px solid #00ff00; padding: 12px 24px; color: #00ff00; font-family: 'Courier New', monospace; font-weight: bold; cursor: pointer; margin-right: 10px; text-shadow: 0 0 8px #00ff00; transition: all 0.4s ease;">${t.refreshConfig}</button>
                        <button onclick="resetAllConfig()" style="background: rgba(255, 0, 0, 0.15); border: 2px solid #ff0000; padding: 12px 24px; color: #ff0000; font-family: 'Courier New', monospace; font-weight: bold; cursor: pointer; text-shadow: 0 0 8px #ff0000; transition: all 0.4s ease;">${t.resetConfig}</button>
                </div>
                <div id="statusMessage" style="display: none; padding: 10px; margin: 10px 0; border: 1px solid #00ff00; background: rgba(0, 20, 0, 0.8); color: #00ff00; text-shadow: 0 0 5px #00ff00;"></div>
            </div>
            
            <div class="card" id="card-links">
                    <h2 class="card-title">${t.relatedLinks}</h2>
                    <p class="card-help">${isFarsi ? 'لینک‌های کمکی و دسترسی‌های سریع برای استفاده/مدیریت. (برای API مدیریت IPهای ترجیحی باید گزینه ae را فعال کنید.)' : 'Helpful links and quick access. (To use the Preferred‑IPs API you must enable `ae` in settings.)'}</p>
                <div class="social-grid">
                    <a class="social-link social-link-telegram" href="https://t.me/PIMX_PASS" target="_blank" rel="noreferrer">
                        <span class="social-icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24"><path d="M21.86 3.12c.27-.96-.69-1.79-1.52-1.31L2.76 11.04c-.9.48-.79 1.82.17 2.15l4.56 1.55 1.76 5.43c.29.89 1.44 1.11 2.04.39l2.54-3.07 4.98 3.65c.82.6 1.99.15 2.2-.85L21.86 3.12zM9.18 13.93l8.82-8.17-6.53 9.71a1 1 0 0 1-.79.44l-1.5-1.98z"/></svg>
                        </span>
                        <span class="social-text"><strong>${isFarsi ? 'کانال تلگرام' : 'Telegram Channel'}</strong><small>@PIMX_PASS</small></span>
                    </a>
                    <a class="social-link social-link-telegram" href="https://t.me/PIMX_PASS_BOT" target="_blank" rel="noreferrer">
                        <span class="social-icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24"><path d="M21.86 3.12c.27-.96-.69-1.79-1.52-1.31L2.76 11.04c-.9.48-.79 1.82.17 2.15l4.56 1.55 1.76 5.43c.29.89 1.44 1.11 2.04.39l2.54-3.07 4.98 3.65c.82.6 1.99.15 2.2-.85L21.86 3.12zM9.18 13.93l8.82-8.17-6.53 9.71a1 1 0 0 1-.79.44l-1.5-1.98z"/></svg>
                        </span>
                        <span class="social-text"><strong>${isFarsi ? 'بات سرور' : 'Server Bot'}</strong><small>@PIMX_PASS_BOT</small></span>
                    </a>
                    <a class="social-link social-link-telegram" href="https://t.me/PIMX_SONIC_BOT" target="_blank" rel="noreferrer">
                        <span class="social-icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24"><path d="M21.86 3.12c.27-.96-.69-1.79-1.52-1.31L2.76 11.04c-.9.48-.79 1.82.17 2.15l4.56 1.55 1.76 5.43c.29.89 1.44 1.11 2.04.39l2.54-3.07 4.98 3.65c.82.6 1.99.15 2.2-.85L21.86 3.12zM9.18 13.93l8.82-8.17-6.53 9.71a1 1 0 0 1-.79.44l-1.5-1.98z"/></svg>
                        </span>
                        <span class="social-text"><strong>${isFarsi ? 'بات دانلود اندروید' : 'Android Download Bot'}</strong><small>@PIMX_SONIC_BOT</small></span>
                    </a>
                    <a class="social-link social-link-telegram" href="https://t.me/PIMX_PLAY_BOT" target="_blank" rel="noreferrer">
                        <span class="social-icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24"><path d="M21.86 3.12c.27-.96-.69-1.79-1.52-1.31L2.76 11.04c-.9.48-.79 1.82.17 2.15l4.56 1.55 1.76 5.43c.29.89 1.44 1.11 2.04.39l2.54-3.07 4.98 3.65c.82.6 1.99.15 2.2-.85L21.86 3.12zM9.18 13.93l8.82-8.17-6.53 9.71a1 1 0 0 1-.79.44l-1.5-1.98z"/></svg>
                        </span>
                        <span class="social-text"><strong>${isFarsi ? 'بات موزیک (مشابه SoundCloud)' : 'Music Bot (SoundCloud-like)'}</strong><small>@PIMX_PLAY_BOT</small></span>
                    </a>
                    <a class="social-link social-link-x" href="https://x.com/pimxpass" target="_blank" rel="noreferrer">
                        <span class="social-icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24"><path d="M18.901 2H22l-6.772 7.733L23.193 22h-6.24l-4.889-6.392L6.47 22H3.37l7.244-8.27L1 2h6.398l4.418 5.87L18.9 2zm-1.086 18h1.715L6.467 3.895H4.63L17.815 20z"/></svg>
                        </span>
                        <span class="social-text"><strong>X</strong><small>@pimxpass</small></span>
                    </a>
                </div>
                <div class="utility-links">
                    <a href="https://www.youtube.com/@PIMX_PLAY_BOT" target="_blank" rel="noreferrer">${isFarsi ? 'یوتیوب' : 'YouTube'}</a>
                    <a href="https://github.com/byJoey/cfnew" target="_blank" rel="noreferrer">${t.githubProject}</a>
                    <a href="https://www.youtube.com/@joeyblog" target="_blank" rel="noreferrer">YouTube @joeyblog</a>
                </div>
                    <p class="card-help" style="text-align:center; margin-top: 10px;">
                        ${isFarsi
                            ? 'بات سرور: V2Ray / NPV Tunnel / HA Tunnel Plus / OpenVPN / HTTP Injector / HTTP Custom + پروکسی تلگرام • اندروید: @PIMX_SONIC_BOT • موزیک: @PIMX_PLAY_BOT'
                            : 'Server Bot: V2Ray / NPV Tunnel / HA Tunnel Plus / OpenVPN / HTTP Injector / HTTP Custom + Telegram proxy • Android: @PIMX_SONIC_BOT • Music bot: @PIMX_PLAY_BOT'}
                    </p>
            </div>
        </div>
        <script>
            // Subscription converter URL (injected from server config)
            var SUB_CONVERTER_URL = "${ scu }";
            // Remote config URL (hard-coded)
            var REMOTE_CONFIG_URL = "${ remoteConfigUrl }";
                
                // Translations
                const translations = {
                    en: {
                        subscriptionCopied: 'Subscription link copied.',
                        autoSubscriptionCopied: 'Auto-detect link copied. When your client fetches it, the server returns the right format based on User‑Agent.'
                    },
                    fa: {
                        subscriptionCopied: 'لینک اشتراک کپی شد',
                        autoSubscriptionCopied: 'لینک اشتراک تشخیص خودکار کپی شد، کلاینت هنگام دسترسی بر اساس User-Agent به طور خودکار تشخیص داده و قالب مربوطه را برمی‌گرداند'
                    }
                };
                
                function getCookie(name) {
                    const value = '; ' + document.cookie;
                    const parts = value.split('; ' + name + '=');
                    if (parts.length === 2) return parts.pop().split(';').shift();
                    return null;
                }
                
                const browserLang = navigator.language || navigator.userLanguage || '';
                const savedLang = localStorage.getItem('preferredLanguage') || getCookie('preferredLanguage');
                let isFarsi = false;
                
                if (savedLang === 'fa' || savedLang === 'fa-IR') {
                    isFarsi = true;
                } else {
                    isFarsi = browserLang.includes('fa') || browserLang.includes('fa-IR');
                }
                
                const t = translations[isFarsi ? 'fa' : 'en'];

                function showToast(message, type) {
                    const wrap = document.getElementById('toastWrap') || (() => {
                        const el = document.createElement('div');
                        el.id = 'toastWrap';
                        document.body.appendChild(el);
                        return el;
                    })();
                    const toast = document.createElement('div');
                    toast.className = 'toast-item ' + (type || 'success');
                    toast.textContent = String(message || '');
                    wrap.appendChild(toast);
                    setTimeout(() => {
                        toast.style.opacity = '0';
                        toast.style.transform = 'translateY(8px)';
                        setTimeout(() => toast.remove(), 260);
                    }, 2800);
                }

                function applyLanguage(lang) {
                    isFarsi = lang === 'fa' || lang === 'fa-IR';
                    const ui = isFarsi ? {
                        dir: 'rtl',
                        lang: 'fa-IR',
                        title: 'مرکز اشتراک • پنل مدیریت پیشرفته',
                        subtitle: 'پنل یک‌صفحه‌ای برای مدیریت کلاینت، تنظیمات KV و لینک اشتراک',
                        quick: 'شروع سریع',
                        step1: '۱) سرور',
                        step2: '۲) کلاینت',
                        step3: '۳) پیشرفته',
                        step4: '۴) لینک‌ها',
                        client: '[ انتخاب کلاینت ]',
                        status: '[ وضعیت سیستم ]',
                        settings: '[ تنظیمات ]',
                        links: '[ لینک‌های مرتبط ]',
                        settingsHint: 'تنظیمات در KV ذخیره می‌شوند و همان لحظه روی خروجی اشتراک اعمال می‌گردند.',
                        clientHint: 'روی کلاینت موردنظر بزن؛ لینک ساخته می‌شود و کپی می‌گردد.',
                        statusHint: 'وضعیت واقعی Worker، منطقه و ProxyIP را اینجا ببین.',
                        linksHint: 'لینک‌های رسمی PIMXPASS برای کانال، بات‌ها و شبکه‌های اجتماعی.',
                        saveRegion: 'ذخیره منطقه',
                        saveProtocol: 'ذخیره پروتکل',
                        saveSettings: 'ذخیره تنظیمات',
                        saveAdvanced: 'ذخیره پیشرفته',
                        refresh: 'بازخوانی',
                        reset: 'بازنشانی',
                        help: 'آموزش'
                    } : {
                        dir: 'ltr',
                        lang: 'en-US',
                        title: 'Subscription Center • Advanced Panel',
                        subtitle: 'Single-page control center for clients, KV settings, and subscription links',
                        quick: 'Quick Start',
                        step1: '1) Server',
                        step2: '2) Client',
                        step3: '3) Advanced',
                        step4: '4) Links',
                        client: '[ Select Client ]',
                        status: '[ System Status ]',
                        settings: '[ Settings ]',
                        links: '[ Links ]',
                        settingsHint: 'Settings are stored in KV and applied immediately to generated subscriptions.',
                        clientHint: 'Pick a client and the link is generated and copied.',
                        statusHint: 'Check real Worker region, ProxyIP mode, and matching state here.',
                        linksHint: 'Official PIMXPASS links for channel, bots, and socials.',
                        saveRegion: 'Save region',
                        saveProtocol: 'Save protocol settings',
                        saveSettings: 'Save settings',
                        saveAdvanced: 'Save advanced',
                        refresh: 'Refresh',
                        reset: 'Reset',
                        help: 'Guide'
                    };
                    document.documentElement.setAttribute('lang', ui.lang);
                    document.documentElement.setAttribute('dir', ui.dir);
                    const subtitleEl = document.querySelector('.subtitle');
                    if (subtitleEl) subtitleEl.textContent = ui.title + ' • ' + ui.subtitle;
                    const quickTitle = document.querySelector('#card-wizard .card-title');
                    if (quickTitle) quickTitle.textContent = ui.quick;
                    const steps = document.querySelectorAll('.step-btn');
                    if (steps[0]) steps[0].textContent = ui.step1;
                    if (steps[1]) steps[1].textContent = ui.step2;
                    if (steps[2]) steps[2].textContent = ui.step3;
                    if (steps[3]) steps[3].textContent = ui.step4;
                    const clientTitle = document.querySelector('#card-client .card-title');
                    if (clientTitle) clientTitle.textContent = ui.client;
                    const statusTitle = document.querySelector('#card-status .card-title');
                    if (statusTitle) statusTitle.textContent = ui.status;
                    const settingsTitle = document.querySelector('#configCard .card-title');
                    if (settingsTitle) settingsTitle.textContent = ui.settings;
                    const linksTitle = document.querySelector('#card-links .card-title');
                    if (linksTitle) linksTitle.textContent = ui.links;
                    const helps = document.querySelectorAll('.help-btn');
                    helps.forEach((btn) => btn.textContent = ui.help);
                    const helpsText = document.querySelectorAll('.card-help');
                    if (helpsText[1]) helpsText[1].textContent = ui.clientHint;
                    if (helpsText[2]) helpsText[2].textContent = ui.statusHint;
                    if (helpsText[3]) helpsText[3].textContent = ui.settingsHint;
                    if (helpsText[4]) helpsText[4].textContent = ui.linksHint;
                    const saveRegionBtn = document.querySelector('#regionForm button[type="submit"]');
                    if (saveRegionBtn) saveRegionBtn.textContent = ui.saveRegion;
                    const saveProtocolBtn = document.getElementById('saveProtocolBtn');
                    if (saveProtocolBtn) saveProtocolBtn.textContent = ui.saveProtocol;
                    const saveSettingsBtn = document.querySelector('#otherConfigForm button[type="submit"]');
                    if (saveSettingsBtn) saveSettingsBtn.textContent = ui.saveSettings;
                    const saveAdvancedBtn = document.querySelector('#advancedConfigForm button[type="submit"]');
                    if (saveAdvancedBtn) saveAdvancedBtn.textContent = ui.saveAdvanced;
                    const refreshBtn = document.querySelector('button[onclick="loadCurrentConfig()"]');
                    if (refreshBtn) refreshBtn.textContent = ui.refresh;
                    const resetBtn = document.querySelector('button[onclick="resetAllConfig()"]');
                    if (resetBtn) resetBtn.textContent = ui.reset;
                }

                function changeLanguage(lang) {
                    localStorage.setItem('preferredLanguage', lang);
                    const expiryDate = new Date();
                    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
                    document.cookie = 'preferredLanguage=' + lang + '; path=/; expires=' + expiryDate.toUTCString() + '; SameSite=Lax';
                    applyLanguage(lang);
                    showToast(isFarsi ? 'زبان بدون رفرش اعمال شد' : 'Language changed without refresh', 'success');
                }
                
                // On load: theme + language sync
                window.addEventListener('DOMContentLoaded', function() {
                    const themeToggle = document.getElementById('themeToggle');
                    function setTheme(theme) {
                        document.documentElement.dataset.theme = theme;
                        localStorage.setItem('preferredTheme', theme);
                        if (themeToggle) themeToggle.textContent = theme === 'light' ? '☀️' : '🌙';
                    }
                    const savedTheme = localStorage.getItem('preferredTheme');
                    if (savedTheme) {
                        setTheme(savedTheme);
                    } else {
                        const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
                        setTheme(prefersLight ? 'light' : 'dark');
                    }
                    if (themeToggle) {
                        themeToggle.addEventListener('click', () => {
                            const current = document.documentElement.dataset.theme || 'dark';
                            setTheme(current === 'light' ? 'dark' : 'light');
                        });
                    }

                    const savedLang = localStorage.getItem('preferredLanguage') || getCookie('preferredLanguage');
                    const urlParams = new URLSearchParams(window.location.search);
                    const urlLang = urlParams.get('lang');
                    
                    // If lang is present in the URL, persist it and then remove it
                    if (urlLang) {
                        const currentUrl = new URL(window.location.href);
                        currentUrl.searchParams.delete('lang');
                        const newUrl = currentUrl.toString();
                        
                        // Persist language
                        const expiryDate = new Date();
                        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
                        document.cookie = 'preferredLanguage=' + urlLang + '; path=/; expires=' + expiryDate.toUTCString() + '; SameSite=Lax';
                        localStorage.setItem('preferredLanguage', urlLang);
                        
                        // Use history API to remove URL param without refresh
                        window.history.replaceState({}, '', newUrl);
                    } else if (savedLang) {
                        // Sync cookie if localStorage has a value
                        const expiryDate = new Date();
                        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
                        document.cookie = 'preferredLanguage=' + savedLang + '; path=/; expires=' + expiryDate.toUTCString() + '; SameSite=Lax';
                    }
                    const activeLang = urlLang || savedLang || (isFarsi ? 'fa' : 'en');
                    applyLanguage(activeLang);
                    const languageSelector = document.getElementById('languageSelector');
                    if (languageSelector) {
                        languageSelector.value = activeLang.startsWith('fa') ? 'fa' : 'en';
                    }

                    // One-page navigation (keep all cards visible and scroll to section)
                    const stepTarget = {
                        server: 'card-status',
                        client: 'card-client',
                        advanced: 'advancedCard',
                        links: 'card-links',
                    };
                    function setWizardStep(step, shouldScroll) {
                        if (!stepTarget[step]) step = 'server';
                        localStorage.setItem('pimx_wizard_step', step);
                        document.querySelectorAll('.step-btn').forEach((btn) => {
                            btn.setAttribute('aria-current', btn.dataset.step === step ? 'true' : 'false');
                        });
                        if (shouldScroll) {
                            const target = document.getElementById(stepTarget[step]);
                            if (target && target.style.display !== 'none') {
                                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                        }
                    }
                    const savedStep = localStorage.getItem('pimx_wizard_step') || 'server';
                    document.querySelectorAll('.step-btn').forEach((btn) => {
                        btn.addEventListener('click', () => setWizardStep(btn.dataset.step, true));
                    });
                    setWizardStep(savedStep, false);

                    // Staggered reveal + loader
                    document.querySelectorAll('.card').forEach((card, index) => {
                        card.style.setProperty('--reveal-delay', (100 + index * 70) + 'ms');
                    });
                    const loader = document.getElementById('pageLoader');
                    const seenIntro = sessionStorage.getItem('pimx_intro_seen') === '1';
                    const finishIntro = () => {
                        document.body.classList.add('loaded');
                        document.body.classList.add('await-scroll');
                        if (loader) {
                            loader.classList.add('is-hidden');
                            setTimeout(() => {
                                if (loader.parentNode) loader.parentNode.removeChild(loader);
                            }, 560);
                        }
                        const unlockOnScroll = () => {
                            document.body.classList.add('scrolled');
                            window.removeEventListener('scroll', unlockOnScroll);
                        };
                        window.addEventListener('scroll', unlockOnScroll, { passive: true });
                        if (window.scrollY > 8) unlockOnScroll();
                        sessionStorage.setItem('pimx_intro_seen', '1');
                    };
                    setTimeout(finishIntro, seenIntro ? 120 : 1500);

                    // Typewriter animation for subtitle (first visual load only)
                    const subtitleEl = document.querySelector('.subtitle');
                    if (subtitleEl && !seenIntro) {
                        const fullText = subtitleEl.textContent || '';
                        subtitleEl.textContent = '';
                        subtitleEl.classList.add('typing');
                        let index = 0;
                        const write = () => {
                            if (index >= fullText.length) {
                                subtitleEl.classList.remove('typing');
                                return;
                            }
                            subtitleEl.textContent += fullText.charAt(index);
                            index += 1;
                            setTimeout(write, 18);
                        };
                        setTimeout(write, 350);
                    }
                });
            
            function tryOpenApp(schemeUrl, fallbackCallback, timeout) {
                timeout = timeout || 2500;
                var appOpened = false;
                var callbackExecuted = false;
                var startTime = Date.now();
                
                var blurHandler = function() {
                    var elapsed = Date.now() - startTime;
                    if (elapsed < 3000 && !callbackExecuted) {
                        appOpened = true;
                    }
                };
                
                window.addEventListener('blur', blurHandler);
                
                var hiddenHandler = function() {
                    var elapsed = Date.now() - startTime;
                    if (elapsed < 3000 && !callbackExecuted) {
                        appOpened = true;
                    }
                };
                
                document.addEventListener('visibilitychange', hiddenHandler);
                
                var iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                iframe.style.width = '1px';
                iframe.style.height = '1px';
                iframe.src = schemeUrl;
                document.body.appendChild(iframe);
                
                setTimeout(function() {
                    iframe.parentNode && iframe.parentNode.removeChild(iframe);
                    window.removeEventListener('blur', blurHandler);
                    document.removeEventListener('visibilitychange', hiddenHandler);
                    
                    if (!callbackExecuted) {
                        callbackExecuted = true;
                        if (!appOpened && fallbackCallback) {
                            fallbackCallback();
                        }
                    }
                }, timeout);
            }
            
            function generateClientLink(clientType, clientName) {
                var currentUrl = window.location.href;
                var subscriptionUrl = currentUrl + "/sub";
                var schemeUrl = '';
                var displayName = clientName || '';
                var finalUrl = subscriptionUrl;
                
                if (clientType === atob('djJyYXk=')) {
                    finalUrl = subscriptionUrl;
                    var urlElement = document.getElementById("clientSubscriptionUrl");
                    urlElement.textContent = finalUrl;
                    urlElement.style.display = "block";
                    urlElement.style.overflowWrap = "break-word";
                    urlElement.style.wordBreak = "break-all";
                    urlElement.style.overflowX = "auto";
                    urlElement.style.maxWidth = "100%";
                    urlElement.style.boxSizing = "border-box";
                    
                    if (clientName === 'V2RAY') {
                        navigator.clipboard.writeText(finalUrl).then(function() {
                                showToast(displayName + " " + t.subscriptionCopied, 'success');
                        });
                    } else if (clientName === 'Shadowrocket') {
                        schemeUrl = 'shadowrocket://add/' + encodeURIComponent(finalUrl);
                        tryOpenApp(schemeUrl, function() {
                            navigator.clipboard.writeText(finalUrl).then(function() {
                                    showToast(displayName + " " + t.subscriptionCopied, 'success');
                            });
                        });
                    } else if (clientName === 'V2RAYNG') {
                        schemeUrl = 'v2rayng://install?url=' + encodeURIComponent(finalUrl);
                        tryOpenApp(schemeUrl, function() {
                            navigator.clipboard.writeText(finalUrl).then(function() {
                                    showToast(displayName + " " + t.subscriptionCopied, 'success');
                            });
                        });
                    } else if (clientName === 'NEKORAY') {
                        schemeUrl = 'nekoray://install-config?url=' + encodeURIComponent(finalUrl);
                        tryOpenApp(schemeUrl, function() {
                            navigator.clipboard.writeText(finalUrl).then(function() {
                                    showToast(displayName + " " + t.subscriptionCopied, 'success');
                            });
                        });
                    }
                } else {
                    // Check whether ECH is enabled
                    var echEnabled = document.getElementById('ech') && document.getElementById('ech').checked;
                    
                    // If ECH is enabled and the target is Clash, use the backend endpoint directly
                    if (echEnabled && clientType === atob('Y2xhc2g=')) {
                        finalUrl = subscriptionUrl + "?target=" + clientType;
                        var urlElement = document.getElementById("clientSubscriptionUrl");
                        urlElement.textContent = finalUrl;
                        urlElement.style.display = "block";
                        urlElement.style.overflowWrap = "break-word";
                        urlElement.style.wordBreak = "break-all";
                        urlElement.style.overflowX = "auto";
                        urlElement.style.maxWidth = "100%";
                        urlElement.style.boxSizing = "border-box";
                        
                        if (clientName === 'STASH') {
                            schemeUrl = 'stash://install?url=' + encodeURIComponent(finalUrl);
                            displayName = 'STASH';
                        } else {
                            schemeUrl = 'clash://install-config?url=' + encodeURIComponent(finalUrl);
                            displayName = 'CLASH';
                        }
                        
                        if (schemeUrl) {
                            tryOpenApp(schemeUrl, function() {
                                navigator.clipboard.writeText(finalUrl).then(function() {
                                        showToast(displayName + " " + t.subscriptionCopied, 'success');
                                });
                            });
                        } else {
                            navigator.clipboard.writeText(finalUrl).then(function() {
                                    showToast(displayName + " " + t.subscriptionCopied, 'success');
                            });
                        }
                    } else {
                        // Otherwise, use the subscription converter
                        var encodedUrl = encodeURIComponent(subscriptionUrl);
                        finalUrl = SUB_CONVERTER_URL + "?target=" + clientType + "&url=" + encodedUrl + "&insert=false&config=" + encodeURIComponent(REMOTE_CONFIG_URL) + "&emoji=true&list=false&xudp=false&udp=false&tfo=false&expand=true&scv=false&fdn=false&new_name=true";
                        var urlElement = document.getElementById("clientSubscriptionUrl");
                        urlElement.textContent = finalUrl;
                        urlElement.style.display = "block";
                        urlElement.style.overflowWrap = "break-word";
                        urlElement.style.wordBreak = "break-all";
                        urlElement.style.overflowX = "auto";
                        urlElement.style.maxWidth = "100%";
                        urlElement.style.boxSizing = "border-box";
                        
                        if (clientType === atob('Y2xhc2g=')) {
                            if (clientName === 'STASH') {
                                schemeUrl = 'stash://install?url=' + encodeURIComponent(finalUrl);
                                displayName = 'STASH';
                            } else {
                                schemeUrl = 'clash://install-config?url=' + encodeURIComponent(finalUrl);
                                displayName = 'CLASH';
                            }
                        } else if (clientType === atob('c3VyZ2U=')) {
                            schemeUrl = 'surge:///install-config?url=' + encodeURIComponent(finalUrl);
                            displayName = 'SURGE';
                        } else if (clientType === atob('c2luZ2JveA==')) {
                            schemeUrl = 'sing-box://install-config?url=' + encodeURIComponent(finalUrl);
                            displayName = 'SING-BOX';
                        } else if (clientType === atob('bG9vbg==')) {
                            schemeUrl = 'loon://install?url=' + encodeURIComponent(finalUrl);
                            displayName = 'LOON';
                        } else if (clientType === atob('cXVhbng=')) {
                            schemeUrl = 'quantumult-x://install-config?url=' + encodeURIComponent(finalUrl);
                            displayName = 'QUANTUMULT X';
                        }
                        
                        if (schemeUrl) {
                            tryOpenApp(schemeUrl, function() {
                                navigator.clipboard.writeText(finalUrl).then(function() {
                                        showToast(displayName + " " + t.subscriptionCopied, 'success');
                                });
                            });
                        } else {
                            navigator.clipboard.writeText(finalUrl).then(function() {
                                    showToast(displayName + " " + t.subscriptionCopied, 'success');
                            });
                        }
                    }
                }
            }
            
            function createMatrixRain() {
                const matrixContainer = document.getElementById('matrixCodeRain');
                const matrixChars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
                const columns = Math.floor(window.innerWidth / 18);
                
                for (let i = 0; i < columns; i++) {
                    const column = document.createElement('div');
                    column.className = 'matrix-column';
                    column.style.left = (i * 18) + 'px';
                    column.style.animationDelay = Math.random() * 15 + 's';
                    column.style.animationDuration = (Math.random() * 15 + 8) + 's';
                    column.style.fontSize = (Math.random() * 4 + 12) + 'px';
                    column.style.opacity = Math.random() * 0.8 + 0.2;
                    
                    let text = '';
                    const charCount = Math.floor(Math.random() * 30 + 20);
                    for (let j = 0; j < charCount; j++) {
                        const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
                        const brightness = Math.random() > 0.1 ? '#00ff00' : '#00aa00';
                        text += '<span style="color: ' + brightness + ';">' + char + '</span><br>';
                    }
                    column.innerHTML = text;
                    matrixContainer.appendChild(column);
                }
                
                setInterval(function() {
                    const columns = matrixContainer.querySelectorAll('.matrix-column');
                    columns.forEach(function(column) {
                        if (Math.random() > 0.95) {
                            const chars = column.querySelectorAll('span');
                            if (chars.length > 0) {
                                const randomChar = chars[Math.floor(Math.random() * chars.length)];
                                randomChar.style.color = '#ffffff';
                                setTimeout(function() {
                                    randomChar.style.color = '#00ff00';
                                }, 200);
                            }
                        }
                    });
                }, 100);
            }
            
            async function checkSystemStatus() {
                try {
                    const cfStatus = document.getElementById('cfStatus');
                    const regionStatus = document.getElementById('regionStatus');
                    const geoInfo = document.getElementById('geoInfo');
                    const backupStatus = document.getElementById('backupStatus');
                    const currentIP = document.getElementById('currentIP');
                    const regionMatch = document.getElementById('regionMatch');
                    
                        // Read current language (prefer cookie/localStorage)
                        function getCookie(name) {
                            const value = '; ' + document.cookie;
                            const parts = value.split('; ' + name + '=');
                            if (parts.length === 2) return parts.pop().split(';').shift();
                            return null;
                        }
                        
                        const browserLang = navigator.language || navigator.userLanguage || '';
                        const savedLang = localStorage.getItem('preferredLanguage') || getCookie('preferredLanguage');
                        let isFarsi = false;
                        
                        if (savedLang === 'fa' || savedLang === 'fa-IR') {
                            isFarsi = true;
                        } else {
                            isFarsi = browserLang.includes('fa') || browserLang.includes('fa-IR');
                        }
                        
                        const translations = {
                            en: {
                                workerRegion: 'Worker region: ',
                                detectionMethod: 'Detection: ',
                                proxyIPStatus: 'ProxyIP: ',
                                currentIP: 'Current IP: ',
                                regionMatch: 'Region matching: ',
                                regionNames: {
                                    'US': '🇺🇸 United States', 'SG': '🇸🇬 Singapore', 'JP': '🇯🇵 Japan',
                                    'KR': '🇰🇷 South Korea', 'DE': '🇩🇪 Germany', 'SE': '🇸🇪 Sweden', 'NL': '🇳🇱 Netherlands',
                                    'FI': '🇫🇮 Finland', 'GB': '🇬🇧 United Kingdom'
                                },
                                customIPMode: 'Custom ProxyIP mode (p is set)',
                                customIPModeDesc: 'Custom IP mode (region matching disabled)',
                                usingCustomProxyIP: 'Using ProxyIP: ',
                                customIPConfig: ' (p variable)',
                                customIPModeDisabled: 'Custom IP mode: region selection disabled',
                                manualRegion: 'Manual region',
                                manualRegionDesc: ' (manual)',
                                proxyIPAvailable: '10/10 available (default ProxyIP domain reachable)',
                                smartSelection: 'Smart selection in progress',
                                sameRegionIP: 'Same-region target available (1)',
                                cloudflareDetection: 'Cloudflare built-in detection',
                                detectionFailed: 'Detection failed',
                                unknown: 'Unknown'
                            },
                            fa: {
                                workerRegion: 'منطقه Worker: ',
                                detectionMethod: 'روش تشخیص: ',
                                proxyIPStatus: 'وضعیت ProxyIP: ',
                                currentIP: 'IP فعلی: ',
                                regionMatch: 'تطبیق منطقه: ',
                                regionNames: {
                                    'US': '🇺🇸 آمریکا', 'SG': '🇸🇬 سنگاپور', 'JP': '🇯🇵 ژاپن',
                                    'KR': '🇰🇷 کره جنوبی', 'DE': '🇩🇪 آلمان', 'SE': '🇸🇪 سوئد', 'NL': '🇳🇱 هلند',
                                    'FI': '🇫🇮 فنلاند', 'GB': '🇬🇧 بریتانیا'
                                },
                                customIPMode: 'حالت ProxyIP سفارشی (متغیر p فعال است)',
                                customIPModeDesc: 'حالت IP سفارشی (تطبیق منطقه غیرفعال است)',
                                usingCustomProxyIP: 'استفاده از ProxyIP سفارشی: ',
                                customIPConfig: ' (پیکربندی متغیر p)',
                                customIPModeDisabled: 'حالت IP سفارشی، انتخاب منطقه غیرفعال است',
                                manualRegion: 'تعیین منطقه دستی',
                                manualRegionDesc: ' (تعیین دستی)',
                                proxyIPAvailable: '10/10 در دسترس (دامنه پیش‌فرض ProxyIP در دسترس است)',
                                smartSelection: 'انتخاب هوشمند نزدیک در حال انجام است',
                                sameRegionIP: 'IP هم‌منطقه در دسترس است (1)',
                                cloudflareDetection: 'تشخیص داخلی Cloudflare',
                                detectionFailed: 'تشخیص ناموفق',
                                unknown: 'ناشناخته'
                            }
                        };
                        
                        const t = translations[isFarsi ? 'fa' : 'en'];
                    
                    let detectedRegion = 'US'; // Default
                    let isCustomIPMode = false;
                    let isManualRegionMode = false;
                    try {
                        const response = await fetch(window.location.pathname + '/region');
                        const data = await response.json();
                        
                        if (data.region === 'CUSTOM') {
                            isCustomIPMode = true;
                            detectedRegion = 'CUSTOM';
                            
                            // Fetch custom IP details
                                const customIPInfo = data.ci || t.unknown;
                            
                                geoInfo.innerHTML = t.detectionMethod + '<span style="color: #ffaa00;">⚙️ ' + t.customIPMode + '</span>';
                                regionStatus.innerHTML = t.workerRegion + '<span style="color: #ffaa00;">🔧 ' + t.customIPModeDesc + '</span>';
                            
                            // Show custom IP configuration (with IP)
                                if (backupStatus) backupStatus.innerHTML = t.proxyIPStatus + '<span style="color: #ffaa00;">🔧 ' + t.usingCustomProxyIP + customIPInfo + '</span>';
                                if (currentIP) currentIP.innerHTML = t.currentIP + '<span style="color: #ffaa00;">✅ ' + customIPInfo + t.customIPConfig + '</span>';
                                if (regionMatch) regionMatch.innerHTML = t.regionMatch + '<span style="color: #ffaa00;">⚠️ ' + t.customIPModeDisabled + '</span>';
                            
                            return; // Early return; skip remaining region-matching logic
                            } else if (data.detectionMethod === 'Manual region' || data.detectionMethod === 'تعیین منطقه دستی') {
                            isManualRegionMode = true;
                            detectedRegion = data.region;
                            
                                geoInfo.innerHTML = t.detectionMethod + '<span style="color: #44aa44;">' + t.manualRegion + '</span>';
                                regionStatus.innerHTML = t.workerRegion + '<span style="color: #44ff44;">🎯 ' + (t.regionNames[detectedRegion] || detectedRegion) + t.manualRegionDesc + '</span>';
                            
                            // Show configured status instead of detection
                                if (backupStatus) backupStatus.innerHTML = t.proxyIPStatus + '<span style="color: #44ff44;">✅ ' + t.proxyIPAvailable + '</span>';
                                if (currentIP) currentIP.innerHTML = t.currentIP + '<span style="color: #44ff44;">✅ ' + t.smartSelection + '</span>';
                                if (regionMatch) regionMatch.innerHTML = t.regionMatch + '<span style="color: #44ff44;">✅ ' + t.sameRegionIP + '</span>';
                            
                            return; // Early return; skip remaining region-matching logic
                            } else if (data.region) {
                            detectedRegion = data.region;
                        }
                        
                            geoInfo.innerHTML = t.detectionMethod + '<span style="color: #44ff44;">' + t.cloudflareDetection + '</span>';
                        
                    } catch (e) {
                            geoInfo.innerHTML = t.detectionMethod + '<span style="color: #ff4444;">' + t.detectionFailed + '</span>';
                    }
                    
                        regionStatus.innerHTML = t.workerRegion + '<span style="color: #44ff44;">✅ ' + (t.regionNames[detectedRegion] || detectedRegion) + '</span>';
                    
                    // Show configured status directly (skip detection)
                    if (backupStatus) {
                            backupStatus.innerHTML = t.proxyIPStatus + '<span style="color: #44ff44;">✅ ' + t.proxyIPAvailable + '</span>';
                    }
                    
                    if (currentIP) {
                            currentIP.innerHTML = t.currentIP + '<span style="color: #44ff44;">✅ ' + t.smartSelection + '</span>';
                    }
                    
                    if (regionMatch) {
                            regionMatch.innerHTML = t.regionMatch + '<span style="color: #44ff44;">✅ ' + t.sameRegionIP + '</span>';
                    }
                    
                } catch (error) {
                        function getCookie(name) {
                            const value = '; ' + document.cookie;
                            const parts = value.split('; ' + name + '=');
                            if (parts.length === 2) return parts.pop().split(';').shift();
                            return null;
                        }
                        
                        const browserLang = navigator.language || navigator.userLanguage || '';
                        const savedLang = localStorage.getItem('preferredLanguage') || getCookie('preferredLanguage');
                        let isFarsi = false;
                        
                        if (savedLang === 'fa' || savedLang === 'fa-IR') {
                            isFarsi = true;
                        } else {
                            isFarsi = browserLang.includes('fa') || browserLang.includes('fa-IR');
                        }
                        
                        const translations = {
                            en: {
                                workerRegion: 'Worker region: ',
                                detectionMethod: 'Detection: ',
                                proxyIPStatus: 'ProxyIP: ',
                                currentIP: 'Current IP: ',
                                regionMatch: 'Region matching: ',
                                detectionFailed: 'Detection failed'
                            },
                            fa: {
                                workerRegion: 'منطقه Worker: ',
                                detectionMethod: 'روش تشخیص: ',
                                proxyIPStatus: 'وضعیت ProxyIP: ',
                                currentIP: 'IP فعلی: ',
                                regionMatch: 'تطبیق منطقه: ',
                                detectionFailed: 'تشخیص ناموفق'
                            }
                        };
                        
                        const t = translations[isFarsi ? 'fa' : 'en'];
                        
                        document.getElementById('regionStatus').innerHTML = t.workerRegion + '<span style="color: #ff4444;">❌ ' + t.detectionFailed + '</span>';
                        document.getElementById('geoInfo').innerHTML = t.detectionMethod + '<span style="color: #ff4444;">❌ ' + t.detectionFailed + '</span>';
                        document.getElementById('backupStatus').innerHTML = t.proxyIPStatus + '<span style="color: #ff4444;">❌ ' + t.detectionFailed + '</span>';
                        document.getElementById('currentIP').innerHTML = t.currentIP + '<span style="color: #ff4444;">❌ ' + t.detectionFailed + '</span>';
                        document.getElementById('regionMatch').innerHTML = t.regionMatch + '<span style="color: #ff4444;">❌ ' + t.detectionFailed + '</span>';
                }
            }
            
                async function testAPI() {
                    try {
                        function getCookie(name) {
                            const value = '; ' + document.cookie;
                            const parts = value.split('; ' + name + '=');
                            if (parts.length === 2) return parts.pop().split(';').shift();
                            return null;
                        }
                        
                        const browserLang = navigator.language || navigator.userLanguage || '';
                        const savedLang = localStorage.getItem('preferredLanguage') || getCookie('preferredLanguage');
                        let isFarsi = false;
                        
                        if (savedLang === 'fa' || savedLang === 'fa-IR') {
                            isFarsi = true;
                        } else {
                            isFarsi = browserLang.includes('fa') || browserLang.includes('fa-IR');
                        }
                        
                        const translations = {
                            en: {
                                apiTestResult: 'API result: ',
                                apiTestTime: 'Time: ',
                                apiTestFailed: 'API failed: ',
                                unknownError: 'Unknown error',
                                apiTestError: 'API test failed: '
                            },
                            fa: {
                                apiTestResult: 'نتیجه تشخیص API: ',
                                apiTestTime: 'زمان تشخیص: ',
                                apiTestFailed: 'تشخیص API ناموفق: ',
                                unknownError: 'خطای ناشناخته',
                                apiTestError: 'تست API ناموفق: '
                            }
                        };
                        
                        const t = translations[isFarsi ? 'fa' : 'en'];
                        
                    const response = await fetch(window.location.pathname + '/test-api');
                    const data = await response.json();
                    
                    if (data.detectedRegion) {
                            showToast(t.apiTestResult + data.detectedRegion + ' • ' + t.apiTestTime + data.timestamp, 'success');
                    } else {
                            showToast(t.apiTestFailed + (data.error || t.unknownError), 'error');
                    }
                } catch (error) {
                        function getCookie(name) {
                            const value = '; ' + document.cookie;
                            const parts = value.split('; ' + name + '=');
                            if (parts.length === 2) return parts.pop().split(';').shift();
                            return null;
                        }
                        
                        const browserLang = navigator.language || navigator.userLanguage || '';
                        const savedLang = localStorage.getItem('preferredLanguage') || getCookie('preferredLanguage');
                        let isFarsi = false;
                        
                        if (savedLang === 'fa' || savedLang === 'fa-IR') {
                            isFarsi = true;
                        } else {
                            isFarsi = browserLang.includes('fa') || browserLang.includes('fa-IR');
                        }
                        
                        const translations = {
                            en: { apiTestError: 'API test failed: ' },
                            fa: { apiTestError: 'تست API ناموفق: ' }
                        };
                        
                        const t = translations[isFarsi ? 'fa' : 'en'];
                        showToast(t.apiTestError + error.message, 'error');
                }
            }
            
            // Settings/KV helpers
            async function checkKVStatus() {
                const apiUrl = window.location.pathname + '/api/config';
                
                try {
                    const response = await fetch(apiUrl);
                    
                        function getCookie(name) {
                            const value = '; ' + document.cookie;
                            const parts = value.split('; ' + name + '=');
                            if (parts.length === 2) return parts.pop().split(';').shift();
                            return null;
                        }
                        
                        const browserLang = navigator.language || navigator.userLanguage || '';
                        const savedLang = localStorage.getItem('preferredLanguage') || getCookie('preferredLanguage');
                        let isFarsi = false;
                        
                        if (savedLang === 'fa' || savedLang === 'fa-IR') {
                            isFarsi = true;
                        } else {
                            isFarsi = browserLang.includes('fa') || browserLang.includes('fa-IR');
                        }
                        
                    const translations = {
                        en: {
                            kvDisabled: '⚠️ KV not enabled/configured',
                            kvNotConfigured: 'KV is not configured.\\n\\nIn Cloudflare Workers:\\n1) Create a KV namespace\\n2) Bind it as variable C\\n3) Redeploy the code',
                            kvNotEnabled: 'KV is not configured',
                            kvEnabled: '✅ KV enabled — settings UI is available',
                            kvCheckFailed: '⚠️ KV check failed',
                            kvCheckFailedFormat: 'KV check failed: invalid response format',
                            kvCheckFailedStatus: 'KV check failed - status: ',
                            kvCheckFailedError: 'KV check failed - error: '
                        },
                        fa: {
                            kvDisabled: '⚠️ ذخیره‌سازی KV فعال نیست یا پیکربندی نشده است',
                            kvNotConfigured: 'ذخیره‌سازی KV پیکربندی نشده است، نمی‌توانید از عملکرد مدیریت تنظیمات استفاده کنید.\\n\\nلطفا در Cloudflare Workers:\\n1. فضای نام KV ایجاد کنید\\n2. متغیر محیطی C را پیوند دهید\\n3. کد را دوباره مستقر کنید',
                            kvNotEnabled: 'ذخیره‌سازی KV پیکربندی نشده است',
                            kvEnabled: '✅ ذخیره‌سازی KV فعال است، می‌توانید از مدیریت تنظیمات استفاده کنید',
                            kvCheckFailed: '⚠️ بررسی ذخیره‌سازی KV ناموفق',
                            kvCheckFailedFormat: 'بررسی ذخیره‌سازی KV ناموفق: خطای فرمت پاسخ',
                            kvCheckFailedStatus: 'بررسی ذخیره‌سازی KV ناموفق - کد وضعیت: ',
                            kvCheckFailedError: 'بررسی ذخیره‌سازی KV ناموفق - خطا: '
                        }
                    };
                    
                    const t = translations[isFarsi ? 'fa' : 'en'];
                        
                        if (response.status === 503) {
                            // KV not configured
                            document.getElementById('kvStatus').innerHTML = '<span style="color: #ffaa00;">' + t.kvDisabled + '</span>';
                            document.getElementById('configCard').style.display = 'block';
                            if (document.getElementById('advancedCard')) document.getElementById('advancedCard').style.display = 'none';
                            document.getElementById('currentConfig').textContent = t.kvNotConfigured;
                    } else if (response.ok) {
                        try {
                        const data = await response.json();
                        
                            // Check whether KV is enabled
                            if (data && data.kvEnabled === true) {
                                document.getElementById('kvStatus').innerHTML = '<span style="color: #44ff44;">' + t.kvEnabled + '</span>';
                                document.getElementById('configContent').style.display = 'block';
                                document.getElementById('configCard').style.display = 'block';
                                if (document.getElementById('advancedCard')) document.getElementById('advancedCard').style.display = 'block';
                                await loadCurrentConfig();
                            } else {
                                document.getElementById('kvStatus').innerHTML = '<span style="color: #ffaa00;">' + t.kvDisabled + '</span>';
                                document.getElementById('configCard').style.display = 'block';
                                if (document.getElementById('advancedCard')) document.getElementById('advancedCard').style.display = 'none';
                                document.getElementById('currentConfig').textContent = t.kvNotEnabled;
                                }
                        } catch (jsonError) {
                            document.getElementById('kvStatus').innerHTML = '<span style="color: #ffaa00;">' + t.kvCheckFailed + '</span>';
                            document.getElementById('configCard').style.display = 'block';
                            if (document.getElementById('advancedCard')) document.getElementById('advancedCard').style.display = 'none';
                            document.getElementById('currentConfig').textContent = t.kvCheckFailedFormat;
                        }
                    } else {
                        document.getElementById('kvStatus').innerHTML = '<span style="color: #ffaa00;">' + t.kvDisabled + '</span>';
                        document.getElementById('configCard').style.display = 'block';
                        if (document.getElementById('advancedCard')) document.getElementById('advancedCard').style.display = 'none';
                        document.getElementById('currentConfig').textContent = t.kvCheckFailedStatus + response.status;
                    }
                } catch (error) {
                    function getCookie(name) {
                        const value = '; ' + document.cookie;
                        const parts = value.split('; ' + name + '=');
                        if (parts.length === 2) return parts.pop().split(';').shift();
                        return null;
                    }
                    
                    const browserLang = navigator.language || navigator.userLanguage || '';
                    const savedLang = localStorage.getItem('preferredLanguage') || getCookie('preferredLanguage');
                    let isFarsi = false;
                    
                    if (savedLang === 'fa' || savedLang === 'fa-IR') {
                        isFarsi = true;
                    } else {
                        isFarsi = browserLang.includes('fa') || browserLang.includes('fa-IR');
                    }
                    
                    const translations = {
                        en: {
                            kvDisabled: '⚠️ KV not enabled/configured',
                            kvCheckFailedError: 'KV check failed - error: '
                        },
                        fa: {
                            kvDisabled: '⚠️ ذخیره‌سازی KV فعال نیست یا پیکربندی نشده است',
                            kvCheckFailedError: 'بررسی ذخیره‌سازی KV ناموفق - خطا: '
                        }
                    };
                    
                    const t = translations[isFarsi ? 'fa' : 'en'];
                    
                    document.getElementById('kvStatus').innerHTML = '<span style="color: #ffaa00;">' + t.kvDisabled + '</span>';
                    document.getElementById('configCard').style.display = 'block';
                    if (document.getElementById('advancedCard')) document.getElementById('advancedCard').style.display = 'none';
                    document.getElementById('currentConfig').textContent = t.kvCheckFailedError + error.message;
                }
            }
            
            async function loadCurrentConfig() {
                const apiUrl = window.location.pathname + '/api/config';
                
                try {
                    const response = await fetch(apiUrl);
                    
                    if (response.status === 503) {
                        document.getElementById('currentConfig').textContent = isFarsi ? 'KV پیکربندی نشده است؛ بارگذاری تنظیمات ممکن نیست.' : 'KV is not configured; cannot load settings.';
                        return;
                    }
                    if (!response.ok) {
                        const errorText = await response.text();
                        document.getElementById('currentConfig').textContent = (isFarsi ? 'بارگذاری ناموفق: ' : 'Load failed: ') + errorText;
                        return;
                    }
                    const config = await response.json();
                    
                    // Filter out internal field kvEnabled
                    const displayConfig = {};
                    for (const [key, value] of Object.entries(config)) {
                        if (key !== 'kvEnabled') {
                            displayConfig[key] = value;
                        }
                    }
                    
                    let configText = (isFarsi ? 'پیکربندی فعلی:\\n' : 'Current config:\\n');
                    if (Object.keys(displayConfig).length === 0) {
                        configText += (isFarsi ? '(بدون تنظیمات)' : '(empty)');
                    } else {
                        for (const [key, value] of Object.entries(displayConfig)) {
                            configText += key + ': ' + (value || (isFarsi ? '(تنظیم نشده)' : '(not set)')) + '\\n';
                        }
                    }
                    
                    document.getElementById('currentConfig').textContent = configText;
                    
                    // Update form values
                    document.getElementById('wkRegion').value = config.wk || '';
                    document.getElementById('ev').checked = config.ev !== 'no';
                    document.getElementById('et').checked = config.et === 'yes';
                    document.getElementById('ex').checked = config.ex === 'yes';
                    document.getElementById('ech').checked = config.ech === 'yes';
                    document.getElementById('tp').value = config.tp || '';
                    if (document.getElementById('customDNS')) {
                        document.getElementById('customDNS').value = config.customDNS || '';
                    }
                    if (document.getElementById('customECHDomain')) {
                        document.getElementById('customECHDomain').value = config.customECHDomain || '';
                    }
                    document.getElementById('scu').value = config.scu || '';
                    document.getElementById('epd').checked = config.epd !== 'no';
                    document.getElementById('epi').checked = config.epi !== 'no';
                    document.getElementById('egi').checked = config.egi !== 'no';
                    if (document.getElementById('ipv4Enabled')) document.getElementById('ipv4Enabled').checked = config.ipv4 !== 'no';
                    if (document.getElementById('ipv6Enabled')) document.getElementById('ipv6Enabled').checked = config.ipv6 !== 'no';
                    if (document.getElementById('ispMobile')) document.getElementById('ispMobile').checked = config.ispMobile !== 'no';
                    if (document.getElementById('ispUnicom')) document.getElementById('ispUnicom').checked = config.ispUnicom !== 'no';
                    if (document.getElementById('ispTelecom')) document.getElementById('ispTelecom').checked = config.ispTelecom !== 'no';
                    document.getElementById('customPath').value = config.d || '';
                    document.getElementById('customIP').value = config.p || '';
                    document.getElementById('yx').value = config.yx || '';
                    document.getElementById('yxURL').value = config.yxURL || '';
                    document.getElementById('socksConfig').value = config.s || '';
                    document.getElementById('customHomepage').value = config.homepage || '';
                    document.getElementById('apiEnabled').value = config.ae || '';
                    document.getElementById('regionMatching').value = config.rm || '';
                    document.getElementById('downgradeControl').value = config.qj || '';
                    document.getElementById('portControl').value = config.dkby || '';
                    document.getElementById('preferredControl').value = config.yxby || '';
                    
                    // Update path type display
                    updatePathTypeStatus(config.d);
                    
                    // If p is set, disable wk region selection
                    updateWkRegionState();
                    
                } catch (error) {
                    document.getElementById('currentConfig').textContent = (isFarsi ? 'بارگذاری ناموفق: ' : 'Load failed: ') + error.message;
                }
            }
            
            // Update path type display
            function updatePathTypeStatus(cp) {
                const pathTypeStatus = document.getElementById('pathTypeStatus');
                const currentUrl = window.location.href;
                const pathParts = window.location.pathname.split('/').filter(p => p);
                const currentPath = pathParts.length > 0 ? pathParts[0] : '';
                
                if (cp && cp.trim()) {
                    // Use custom path (d)
                    pathTypeStatus.innerHTML = '<div style="color: #44ff44;">' + (isFarsi ? 'نوع استفاده' : 'Mode') + ': <strong>' + (isFarsi ? 'مسیر سفارشی (d)' : 'Custom path (d)') + '</strong></div>' +
                        '<div style="margin-top: 5px; color: #00ff00;">' + (isFarsi ? 'مسیر فعلی' : 'Current path') + ': <span style="color: #ffaa00;">' + cp + '</span></div>' +
                        '<div style="margin-top: 5px; font-size: 0.9rem; color: #00aa00;">' + (isFarsi ? 'آدرس دسترسی' : 'Access URL') + ': ' + 
                        (currentUrl.split('/')[0] + '//' + currentUrl.split('/')[2]) + cp + '/sub</div>';
                } else {
                    // Use UUID path (u)
                    pathTypeStatus.innerHTML = '<div style="color: #44ff44;">' + (isFarsi ? 'نوع استفاده' : 'Mode') + ': <strong>' + (isFarsi ? 'مسیر UUID (u)' : 'UUID path (u)') + '</strong></div>' +
                        '<div style="margin-top: 5px; color: #00ff00;">' + (isFarsi ? 'مسیر فعلی' : 'Current path') + ': <span style="color: #ffaa00;">' + (currentPath || '(UUID)') + '</span></div>' +
                        '<div style="margin-top: 5px; font-size: 0.9rem; color: #00aa00;">' + (isFarsi ? 'آدرس دسترسی' : 'Access URL') + ': ' + currentUrl.split('/sub')[0] + '/sub</div>';
                }
            }
            
            // Update wk selector enabled/disabled state
            function updateWkRegionState() {
                const customIPInput = document.getElementById('customIP');
                const wkRegion = document.getElementById('wkRegion');
                const wkRegionHint = document.getElementById('wkRegionHint');
                
                if (customIPInput && wkRegion) {
                    const hasCustomIP = customIPInput.value.trim() !== '';
                    wkRegion.disabled = hasCustomIP;
                    
                    // Add visual feedback
                    if (hasCustomIP) {
                        wkRegion.style.opacity = '0.5';
                        wkRegion.style.cursor = 'not-allowed';
                        wkRegion.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                        // Show hint
                        if (wkRegionHint) {
                            wkRegionHint.style.display = 'block';
                            wkRegionHint.style.color = '#ffaa00';
                        }
                    } else {
                        wkRegion.style.opacity = '1';
                        wkRegion.style.cursor = 'pointer';
                        wkRegion.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                        // Hide hint
                        if (wkRegionHint) {
                            wkRegionHint.style.display = 'none';
                        }
                    }
                }
            }
            
            async function saveConfig(configData) {
                const apiUrl = window.location.pathname + '/api/config';
                
                try {
                    const response = await fetch(apiUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(configData)
                    });
                    
                    
                    if (response.status === 503) {
                        showStatus(isFarsi ? 'KV پیکربندی نشده است؛ ذخیره ممکن نیست. لطفاً ابتدا KV را با نام C وصل کنید.' : 'KV is not configured; cannot save. Please bind a KV namespace as C first.', 'error');
                        return;
                    }
                    
                    if (!response.ok) {
                        const errorText = await response.text();
                        
                        // Try parsing JSON error response
                        try {
                            const errorData = JSON.parse(errorText);
                            showStatus(errorData.message || (isFarsi ? 'ذخیره ناموفق' : 'Save failed'), 'error');
                        } catch (parseError) {
                            // If not JSON, show raw text
                            showStatus((isFarsi ? 'ذخیره ناموفق: ' : 'Save failed: ') + errorText, 'error');
                        }
                        return;
                    }
                    
                    const result = await response.json();
                    
                    showStatus(result.message, result.success ? 'success' : 'error');
                    
                    if (result.success) {
                        await loadCurrentConfig();
                        // Update wk selector state
                        updateWkRegionState();
                        await checkSystemStatus();
                        await checkECHStatus();
                    } else {
                    }
                } catch (error) {
                    showStatus((isFarsi ? 'ذخیره ناموفق: ' : 'Save failed: ') + error.message, 'error');
                }
            }
            
            function showStatus(message, type) {
                const statusDiv = document.getElementById('statusMessage');
                statusDiv.textContent = message;
                statusDiv.style.display = 'block';
                statusDiv.style.color = type === 'success' ? '#00ff00' : '#ff0000';
                statusDiv.style.borderColor = type === 'success' ? '#00ff00' : '#ff0000';
                
                setTimeout(function() {
                    statusDiv.style.display = 'none';
                }, 3000);
            }
            
            async function resetAllConfig() {
                if (confirm(isFarsi ? 'آیا مطمئن هستید که می‌خواهید همه تنظیمات را ریست کنید؟ این کار تمام KV را پاک می‌کند و به مقادیر محیطی برمی‌گرداند.' : 'Reset all settings? This clears all KV config and falls back to environment variables.')) {
                    try {
                        const response = await fetch(window.location.pathname + '/api/config', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ 
                                wk: '',
                                d: '',
                                p: '',
                                yx: '',
                                yxURL: '',
                                s: '', ae: '',
                                rm: '',
                                qj: '',
                                dkby: '',
                                yxby: '', ev: '', et: '', ex: '', tp: '', scu: '', epd: '', epi: '', egi: '',
                                ipv4: '', ipv6: '', ispMobile: '', ispUnicom: '', ispTelecom: '',
                                homepage: ''
                            })
                        });
                        
                        if (response.status === 503) {
                            showStatus(isFarsi ? 'KV پیکربندی نشده است؛ ریست ممکن نیست.' : 'KV is not configured; cannot reset.', 'error');
                            return;
                        }
                        
                        if (!response.ok) {
                            const errorText = await response.text();
                            
                            // Try parsing JSON error response
                            try {
                                const errorData = JSON.parse(errorText);
                                showStatus(errorData.message || 'Reset failed', 'error');
                            } catch (parseError) {
                                // If not JSON, show raw text
                                showStatus('Reset failed: ' + errorText, 'error');
                            }
                            return;
                        }
                        
                        const result = await response.json();
                        showStatus(result.message || 'Settings reset', result.success ? 'success' : 'error');
                        
                        if (result.success) {
                            await loadCurrentConfig();
                            // Update wk selector state
                            updateWkRegionState();
                            await checkSystemStatus();
                            await checkECHStatus();
                        }
                    } catch (error) {
                        showStatus('Reset failed: ' + error.message, 'error');
                    }
                }
            }
            
            async function checkECHStatus() {
                const echStatusEl = document.getElementById('echStatus');
                
                if (!echStatusEl) return;
                
                try {
                    const currentUrl = window.location.href;
                    const subscriptionUrl = currentUrl + '/sub';
                    
                    echStatusEl.innerHTML = (isFarsi ? 'وضعیت ECH: ' : 'ECH status: ') + '<span style="color: #ffaa00;">' + (isFarsi ? 'در حال بررسی...' : 'Checking...') + '</span>';
                    
                    const response = await fetch(subscriptionUrl, {
                        method: 'GET',
                        headers: {
                            'Accept': 'text/plain'
                        }
                    });
                    
                    const echStatusHeader = response.headers.get('X-ECH-Status');
                    const echConfigLength = response.headers.get('X-ECH-Config-Length');
                    
                    if (echStatusHeader === 'ENABLED') {
                        echStatusEl.innerHTML = (isFarsi ? 'وضعیت ECH: ' : 'ECH status: ') + '<span style="color: #44ff44;">✅ ' + (isFarsi ? 'فعال' : 'Enabled') + (echConfigLength ? (isFarsi ? ' (طول پیکربندی: ' : ' (config length: ') + echConfigLength + ')' : '') + '</span>';
                    } else {
                        echStatusEl.innerHTML = (isFarsi ? 'وضعیت ECH: ' : 'ECH status: ') + '<span style="color: #ffaa00;">⚠️ ' + (isFarsi ? 'غیرفعال' : 'Disabled') + '</span>';
                    }
                } catch (error) {
                    echStatusEl.innerHTML = (isFarsi ? 'وضعیت ECH: ' : 'ECH status: ') + '<span style="color: #ff4444;">❌ ' + (isFarsi ? 'ناموفق: ' : 'Failed: ') + error.message + '</span>';
                }
            }
            
            document.addEventListener('DOMContentLoaded', function() {
                createMatrixRain();
                checkSystemStatus();
                checkKVStatus();
                checkECHStatus();
                
                // When ECH is enabled, force TLS-only
                const echCheckbox = document.getElementById('ech');
                const portControl = document.getElementById('portControl');
                if (echCheckbox && portControl) {
                    echCheckbox.addEventListener('change', function() {
                        if (this.checked) {
                            // When ECH is enabled, auto-set TLS-only to yes
                            portControl.value = 'yes';
                        }
                    });
                    
                    // On load, if ECH is checked, auto-set TLS-only
                    if (echCheckbox.checked) {
                        portControl.value = 'yes';
                    }
                }
                
                // Watch customIP changes and update wk selector
                const customIPInput = document.getElementById('customIP');
                if (customIPInput) {
                    customIPInput.addEventListener('input', function() {
                        updateWkRegionState();
                    });
                }
                
                // Bind form events
                const regionForm = document.getElementById('regionForm');
                if (regionForm) {
                    regionForm.addEventListener('submit', async function(e) {
                        e.preventDefault();
                        const wkRegion = document.getElementById('wkRegion').value;
                        await saveConfig({ wk: wkRegion });
                    });
                }
                
                const saveProtocolBtn = document.getElementById('saveProtocolBtn');
                if (saveProtocolBtn) {
                    saveProtocolBtn.addEventListener('click', async function(e) {
                        e.preventDefault();
                        const configData = { 
                            ev: document.getElementById('ev').checked ? 'yes' : 'no', 
                            et: document.getElementById('et').checked ? 'yes' : 'no', 
                            ex: document.getElementById('ex').checked ? 'yes' : 'no', 
                            ech: document.getElementById('ech').checked ? 'yes' : 'no',
                            tp: document.getElementById('tp').value,
                            customDNS: document.getElementById('customDNS').value,
                            customECHDomain: document.getElementById('customECHDomain').value
                        };
                        
                        if (!document.getElementById('ev').checked && 
                            !document.getElementById('et').checked && 
                            !document.getElementById('ex').checked) {
                            showToast(isFarsi ? 'حداقل باید یک پروتکل را فعال کنید!' : 'Please enable at least one protocol.', 'error');
                            return;
                        }
                        
                        await saveConfig(configData);
                    });
                }
                
                const otherConfigForm = document.getElementById('otherConfigForm');
                if (otherConfigForm) {
                    otherConfigForm.addEventListener('submit', async function(e) {
                        e.preventDefault();
                        const configData = { ev: document.getElementById('ev').checked ? 'yes' : 'no', et: document.getElementById('et').checked ? 'yes' : 'no', ex: document.getElementById('ex').checked ? 'yes' : 'no', ech: document.getElementById('ech').checked ? 'yes' : 'no', tp: document.getElementById('tp').value,
                            d: document.getElementById('customPath').value,
                            p: document.getElementById('customIP').value,
                            yx: document.getElementById('yx').value,
                            yxURL: document.getElementById('yxURL').value,
                            s: document.getElementById('socksConfig').value,
                            homepage: document.getElementById('customHomepage').value,
                            customDNS: document.getElementById('customDNS').value,
                            customECHDomain: document.getElementById('customECHDomain').value
                        };
                        
                        // Ensure at least one protocol is enabled
                        if (!document.getElementById('ev').checked && 
                            !document.getElementById('et').checked && 
                            !document.getElementById('ex').checked) {
                            showToast(isFarsi ? 'حداقل باید یک پروتکل را فعال کنید!' : 'Please enable at least one protocol.', 'error');
                            return;
                        }
                        
                        await saveConfig(configData);
                    });
                }
                
                const advancedConfigForm = document.getElementById('advancedConfigForm');
                if (advancedConfigForm) {
                    advancedConfigForm.addEventListener('submit', async function(e) {
                        e.preventDefault();
                        const configData = { scu: document.getElementById('scu').value, epd: document.getElementById('epd').checked ? 'yes' : 'no', epi: document.getElementById('epi').checked ? 'yes' : 'no', egi: document.getElementById('egi').checked ? 'yes' : 'no', ae: document.getElementById('apiEnabled').value,
                            rm: document.getElementById('regionMatching').value,
                            qj: document.getElementById('downgradeControl').value,
                            dkby: document.getElementById('portControl').value,
                            yxby: document.getElementById('preferredControl').value,
                            ipv4: document.getElementById('ipv4Enabled').checked ? 'yes' : 'no',
                            ipv6: document.getElementById('ipv6Enabled').checked ? 'yes' : 'no',
                            ispMobile: document.getElementById('ispMobile').checked ? 'yes' : 'no',
                            ispUnicom: document.getElementById('ispUnicom').checked ? 'yes' : 'no',
                            ispTelecom: document.getElementById('ispTelecom').checked ? 'yes' : 'no'
                        };
                        await saveConfig(configData);
                    });
                }
                
                let testAbortController = null;
                let testResults = [];
                
                const startTestBtn = document.getElementById('startLatencyTest');
                const stopTestBtn = document.getElementById('stopLatencyTest');
                const testStatus = document.getElementById('latencyTestStatus');
                const testResultsDiv = document.getElementById('latencyTestResults');
                const resultsList = document.getElementById('latencyResultsList');
                const overwriteSelectedBtn = document.getElementById('overwriteSelectedToYx');
                const appendSelectedBtn = document.getElementById('appendSelectedToYx');
                const selectAllBtn = document.getElementById('selectAllResults');
                const deselectAllBtn = document.getElementById('deselectAllResults');
                const ipSourceSelect = document.getElementById('ipSourceSelect');
                const manualInputDiv = document.getElementById('manualInputDiv');
                const urlFetchDiv = document.getElementById('urlFetchDiv');
                const latencyTestInput = document.getElementById('latencyTestInput');
                const fetchURLInput = document.getElementById('fetchURLInput');
                const latencyTestPort = document.getElementById('latencyTestPort');
                const randomIPCount = document.getElementById('randomIPCount');
                const cfRandomDiv = document.getElementById('cfRandomDiv');
                const randomCountDiv = document.getElementById('randomCountDiv');
                const generateCFIPBtn = document.getElementById('generateCFIPBtn');
                const fetchIPBtn = document.getElementById('fetchIPBtn');
                
                if (latencyTestInput) {
                    const savedTestInput = localStorage.getItem('latencyTestInput');
                    if (savedTestInput) latencyTestInput.value = savedTestInput;
                    latencyTestInput.addEventListener('input', function() {
                        localStorage.setItem('latencyTestInput', this.value);
                    });
                }
                if (fetchURLInput) {
                    const savedFetchURL = localStorage.getItem('fetchURLInput');
                    if (savedFetchURL) fetchURLInput.value = savedFetchURL;
                    fetchURLInput.addEventListener('input', function() {
                        localStorage.setItem('fetchURLInput', this.value);
                    });
                }
                if (latencyTestPort) {
                    const savedPort = localStorage.getItem('latencyTestPort');
                    if (savedPort) latencyTestPort.value = savedPort;
                    latencyTestPort.addEventListener('input', function() {
                        localStorage.setItem('latencyTestPort', this.value);
                    });
                }
                if (randomIPCount) {
                    const savedCount = localStorage.getItem('randomIPCount');
                    if (savedCount) randomIPCount.value = savedCount;
                    randomIPCount.addEventListener('input', function() {
                        localStorage.setItem('randomIPCount', this.value);
                    });
                    // On init, disable inputs when hidden
                    if (randomCountDiv && randomCountDiv.style.display === 'none') {
                        randomIPCount.disabled = true;
                    }
                }
                const testThreadsInput = document.getElementById('testThreads');
                if (testThreadsInput) {
                    const savedThreads = localStorage.getItem('testThreads');
                    if (savedThreads) testThreadsInput.value = savedThreads;
                    testThreadsInput.addEventListener('input', function() {
                        localStorage.setItem('testThreads', this.value);
                    });
                }
                if (ipSourceSelect) {
                    const savedSource = localStorage.getItem('ipSourceSelect');
                    const currentSource = savedSource || ipSourceSelect.value || 'manual';
                    if (savedSource) {
                        ipSourceSelect.value = savedSource;
                    }
                    manualInputDiv.style.display = currentSource === 'manual' ? 'block' : 'none';
                    urlFetchDiv.style.display = currentSource === 'urlFetch' ? 'block' : 'none';
                    cfRandomDiv.style.display = currentSource === 'cfRandom' ? 'block' : 'none';
                    randomCountDiv.style.display = currentSource === 'cfRandom' ? 'block' : 'none';
                    // Disable inputs when hidden to avoid validation errors
                    if (randomIPCount) {
                        randomIPCount.disabled = currentSource !== 'cfRandom';
                    }
                }
                
                const CF_CIDR_LIST = [
                    '173.245.48.0/20', '103.21.244.0/22', '103.22.200.0/22', '103.31.4.0/22',
                    '141.101.64.0/18', '108.162.192.0/18', '190.93.240.0/20', '188.114.96.0/20',
                    '197.234.240.0/22', '198.41.128.0/17', '162.158.0.0/15', '104.16.0.0/13',
                    '104.24.0.0/14', '172.64.0.0/13', '131.0.72.0/22'
                ];
                
                function generateRandomIPFromCIDR(cidr) {
                    const [baseIP, prefixLength] = cidr.split('/');
                    const prefix = parseInt(prefixLength);
                    const hostBits = 32 - prefix;
                    const ipParts = baseIP.split('.').map(p => parseInt(p));
                    const ipInt = (ipParts[0] << 24) | (ipParts[1] << 16) | (ipParts[2] << 8) | ipParts[3];
                    const randomOffset = Math.floor(Math.random() * Math.pow(2, hostBits));
                    const mask = (0xFFFFFFFF << hostBits) >>> 0;
                    const randomIP = (((ipInt & mask) >>> 0) + randomOffset) >>> 0;
                    return [(randomIP >>> 24) & 0xFF, (randomIP >>> 16) & 0xFF, (randomIP >>> 8) & 0xFF, randomIP & 0xFF].join('.');
                }
                
                function generateCFRandomIPs(count, port) {
                    const ips = [];
                    for (let i = 0; i < count; i++) {
                        const cidr = CF_CIDR_LIST[Math.floor(Math.random() * CF_CIDR_LIST.length)];
                        const ip = generateRandomIPFromCIDR(cidr);
                        ips.push(ip + ':' + port);
                    }
                    return ips;
                }
                
                if (ipSourceSelect) {
                    ipSourceSelect.addEventListener('change', function() {
                        const value = this.value;
                        localStorage.setItem('ipSourceSelect', value);
                        manualInputDiv.style.display = value === 'manual' ? 'block' : 'none';
                        urlFetchDiv.style.display = value === 'urlFetch' ? 'block' : 'none';
                        cfRandomDiv.style.display = value === 'cfRandom' ? 'block' : 'none';
                        randomCountDiv.style.display = value === 'cfRandom' ? 'block' : 'none';
                        // Disable inputs when hidden to avoid validation errors
                        if (randomIPCount) {
                            randomIPCount.disabled = value !== 'cfRandom';
                        }
                    });
                }
                
                if (generateCFIPBtn) {
                    generateCFIPBtn.addEventListener('click', function() {
                        const count = parseInt(document.getElementById('randomIPCount').value) || 20;
                        const port = document.getElementById('latencyTestPort').value || '443';
                        const ips = generateCFRandomIPs(count, port);
                        document.getElementById('latencyTestInput').value = ips.join(',');
                        manualInputDiv.style.display = 'block';
                        showStatus('${isFarsi ? 'تولید شد' : 'Generated'} ' + count + ' ${isFarsi ? 'IP تصادفی CF' : 'CF random IP(s)'}', 'success');
                    });
                }
                
                if (fetchIPBtn) {
                    fetchIPBtn.addEventListener('click', async function() {
                        const urlInput = document.getElementById('fetchURLInput');
                        const fetchUrl = urlInput.value.trim();
                        if (!fetchUrl) {
                            showToast('${isFarsi ? 'لطفا URL را وارد کنید' : 'Please enter a URL'}', 'error');
                            return;
                        }
                        
                        fetchIPBtn.disabled = true;
                        fetchIPBtn.textContent = '${isFarsi ? 'در حال دریافت...' : 'Fetching...'}';
                        
                        try {
                            // Support multiple URLs (comma-separated) and comma-separated items in responses
                            const urlList = Array.from(new Set(
                                fetchUrl.split(',').map(u => u.trim()).filter(u => u)
                            ));
                            
                            const allItems = [];
                            
                            for (const u of urlList) {
                                const response = await fetch(u);
                                if (!response.ok) {
                                    throw new Error('HTTP ' + response.status + ' @ ' + u);
                                }
                                const text = await response.text();
                                
                                // Split by lines, then by commas (supports multi-line and comma-separated formats)
                                const perUrlItems = text
                                    .split(/\\r?\\n/)
                                    .map(l => l.trim())
                                    .filter(l => l && !l.startsWith('#'))
                                    .flatMap(l => l.split(',').map(p => p.trim()).filter(p => p));
                                
                                allItems.push(...perUrlItems);
                            }
                            
                            if (allItems.length > 0) {
                                document.getElementById('latencyTestInput').value = allItems.join(',');
                                manualInputDiv.style.display = 'block';
                                showStatus('${isFarsi ? 'دریافت شد' : 'Fetched'} ' + allItems.length + ' ${isFarsi ? 'IP' : 'IP(s)'}', 'success');
                            } else {
                                showStatus('${isFarsi ? 'داده‌ای یافت نشد' : 'No data found'}', 'error');
                            }
                        } catch (err) {
                            showStatus('${isFarsi ? 'خطا در دریافت' : 'Fetch failed'}: ' + err.message, 'error');
                        } finally {
                            fetchIPBtn.disabled = false;
                            fetchIPBtn.textContent = '⬇ ${isFarsi ? 'دریافت IP' : 'Fetch IP'}';
                        }
                    });
                }
                
                if (startTestBtn) {
                    startTestBtn.addEventListener('click', async function() {
                        const inputField = document.getElementById('latencyTestInput');
                        const portField = document.getElementById('latencyTestPort');
                        const threadsField = document.getElementById('testThreads');
                        const inputValue = inputField.value.trim();
                        const defaultPort = portField.value || '443';
                        const threads = parseInt(threadsField.value) || 5;
                        
                        if (!inputValue) {
                            showStatus('${isFarsi ? 'لطفا IP یا دامنه وارد کنید' : 'Please enter an IP or domain'}', 'error');
                            return;
                        }
                        
                        const targets = inputValue.split(',').map(t => t.trim()).filter(t => t);
                        if (targets.length === 0) return;
                        
                        startTestBtn.style.display = 'none';
                        stopTestBtn.style.display = 'inline-block';
                        testStatus.style.display = 'block';
                        testResultsDiv.style.display = 'block';
                        resultsList.innerHTML = '';
                        testResults = [];
                        if (cityFilterContainer) {
                            cityFilterContainer.style.display = 'none';
                        }
                        
                        testAbortController = new AbortController();
                        
                        let completed = 0;
                        const total = targets.length;
                        
                        function parseTarget(target) {
                            let host = target;
                            let port = defaultPort;
                            let nodeName = '';
                            
                            if (target.includes('#')) {
                                const parts = target.split('#');
                                nodeName = parts[1] || '';
                                host = parts[0];
                            }
                            
                            if (host.includes(':') && !host.startsWith('[')) {
                                const lastColon = host.lastIndexOf(':');
                                const possiblePort = host.substring(lastColon + 1);
                                if (/^[0-9]+$/.test(possiblePort)) {
                                    port = possiblePort;
                                    host = host.substring(0, lastColon);
                                }
                            } else if (host.includes(']:')) {
                                const parts = host.split(']:');
                                host = parts[0] + ']';
                                port = parts[1];
                            }
                            return { host, port, nodeName };
                        }
                        
                        function renderResult(result, index, shouldShow = true) {
                            // Show only successful online preferred results (hide failed/timeout)
                            if (!result.success) {
                                return null;
                            }
                            
                            const resultItem = document.createElement('div');
                            resultItem.style.cssText = 'display: flex; align-items: center; padding: 8px; border-bottom: 1px solid #003300; gap: 10px;';
                            resultItem.dataset.index = index;
                            resultItem.dataset.colo = result.colo || '';
                            if (!shouldShow) {
                                resultItem.style.display = 'none';
                            }
                            
                            const checkbox = document.createElement('input');
                            checkbox.type = 'checkbox';
                            checkbox.checked = true;
                            checkbox.disabled = false;
                            checkbox.dataset.index = index;
                            checkbox.style.cssText = 'width: 18px; height: 18px; cursor: pointer;';
                            
                            const info = document.createElement('div');
                            info.style.cssText = 'flex: 1; font-family: monospace; font-size: 13px;';
                            
                            const coloName = result.colo ? getColoName(result.colo) : '';
                            const coloDisplay = coloName ? ' <span style="color: #00aaff;">[' + coloName + ']</span>' : '';
                            info.innerHTML = '<span style="color: #00ff00;">' + result.host + ':' + result.port + '</span>' + coloDisplay + ' <span style="color: #ffff00;">' + result.latency + 'ms</span>';
                            
                            resultItem.appendChild(checkbox);
                            resultItem.appendChild(info);
                            resultsList.appendChild(resultItem);
                            return resultItem;
                        }
                        
                        async function testOne(target) {
                            if (testAbortController.signal.aborted) return null;
                            const { host, port, nodeName } = parseTarget(target);
                            const result = await testLatency(host, port, testAbortController.signal);
                            result.host = host;
                            result.port = port;
                            result.nodeName = (result.success && result.colo) ? (nodeName || ('CF-' + result.colo)) : (nodeName || host);
                            return result;
                        }
                        
                        for (let i = 0; i < total; i += threads) {
                            if (testAbortController.signal.aborted) break;
                            
                            const batch = targets.slice(i, Math.min(i + threads, total));
                            testStatus.textContent = '${isFarsi ? 'در حال تست' : 'Testing'}: ' + (i + 1) + '-' + Math.min(i + threads, total) + '/' + total + ' (${isFarsi ? 'رشته‌ها' : 'Threads'}: ' + threads + ')';
                            
                            const results = await Promise.all(batch.map(t => testOne(t)));
                            
                            for (const result of results) {
                                if (result) {
                                    const idx = testResults.length;
                                    testResults.push(result);
                                    renderResult(result, idx);
                                    completed++;
                                }
                            }
                        }
                        
                        testStatus.textContent = '${isFarsi ? 'تست کامل شد' : 'Done'}: ' + completed + '/' + total;
                        startTestBtn.style.display = 'inline-block';
                        stopTestBtn.style.display = 'none';
                        
                        // Update city selector
                        updateCityFilter();
                    });
                }
                
                if (stopTestBtn) {
                    stopTestBtn.addEventListener('click', function() {
                        if (testAbortController) {
                            testAbortController.abort();
                        }
                        startTestBtn.style.display = 'inline-block';
                        stopTestBtn.style.display = 'none';
                        testStatus.textContent = '${isFarsi ? 'تست متوقف شد' : 'Stopped'}';
                    });
                }
                
                if (selectAllBtn) {
                    selectAllBtn.addEventListener('click', function() {
                        const checkboxes = resultsList.querySelectorAll('input[type="checkbox"]:not(:disabled)');
                        checkboxes.forEach(cb => cb.checked = true);
                    });
                }
                
                if (deselectAllBtn) {
                    deselectAllBtn.addEventListener('click', function() {
                        const checkboxes = resultsList.querySelectorAll('input[type="checkbox"]');
                        checkboxes.forEach(cb => cb.checked = false);
                    });
                }
                
                // Helper: get selected items
                function getSelectedItems() {
                    const checkboxes = resultsList.querySelectorAll('input[type="checkbox"]:checked');
                    if (checkboxes.length === 0) {
                        showStatus('${isFarsi ? 'لطفا حداقل یک مورد انتخاب کنید' : 'Please select at least one item'}', 'error');
                        return null;
                    }
                    
                    const selectedItems = [];
                    checkboxes.forEach(cb => {
                        const idx = parseInt(cb.dataset.index);
                        const result = testResults[idx];
                        if (result && result.success) {
                            const coloName = result.colo ? getColoName(result.colo) : result.nodeName;
                            const itemStr = result.host + ':' + result.port + '#' + coloName;
                            selectedItems.push(itemStr);
                        }
                    });
                    
                    return selectedItems;
                }
                
                // Replace list
                if (overwriteSelectedBtn) {
                    overwriteSelectedBtn.addEventListener('click', async function() {
                        const selectedItems = getSelectedItems();
                        if (!selectedItems || selectedItems.length === 0) return;
                        
                        const yxInput = document.getElementById('yx');
                        const newValue = selectedItems.join(',');
                        yxInput.value = newValue;
                        
                        overwriteSelectedBtn.disabled = true;
                        appendSelectedBtn.disabled = true;
                        overwriteSelectedBtn.textContent = '${isFarsi ? 'در حال ذخیره...' : 'Saving...'}';
                        
                        try {
                            const configData = {
                                customIP: document.getElementById('customIP').value,
                                yx: newValue,
                                yxURL: document.getElementById('yxURL').value,
                                socksConfig: document.getElementById('socksConfig').value
                            };
                            await saveConfig(configData);
                            showStatus('${isFarsi ? 'موفقیت‌آمیز بود' : 'Replaced'} ' + selectedItems.length + ' ${isFarsi ? 'مورد و ذخیره شد' : 'item(s) and saved'}', 'success');
                        } catch (err) {
                            showStatus('${isFarsi ? 'خطا در ذخیره' : 'Save failed'}: ' + err.message, 'error');
                        } finally {
                            overwriteSelectedBtn.disabled = false;
                            appendSelectedBtn.disabled = false;
                            overwriteSelectedBtn.textContent = '${isFarsi ? 'جایگزین' : 'Replace'}';
                        }
                    });
                }
                
                // Append to list
                if (appendSelectedBtn) {
                    appendSelectedBtn.addEventListener('click', async function() {
                        const selectedItems = getSelectedItems();
                        if (!selectedItems || selectedItems.length === 0) return;
                        
                        const yxInput = document.getElementById('yx');
                        const currentValue = yxInput.value.trim();
                        const newItems = selectedItems.join(',');
                        const newValue = currentValue ? (currentValue + ',' + newItems) : newItems;
                        yxInput.value = newValue;
                        
                        overwriteSelectedBtn.disabled = true;
                        appendSelectedBtn.disabled = true;
                        appendSelectedBtn.textContent = '${isFarsi ? 'در حال ذخیره...' : 'Saving...'}';
                        
                        try {
                            const configData = {
                                customIP: document.getElementById('customIP').value,
                                yx: newValue,
                                yxURL: document.getElementById('yxURL').value,
                                socksConfig: document.getElementById('socksConfig').value
                            };
                            await saveConfig(configData);
                            showStatus('${isFarsi ? 'موفقیت‌آمیز بود' : 'Appended'} ' + selectedItems.length + ' ${isFarsi ? 'مورد و ذخیره شد' : 'item(s) and saved'}', 'success');
                        } catch (err) {
                            showStatus('${isFarsi ? 'خطا در ذخیره' : 'Save failed'}: ' + err.message, 'error');
                        } finally {
                            overwriteSelectedBtn.disabled = false;
                            appendSelectedBtn.disabled = false;
                            appendSelectedBtn.textContent = '${isFarsi ? 'اضافه کردن' : 'Append'}';
                        }
                    });
                }
                
                function ipToHex(ip) {
                    const parts = ip.split('.');
                    if (parts.length !== 4) return null;
                    let hex = '';
                    for (let i = 0; i < 4; i++) {
                        const num = parseInt(parts[i]);
                        if (isNaN(num) || num < 0 || num > 255) return null;
                        hex += num.toString(16).padStart(2, '0');
                    }
                    return hex;
                }
                
                const coloMap = {};

                function getColoName(colo) {
                    return coloMap[colo] || colo;
                }
                
                // City filter helpers
                const cityFilterContainer = document.getElementById('cityFilterContainer');
                const cityCheckboxesContainer = document.getElementById('cityCheckboxesContainer');
                
                function updateCityFilter() {
                    if (!cityFilterContainer || !cityCheckboxesContainer) return;
                    
                    // Extract available cities from results
                    const cityMap = new Map();
                    testResults.forEach((result, index) => {
                        if (result.success && result.colo) {
                            const colo = result.colo;
                            if (!cityMap.has(colo)) {
                                cityMap.set(colo, {
                                    colo: colo,
                                    name: getColoName(colo),
                                    count: 0
                                });
                            }
                            cityMap.get(colo).count++;
                        }
                    });
                    
                    if (cityMap.size === 0) {
                        cityFilterContainer.style.display = 'none';
                        return;
                    }
                    
                    cityFilterContainer.style.display = 'block';
                    cityCheckboxesContainer.innerHTML = '';
                    
                    // Sort by city label
                    const cities = Array.from(cityMap.values()).sort((a, b) => a.name.localeCompare(b.name));
                    
                    cities.forEach(city => {
                        const label = document.createElement('label');
                        label.style.cssText = 'display: inline-flex; align-items: center; cursor: pointer; color: #00ff00; font-size: 0.85rem; padding: 4px 8px; background: rgba(0, 40, 0, 0.4); border: 1px solid #00aa00; border-radius: 4px;';
                        
                        const checkbox = document.createElement('input');
                        checkbox.type = 'checkbox';
                        checkbox.value = city.colo;
                        checkbox.checked = true;
                        checkbox.dataset.colo = city.colo;
                        checkbox.style.cssText = 'margin-right: 6px; width: 16px; height: 16px; cursor: pointer;';
                        
                        const span = document.createElement('span');
                        span.textContent = city.name + ' (' + city.count + ')';
                        
                        label.appendChild(checkbox);
                        label.appendChild(span);
                        cityCheckboxesContainer.appendChild(label);
                        
                        checkbox.addEventListener('change', filterResultsByCity);
                    });
                    
                    // Watch filter mode changes
                    const filterModeRadios = document.querySelectorAll('input[name="cityFilterMode"]');
                    filterModeRadios.forEach(radio => {
                        radio.addEventListener('change', function() {
                            if (this.value === 'all') {
                                // In "All cities" mode, select all city checkboxes
                                const cityCheckboxes = cityCheckboxesContainer.querySelectorAll('input[type="checkbox"]');
                                cityCheckboxes.forEach(cb => {
                                    cb.checked = true;
                                    cb.disabled = false;
                                });
                            }
                            filterResultsByCity();
                        });
                    });
                }
                
                function filterResultsByCity() {
                    if (!resultsList || !cityCheckboxesContainer) return;
                    
                    const filterMode = document.querySelector('input[name="cityFilterMode"]:checked')?.value || 'all';
                    const resultItems = resultsList.querySelectorAll('[data-index]');
                    const cityCheckboxes = cityCheckboxesContainer.querySelectorAll('input[type="checkbox"]');
                    
                    if (filterMode === 'fastest10') {
                        // Keep only the fastest 10
                        const sortedResults = testResults
                            .map((result, index) => ({ result, index }))
                            .filter(item => item.result.success)
                            .sort((a, b) => a.result.latency - b.result.latency)
                            .slice(0, 10);
                        
                        const fastestIndices = new Set(sortedResults.map(item => item.index));
                        
                        resultItems.forEach(item => {
                            const index = parseInt(item.dataset.index);
                            const checkbox = item.querySelector('input[type="checkbox"]');
                            if (fastestIndices.has(index)) {
                                item.style.display = 'flex';
                                if (checkbox) checkbox.checked = true;
                            } else {
                                item.style.display = 'none';
                                if (checkbox) checkbox.checked = false;
                            }
                        });
                        
                        // Disable city checkboxes
                        cityCheckboxes.forEach(cb => cb.disabled = true);
                    } else {
                        // Filter by selected cities
                        const selectedCities = new Set();
                        cityCheckboxes.forEach(cb => {
                            if (cb.checked) {
                                selectedCities.add(cb.value);
                            }
                        });
                        
                        // If all (or none) cities are selected, show all results
                        const allChecked = cityCheckboxes.length > 0 && selectedCities.size === cityCheckboxes.length;
                        const noneChecked = selectedCities.size === 0;
                        
                        resultItems.forEach(item => {
                            const colo = item.dataset.colo || '';
                            const checkbox = item.querySelector('input[type="checkbox"]');
                            if (allChecked || noneChecked || selectedCities.has(colo)) {
                                item.style.display = 'flex';
                                // Sync result-item checkbox states
                                if (checkbox) {
                                    if (allChecked) {
                                        // When all cities are selected, select all result items
                                        checkbox.checked = true;
                                    } else if (noneChecked) {
                                        // When no city is selected, clear all result items
                                        checkbox.checked = false;
                                    } else {
                                        // Sync checkboxes based on selected cities
                                        checkbox.checked = selectedCities.has(colo);
                                    }
                                }
                            } else {
                                item.style.display = 'none';
                                // Uncheck hidden result items
                                if (checkbox) {
                                    checkbox.checked = false;
                                }
                            }
                        });
                        
                        // Enable city checkboxes
                        cityCheckboxes.forEach(cb => cb.disabled = false);
                    }
                }
                
                async function testLatency(host, port, signal) {
                    const timeout = 8000;
                    let colo = '';
                    let testUrl = '';
                    
                    try {
                        const controller = new AbortController();
                        const timeoutId = setTimeout(() => controller.abort(), timeout);
                        
                        if (signal) {
                            signal.addEventListener('abort', () => controller.abort());
                        }
                        
                        const cleanHost = host.replace(/^\\[|\\]$/g, '');
                        const hexIP = ipToHex(cleanHost);
                        const testDomain = hexIP ? (hexIP + '.nip.lfree.org') : (cleanHost + '.nip.lfree.org');
                        testUrl = 'https://' + testDomain + ':' + port + '/';
                        
                        console.log('[LatencyTest] Testing:', testUrl, 'Original:', host + ':' + port, 'HexIP:', hexIP);
                        
                        const firstStart = Date.now();
                        const response1 = await fetch(testUrl, { 
                            signal: controller.signal
                        });
                        const firstTime = Date.now() - firstStart;
                        
                        if (!response1.ok) {
                            clearTimeout(timeoutId);
                            return { success: false, latency: firstTime, error: 'HTTP ' + response1.status + ' ' + response1.statusText, colo: '', testUrl: testUrl };
                        }
                        
                        try {
                            const text = await response1.text();
                            console.log('[LatencyTest] Response body:', text.substring(0, 200));
                            const data = JSON.parse(text);
                            if (data.colo) {
                                colo = data.colo;
                            }
                        } catch (e) {
                            console.log('[LatencyTest] Parse error:', e.message);
                        }
                        
                        const secondStart = Date.now();
                        const response2 = await fetch(testUrl, { 
                            signal: controller.signal
                        });
                        await response2.text();
                        const latency = Date.now() - secondStart;
                        
                        clearTimeout(timeoutId);
                        
                        console.log('[LatencyTest] First:', firstTime + 'ms (DNS+TLS+RTT)', 'Second:', latency + 'ms (RTT only)');
                        
                        return { success: true, latency: latency, colo: colo, testUrl: testUrl };
                    } catch (error) {
                        const errorMsg = error.name === 'AbortError' ? '${isFarsi ? 'زمان تمام شد' : 'Timeout'}' : error.message;
                        console.log('[LatencyTest] Error:', errorMsg, 'URL:', testUrl);
                        return { success: false, latency: -1, error: errorMsg, colo: '', testUrl: testUrl };
                    }
                }
            });

            window.addEventListener('DOMContentLoaded', function() {
                const container = document.querySelector('.container');
                const configCard = document.getElementById('configCard');
                const advancedForm = document.getElementById('advancedConfigForm');
                const advancedTitle = configCard ? configCard.querySelector('h3') : null;
                const LOG_KEY = 'pimx_panel_logs_v2';

                function langCode() {
                    const lang = (localStorage.getItem('preferredLanguage') || getCookie('preferredLanguage') || '').toLowerCase();
                    return (lang === 'fa' || lang === 'fa-ir') ? 'fa' : 'en';
                }
                function i18n(fa, en) {
                    return langCode() === 'fa' ? fa : en;
                }
                function readLogs() {
                    try {
                        const raw = localStorage.getItem(LOG_KEY);
                        return raw ? JSON.parse(raw) : [];
                    } catch (error) {
                        return [];
                    }
                }
                function writeLogs(items) {
                    localStorage.setItem(LOG_KEY, JSON.stringify(items.slice(0, 120)));
                }
                function renderLogs() {
                    const wrap = document.getElementById('logsWrap');
                    if (!wrap) return;
                    const items = readLogs();
                    if (!items.length) {
                        wrap.innerHTML = '<div class="log-row"><span class="log-type">' + i18n('وضعیت', 'Status') + '</span><span>-</span><span>' + i18n('هنوز لاگی ثبت نشده است.', 'No logs yet.') + '</span></div>';
                        return;
                    }
                    wrap.innerHTML = items.map(function(item) {
                        const date = new Date(item.time);
                        const local = isNaN(date.getTime()) ? item.time : date.toLocaleString();
                        return '<div class="log-row"><span>' + local + '</span><span class="log-type">' + item.type + '</span><span>' + item.message + '</span></div>';
                    }).join('');
                }
                function pushLog(type, message) {
                    const now = new Date();
                    const entry = { time: now.toISOString(), type: type, message: message };
                    const items = [entry].concat(readLogs());
                    writeLogs(items);
                    renderLogs();
                }
                function ensureHelpModal() {
                    if (document.getElementById('helpModal')) return;
                    const modal = document.createElement('div');
                    modal.id = 'helpModal';
                    modal.className = 'help-modal';
                    modal.innerHTML = '<div class="help-panel"><div style="display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:10px;"><h3 id="helpTitle">' + i18n('راهنما', 'Guide') + '</h3><button type="button" id="helpCloseBtn">' + i18n('بستن', 'Close') + '</button></div><p id="helpBody"></p></div>';
                    document.body.appendChild(modal);
                    document.getElementById('helpCloseBtn').addEventListener('click', function() {
                        modal.classList.remove('is-open');
                    });
                    modal.addEventListener('click', function(event) {
                        if (event.target === modal) modal.classList.remove('is-open');
                    });
                }
                function addSectionHelpButtons() {
                    ensureHelpModal();
                    const helpMap = {
                        cardClientFa: 'در این بخش کلاینت هدف را انتخاب می‌کنی. لینک اشتراک همان‌جا ساخته می‌شود و به‌صورت خودکار کپی می‌شود.',
                        cardClientEn: 'Pick a target client here. The subscription link is generated and copied automatically.',
                        wizardFa: 'این بخش مسیر سریع استفاده را نشان می‌دهد: سرور، کلاینت، تنظیمات پیشرفته و لینک‌ها.',
                        wizardEn: 'Quick flow: server, client, advanced settings, and links.',
                        cardStatusFa: 'وضعیت منطقه Worker، منطق تطبیق، وضعیت ECH و ProxyIP را زنده نمایش می‌دهد.',
                        cardStatusEn: 'Shows live Worker region, matching logic, ECH status, and ProxyIP behavior.',
                        configFa: 'تنظیمات اصلی اینجا ذخیره می‌شوند. پس از ذخیره، خروجی اشتراک بدون رفرش به‌روزرسانی می‌شود.',
                        configEn: 'Main settings are stored here. After save, generated subscriptions update without page reload.',
                        advancedFa: 'گزینه‌های پیشرفته شامل Converter، فیلتر IP، کنترل API و سیاست‌های TLS در این بخش است.',
                        advancedEn: 'Advanced controls include converter URL, IP filters, API management, and TLS policies.',
                        linksFa: 'تمام لینک‌های رسمی کانال، بات‌ها و شبکه‌های اجتماعی از این بخش در دسترس هستند.',
                        linksEn: 'All official channel, bot, and social links are available in this section.',
                        logsFa: 'هر تغییری که در پنل انجام بدهی در این بخش به شکل تایم‌لاین ثبت می‌شود.',
                        logsEn: 'Every change you make in the panel is recorded here as a timeline.'
                    };
                    const sectionDefs = [
                        { id: 'card-wizard', fa: helpMap.wizardFa, en: helpMap.wizardEn },
                        { id: 'card-client', fa: helpMap.cardClientFa, en: helpMap.cardClientEn },
                        { id: 'card-status', fa: helpMap.cardStatusFa, en: helpMap.cardStatusEn },
                        { id: 'configCard', fa: helpMap.configFa, en: helpMap.configEn },
                        { id: 'advancedCard', fa: helpMap.advancedFa, en: helpMap.advancedEn },
                        { id: 'card-links', fa: helpMap.linksFa, en: helpMap.linksEn },
                        { id: 'card-logs', fa: helpMap.logsFa, en: helpMap.logsEn }
                    ];
                    sectionDefs.forEach(function(section) {
                        const card = document.getElementById(section.id);
                        if (!card) return;
                        const title = card.querySelector('.card-title');
                        if (!title || title.parentElement.classList.contains('section-head')) return;
                        const head = document.createElement('div');
                        head.className = 'section-head';
                        title.parentElement.insertBefore(head, title);
                        head.appendChild(title);
                        const btn = document.createElement('button');
                        btn.type = 'button';
                        btn.className = 'help-btn';
                        btn.textContent = i18n('آموزش', 'Guide');
                        btn.addEventListener('click', function() {
                            const modal = document.getElementById('helpModal');
                            if (!modal) return;
                            document.getElementById('helpTitle').textContent = title.textContent;
                            document.getElementById('helpBody').textContent = langCode() === 'fa' ? section.fa : section.en;
                            modal.classList.add('is-open');
                        });
                        head.appendChild(btn);
                    });
                }
                function separateAdvancedSection() {
                    if (!container || !configCard || !advancedForm) return;
                    if (document.getElementById('advancedCard')) return;
                    const advancedCard = document.createElement('div');
                    advancedCard.className = 'card';
                    advancedCard.id = 'advancedCard';
                    advancedCard.style.display = 'none';
                    advancedCard.innerHTML = '<h2 class="card-title">' + i18n('[ تنظیمات پیشرفته ]', '[ Advanced Settings ]') + '</h2><p class="card-help">' + i18n('این بخش به‌صورت جدا برای کنترل‌های حرفه‌ای طراحی شده تا شلوغی Settings کم شود.', 'Advanced controls are separated for a cleaner settings experience.') + '</p>';
                    if (advancedTitle) advancedTitle.remove();
                    advancedCard.appendChild(advancedForm);
                    configCard.insertAdjacentElement('afterend', advancedCard);
                }
                function mountOperationCards() {
                    const form = document.getElementById('advancedConfigForm');
                    if (!form || document.getElementById('opModeGrid')) return;
                    const holder = document.createElement('div');
                    holder.id = 'opModeGrid';
                    holder.innerHTML = '<label style="display:block;margin-bottom:8px;">' + i18n('عملیات سریع', 'Operation Presets') + '</label><div class="op-card-grid"><button type="button" class="op-card-btn" data-mode="balanced">' + i18n('متعادل', 'Balanced') + '</button><button type="button" class="op-card-btn" data-mode="performance">' + i18n('پرفورمنس', 'Performance') + '</button><button type="button" class="op-card-btn" data-mode="secure">' + i18n('امن', 'Secure') + '</button></div>';
                    form.insertBefore(holder, form.firstChild);
                    const buttons = holder.querySelectorAll('.op-card-btn');
                    const applyMode = function(mode) {
                        const regionMatching = document.getElementById('regionMatching');
                        const portControl = document.getElementById('portControl');
                        const preferredControl = document.getElementById('preferredControl');
                        const downgradeControl = document.getElementById('downgradeControl');
                        if (!regionMatching || !portControl || !preferredControl || !downgradeControl) return;
                        if (mode === 'balanced') {
                            regionMatching.value = '';
                            portControl.value = '';
                            preferredControl.value = '';
                            downgradeControl.value = '';
                        } else if (mode === 'performance') {
                            regionMatching.value = '';
                            portControl.value = '';
                            preferredControl.value = '';
                            downgradeControl.value = 'no';
                        } else {
                            regionMatching.value = '';
                            portControl.value = 'yes';
                            preferredControl.value = '';
                            downgradeControl.value = '';
                        }
                        buttons.forEach(function(btn) {
                            btn.classList.toggle('active', btn.dataset.mode === mode);
                        });
                        pushLog('MODE', i18n('پروفایل عملیاتی: ', 'Operation preset: ') + mode);
                    };
                    buttons.forEach(function(btn) {
                        btn.addEventListener('click', function() {
                            applyMode(btn.dataset.mode);
                        });
                    });
                    applyMode('balanced');
                }
                function ensureLogsCard() {
                    if (!container || document.getElementById('card-logs')) return;
                    const card = document.createElement('div');
                    card.className = 'card';
                    card.id = 'card-logs';
                    card.innerHTML = '<h2 class="card-title">' + i18n('[ لاگ تغییرات ]', '[ Activity Logs ]') + '</h2><p class="card-help">' + i18n('هر تغییر مهم تنظیمات، عملیات کاربر و انتخاب کلاینت اینجا ثبت می‌شود.', 'Settings changes, client actions, and important operations are recorded here.') + '</p><div class="logs-wrap" id="logsWrap"></div><div style="margin-top:10px;display:flex;gap:10px;"><button type="button" id="clearLogsBtn">' + i18n('پاک کردن لاگ', 'Clear logs') + '</button></div>';
                    container.appendChild(card);
                    const clearBtn = document.getElementById('clearLogsBtn');
                    if (clearBtn) {
                        clearBtn.addEventListener('click', function() {
                            writeLogs([]);
                            renderLogs();
                            showToast(i18n('لاگ‌ها پاک شدند', 'Logs cleared'), 'success');
                        });
                    }
                }
                function initScrollReveal() {
                    const cards = Array.from(document.querySelectorAll('.container > .card'));
                    let started = false;
                    const observer = new IntersectionObserver(function(entries) {
                        entries.forEach(function(entry) {
                            if (entry.isIntersecting) entry.target.classList.add('is-visible');
                        });
                    }, { threshold: 0.16 });
                    const start = function() {
                        if (started || !document.body.classList.contains('scrolled')) return;
                        started = true;
                        cards.forEach(function(card) {
                            observer.observe(card);
                        });
                    };
                    start();
                    window.addEventListener('scroll', start, { passive: true });
                }
                const originalSaveConfig = window.saveConfig;
                if (typeof originalSaveConfig === 'function') {
                    window.saveConfig = async function(configData) {
                        const changedKeys = Object.keys(configData || {});
                        if (changedKeys.length) {
                            pushLog('SETTING', i18n('ذخیره: ', 'Saved: ') + changedKeys.join(', '));
                        }
                        return await originalSaveConfig.apply(this, arguments);
                    };
                }
                const originalGenerateClientLink = window.generateClientLink;
                if (typeof originalGenerateClientLink === 'function') {
                    window.generateClientLink = function(clientType, clientName) {
                        pushLog('CLIENT', i18n('انتخاب کلاینت: ', 'Client selected: ') + (clientName || 'Unknown'));
                        return originalGenerateClientLink.apply(this, arguments);
                    };
                }
                const themeToggle = document.getElementById('themeToggle');
                if (themeToggle) {
                    themeToggle.addEventListener('click', function() {
                        const mode = document.documentElement.dataset.theme || 'dark';
                        pushLog('THEME', i18n('تغییر تم: ', 'Theme changed: ') + mode);
                    });
                }
                const languageSelector = document.getElementById('languageSelector');
                if (languageSelector) {
                    languageSelector.addEventListener('change', function() {
                        pushLog('LANG', i18n('تغییر زبان: ', 'Language changed: ') + this.value);
                    });
                }
                separateAdvancedSection();
                mountOperationCards();
                ensureLogsCard();
                addSectionHelpButtons();
                initScrollReveal();
                renderLogs();
                pushLog('BOOT', i18n('پنل بارگذاری شد', 'Panel loaded'));
            });
        </script>
    </body>
    </html>`;
        
        return new Response(pageHtml, { 
            status: 200, 
            headers: { 'Content-Type': 'text/html; charset=utf-8' } 
        });
    }

    async function parseTrojanHeader(buffer, ut) {
        
        const passwordToHash = tp || ut;
        const sha224Password = await sha224Hash(passwordToHash);
        
        if (buffer.byteLength < 56) {
            return {
                hasError: true,
                message: "invalid " + atob('dHJvamFu') + " data - too short"
            };
        }
        let crLfIndex = 56;
        if (new Uint8Array(buffer.slice(56, 57))[0] !== 0x0d || new Uint8Array(buffer.slice(57, 58))[0] !== 0x0a) {
            return {
                hasError: true,
                message: "invalid " + atob('dHJvamFu') + " header format (missing CR LF)"
            };
        }
        const password = new TextDecoder().decode(buffer.slice(0, crLfIndex));
        if (password !== sha224Password) {
            return {
                hasError: true,
                message: "invalid " + atob('dHJvamFu') + " password"
            };
        }

        const socks5DataBuffer = buffer.slice(crLfIndex + 2);
        if (socks5DataBuffer.byteLength < 6) {
            return {
                hasError: true,
                message: atob('aW52YWxpZCBTT0NLUzUgcmVxdWVzdCBkYXRh')
            };
        }

        const view = new DataView(socks5DataBuffer);
        const cmd = view.getUint8(0);
        if (cmd !== 1) {
            return {
                hasError: true,
                message: "unsupported command, only TCP (CONNECT) is allowed"
            };
        }

        const atype = view.getUint8(1);
        let addressLength = 0;
        let addressIndex = 2;
        let address = "";
        switch (atype) {
            case 1:
                addressLength = 4;
                address = new Uint8Array(
                socks5DataBuffer.slice(addressIndex, addressIndex + addressLength)
                ).join(".");
                break;
            case 3:
                addressLength = new Uint8Array(
                socks5DataBuffer.slice(addressIndex, addressIndex + 1)
                )[0];
                addressIndex += 1;
                address = new TextDecoder().decode(
                socks5DataBuffer.slice(addressIndex, addressIndex + addressLength)
                );
                break;
            case 4:
                addressLength = 16;
                const dataView = new DataView(socks5DataBuffer.slice(addressIndex, addressIndex + addressLength));
                const ipv6 = [];
                for (let i = 0; i < 8; i++) {
                    ipv6.push(dataView.getUint16(i * 2).toString(16));
                }
                address = ipv6.join(":");
                break;
            default:
                return {
                    hasError: true,
                    message: `invalid addressType is ${atype}`
                };
        }

        if (!address) {
            return {
                hasError: true,
                message: `address is empty, addressType is ${atype}`
            };
        }

        const portIndex = addressIndex + addressLength;
        const portBuffer = socks5DataBuffer.slice(portIndex, portIndex + 2);
        const portRemote = new DataView(portBuffer).getUint16(0);
        
        return {
            hasError: false,
            addressRemote: address,
            addressType: atype,
            port: portRemote,
            hostname: address,
            rawClientData: socks5DataBuffer.slice(portIndex + 4)
        };
    }

    async function sha224Hash(text) {
        const encoder = new TextEncoder();
        const data = encoder.encode(text);
        
        const K = [
            0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
            0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
            0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
            0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
            0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
            0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
            0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
            0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
        ];
        
        let H = [
            0xc1059ed8, 0x367cd507, 0x3070dd17, 0xf70e5939,
            0xffc00b31, 0x68581511, 0x64f98fa7, 0xbefa4fa4
        ];
        
        const msgLen = data.length;
        const bitLen = msgLen * 8;
        const paddedLen = Math.ceil((msgLen + 9) / 64) * 64;
        const padded = new Uint8Array(paddedLen);
        padded.set(data);
        padded[msgLen] = 0x80;
        
        const view = new DataView(padded.buffer);
        view.setUint32(paddedLen - 4, bitLen, false);
        
        for (let chunk = 0; chunk < paddedLen; chunk += 64) {
            const W = new Uint32Array(64);
            
            for (let i = 0; i < 16; i++) {
                W[i] = view.getUint32(chunk + i * 4, false);
            }
            
            for (let i = 16; i < 64; i++) {
                const s0 = rightRotate(W[i - 15], 7) ^ rightRotate(W[i - 15], 18) ^ (W[i - 15] >>> 3);
                const s1 = rightRotate(W[i - 2], 17) ^ rightRotate(W[i - 2], 19) ^ (W[i - 2] >>> 10);
                W[i] = (W[i - 16] + s0 + W[i - 7] + s1) >>> 0;
            }
            
            let [a, b, c, d, e, f, g, h] = H;
            
            for (let i = 0; i < 64; i++) {
                const S1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
                const ch = (e & f) ^ (~e & g);
                const temp1 = (h + S1 + ch + K[i] + W[i]) >>> 0;
                const S0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
                const maj = (a & b) ^ (a & c) ^ (b & c);
                const temp2 = (S0 + maj) >>> 0;
                
                h = g;
                g = f;
                f = e;
                e = (d + temp1) >>> 0;
                d = c;
                c = b;
                b = a;
                a = (temp1 + temp2) >>> 0;
            }
            
            H[0] = (H[0] + a) >>> 0;
            H[1] = (H[1] + b) >>> 0;
            H[2] = (H[2] + c) >>> 0;
            H[3] = (H[3] + d) >>> 0;
            H[4] = (H[4] + e) >>> 0;
            H[5] = (H[5] + f) >>> 0;
            H[6] = (H[6] + g) >>> 0;
            H[7] = (H[7] + h) >>> 0;
        }
        
        const result = [];
        for (let i = 0; i < 7; i++) {
            result.push(
                ((H[i] >>> 24) & 0xff).toString(16).padStart(2, '0'),
                ((H[i] >>> 16) & 0xff).toString(16).padStart(2, '0'),
                ((H[i] >>> 8) & 0xff).toString(16).padStart(2, '0'),
                (H[i] & 0xff).toString(16).padStart(2, '0')
            );
        }
        
        return result.join('');
    }

    function rightRotate(value, amount) {
        return (value >>> amount) | (value << (32 - amount));
    }

    let ACTIVE_CONNECTIONS = 0;
    const XHTTP_BUFFER_SIZE = 128 * 1024;
    const CONNECT_TIMEOUT_MS = 5000;
    const IDLE_TIMEOUT_MS = 45000;
    const MAX_RETRIES = 2;
    const MAX_CONCURRENT = 32;

    function xhttp_sleep(ms) {
        return new Promise((r) => setTimeout(r, ms));
    }

    function validate_uuid_xhttp(id, uuid) {
        for (let index = 0; index < 16; index++) {
            if (id[index] !== uuid[index]) {
                return false;
            }
        }
        return true;
    }

    class XhttpCounter {
        #total

        constructor() {
            this.#total = 0;
        }

        get() {
            return this.#total;
        }

        add(size) {
            this.#total += size;
        }
    }

    function concat_typed_arrays(first, ...args) {
        let len = first.length;
        for (let a of args) {
            len += a.length;
        }
        const r = new first.constructor(len);
        r.set(first, 0);
        len = first.length;
        for (let a of args) {
            r.set(a, len);
            len += a.length;
        }
        return r;
    }

    function parse_uuid_xhttp(uuid) {
        uuid = uuid.replaceAll('-', '');
        const r = [];
        for (let index = 0; index < 16; index++) {
            const v = parseInt(uuid.substr(index * 2, 2), 16);
            r.push(v);
        }
        return r;
    }

    function get_xhttp_buffer(size) {
        return new Uint8Array(new ArrayBuffer(size || XHTTP_BUFFER_SIZE));
    }

    async function read_xhttp_header(readable, uuid_str) {
        const reader = readable.getReader({ mode: 'byob' });

        try {
            let r = await reader.readAtLeast(1 + 16 + 1, get_xhttp_buffer());
            let rlen = 0;
            let idx = 0;
            let cache = r.value;
            rlen += r.value.length;

            const version = cache[0];
            const id = cache.slice(1, 1 + 16);
            const uuid = parse_uuid_xhttp(uuid_str);
            if (!validate_uuid_xhttp(id, uuid)) {
                return `invalid UUID`;
            }
            const pb_len = cache[1 + 16];
            const addr_plus1 = 1 + 16 + 1 + pb_len + 1 + 2 + 1;

            if (addr_plus1 + 1 > rlen) {
                if (r.done) {
                    return `header too short`;
                }
                idx = addr_plus1 + 1 - rlen;
                r = await reader.readAtLeast(idx, get_xhttp_buffer());
                rlen += r.value.length;
                cache = concat_typed_arrays(cache, r.value);
            }

            const cmd = cache[1 + 16 + 1 + pb_len];
            if (cmd !== 1) {
                return `unsupported command: ${cmd}`;
            }
            const port = (cache[addr_plus1 - 1 - 2] << 8) + cache[addr_plus1 - 1 - 1];
            const atype = cache[addr_plus1 - 1];
            let header_len = -1;
            if (atype === ADDRESS_TYPE_IPV4) {
                header_len = addr_plus1 + 4;
            } else if (atype === ADDRESS_TYPE_IPV6) {
                header_len = addr_plus1 + 16;
            } else if (atype === ADDRESS_TYPE_URL) {
                header_len = addr_plus1 + 1 + cache[addr_plus1];
            }

            if (header_len < 0) {
                return 'read address type failed';
            }

            idx = header_len - rlen;
            if (idx > 0) {
                if (r.done) {
                    return `read address failed`;
                }
                r = await reader.readAtLeast(idx, get_xhttp_buffer());
                rlen += r.value.length;
                cache = concat_typed_arrays(cache, r.value);
            }

            let hostname = '';
            idx = addr_plus1;
            switch (atype) {
                case ADDRESS_TYPE_IPV4:
                    hostname = cache.slice(idx, idx + 4).join('.');
                    break;
                case ADDRESS_TYPE_URL:
                    hostname = new TextDecoder().decode(
                        cache.slice(idx + 1, idx + 1 + cache[idx]),
                    );
                    break;
                case ADDRESS_TYPE_IPV6:
                    hostname = cache
                        .slice(idx, idx + 16)
                        .reduce(
                            (s, b2, i2, a) =>
                                i2 % 2
                                    ? s.concat(((a[i2 - 1] << 8) + b2).toString(16))
                                    : s,
                            [],
                        )
                        .join(':');
                    break;
            }

            if (hostname.length < 1) {
                return 'failed to parse hostname';
            }

            const data = cache.slice(header_len);
            return {
                hostname,
                port,
                data,
                resp: new Uint8Array([version, 0]),
                reader,
                done: r.done,
            };
        } catch (error) {
            try { reader.releaseLock(); } catch (_) {}
            throw error;
        }
    }

    async function upload_to_remote_xhttp(counter, writer, httpx) {
        async function inner_upload(d) {
            if (!d || d.length === 0) {
                return;
            }
            counter.add(d.length);
            try {
                await writer.write(d);
            } catch (error) {
                throw error;
            }
        }

        try {
            await inner_upload(httpx.data);
            let chunkCount = 0;
            while (!httpx.done) {
                const r = await httpx.reader.read(get_xhttp_buffer());
                if (r.done) break;
                await inner_upload(r.value);
                httpx.done = r.done;
                chunkCount++;
                if (chunkCount % 10 === 0) {
                    await xhttp_sleep(0);
                }
                if (!r.value || r.value.length === 0) {
                    await xhttp_sleep(2);
                }
            }
        } catch (error) {
            throw error;
        }
    }

    function create_xhttp_uploader(httpx, writable) {
        const counter = new XhttpCounter();
        const writer = writable.getWriter();
        
        const done = (async () => {
            try {
                await upload_to_remote_xhttp(counter, writer, httpx);
            } catch (error) {
                throw error;
            } finally {
                try {
                    await writer.close();
                } catch (error) {
                    
                }
            }
        })();

        return {
            counter,
            done,
            abort: () => {
                try { writer.abort(); } catch (_) {}
            }
        };
    }

    function create_xhttp_downloader(resp, remote_readable) {
        const counter = new XhttpCounter();
        let stream;

        const done = new Promise((resolve, reject) => {
            stream = new TransformStream(
                {
                    start(controller) {
                        counter.add(resp.length);
                        controller.enqueue(resp);
                    },
                    transform(chunk, controller) {
                        counter.add(chunk.length);
                        controller.enqueue(chunk);
                    },
                    cancel(reason) {
                        reject(`download cancelled: ${reason}`);
                    },
                },
                null,
                new ByteLengthQueuingStrategy({ highWaterMark: XHTTP_BUFFER_SIZE }),
            );

            let lastActivity = Date.now();
            const idleTimer = setInterval(() => {
                if (Date.now() - lastActivity > IDLE_TIMEOUT_MS) {
                    try {
                        stream.writable.abort?.('idle timeout');
                    } catch (_) {}
                    clearInterval(idleTimer);
                    reject('idle timeout');
                }
            }, 5000);

            const reader = remote_readable.getReader();
            const writer = stream.writable.getWriter();

            ;(async () => {
                try {
                    let chunkCount = 0;
                    while (true) {
                        const r = await reader.read();
                        if (r.done) {
                            break;
                        }
                        lastActivity = Date.now();
                        await writer.write(r.value);
                        chunkCount++;
                        if (chunkCount % 5 === 0) {
                            await xhttp_sleep(0);
                        }
                    }
                    await writer.close();
                    resolve();
                } catch (err) {
                    reject(err);
                } finally {
                    try { 
                        reader.releaseLock(); 
                    } catch (_) {}
                    try { 
                        writer.releaseLock(); 
                    } catch (_) {}
                    clearInterval(idleTimer);
                }
            })();
        });

        return {
            readable: stream.readable,
            counter,
            done,
            abort: () => {
                try { stream.readable.cancel(); } catch (_) {}
                try { stream.writable.abort(); } catch (_) {}
            }
        };
    }

    async function connect_to_remote_xhttp(httpx, ...remotes) {
        let attempt = 0;
        let lastErr;
        
        const connectionList = [httpx.hostname, ...remotes.filter(r => r && r !== httpx.hostname)];
        
        for (const hostname of connectionList) {
            if (!hostname) continue;
            
            attempt = 0;
            while (attempt < MAX_RETRIES) {
                attempt++;
                try {
                    const remote = connect({ hostname, port: httpx.port });
                    const timeoutPromise = xhttp_sleep(CONNECT_TIMEOUT_MS).then(() => {
                        throw new Error(atob('Y29ubmVjdCB0aW1lb3V0'));
                    });
                    
                    await Promise.race([remote.opened, timeoutPromise]);

                    const uploader = create_xhttp_uploader(httpx, remote.writable);
                    const downloader = create_xhttp_downloader(httpx.resp, remote.readable);
                    
                    return { 
                        downloader, 
                        uploader,
                        close: () => {
                            try { remote.close(); } catch (_) {}
                        }
                    };
                } catch (err) {
                    lastErr = err;
                    if (attempt < MAX_RETRIES) {
                        await xhttp_sleep(500 * attempt);
                    }
                }
            }
        }
        
        return null;
    }

    async function handle_xhttp_client(body, uuid) {
        if (ACTIVE_CONNECTIONS >= MAX_CONCURRENT) {
            return new Response('Too many connections', { status: 429 });
        }
        
        ACTIVE_CONNECTIONS++;
        
        let cleaned = false;
        const cleanup = () => {
            if (!cleaned) {
                ACTIVE_CONNECTIONS = Math.max(0, ACTIVE_CONNECTIONS - 1);
                cleaned = true;
            }
        };

        try {
            const httpx = await read_xhttp_header(body, uuid);
            if (typeof httpx !== 'object' || !httpx) {
                return null;
            }

            const remoteConnection = await connect_to_remote_xhttp(httpx, fallbackAddress, '13.230.34.30');
            if (remoteConnection === null) {
                return null;
            }

            const connectionClosed = Promise.race([
                (async () => {
                    try {
                        await remoteConnection.downloader.done;
                    } catch (err) {
                        
                    }
                })(),
                (async () => {
                    try {
                        await remoteConnection.uploader.done;
                    } catch (err) {
                        
                    }
                })(),
                xhttp_sleep(IDLE_TIMEOUT_MS).then(() => {
                    
                })
            ]).finally(() => {
                try { remoteConnection.close(); } catch (_) {}
                try { remoteConnection.downloader.abort(); } catch (_) {}
                try { remoteConnection.uploader.abort(); } catch (_) {}
                
                cleanup();
            });

            return {
                readable: remoteConnection.downloader.readable,
                closed: connectionClosed
            };
        } catch (error) {
            cleanup();
            return null;
        }
    }

    async function handleXhttpPost(request) {
        try {
            return await handle_xhttp_client(request.body, at);
        } catch (err) {
            return null;
        }
    }

    function base64ToArray(b64Str) {
        if (!b64Str) return { error: null };
        try { b64Str = b64Str.replace(/-/g, '+').replace(/_/g, '/'); return { earlyData: Uint8Array.from(atob(b64Str), (c) => c.charCodeAt(0)).buffer, error: null }; } 
        catch (error) { return { error }; }
    }

    function closeSocketQuietly(socket) { try { if (socket.readyState === 1 || socket.readyState === 2) socket.close(); } catch (error) {} }

    const hexTable = Array.from({ length: 256 }, (v, i) => (i + 256).toString(16).slice(1));
    function formatIdentifier(arr, offset = 0) {
        const id = (hexTable[arr[offset]]+hexTable[arr[offset+1]]+hexTable[arr[offset+2]]+hexTable[arr[offset+3]]+"-"+hexTable[arr[offset+4]]+hexTable[arr[offset+5]]+"-"+hexTable[arr[offset+6]]+hexTable[arr[offset+7]]+"-"+hexTable[arr[offset+8]]+hexTable[arr[offset+9]]+"-"+hexTable[arr[offset+10]]+hexTable[arr[offset+11]]+hexTable[arr[offset+12]]+hexTable[arr[offset+13]]+hexTable[arr[offset+14]]+hexTable[arr[offset+15]]).toLowerCase();
        if (!isValidFormat(id)) throw new TypeError(E_INVALID_ID_STR);
        return id;
    }

    async function fetchAndParseNewIPs() {
        const url = piu || "https://raw.githubusercontent.com/qwer-search/bestip/refs/heads/main/kejilandbestip.txt";
        try {
            const urls = url.includes(',') ? url.split(',').map(u => u.trim()).filter(u => u) : [url];
            const apiResults = await fetchPreferredAPI(urls, '443', 5000);
            
            if (apiResults.length > 0) {
                const results = [];
                const regex = /^(\[[\da-fA-F:]+\]|[\d.]+|[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)*)(?::(\d+))?(?:#(.+))?$/;
                
                for (const item of apiResults) {
                    const match = item.match(regex);
                    if (match) {
                        results.push({
                            ip: match[1],
                            port: parseInt(match[2] || '443', 10),
                            name: match[3]?.trim() || match[1]
                        });
                    }
                }
                return results;
            }
            
            const response = await fetch(url);
            if (!response.ok) return [];
            const text = await response.text();
            const results = [];
            const lines = text.trim().replace(/\r/g, "").split('\n');
            const simpleRegex = /^([^:]+):(\d+)#(.*)$/;

            for (const line of lines) {
                const trimmedLine = line.trim();
                if (!trimmedLine) continue;
                const match = trimmedLine.match(simpleRegex);
                if (match) {
                    results.push({
                        ip: match[1],
                        port: parseInt(match[2], 10),
                        name: match[3].trim() || match[1]
                    });
                }
            }
            return results;
        } catch (error) {
            return [];
        }
    }

    function generateLinksFromNewIPs(list, user, workerDomain, echConfig = null) {
        
        const CF_HTTP_PORTS = [80, 8080, 8880, 2052, 2082, 2086, 2095];
        const CF_HTTPS_PORTS = [443, 2053, 2083, 2087, 2096, 8443];
        
        const links = [];
        const wsPath = '/?ed=2048';
        const proto = atob('dmxlc3M=');
        
        list.forEach(item => {
            const nodeName = item.name.replace(/\s/g, '_');
            const port = item.port;
            
            if (CF_HTTPS_PORTS.includes(port)) {
                
                const wsNodeName = `${nodeName}-${port}-WS-TLS`;
                let link = `${proto}://${user}@${item.ip}:${port}?encryption=none&security=tls&sni=${workerDomain}&fp=${enableECH ? 'chrome' : 'randomized'}&type=ws&host=${workerDomain}&path=${wsPath}`;
                
                // If ECH is enabled, append the ech parameter (requires Chrome fingerprint)
                if (enableECH) {
                    const dnsServer = customDNS || 'https://dns.joeyblog.eu.org/joeyblog';
                    const echDomain = customECHDomain || 'cloudflare-ech.com';
                    link += `&alpn=h3%2Ch2%2Chttp%2F1.1&ech=${encodeURIComponent(`${echDomain}+${dnsServer}`)}`;
                }
                
                link += `#${encodeURIComponent(wsNodeName)}`;
                links.push(link);
            } else if (CF_HTTP_PORTS.includes(port)) {
                
                if (!disableNonTLS) {
                    const wsNodeName = `${nodeName}-${port}-WS`;
                    const link = `${proto}://${user}@${item.ip}:${port}?encryption=none&security=none&type=ws&host=${workerDomain}&path=${wsPath}#${encodeURIComponent(wsNodeName)}`;
                    links.push(link);
                }
            } else {
                
                const wsNodeName = `${nodeName}-${port}-WS-TLS`;
                let link = `${proto}://${user}@${item.ip}:${port}?encryption=none&security=tls&sni=${workerDomain}&fp=${enableECH ? 'chrome' : 'randomized'}&type=ws&host=${workerDomain}&path=${wsPath}`;
                
                // If ECH is enabled, append the ech parameter (requires Chrome fingerprint)
                if (enableECH) {
                    const dnsServer = customDNS || 'https://dns.joeyblog.eu.org/joeyblog';
                    const echDomain = customECHDomain || 'cloudflare-ech.com';
                    link += `&alpn=h3%2Ch2%2Chttp%2F1.1&ech=${encodeURIComponent(`${echDomain}+${dnsServer}`)}`;
                }
                
                link += `#${encodeURIComponent(wsNodeName)}`;
                links.push(link);
            }
        });
        return links;
    }

    function generateXhttpLinksFromSource(list, user, workerDomain, echConfig = null) {
        const links = [];
        const nodePath = user.substring(0, 8);
        
        list.forEach(item => {
            let nodeNameBase = item.isp.replace(/\s/g, '_');
            if (item.colo && item.colo.trim()) {
                nodeNameBase = `${nodeNameBase}-${item.colo.trim()}`;
            }
            const safeIP = item.ip.includes(':') ? `[${item.ip}]` : item.ip;
            const port = item.port || 443;
            
            const wsNodeName = `${nodeNameBase}-${port}-xhttp`;
            const params = new URLSearchParams({
                encryption: 'none',
                security: 'tls',
                sni: workerDomain,
                fp: 'chrome',
                type: 'xhttp',
                host: workerDomain,
                path: `/${nodePath}`,
                mode: 'stream-one'
            });
            
            // If ECH is enabled, append the ech parameter (requires Chrome fingerprint)
            if (enableECH) {
                const dnsServer = customDNS || 'https://dns.joeyblog.eu.org/joeyblog';
                const echDomain = customECHDomain || 'cloudflare-ech.com';
                params.set('alpn', 'h3,h2,http/1.1');
                params.set('ech', `${echDomain}+${dnsServer}`);
            }
            
            links.push(`vless://${user}@${safeIP}:${port}?${params.toString()}#${encodeURIComponent(wsNodeName)}`);
        });
        
        return links;
    }

    async function generateTrojanLinksFromNewIPs(list, user, workerDomain, echConfig = null) {
        
        const CF_HTTP_PORTS = [80, 8080, 8880, 2052, 2082, 2086, 2095];
        const CF_HTTPS_PORTS = [443, 2053, 2083, 2087, 2096, 8443];
        
        const links = [];
        const wsPath = '/?ed=2048';
        
        const password = tp || user;
        
        list.forEach(item => {
            const nodeName = item.name.replace(/\s/g, '_');
            const port = item.port;
            
            if (CF_HTTPS_PORTS.includes(port)) {
                
                const wsNodeName = `${nodeName}-${port}-${atob('VHJvamFu')}-WS-TLS`;
                let link = `${atob('dHJvamFuOi8v')}${password}@${item.ip}:${port}?security=tls&sni=${workerDomain}&fp=chrome&type=ws&host=${workerDomain}&path=${wsPath}`;
                
                // If ECH is enabled, append the ech parameter (requires Chrome fingerprint)
                if (enableECH) {
                    const dnsServer = customDNS || 'https://dns.joeyblog.eu.org/joeyblog';
                    const echDomain = customECHDomain || 'cloudflare-ech.com';
                    link += `&alpn=h3%2Ch2%2Chttp%2F1.1&ech=${encodeURIComponent(`${echDomain}+${dnsServer}`)}`;
                }
                
                link += `#${encodeURIComponent(wsNodeName)}`;
                links.push(link);
            } else if (CF_HTTP_PORTS.includes(port)) {
                
                if (!disableNonTLS) {
                    const wsNodeName = `${nodeName}-${port}-${atob('VHJvamFu')}-WS`;
                    const link = `${atob('dHJvamFuOi8v')}${password}@${item.ip}:${port}?security=none&type=ws&host=${workerDomain}&path=${wsPath}#${encodeURIComponent(wsNodeName)}`;
                    links.push(link);
                }
            } else {
                
                const wsNodeName = `${nodeName}-${port}-${atob('VHJvamFu')}-WS-TLS`;
                let link = `${atob('dHJvamFuOi8v')}${password}@${item.ip}:${port}?security=tls&sni=${workerDomain}&fp=chrome&type=ws&host=${workerDomain}&path=${wsPath}`;
                
                // If ECH is enabled, append the ech parameter (requires Chrome fingerprint)
                if (enableECH) {
                    const dnsServer = customDNS || 'https://dns.joeyblog.eu.org/joeyblog';
                    const echDomain = customECHDomain || 'cloudflare-ech.com';
                    link += `&alpn=h3%2Ch2%2Chttp%2F1.1&ech=${encodeURIComponent(`${echDomain}+${dnsServer}`)}`;
                }
                
                link += `#${encodeURIComponent(wsNodeName)}`;
                links.push(link);
            }
        });
        return links;
    }

    async function handleConfigAPI(request) {
        if (request.method === 'GET') {
            
            if (!kvStore) {
                return new Response(JSON.stringify({
                    error: 'KV not configured',
                    kvEnabled: false
                }), {
                    status: 503,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            
            return new Response(JSON.stringify({
                ...kvConfig,
                kvEnabled: true
            }), {
                headers: { 'Content-Type': 'application/json' }
            });
        } else if (request.method === 'POST') {
            
            if (!kvStore) {
                return new Response(JSON.stringify({
                    success: false,
                    message: 'KV not configured; cannot save configuration'
                }), {
                    status: 503,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            
            try {
                const newConfig = await request.json();
                
                for (const [key, value] of Object.entries(newConfig)) {
                    if (value === '' || value === null || value === undefined) {
                        delete kvConfig[key];
                    } else {
                        kvConfig[key] = value;
                    }
                }
                
                await saveKVConfig();
                
                updateConfigVariables();
                
                if (newConfig.yx !== undefined) {
                    updateCustomPreferredFromYx();
                }
                
                const newPreferredIPsURL = getConfigValue('yxURL', '') || 'https://raw.githubusercontent.com/qwer-search/bestip/refs/heads/main/kejilandbestip.txt';
                const defaultURL = 'https://raw.githubusercontent.com/qwer-search/bestip/refs/heads/main/kejilandbestip.txt';
                if (newPreferredIPsURL !== defaultURL) {
                    directDomains.length = 0;
                    customPreferredIPs = [];
                    customPreferredDomains = [];
                } else {
                    backupIPs = [
                        ...REGION_CODES.map((code) => ({
                            domain: hubDomainMap[regionRouteMap[code] || 'SG'],
                            region: code,
                            regionCode: code,
                            port: 443
                        })),
                        { domain: 'ProxyIP.Oracle.cmliussss.net', region: 'Oracle', regionCode: 'Oracle', port: 443 },
                        { domain: 'ProxyIP.DigitalOcean.CMLiussss.net', region: 'DigitalOcean', regionCode: 'DigitalOcean', port: 443 },
                        { domain: 'ProxyIP.Vultr.CMLiussss.net', region: 'Vultr', regionCode: 'Vultr', port: 443 },
                        { domain: 'ProxyIP.Multacom.CMLiussss.net', region: 'Multacom', regionCode: 'Multacom', port: 443 }
                    ];
                    directDomains.length = 0;
                    directDomains.push(
                        { name: "cloudflare.182682.xyz", domain: "cloudflare.182682.xyz" }, 
                        { name: "speed.marisalnc.com", domain: "speed.marisalnc.com" },
                        { domain: "freeyx.cloudflare88.eu.org" }, 
                        { domain: "bestcf.top" }, 
                        { domain: "cdn.2020111.xyz" }, 
                        { domain: "cfip.cfcdn.vip" },
                        { domain: "cf.0sm.com" }, 
                        { domain: "cf.090227.xyz" }, 
                        { domain: "cf.zhetengsha.eu.org" }, 
                        { domain: "cloudflare.9jy.cc" },
                        { domain: "cf.zerone-cdn.pp.ua" }, 
                        { domain: "cfip.1323123.xyz" }, 
                        { domain: "cnamefuckxxs.yuchen.icu" }, 
                        { domain: "cloudflare-ip.mofashi.ltd" },
                        { domain: "115155.xyz" }, 
                        { domain: "cname.xirancdn.us" }, 
                        { domain: "f3058171cad.002404.xyz" }, 
                        { domain: "8.889288.xyz" },
                        { domain: "cdn.tzpro.xyz" }, 
                        { domain: "cf.877771.xyz" }, 
                        { domain: "xn--b6gac.eu.org" }
                    );
                }
                
                return new Response(JSON.stringify({
                    success: true,
                    message: 'Configuration saved',
                    config: kvConfig
                }), {
                    headers: { 'Content-Type': 'application/json' }
                });
            } catch (error) {
                
                return new Response(JSON.stringify({
                    success: false,
                    message: 'Save failed: ' + error.message
                }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        }
        
        return new Response(JSON.stringify({ error: 'Method not allowed' }), { 
            status: 405,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    async function handlePreferredIPsAPI(request) {
        
        if (!kvStore) {
            return new Response(JSON.stringify({
                success: false,
                error: 'KV not configured',
                message: 'KV must be configured to use this feature'
            }), {
                status: 503,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        const ae = getConfigValue('ae', '') === 'yes';
        if (!ae) {
            return new Response(JSON.stringify({
                success: false,
                error: 'API disabled',
                message: 'For safety, the Preferred‑IPs API is disabled by default. Enable `ae` (Allow API management) in Settings to use it.'
            }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        try {
            if (request.method === 'GET') {
                
                const yxValue = getConfigValue('yx', '');
                const pi = parseYxToArray(yxValue);
                
                return new Response(JSON.stringify({
                    success: true,
                    count: pi.length,
                    data: pi
                }), {
                    headers: { 'Content-Type': 'application/json' }
                });
                
            } else if (request.method === 'POST') {
                
                const body = await request.json();
                
                const ipsToAdd = Array.isArray(body) ? body : [body];
                
                if (ipsToAdd.length === 0) {
                    return new Response(JSON.stringify({
                        success: false,
                        error: 'Empty request body',
                        message: 'Please provide IP data'
                    }), {
                        status: 400,
                        headers: { 'Content-Type': 'application/json' }
                    });
                }
                
                const yxValue = getConfigValue('yx', '');
                let pi = parseYxToArray(yxValue);
                
                const addedIPs = [];
                const skippedIPs = [];
                const errors = [];
                
                for (const item of ipsToAdd) {
                    
                    if (!item.ip) {
                        errors.push({ ip: 'Unknown', reason: 'IP is required' });
                        continue;
                    }
                    
                    const port = item.port || 443;
                    const name = item.name || `API-Preferred-${item.ip}:${port}`;
                    
                    if (!isValidIP(item.ip) && !isValidDomain(item.ip)) {
                        errors.push({ ip: item.ip, reason: 'Invalid IP or domain format' });
                        continue;
                    }
                    
                    const exists = pi.some(existItem => 
                        existItem.ip === item.ip && existItem.port === port
                    );
                    
                    if (exists) {
                        skippedIPs.push({ ip: item.ip, port: port, reason: 'Already exists' });
                        continue;
                    }
                    
                    const newIP = {
                        ip: item.ip,
                        port: port,
                        name: name,
                        addedAt: new Date().toISOString()
                    };
                    
                    pi.push(newIP);
                    addedIPs.push(newIP);
                }
                
                if (addedIPs.length > 0) {
                    const newYxValue = arrayToYx(pi);
                    await setConfigValue('yx', newYxValue);
                    updateCustomPreferredFromYx();
                }
                
                return new Response(JSON.stringify({
                    success: addedIPs.length > 0,
                    message: `Added ${addedIPs.length} item(s)`,
                    added: addedIPs.length,
                    skipped: skippedIPs.length,
                    errors: errors.length,
                    data: {
                        addedIPs: addedIPs,
                        skippedIPs: skippedIPs.length > 0 ? skippedIPs : undefined,
                        errors: errors.length > 0 ? errors : undefined
                    }
                }), {
                    headers: { 'Content-Type': 'application/json' }
                });
                
            } else if (request.method === 'DELETE') {
                
                const body = await request.json();
                
                if (body.all === true) {
                    
                    const yxValue = getConfigValue('yx', '');
                    const pi = parseYxToArray(yxValue);
                    const deletedCount = pi.length;
                    
                    await setConfigValue('yx', '');
                    updateCustomPreferredFromYx();
                    
                    return new Response(JSON.stringify({
                        success: true,
                        message: `Cleared all preferred items (deleted ${deletedCount})`,
                        deletedCount: deletedCount
                    }), {
                        headers: { 'Content-Type': 'application/json' }
                    });
                }
                
                if (!body.ip) {
                    return new Response(JSON.stringify({
                        success: false,
                        error: 'IP is required',
                        message: 'Provide the `ip` field to delete a single item, or use {\"all\": true} to clear everything.'
                    }), {
                        status: 400,
                        headers: { 'Content-Type': 'application/json' }
                    });
                }
                
                const port = body.port || 443;
                
                const yxValue = getConfigValue('yx', '');
                let pi = parseYxToArray(yxValue);
                const initialLength = pi.length;
                
                const filteredIPs = pi.filter(item => 
                    !(item.ip === body.ip && item.port === port)
                );
                
                if (filteredIPs.length === initialLength) {
                    return new Response(JSON.stringify({
                        success: false,
                        error: 'Not found',
                        message: `${body.ip}:${port} not found`
                    }), {
                        status: 404,
                        headers: { 'Content-Type': 'application/json' }
                    });
                }
                
                const newYxValue = arrayToYx(filteredIPs);
                await setConfigValue('yx', newYxValue);
                updateCustomPreferredFromYx();
                
                return new Response(JSON.stringify({
                    success: true,
                    message: 'Deleted',
                    deleted: { ip: body.ip, port: port }
                }), {
                    headers: { 'Content-Type': 'application/json' }
                });
                
            } else {
                return new Response(JSON.stringify({
                    success: false,
                    error: 'Method not supported',
                    message: 'Supported methods: GET, POST, DELETE'
                }), {
                    status: 405,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        } catch (error) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Request failed',
                message: error.message
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    }

    function updateConfigVariables() {
        const manualRegion = getConfigValue('wk', '');
        if (manualRegion && manualRegion.trim()) {
            manualWorkerRegion = manualRegion.trim().toUpperCase();
            currentWorkerRegion = manualWorkerRegion;
        } else {
            const ci = getConfigValue('p', '');
            if (ci && ci.trim()) {
                currentWorkerRegion = 'CUSTOM';
            } else {
                manualWorkerRegion = '';
            }
        }
        
        const regionMatchingControl = getConfigValue('rm', '');
        if (regionMatchingControl && regionMatchingControl.toLowerCase() === 'no') {
            enableRegionMatching = false;
        } else {
            enableRegionMatching = true;
        }
        
        const vlessControl = getConfigValue('ev', '');
        if (vlessControl !== undefined && vlessControl !== '') {
            ev = vlessControl === 'yes' || vlessControl === true || vlessControl === 'true';
        }
        
        const tjControl = getConfigValue('et', '');
        if (tjControl !== undefined && tjControl !== '') {
            et = tjControl === 'yes' || tjControl === true || tjControl === 'true';
        }
        
        tp = getConfigValue('tp', '') || '';
        
        const xhttpControl = getConfigValue('ex', '');
        if (xhttpControl !== undefined && xhttpControl !== '') {
            ex = xhttpControl === 'yes' || xhttpControl === true || xhttpControl === 'true';
        }
        
        if (!ev && !et && !ex) {
            ev = true;
        }
        
        scu = getConfigValue('scu', '') || 'https://url.v1.mk/sub';
        
        const preferredDomainsControl = getConfigValue('epd', 'no');
        if (preferredDomainsControl !== undefined && preferredDomainsControl !== '') {
            epd = preferredDomainsControl !== 'no' && preferredDomainsControl !== false && preferredDomainsControl !== 'false';
        }
        
        const preferredIPsControl = getConfigValue('epi', '');
        if (preferredIPsControl !== undefined && preferredIPsControl !== '') {
            epi = preferredIPsControl !== 'no' && preferredIPsControl !== false && preferredIPsControl !== 'false';
        }
        
        const githubIPsControl = getConfigValue('egi', '');
        if (githubIPsControl !== undefined && githubIPsControl !== '') {
            egi = githubIPsControl !== 'no' && githubIPsControl !== false && githubIPsControl !== 'false';
        }
        
        const echControl = getConfigValue('ech', '');
        if (echControl !== undefined && echControl !== '') {
            enableECH = echControl === 'yes' || echControl === true || echControl === 'true';
        }
        
        // Update custom DNS and ECH domain
        const customDNSValue = getConfigValue('customDNS', '');
        if (customDNSValue && customDNSValue.trim()) {
            customDNS = customDNSValue.trim();
        } else {
            customDNS = 'https://dns.joeyblog.eu.org/joeyblog';
        }
        
        const customECHDomainValue = getConfigValue('customECHDomain', '');
        if (customECHDomainValue && customECHDomainValue.trim()) {
            customECHDomain = customECHDomainValue.trim();
        } else {
            customECHDomain = 'cloudflare-ech.com';
        }
        
        // If ECH is enabled, force TLS-only mode (avoid port 80 interference)
        // ECH requires TLS, so non-TLS nodes must be disabled
        if (enableECH) {
            disableNonTLS = true;
        }
        
        // Check dkby (if dkby=yes, also forces TLS-only)
        const dkbyControl = getConfigValue('dkby', '');
        if (dkbyControl && dkbyControl.toLowerCase() === 'yes') {
            disableNonTLS = true;
        }
        
        cp = getConfigValue('d', '') || '';
        
        piu = getConfigValue('yxURL', '') || 'https://raw.githubusercontent.com/qwer-search/bestip/refs/heads/main/kejilandbestip.txt';
        
        const envFallback = getConfigValue('p', '');
        if (envFallback) {
            fallbackAddress = envFallback.trim();
        } else {
            fallbackAddress = '';
        }
        
        socks5Config = getConfigValue('s', '') || '';
        if (socks5Config) {
            try {
                parsedSocks5Config = parseSocksConfig(socks5Config);
                isSocksEnabled = true;
            } catch (err) {
                isSocksEnabled = false;
            }
        } else {
            isSocksEnabled = false;
        }
        
        const yxbyControl = getConfigValue('yxby', '');
        if (yxbyControl && yxbyControl.toLowerCase() === 'yes') {
            disablePreferred = true;
        } else {
            disablePreferred = false;
        }
        
        const defaultURL = 'https://raw.githubusercontent.com/qwer-search/bestip/refs/heads/main/kejilandbestip.txt';
        if (piu !== defaultURL) {
            directDomains.length = 0;
            customPreferredIPs = [];
            customPreferredDomains = [];
        }
    }

    function updateCustomPreferredFromYx() {
        const yxValue = getConfigValue('yx', '');
        if (yxValue) {
            try {
                const preferredList = yxValue.split(',').map(item => item.trim()).filter(item => item);
                customPreferredIPs = [];
                customPreferredDomains = [];
                
                preferredList.forEach(item => {
                    let nodeName = '';
                    let addressPart = item;
                    
                    if (item.includes('#')) {
                        const parts = item.split('#');
                        addressPart = parts[0].trim();
                        nodeName = parts[1].trim();
                    }
                    
                    const { address, port } = parseAddressAndPort(addressPart);
                    
                    if (!nodeName) {
                        nodeName = 'CustomPreferred-' + address + (port ? ':' + port : '');
                    }
                    
                    if (isValidIP(address)) {
                        customPreferredIPs.push({ 
                            ip: address, 
                            port: port,
                            isp: nodeName
                        });
                    } else {
                        customPreferredDomains.push({ 
                            domain: address, 
                            port: port,
                            name: nodeName
                        });
                    }
                });
            } catch (err) {
                customPreferredIPs = [];
                customPreferredDomains = [];
            }
        } else {
            customPreferredIPs = [];
            customPreferredDomains = [];
        }
    }

    function parseYxToArray(yxValue) {
        if (!yxValue || !yxValue.trim()) return [];
        
        const items = yxValue.split(',').map(item => item.trim()).filter(item => item);
        const result = [];
        
        for (const item of items) {
            
            let nodeName = '';
            let addressPart = item;
            
            if (item.includes('#')) {
                const parts = item.split('#');
                addressPart = parts[0].trim();
                nodeName = parts[1].trim();
            }
            
            const { address, port } = parseAddressAndPort(addressPart);
            
            if (!nodeName) {
                nodeName = address + (port ? ':' + port : '');
            }
            
            result.push({
                ip: address,
                port: port || 443,
                name: nodeName,
                addedAt: new Date().toISOString()
            });
        }
        
        return result;
    }

    function arrayToYx(array) {
        if (!array || array.length === 0) return '';
        
        return array.map(item => {
            const port = item.port || 443;
            return `${item.ip}:${port}#${item.name}`;
        }).join(',');
    }

    function isValidDomain(domain) {
        const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
        return domainRegex.test(domain);
    }

    async function parseTextToArray(content) {
        var processed = content.replace(/[	"'\r\n]+/g, ',').replace(/,+/g, ',');
        if (processed.charAt(0) == ',') processed = processed.slice(1);
        if (processed.charAt(processed.length - 1) == ',') processed = processed.slice(0, processed.length - 1);
        return processed.split(',');
    }

    async function fetchPreferredAPI(urls, defaultPort = '443', timeout = 3000) {
        if (!urls?.length) return [];
        const results = new Set();
        await Promise.allSettled(urls.map(async (url) => {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), timeout);
                const response = await fetch(url, { signal: controller.signal });
                clearTimeout(timeoutId);
                let text = '';
                try {
                    const buffer = await response.arrayBuffer();
                    const contentType = (response.headers.get('content-type') || '').toLowerCase();
                    const charset = contentType.match(/charset=([^\s;]+)/i)?.[1]?.toLowerCase() || '';

                    let decoders = ['utf-8', 'gb2312'];
                    if (charset.includes('gb') || charset.includes('gbk') || charset.includes('gb2312')) {
                        decoders = ['gb2312', 'utf-8'];
                    }

                    let decodeSuccess = false;
                    for (const decoder of decoders) {
                        try {
                            const decoded = new TextDecoder(decoder).decode(buffer);
                            if (decoded && decoded.length > 0 && !decoded.includes('\ufffd')) {
                                text = decoded;
                                decodeSuccess = true;
                                break;
                            } else if (decoded && decoded.length > 0) {
                                continue;
                            }
                        } catch (e) {
                            continue;
                        }
                    }

                    if (!decodeSuccess) {
                        text = await response.text();
                    }

                    if (!text || text.trim().length === 0) {
                        return;
                    }
                } catch (e) {
                    return;
                }
                const lines = text.trim().split('\n').map(l => l.trim()).filter(l => l);
                const isCSV = lines.length > 1 && lines[0].includes(',');
                const IPV6_PATTERN = /^[^\[\]]*:[^\[\]]*:[^\[\]]/;
                if (!isCSV) {
                    lines.forEach(line => {
                        const hashIndex = line.indexOf('#');
                        const [hostPart, remark] = hashIndex > -1 ? [line.substring(0, hashIndex), line.substring(hashIndex)] : [line, ''];
                        let hasPort = false;
                        if (hostPart.startsWith('[')) {
                            hasPort = /\]:(\d+)$/.test(hostPart);
                        } else {
                            const colonIndex = hostPart.lastIndexOf(':');
                            hasPort = colonIndex > -1 && /^\d+$/.test(hostPart.substring(colonIndex + 1));
                        }
                        const port = new URL(url).searchParams.get('port') || defaultPort;
                        results.add(hasPort ? line : `${hostPart}:${port}${remark}`);
                    });
                } else {
                    const headers = lines[0].split(',').map(h => h.trim());
                    const dataLines = lines.slice(1);
                    const ipIdx = headers.findIndex(h => /(^ip$|ip\s*address|address)/i.test(h));
                    const portIdx = headers.findIndex(h => /^port$/i.test(h));
                    const remarkIdx = headers.findIndex(h => /(country|city|colo|datacenter|data\s*center|dc)/i.test(h));
                    const tlsIdx = headers.findIndex(h => /^tls$/i.test(h));
                    const delayIdx = headers.findIndex(h => /(latency|delay|ms)/i.test(h));
                    const speedIdx = headers.findIndex(h => /(speed|download)/i.test(h));

                    if (ipIdx !== -1 && portIdx !== -1 && remarkIdx !== -1) {
                        dataLines.forEach(line => {
                            const cols = line.split(',').map(c => c.trim());
                            if (tlsIdx !== -1 && cols[tlsIdx]?.toLowerCase() !== 'true') return;
                            const wrappedIP = IPV6_PATTERN.test(cols[ipIdx]) ? `[${cols[ipIdx]}]` : cols[ipIdx];
                            results.add(`${wrappedIP}:${cols[portIdx]}#${cols[remarkIdx]}`);
                        });
                    } else if (ipIdx !== -1 && delayIdx !== -1 && speedIdx !== -1) {
                        const port = new URL(url).searchParams.get('port') || defaultPort;
                        dataLines.forEach(line => {
                            const cols = line.split(',').map(c => c.trim());
                            const wrappedIP = IPV6_PATTERN.test(cols[ipIdx]) ? `[${cols[ipIdx]}]` : cols[ipIdx];
                            results.add(`${wrappedIP}:${port}#CF Preferred ${cols[delayIdx]}ms ${cols[speedIdx]}MB/s`);
                        });
                    }
                }
            } catch (e) { }
        }));
        return Array.from(results);
    }



