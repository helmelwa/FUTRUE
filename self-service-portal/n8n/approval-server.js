const http = require('http');
const url = require('url');

// In-memory store for requests
const requests = new Map();

// Generate unique request ID
function generateRequestId() {
  return 'REQ-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
}

// HTML templates
function renderStatusPage(status, requestId) {
  const statusColor = status === 'approved' ? '#22c55e' : status === 'denied' ? '#ef4444' : '#f59e0b';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Request ${status.charAt(0).toUpperCase() + status.slice(1)}</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 0; padding: 40px; background: #f3f4f6; }
    .container { max-width: 500px; margin: 0 auto; background: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; }
    h1 { color: ${statusColor}; margin-bottom: 10px; }
    p { color: #6b7280; margin-bottom: 20px; }
    .request-id { background: #f3f4f6; padding: 12px 20px; border-radius: 8px; font-family: monospace; display: inline-block; }
    .back-link { display: inline-block; margin-top: 20px; color: #3b82f6; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Request ${status.charAt(0).toUpperCase() + status.slice(1)}</h1>
    <p>Your request has been ${status}.</p>
    <div class="request-id">${requestId}</div>
    <div>
      <a href="/" class="back-link">Submit another request</a>
    </div>
  </div>
</body>
</html>`;
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  try {
    // GET /approve?id=XXX
    if (pathname === '/approve' && query.id) {
      const request = requests.get(query.id);
      if (!request) {
        res.statusCode = 404;
        res.end('<html><body><h1>Request Not Found</h1><p>The specified request ID does not exist.</p></body></html>');
        return;
      }

      request.status = 'approved';
      request.updatedAt = new Date().toISOString();

      console.log('========================================');
      console.log('APPROVAL: Provisioning access for request:', query.id);
      console.log('User:', request.requesterName, `(${request.requesterEmail})`);
      console.log('Resource:', request.resourceName);
      console.log(`Action: Approving ${request.accessType} access`);
      console.log('Simulating AD/ITSM API call to provision access...');
      console.log('Provisioning completed successfully.');
      console.log('========================================');

      console.log('NOTIFICATION: Sending email to', request.requesterEmail);
      console.log('Subject: Your request has been approved');
      console.log('Body: Your request for', request.resourceName, 'has been approved and access is being provisioned.');
      console.log('Email notification sent.');
      console.log('========================================');

      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(renderStatusPage('approved', query.id));
      return;
    }

    // GET /deny?id=XXX
    if (pathname === '/deny' && query.id) {
      const request = requests.get(query.id);
      if (!request) {
        res.statusCode = 404;
        res.end('<html><body><h1>Request Not Found</h1><p>The specified request ID does not exist.</p></body></html>');
        return;
      }

      request.status = 'denied';
      request.updatedAt = new Date().toISOString();

      console.log('========================================');
      console.log('DENIAL: Request denied:', query.id);
      console.log('User:', request.requesterName, `(${request.requesterEmail})`);
      console.log('Resource:', request.resourceName);
      console.log('========================================');

      console.log('NOTIFICATION: Sending email to', request.requesterEmail);
      console.log('Subject: Your request has been denied');
      console.log('Body: Your request for', request.resourceName, 'has been denied.');
      console.log('Email notification sent.');
      console.log('========================================');

      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(renderStatusPage('denied', query.id));
      return;
    }

    // GET /request-status?id=XXX
    if (pathname === '/request-status' && query.id) {
      const request = requests.get(query.id);
      if (!request) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Request not found', requestId: query.id }));
        return;
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        requestId: request.requestId,
        status: request.status,
        requesterEmail: request.requesterEmail,
        resourceName: request.resourceName,
        accessType: request.accessType,
        createdAt: request.createdAt,
        updatedAt: request.updatedAt || null
      }));
      return;
    }

    // GET / (index page with form to create requests)
    if (pathname === '/') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Permission Approval Server</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 0; padding: 40px; background: #f3f4f6; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    h1 { color: #1f2937; margin-bottom: 20px; }
    p { color: #6b7280; }
    code { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-family: monospace; }
    .endpoints { margin-top: 20px; }
    .endpoint { background: #f9fafb; padding: 12px 16px; border-radius: 8px; margin-bottom: 8px; border-left: 3px solid #3b82f6; }
    .endpoint code { color: #3b82f6; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Permission Approval Server</h1>
    <p>This mock server simulates the approval workflow for the self-service portal.</p>
    <div class="endpoints">
      <div class="endpoint"><code>POST /submit</code> - Submit a new permission request</div>
      <div class="endpoint"><code>GET /approve?id=XXX</code> - Approve a request</div>
      <div class="endpoint"><code>GET /deny?id=XXX</code> - Deny a request</div>
      <div class="endpoint"><code>GET /request-status?id=XXX</code> - Check request status</div>
    </div>
  </div>
</body>
</html>`);
      return;
    }

    // POST /submit - Create a new request
    if (pathname === '/submit' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const data = JSON.parse(body);
          const requestId = generateRequestId();
          const request = {
            requestId,
            status: 'pending',
            requesterEmail: data.requesterEmail,
            requesterName: data.requesterName,
            resourceName: data.resourceName,
            accessType: data.accessType,
            createdAt: new Date().toISOString()
          };
          requests.set(requestId, request);

          console.log('========================================');
          console.log('NEW REQUEST:', requestId);
          console.log('From:', request.requesterName, `(${request.requesterEmail})`);
          console.log('Resource:', request.resourceName);
          console.log('Access Type:', request.accessType);
          console.log('========================================');

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ requestId, status: 'pending' }));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
      });
      return;
    }

    // 404
    res.statusCode = 404;
    res.end('<html><body><h1>Not Found</h1></body></html>');

  } catch (err) {
    console.error('Error:', err);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log('========================================');
  console.log('Permission Approval Server running on port', PORT);
  console.log('========================================');
  console.log('Endpoints:');
  console.log('  GET  /               - Server info');
  console.log('  POST /submit         - Submit new request');
  console.log('  GET  /approve?id=XXX - Approve request');
  console.log('  GET  /deny?id=XXX    - Deny request');
  console.log('  GET  /request-status?id=XXX - Check status');
  console.log('========================================');
});
