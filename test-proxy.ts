const testProxy = async () => {
  const baseUrl = 'https://longcpa.zeabur.app';
  const key = 'testgrok';
  const endpoints = [
    '/v1/models',
    '/v1beta/models',
    '/v1beta/models?key=' + key,
    '/models'
  ];
  
  for (const ep of endpoints) {
    console.log(`\nTesting ${ep}...`);
    try {
      const res = await fetch(baseUrl + ep, {
        headers: {
          'Authorization': `Bearer ${key}`,
          'x-goog-api-key': key,
          'User-Agent': 'Mozilla/5.0'
        }
      });
      console.log(`Status: ${res.status}`);
      const text = await res.text();
      console.log(`Response: ${text.substring(0, 200)}`);
    } catch (e) {
      console.error(`Error: ${e.message}`);
    }
  }
};
testProxy();
