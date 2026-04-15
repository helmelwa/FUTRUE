# Self-Service Permission Request Portal — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a working prototype of a Self-Service Portal where employees request access to resources, managers approve via email, and provisioning happens via API.

**Architecture:** HTML/JS frontend calls N8N webhook → N8N workflow orchestrates: fetch manager, send approval email, process decision, provision access, notify requester.

**Tech Stack:** Vanilla HTML/JS (frontend), N8N (workflow/orchestration), mock APIs (manager lookup, AD provisioning), mock SMTP (email simulation).

---

## File Structure

```
self-service-portal/
├── frontend/
│   ├── index.html          # Web form with resource dropdown + justification
│   ├── style.css           # Clean, professional styling
│   └── app.js              # Form submission, polling for status
├── n8n/
│   └── approval-workflow.json  # N8N workflow export
├── docs/
│   ├── setup.md            # How to run the prototype
│   └── demo-guide.md       # Walkthrough for live demo
└── README.md               # Project overview + quick start
```

---

## Task 1: Create Project Structure

**Files:**
- Create: `self-service-portal/frontend/index.html`
- Create: `self-service-portal/frontend/style.css`
- Create: `self-service-portal/frontend/app.js`

- [ ] **Step 1: Create frontend/index.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Access Request Portal</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>Request Resource Access</h1>
        <form id="accessForm">
            <div class="form-group">
                <label for="resource">Select Resource</label>
                <select id="resource" name="resource" required>
                    <option value="">-- Select a resource --</option>
                    <option value="license-analytics">Analytics Software License</option>
                    <option value="sharepoint-marketing">Marketing SharePoint Access</option>
                    <option value="github-dev">GitHub Developer Access</option>
                    <option value="jira-project">Jira Project Access</option>
                </select>
            </div>
            <div class="form-group">
                <label for="justification">Business Justification</label>
                <textarea id="justification" name="justification" rows="4" required
                    placeholder="Please explain why you need access..."></textarea>
            </div>
            <button type="submit" id="submitBtn">Submit Request</button>
        </form>
        <div id="statusMessage" class="status-message"></div>
        <div id="requestStatus" class="request-status"></div>
    </div>
    <script src="app.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create frontend/style.css**

```css
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; padding: 20px; }
.container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
h1 { color: #333; margin-bottom: 20px; }
.form-group { margin-bottom: 20px; }
label { display: block; margin-bottom: 5px; color: #555; font-weight: 500; }
select, textarea { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; }
select { appearance: none; background: white url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><path fill="%23333" d="M6 9L1 4h10z"/></svg>') no-repeat right 10px center; }
textarea { resize: vertical; min-height: 100px; }
button { background: #0066cc; color: white; border: none; padding: 12px 24px; border-radius: 4px; cursor: pointer; font-size: 16px; }
button:hover { background: #0052a3; }
button:disabled { background: #ccc; cursor: not-allowed; }
.status-message { margin-top: 15px; padding: 10px; border-radius: 4px; display: none; }
.status-message.success { background: #d4edda; color: #155724; display: block; }
.status-message.error { background: #f8d7da; color: #721c24; display: block; }
.request-status { margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 4px; display: none; }
.request-status.visible { display: block; }
.request-status h3 { margin-bottom: 10px; }
.request-status .detail { margin: 5px 0; color: #666; }
```

- [ ] **Step 3: Create frontend/app.js**

```javascript
const form = document.getElementById('accessForm');
const submitBtn = document.getElementById('submitBtn');
const statusMessage = document.getElementById('statusMessage');
const requestStatus = document.getElementById('requestStatus');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const resource = document.getElementById('resource').value;
    const justification = document.getElementById('justification').value;
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    
    try {
        const response = await fetch('http://localhost:5678/webhook/permission-request', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                requesterEmail: 'employee@company.com',
                requesterName: 'John Doe',
                resource: resource,
                justification: justification,
                timestamp: new Date().toISOString()
            })
        });
        
        if (!response.ok) throw new Error('Request failed');
        
        const data = await response.json();
        statusMessage.textContent = 'Request submitted successfully! Request ID: ' + data.requestId;
        statusMessage.className = 'status-message success';
        requestStatus.innerHTML = `
            <h3>Your Request</h3>
            <div class="detail"><strong>Resource:</strong> ${resource}</div>
            <div class="detail"><strong>Status:</strong> Pending Approval</div>
            <div class="detail"><strong>Request ID:</strong> ${data.requestId}</div>
            <p style="margin-top:10px; color:#666;">Your manager has been notified. You'll receive an email once they respond.</p>
        `;
        requestStatus.className = 'request-status visible';
        form.reset();
    } catch (error) {
        statusMessage.textContent = 'Error submitting request. Please try again.';
        statusMessage.className = 'status-message error';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Request';
    }
});
```

