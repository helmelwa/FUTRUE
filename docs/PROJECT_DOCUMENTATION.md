# FUTRUE Project — Complete Documentation for Claude Code Analysis

## 📁 Project Structure

```
C:\Users\HELM\Projects\FUTRUE\
├── workflows/                                    # n8n workflows (n8n-as-code)
│   └── n8n_production_d20d_up_railway_app_wladimir_h/
│       └── personal/
│           ├── Permission Approval Workflow.workflow.ts          # MAIN workflow
│           ├── 1.2 Fehlerbehandlung _ Global Exception Handler.workflow.ts  # Error handling
│           └── GET _api_manager__requesterEmail.workflow.ts       # Manager lookup API
├── docs/                                        # Documentation
│   ├── index.html                              # Frontend (GitHub Pages)
│   ├── style.css
│   ├── test-cases.md                           # Test cases
│   ├── test-data.csv                           # Test data
│   ├── approve-deny-data.csv
│   └── presentation.md                         # Presentation outline
├── self-service-portal/
│   └── frontend/
│       ├── index.html                          # Frontend copy
│       ├── app.js
│       └── style.css
├── n8nac-config.json                          # n8n-as-code configuration
└── AGENTS.md                                  # AI Agents guidelines
```

---

## 🌍 Infrastructure

| Component | URL/Location |
|-----------|--------------|
| **n8n Instance** | https://n8n-production-d20d.up.railway.app |
| **Frontend (GitHub Pages)** | https://helmelwa.github.io/FUTRUE/ |
| **Sync Folder** | workflows/ |
| **Project** | Personal |

---

## 🔑 Credentials (for reference)

| Credential Name | Type | Used In |
|----------------|------|---------|
| Gmail account | gmailOAuth2 | All email nodes |
| n8n Bearer Auth account | httpBearerAuth | Fehlerbehandlung workflow |
| n8n API | n8nApi | Fehlerbehandlung workflow |
| Manager Lookup - Header Auth - Test | httpHeaderAuth | GET /api/manager webhook |
| GitHub API (hardcoded token) | httpHeaderAuth | GithubAddToTeam node |

---

## 📊 Data Tables

| Table Name | ID | Purpose |
|------------|-----|---------|
| **requests** | ywzGM56DwJJCSq1T | Permission requests with status |
| **managers** | bcgytuA7wOiRSFiq | Email → manager mapping |

### requests table schema
```
- requestId (string)
- requesterEmail (string)
- requesterName (string)
- resourceName (string)
- justification (string)
- status/approvalStatus (string) — pending, approved, denied
- provisioningStatus (string) — pending, failed
```

### managers table schema
```
- employeeEmail (string) — lookup key
- managerEmail (string) — result
```

---

## 🔷 Workflow 1: Permission Approval Workflow

**ID:** `I1ZPqmvglRbt4TF8`
**Active:** Yes
**Nodes:** 31 | **Connections:** 19

### Trigger Endpoints

| Webhook | Path | Method |
|---------|------|--------|
| SubmitWebhook | `submit-request` | POST |
| ApprovalWebhook | `approve-request` | GET (query: `?id=`) |
| DenyWebhook | `deny-request` | GET (query: `?id=`) |

### Data Flow

```
SUBMIT FLOW:
SubmitWebhook → LookupRequest → CreateRecord (IF)
  → out(0): LookupManager → InsertRequest → SendAMessage + EmailManager + ConfirmToRequester
  → out(1): AlreadyExists (no-op, duplicate)

APPROVE FLOW:
ApprovalWebhook → If_ → UpdateStatusApproved → ApproveEmail → GithubAddToTeam → NotifyApproved → RespondApprove

DENY FLOW:
DenyWebhook → If1 → UpdateStatusDenied → DenyEmail → NotifyDenied → RespondDeny
```

### Key Nodes

| Node | Type | Purpose |
|------|------|---------|
| SubmitWebhook | webhook | Receives POST /webhook/submit-request |
| LookupRequest | dataTable (alwaysOutput) | Find existing request by ID + status=pending |
| CreateRecord | if | Check if request exists |
| LookupManager | dataTable | Find manager email from managers table |
| InsertRequest | dataTable | Create new request record |
| EmailManager | gmail | Send HTML email with approve/deny links |
| ConfirmToRequester | gmail | Send confirmation to requester |
| ApprovalWebhook | webhook | Receives GET /webhook/approve-request?id= |
| UpdateStatusApproved | dataTable (alwaysOutput) | Update status=approved |
| GithubAddToTeam | httpRequest | PUT to GitHub Teams API |
| NotifyApproved | gmail | Notify requester of approval |
| DenyWebhook | webhook | Receives GET /webhook/deny-request?id= |
| UpdateStatusDenied | dataTable (alwaysOutput) | Update status=denied |
| NotifyDenied | gmail | Notify requester of denial |

