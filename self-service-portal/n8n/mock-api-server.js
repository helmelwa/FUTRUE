const http = require('http');
const url = require('url');

// Mock data for test employees
const mockEmployees = {
  'alice.chen@company.com': {
    managerEmail: 'bob.martinez@company.com',
    managerName: 'Bob Martinez'
  },
  'david.kim@company.com': {
    managerEmail: 'sarah.johnson@company.com',
    managerName: 'Sarah Johnson'
  }
};

// Default manager for unknown employees
const defaultManager = {
  managerEmail: 'hr.manager@company.com',
  managerName: 'HR Manager'
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  try {
    // GET /api/manager/{email}
    const managerMatch = pathname.match(/^\/api\/manager\/(.+)$/);
    if (managerMatch) {
      const email = decodeURIComponent(managerMatch[1]);
      const managerData = mockEmployees[email] || defaultManager;

      console.log('========================================');
      console.log('Manager Lookup:', email);
      console.log('Found:', managerData.managerName, `(${managerData.managerEmail})`);
      console.log('========================================');

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(managerData));
      return;
    }

    // Health check endpoint
    if (pathname === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok' }));
      return;
    }

    // 404
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Not found' }));

  } catch (err) {
    console.error('Error:', err);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log('========================================');
  console.log('Mock API Server running on port', PORT);
  console.log('========================================');
  console.log('Endpoints:');
  console.log('  GET /health              - Health check');
  console.log('  GET /api/manager/{email} - Get manager for employee');
  console.log('========================================');
  console.log('Mock Employees:');
  console.log('  alice.chen@company.com   -> Bob Martinez');
  console.log('  david.kim@company.com    -> Sarah Johnson');
  console.log('  [any other email]       -> HR Manager');
  console.log('========================================');
});