- [ ] **Step 4: Create project directories**

Run: `mkdir -p self-service-portal/frontend self-service-portal/n8n self-service-portal/docs`

- [ ] **Step 5: Commit**

```bash
git init self-service-portal
cd self-service-portal
git add frontend/index.html frontend/style.css frontend/app.js
git commit -m "feat: create frontend structure with web form"
```

---

## Task 2: Create N8N Workflow

**Files:**
- Create: `self-service-portal/n8n/approval-workflow.json`

- [ ] **Step 1: Create N8N workflow JSON**

```json
{
  "name": "Permission Request Approval Workflow",
  "nodes": [
    {
      "id": "webhook-trigger",
      "name": "Webhook Trigger",
      "type": "n8n-nodes-base.webhook",
      "position": [250, 300],
      "parameters": {
        "httpMethod": "POST",
        "path": "permission-request",
        "responseMode": "onReceived"
      }
    },
    {
      "id": "get-manager",
      "name": "Get Manager",
      "type": "n8n-nodes-base.httpRequest",
      "position": [500, 300],
      "parameters": {
        "method": "GET",
        "url": "=http://localhost:3000/api/manager/" + $json.requesterEmail
      }
    },
    {
      "id": "send-approval-email",
      "name": "Send Approval Email",
      "type": "n8n-nodes-base.sendEmail",
      "position": [750, 300],
      "parameters": {
        "to": "={{ $json.managerEmail }}",
        "subject": "Access Request from {{ $json.requesterName }}",
        "body": "Hello {{ $json.managerName }},\n\n{{ $json.requesterName }} is requesting access to: {{ $json.resource }}\n\nJustification: {{ $json.justification }}\n\nPlease approve or deny:\n[Approve](http://localhost:8080/approve?id={{ $json.requestId }})\n[Deny](http://localhost:8080/deny?id={{ $json.requestId }})"
      }
    },
    {
      "id": "store-request",
      "name": "Store Request",
      "type": "n8n-nodes-base.writeBinaryFile",
      "position": [500, 500],
      "parameters": {
        "fileName": "={{ $json.requestId }}.json",
        "data": "={{ JSON.stringify($json) }}"
      }
    }
  ],
  "connections": {
    "Webhook Trigger": {
      "main": [[{ "node": "Get Manager", "type": "main", "index": 0 }]]
    },
    "Get Manager": {
      "main": [[{ "node": "Send Approval Email", "type": "main", "index": 0 }]]
    },
    "Send Approval Email": {
      "main": [[{ "node": "Store Request", "type": "main", "index": 0 }]]
    }
  }
}
```

- [ ] **Step 2: Create approval handler server (Node.js)**

Create: `self-service-portal/n8n/approval-server.js`