### GitHub API Configuration

```typescript
// GithubAddToTeam node
method: 'PUT'
url: 'https://api.github.com/orgs/Allpply/teams/permission-requests/memberships/{{ $json.requesterEmail.split("@")[0] }}'
authentication: 'genericCredentialType'
genericAuthType: 'httpHeaderAuth'
headers: {
  Authorization: 'Bearer <GITHUB_TOKEN>',  // Use n8n credentials in production
  X-GitHub-Api-Version: '2022-11-28'
}
```

### Email Templates

**EmailManager (to manager):** HTML email with approve/deny buttons pointing to:
- `https://n8n-production-d20d.up.railway.app/webhook/approve-request?id={requestId}`
- `https://n8n-production-d20d.up.railway.app/webhook/deny-request?id={requestId}`

**NotifyApproved (to requester):**
```
Subject: Your access request was approved
Body: Great news! Your access request has been APPROVED.
      Resource: {resourceName}
      Access is being provisioned.
```

**NotifyDenied (to requester):**
```
Subject: Your access request was denied
Body: Unfortunately, your access request has been DENIED.
      Please contact your manager if you believe this was in error.
```

---

## 🔷 Workflow 2: Fehlerbehandlung / Global Exception Handler

**ID:** `BzPEgYmv3SgFQKjs`
**Active:** Yes
**Nodes:** 5 | **Connections:** 4

### Trigger: Error Trigger (errorTrigger)
 Fires on any workflow error in the n8n instance

### Data Flow
```
FehlerAnfangen (error trigger)
  → GetWorkflowDaten (GET /api/v1/executions/{id}?includeData=true)
    → SchribeAnfrageId (set node — extracts requestId from execution data)
      → UpdateStatusFailed (dataTable: provisioningStatus=failed)
      → NotifyCoe (gmail: send error to CoE)
```

### Key Nodes

| Node | Type | Purpose |
|------|------|---------|
| FehlerAnfangen | errorTrigger | Catches all workflow errors |
| GetWorkflowDaten | httpRequest | Fetch execution details via n8n API |
| SchribeAnfrageId | set | Extract requestId from execution runData |
| UpdateStatusFailed | dataTable (retry) | Set provisioningStatus=failed |
| NotifyCoe | gmail | Alert CoE about the error |

### NotifyCoe Email
```
To: am_us_733289_1771700024721@agentmail.to
Subject: {requestId} - Error
Body: Error tags, workflow name, execution ID, URL, node, error message
```

---

## 🔷 Workflow 3: GET /api/manager/:requesterEmail

**ID:** `6dTN9NnSffcSmY0u`
**Active:** Yes
**Nodes:** 3 | **Connections:** 2

### Trigger: Webhook with header authentication

**Path:** `api/manager/:requesterEmail`
**Authentication:** Header Auth (credential: `Manager Lookup - Header Auth - Test`)

### Data Flow
```
Webhook → LookupManager → RespondToWebhook
```

### Key Nodes

| Node | Type | Purpose |
|------|------|---------|
| Webhook | webhook | Receives GET /api/manager/{email} with header auth |
| LookupManager | dataTable (alwaysOutput, retry) | Find manager by employeeEmail |
| RespondToWebhook | respondToWebhook | Return managerEmail in header |

### Response
```
Response Header: managerEmail={lookup result}
```

---

## 🌐 Frontend: Self-Service Portal

**Location:** `docs/index.html` (deployed to GitHub Pages)

### Form Fields
- `requesterName` (text, required)
- `requesterEmail` (email, required)
- `resource` (select dropdown, required)
- `justification` (textarea, required)
- Submit button

### Submission Flow
```javascript
// Generates requestId client-side
const requestId = 'REQ-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();

// POST to n8n webhook
fetch('https://n8n-production-d20d.up.railway.app/webhook/submit-request', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ requestId, requesterEmail, requesterName, resource, justification, timestamp })
});
```

