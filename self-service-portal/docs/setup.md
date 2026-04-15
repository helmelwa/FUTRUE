# Setup Guide

Detailed instructions for setting up and running the Self-Service Portal prototype.

## Prerequisites

- **Node.js** — Version 18 or higher
- **N8N** — Installed locally or access to n8n cloud instance
- **npm** — Comes with Node.js

## Step 1: Start Mock API Server

The Manager API server handles request validation and processing.

```bash
cd self-service-portal
npm run mock-api
```

**What this does:**
- Starts an Express server on port 3001
- Serves as the backend API for manager operations
- Simulates realistic API responses for development

**Verification:**
- Navigate to `http://localhost:3001/health`
- You should see a JSON response with `{ "status": "ok" }`

## Step 2: Start Approval Server

The Approval Server receives manager approval responses via email links.

```bash
cd self-service-portal
npm run approval-server
```

**What this does:**
- Starts an Express server on port 3002
- Listens for approval callbacks from email links
- Triggers provisioning workflow when approved
- Stores approval state for tracking

**Verification:**
- Navigate to `http://localhost:3002/health`
- You should see a JSON response with `{ "status": "ok" }`

## Step 3: Import N8N Workflow

### Option A: Local N8N

1. Open N8N at `http://localhost:5678`
2. Click **Workflows** in the left sidebar
3. Click **Import** (three dots menu → Import)
4. Select `docs/n8n-workflow.json`
5. Click **Save**

### Option B: N8N Cloud

1. Log in to your n8n cloud instance
2. Go to **Workflows** → **Import**
3. Upload `docs/n8n-workflow.json`

### Configure Webhook URL

1. Open the imported workflow
2. Find the **Webhook** node
3. Set the URL to: `http://localhost:3000/api/webhook`
4. Save and activate the workflow

## Step 4: Test the Flow

### Start the Frontend

```bash
npm run dev
```

The frontend runs on `http://localhost:3000`.

### Run a Test Request

1. Open `http://localhost:3000` in your browser
2. Fill out the onboarding form:
   - **Full Name**: Test User
   - **Email**: test@example.com
   - **Department**: Engineering
   - **Position**: Software Engineer
3. Click **Submit**
4. You should see a confirmation message with a request ID

### Verify the Workflow

1. Check N8N for a new workflow execution
2. Look for email sent to manager (check N8N email node output)
3. Click the approval link in the email (or test URL directly)
4. Verify the request status updates to "approved"

### Troubleshooting

| Issue | Solution |
|-------|----------|
| N8N webhook not received | Check firewall/network, ensure localhost is accessible |
| Email not sent | Verify email node credentials in N8N |
| Approval link broken | Check that approval server is running on port 3002 |
| Frontend errors | Run `npm run dev` again, check console for errors |

## Environment Variables

Create a `.env.local` file in the root:

```env
# Manager API
MANAGER_API_URL=http://localhost:3001

# Approval Server
APPROVAL_SERVER_URL=http://localhost:3002

# N8N Webhook
N8N_WEBHOOK_URL=http://localhost:5678/webhook
```

## Ports Reference

| Service | Port | URL |
|---------|------|-----|
| Frontend (Next.js) | 3000 | http://localhost:3000 |
| Manager API | 3001 | http://localhost:3001 |
| Approval Server | 3002 | http://localhost:3002 |
| N8N (local) | 5678 | http://localhost:5678 |