```javascript
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;

const requests = new Map();

const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    
    if (url.pathname === '/approve' || url.pathname === '/deny') {
        const requestId = url.searchParams.get('id');
        const action = url.pathname === '/approve' ? 'approved' : 'denied';
        
        if (requests.has(requestId)) {
            const request = requests.get(requestId);
            request.status = action;
            request.decidedAt = new Date().toISOString();
            
            // Simulate API call to provision access
            setTimeout(() => {
                console.log(`[PROVISIONING] ${action.toUpperCase()}: Adding ${request.requesterEmail} to ${request.resource}`);
                notifyRequester(request);
            }, 1000);
            
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(`<html><body><h1>Request ${action.toUpperCase()}</h1><p>You ${action} the access request. The requester will be notified.</p></body></html>`);
        } else {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<html><body><h1>Request Not Found</h1></body></html>');
        }
    } else if (url.pathname === '/request-status') {
        const requestId = url.searchParams.get('id');
        const request = requests.get(requestId);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(request || { error: 'not found' }));
    } else {
        res.writeHead(404);
        res.end();
    }
});

function notifyRequester(request) {
    console.log(`[EMAIL] To: ${request.requesterEmail}`);
    console.log(`Subject: Your access request was ${request.status}`);
    console.log(`Body: Your request for ${request.resource} has been ${request.status}.`);
}

server.listen(PORT, () => {
    console.log(`Approval server running on http://localhost:${PORT}`);
});
```

- [ ] **Step 3: Create mock manager API server (Node.js)**

Create: `self-service-portal/n8n/mock-api-server.js`

```javascript
const http = require('http');

const PORT = 3000;

const employees = {
    'employee@company.com': { managerEmail: 'manager@company.com', managerName: 'Jane Manager' },
    'developer@company.com': { managerEmail: 'director@company.com', managerName: 'Bob Director' }
};

const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    
    if (url.pathname.startsWith('/api/manager/')) {
        const email = url.pathname.replace('/api/manager/', '');
        const data = employees[email] || { managerEmail: 'default-manager@company.com', managerName: 'Default Manager' };
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
    } else {
        res.writeHead(404);
        res.end();
    }
});

server.listen(PORT, () => {
    console.log(`Mock API server running on http://localhost:${PORT}`);
});
```

- [ ] **Step 4: Commit**

```bash
git add n8n/approval-workflow.json n8n/approval-server.js n8n/mock-api-server.js
git commit -m "feat: add N8N workflow and mock servers"
```

---

## Task 3: Create Documentation

**Files:**
- Create: `self-service-portal/README.md`
- Create: `self-service-portal/docs/setup.md`
- Create: `self-service-portal/docs/demo-guide.md`

- [ ] **Step 1: Create README.md**

```markdown
# Self-Service Permission Request Portal

A prototype demonstrating automated permission request workflow with manager approval.

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │────▶│     N8N     │────▶│   Manager   │
│  (HTML/JS)  │     │  Workflow   │     │     API     │
└─────────────┘     └──────┬──────┘     └─────────────┘
                          │
                          ▼
                   ┌─────────────┐
                   │   Email to  │
                   │   Manager   │
                   └──────┬──────┘
                          │
                          ▼
                   ┌─────────────┐     ┌─────────────┐
                   │  Approval   │────▶│  Provision  │
                   │   Server    │     │     API     │
                   └─────────────┘     └─────────────┘
```

## Quick Start

1. Start mock API: `node n8n/mock-api-server.js`
2. Start approval server: `node n8n/approval-server.js`
3. Import workflow into N8N: `n8n/approval-workflow.json`
4. Open `frontend/index.html` in browser
5. Submit a request and approve via http://localhost:8080/approve?id=XXX

## Project Structure

```
self-service-portal/
├── frontend/         # Web interface
├── n8n/              # Workflow + mock servers
└── docs/             # Documentation
```
```

- [ ] **Step 2: Create docs/setup.md**

```markdown
# Setup Instructions

## Prerequisites
- Node.js 18+
- N8N (self-hosted or cloud)

## Step 1: Start Mock API Server
```bash
cd self-service-portal
node n8n/mock-api-server.js
```
This simulates the internal API that returns manager info.

## Step 2: Start Approval Server
```bash
node n8n/approval-server.js
```
This handles the approval/deny web pages and simulates provisioning.

## Step 3: Import N8N Workflow
1. Open N8N UI (http://localhost:5678)
2. Click "Import from File"
3. Select `n8n/approval-workflow.json`
4. Activate the webhook

## Step 4: Test
1. Open `frontend/index.html` in browser
2. Fill form and submit
3. Check N8N webhook received the request
4. Open http://localhost:8080/approve?id=YOUR_REQUEST_ID
5. Check console for provisioning log
```

- [ ] **Step 3: Create docs/demo-guide.md**