### Resource Options
- GitHub Organization Access

---

## 📋 Test Data Structure (test-data.csv)

```csv
action,requestId,requesterName,requesterEmail,resource,justification,testCase
submit-request,TEST-TC01-001,Wladimir Helm,gelmelv@gmail.com,GitHub Organization Access,TC-01 Happy path submit,TC-01-HAPPY
approve-request,TEST-TC01-001,N/A,N/A,N/A,N/A,TC-01-APPROVE
...
```

### Test Cases

| TC | Description | Key Test |
|----|-------------|----------|
| TC-01 | Happy Path Approve | Submit → approve → GitHub API called |
| TC-02 | Happy Path Deny | Submit → deny → no GitHub API call |
| TC-03 | Idempotency - Double Approve | First approve works, second is no-op |
| TC-04 | Idempotency - Double Deny | First deny works, second is no-op |
| TC-05 | GitHub 404 Error | User not in org → "Approved, but GitHub setup failed" email |
| TC-06 | Non-existent Request ID | Graceful handling of unknown request ID |
| TC-07 | Manager Not Found | Fallback when manager email not in managers.csv |

---

## 🔗 Manager Lookup Chain (managers.csv)

```
gelmelv@gmail.com → am_us_733289_1771701590387@agentmail.to (self or manager chain)
am_us_733289_1771706269570@agentmail.to → am_us_733289_1771701590387@agentmail.to
am_us_733289_1771701590387@agentmail.to → am_us_733289_1771700024721@agentmail.to (self)
am_us_733289_1771700024721@agentmail.to → am_us_733289_1771706269570@agentmail.to
```

---

## ⚠️ Known Issues / Technical Debt

1. **Hardcoded GitHub Token** — `<GITHUB_TOKEN>` was hardcoded in GithubAddToTeam node. Should use n8n credentials.

2. **Empty IF Conditions** — `If_` and `If1` nodes have empty conditions (equals "" === ""), effectively always pass through out(0).

3. **No Graceful Error Response** — TC-06 (non-existent request) returns generic response instead of clear JSON error.

4. **No Manager Fallback** — TC-07 (manager not found) relies on empty email send attempt, no explicit fallback.

5. **Request ID Generated Client-Side** — `requestId` is generated in browser. Could collide or be spoofed.

6. **No Audit Table** — "zentrale Dokumentation" requirement not explicitly implemented (only Data Table status updates).

7. **No Monitoring/Alerting** — Only Fehlerbehandlung workflow sends errors to CoE. No SLIs/SLOs.

---

## 🎯 IT Case 2 (it-case 2.md) Requirements Coverage

| Requirement | Status | Implementation |
|-------------|--------|-----------------|
| FR-1: Dropdown ресурса | ✅ | `index.html` select element |
| FR-2: Text field (обоснование) | ✅ | `index.html` textarea |
| FR-3: Submit button | ✅ | `index.html` button[type=submit] |
| BE-1: Backend принимает request | ✅ | SubmitWebhook → Data Table |
| BE-2: Manager lookup | ✅ | LookupManager → managers table |
| BE-3: Email к manager с links | ✅ | EmailManager node (HTML email) |
| AP-1: Approve → API call | ✅ | GithubAddToTeam → GitHub Teams API |
| NT-1: Notify requester | ✅ | NotifyApproved / NotifyDenied |
| Live Demo | ✅ | TC-01 test case |
| Code Walkthrough | ✅ | Presentation.md sections |
| Tech choices | ✅ | n8n, GitHub Pages, Gmail |
| Credentials handling | ⚠️ | Token hardcoded — needs improvement |
| Nächste Schritte | ✅ | 3 improvements in presentation.md |

---

## 📝 Key File Paths (for Claude Code reference)

```
C:\Users\HELM\Projects\FUTRUE\
  workflows/n8n_production_d20d_up_railway_app_wladimir_h/personal/Permission Approval Workflow.workflow.ts
  workflows/n8n_production_d20d_up_railway_app_wladimir_h/personal/1.2 Fehlerbehandlung _ Global Exception Handler.workflow.ts
  workflows/n8n_production_d20d_up_railway_app_wladimir_h/personal/GET _api_manager__requesterEmail.workflow.ts
  docs/index.html
  docs/test-cases.md
  docs/test-data.csv
  docs/presentation.md
  self-service-portal/frontend/index.html
  n8nac-config.json
  AGENTS.md
```
