# Self-Service Portal Prototype

A demonstration of an automated employee onboarding workflow that integrates a React frontend with N8N workflow automation and a Manager API backend.

## Architecture

```
+----------------+     +------------------+     +------------------+
|                |     |                  |     |                  |
|   Frontend     | --> |      N8N          | --> |   Manager API    |
|   (React)      |     |   (Orchestrator)  |     |   (Express)      |
|                |     |                  |     |                  |
+----------------+     +------------------+     +------------------+
        ^                      |
        |                      v
        |               +------------------+
        |               |                  |
        +--- Email ---->|  Approval Server |
                        |   (Express)      |
                        |                  |
                        +------------------+
                                |
                                v
                       +------------------+
                       |                  |
                       | Provisioning API |
                       |   (Mock)         |
                       |                  |
                       +------------------+
```

### Flow Description

1. **Frontend** — Employee submits an onboarding request via a React form
2. **N8N Workflow** — Receives the request, stores approval state, sends email to manager
3. **Manager API** — Validates and processes requests
4. **Approval Server** — Receives manager approval via email link, triggers provisioning
5. **Provisioning API** — Completes the onboarding (creates accounts, sets up resources)

## Quick Start

### Prerequisites

- Node.js 18+ installed
- N8N running locally (or access to an N8N instance)

### Steps

1. **Start the mock API server**
   ```bash
   cd self-service-portal
   npm run mock-api
   ```
   This starts the Manager API on port 3001.

2. **Start the approval server**
   ```bash
   npm run approval-server
   ```
   This starts the Approval Server on port 3002.

3. **Start the React frontend**
   ```bash
   npm run dev
   ```
   This starts the Next.js frontend on port 3000.

4. **Import the N8N workflow**
   - Open N8N at `http://localhost:5678`
   - Import `docs/n8n-workflow.json`
   - Configure the webhook URL in the workflow

5. **Test the flow**
   - Submit a request at `http://localhost:3000`
   - Check the N8N workflow executions
   - Click the approval link in the received email

## Project Structure

```
self-service-portal/
├── README.md                    # This file
├── docs/
│   ├── setup.md                 # Detailed setup instructions
│   ├── demo-guide.md             # Demo script and talking points
│   └── n8n-workflow.json        # N8N workflow export
├── src/
│   ├── app/                     # Next.js App Router pages
│   │   ├── page.tsx             # Main onboarding form
│   │   └── api/                 # API routes
│   ├── components/              # React components
│   └── lib/                     # Utilities and API clients
├── servers/
│   ├── mock-api/                # Manager API server
│   │   └── server.ts
│   └── approval-server/         # Approval server
│       └── server.ts
└── package.json
```

## Key Features

- **Automated workflow** — No manual handoffs between teams
- **Email-based approval** — Managers approve via a simple link
- **Real-time status** — Track request status throughout the process
- **Audit trail** — All approvals logged with timestamps