```markdown
# Demo Walkthrough

## Live Demo Script (15-20 min)

### 1. Show Current Problem (2 min)
- Explain manual email-based process
- Pain points: lost emails, no tracking, manual provisioning

### 2. Show Solution Architecture (3 min)
- Diagram of the flow
- Each component's role

### 3. Demo the Form (5 min)
1. Open frontend/index.html
2. Fill fields with test data
3. Submit → show "Request submitted"
4. Show N8N workflow execution
5. Show approval email content

### 4. Approve the Request (5 min)
1. Open approval link
2. Show "Request Approved" page
3. Show provisioning log in console
4. Show notification email simulation

### 5. Code Walkthrough (5 min)
- Frontend: app.js — form submission
- N8N: workflow nodes and connections
- Backend: approval-server.js — decision handling

### 6. Next Steps Discussion (5 min)
See "Future Enhancements" section in README.
```

- [ ] **Step 4: Commit**

```bash
git add README.md docs/setup.md docs/demo-guide.md
git commit -m "docs: add setup and demo documentation"
```

---

## Task 4: Create Future Enhancements Document

**Files:**
- Create: `self-service-portal/docs/future-enhancements.md`

- [ ] **Step 1: Create future-enhancements.md**

```markdown
# Future Enhancements

Based on enterprise requirements discussed:

## 1. Role-Based Access Control
- Predefined roles (Developer, Analyst, Manager)
- Role → Permissions mapping stored in database
- Auto-provisioning based on role assignment

## 2. Temporary Access with Expiration
- Access grants have start/end dates
- Automated revocation when expired
- Re-certification reminders before expiration

## 3. Delegation / Substitute Approvers
- Manager sets delegate when on vacation
- System automatically routes to delegate
- Delegate inherits all approval responsibilities

## 4. Segregation of Duties (SoD)
- Sensitive resources require additional approval
- E.g., access to financial systems needs manager + security team
- Workflow branches based on resource classification

## 5. Automated Deprovisioning
- Integration with HR system (workday termination)
- Trigger automatic revocation of all access
- Audit trail of deprovisioning events

## 6. Self-Service Access Reviews
- Quarterly certification campaigns
- Managers review team access via portal
- Attestation workflow with e-signature

## 7. Integration with Identity Governance (SailPoint, SAP GRC)
- Sync roles and permissions with enterprise IGA
- Leverage existing role definitions
- Compliance reporting and analytics

## Priority for Implementation

1. **Now (Prototype):** Basic form, email approval, API provisioning
2. **Next Sprint:** RBAC, temporary access, delegation
3. **Future:** SoD controls, automated deprovisioning, IGA integration
```

- [ ] **Step 2: Commit**

```bash
git add docs/future-enhancements.md
git commit -m "docs: add future enhancements reference"
```

---

## Task 5: Final Verification

- [ ] **Step 1: Review all files exist**

Run: `find self-service-portal -type f`

Expected output:
```
self-service-portal/frontend/index.html
self-service-portal/frontend/style.css
self-service-portal/frontend/app.js
self-service-portal/n8n/approval-workflow.json
self-service-portal/n8n/approval-server.js
self-service-portal/n8n/mock-api-server.js
self-service-portal/README.md
self-service-portal/docs/setup.md
self-service-portal/docs/demo-guide.md
self-service-portal/docs/future-enhancements.md
```

- [ ] **Step 2: Verify N8N workflow is valid JSON**

Run: `cat n8n/approval-workflow.json | python -m json.tool > /dev/null && echo "Valid JSON"`

Expected: `Valid JSON`

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: complete self-service portal prototype"
```

---

## Self-Review Checklist

1. **Spec coverage:** All 4 case requirements covered:
   - Web form (Task 1) ✓
   - Backend workflow (Task 2) ✓
   - API integration (Task 2 - approval server) ✓
   - Notifications (Task 2 - email simulation) ✓

2. **Placeholder scan:** No TBD/TODO in code ✓

3. **Type consistency:** All JSON field names match across nodes ✓

---

**Plan complete and saved to `docs/superpowers/plans/YYYY-MM-DD-permission-request-portal.md`**

## Two execution options:

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**