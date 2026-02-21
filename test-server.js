// Orpheus 服务器测试
const http = require('http');

function testEndpoint(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`✅ ${path} - Status: ${res.statusCode}`);
        resolve(data);
      });
    }).on('error', (err) => {
      console.log(`❌ ${path} - Error: ${err.message}`);
      reject(err);
    });
  });
}

async function runTests() {
  console.log('🧪 Testing Orpheus Server...\n');
  
  try {
    await testEndpoint('/');
    await testEndpoint('/api/tracks');
    await testEndpoint('/api/playlists');
    console.log('\n✅ All tests passed!');
  } catch (error) {
    console.log('\n❌ Tests failed');
    process.exit(1);
  }
}

runTests();
