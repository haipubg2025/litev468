const fs = require('fs');
let code = fs.readFileSync('src/components/Settings.tsx', 'utf8');

// 1. Refactor handleLoadAllModels to use loadModelsForProxies
code = code.replace(
  /const handleLoadAllModels = async \(\) => \{\s*if \(proxies\.length === 0\) \{\s*toast\.info\('Không có proxy nào để load models'\);\s*return;\s*\}\s*setIsLoadingAllModels\(true\);\s*let successCount = 0;\s*await Promise\.all\(proxies\.map\(async \(proxy\) => \{/,
  `const loadModelsForProxies = async (targetProxies: ProxyConfig[]) => {
    setIsLoadingAllModels(true);
    let successCount = 0;
    
    await Promise.all(targetProxies.map(async (proxy) => {`
);

code = code.replace(
  /setIsLoadingAllModels\(false\);\s*if \(successCount > 0\) \{\s*toast\.success\(\`Đã tải models thành công cho \$\{successCount\}\/\$\{proxies\.length\} proxy\`\);\s*\} else \{\s*toast\.error\('Không thể tải models cho proxy nào'\);\s*\}\s*\};/,
  `setIsLoadingAllModels(false);
    return successCount;
  };

  const handleLoadAllModels = async () => {
    if (proxies.length === 0) {
      toast.info('Không có proxy nào để load models');
      return;
    }
    const count = await loadModelsForProxies(proxies);
    if (count > 0) {
      toast.success(\`Đã tải models thành công cho \$\{count\}/\$\{proxies.length\} proxy\`);
    } else {
      toast.error('Không thể tải models cho proxy nào');
    }
  };`
);

// 2. Add loadModelsForProxies to handleAddProxy
code = code.replace(
  /addProxy\(newProxy\);\s*setProxyForm\(\{ url: '', key: '', format: 'auto' \}\);\s*toast\.success\(\`Kết nối thành công và đã lưu Proxy \$\{proxies\.length\}\`\);/,
  `addProxy(newProxy);
      setProxyForm({ url: '', key: '', format: 'auto' });
      toast.success(\`Kết nối thành công và đã lưu Proxy \$\{proxies.length + 1\}\`);
      loadModelsForProxies([newProxy]);`
);

// 3. Add loadModelsForProxies to handleTxtUpload
code = code.replace(
  /proxyPairs\.forEach\(\(pair, i\) => \{\s*addProxy\(\{\s*id: Math\.random\(\)\.toString\(36\)\.substring\(7\),\s*name: \`Proxy nhập từ TXT \$\{Math\.floor\(Math\.random\(\)\*1000\)\}\`,\s*url: pair\.url,\s*key: pair\.key,\s*createdAt: Date\.now\(\)\s*\}\);\s*\}\);/,
  `const newProxies = proxyPairs.map((pair, i) => {
          const newProxy = {
            id: Math.random().toString(36).substring(7),
            name: \`Proxy nhập từ TXT \$\{Math.floor(Math.random()*1000)}\`,
            url: pair.url,
            key: pair.key,
            createdAt: Date.now()
          };
          addProxy(newProxy);
          return newProxy;
      });
      if (newProxies.length > 0) {
        loadModelsForProxies(newProxies);
      }`
);

fs.writeFileSync('src/components/Settings.tsx', code);
console.log("Patched Settings.tsx");
