// Poll a real public endpoint; GET /api/login is protected and is not a health check.
const base = process.argv.includes('--render')
  ? 'https://floginfe-be-4tnt.onrender.com/api'
  : process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';
const deadline = Date.now() + 180000;
(async () => {
  while (Date.now() < deadline) {
    try {
      const response = await fetch(base + '/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'testuser', password: 'Test@123' }),
        signal: AbortSignal.timeout(10000),
      });
      if (response.ok && (await response.json()).success) {
        console.log('Backend is ready'); return;
      }
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  throw new Error('Backend was not ready within 180 seconds');
})().catch(error => { console.error(error.message); process.exitCode = 1; });
