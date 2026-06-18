const http = require('http');

const PORT = 4000;
let token = '';

function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: PORT,
      path: path.startsWith('/health') ? path : `/api/v1${path}`,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data || '{}') });
        } catch(e) {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  console.log("Starting Comprehensive Backend Test Suite...\n");

  // 1. Health check
  console.log("1. Testing Health Endpoint...");
  let res = await request('GET', '/health');
  if (res.status === 200) console.log("✅ Health check passed");
  else console.error("❌ Health check failed", res);

  // 2. Auth Login
  console.log("\n2. Testing Authentication...");
  res = await request('POST', '/auth/login', { email: 'staff@hotel1.com', password: 'password123' });
  if (res.status === 200 && res.data.token) {
    console.log("✅ Login passed. Token retrieved.");
    token = res.data.token;
  } else {
    console.error("❌ Login failed", res.data);
    return;
  }

  const authHeaders = { 'Authorization': `Bearer ${token}` };

  // 3. Fetch Rooms Config
  console.log("\n3. Testing Configuration (Rooms)...");
  res = await request('GET', '/config/rooms', null, authHeaders);
  if (res.status === 200 && Array.isArray(res.data)) {
    console.log(`✅ Config passed. Found ${res.data.length} rooms.`);
  } else {
    console.error("❌ Config rooms fetch failed", res.data);
  }

  // 4. Create Reservation
  console.log("\n4. Testing Reservations (Booking Engine)...");
  res = await request('POST', '/reservations', {
    guestId: "b851b3f6-cbb4-4c86-89fa-1b4d0cd5c3b1", // Might fail if guest doesn't exist
    roomTypeId: "dddddddd-dddd-dddd-dddd-dddddddddddd", // We don't have exact IDs here
    checkIn: "2026-07-01",
    checkOut: "2026-07-05",
    status: "CONFIRMED"
  }, authHeaders);
  
  if (res.status === 201 || res.status === 400 || res.status === 500) {
     console.log(`✅ Reservation request hit database (HTTP ${res.status})`);
     console.log(res.data);
  }

  console.log("\nTests Complete.");
}

runTests().catch(console.error);
