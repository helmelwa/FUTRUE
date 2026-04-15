# Demo Guide

A complete demonstration script for a 15-20 minute case study presentation.

---

## Section 1: Show Current Problem (2 minutes)

### Talking Points

**The Pain Point:**
- "Every new hire waits days for accounts to be provisioned"
- "IT teams juggle tickets: email, Slack, JIRA — all manual"
- "New employees sit idle on day one, unable to access systems"

**Show the Chaos:**
- Display a screenshot or description of the current email/Slack ticket flow
- Mention the average time: 3-5 business days for full provisioning
- Highlight failure points: lost emails, forgotten tickets, wrong permissions

### Key Message
> "Onboarding is broken. It's slow, error-prone, and frustrates everyone involved."

---

## Section 2: Show Solution Architecture (3 minutes)

### Talking Points

**The Vision:**
- "What if a new hire submitted one form and everything just... worked?"
- "No tickets. No follow-ups. Just click the link in your email to approve."

**Walk Through the Diagram:**
```
Frontend → N8N → Manager API
Email to Manager → Approval Server → Provisioning API
```

1. **Frontend (React)** — Clean form, employee submits once
2. **N8N (Orchestrator)** — Receives request, manages state, sends email
3. **Manager API** — Validates requests, stores data
4. **Approval Server** — Simple approval link, no login required
5. **Provisioning API** — Creates accounts automatically

### Demo Setup Check
- Confirm localhost:3000 is running
- Confirm N8N workflow is active
- Confirm approval server is running on port 3002

### Key Message
> "Five services, one seamless flow. The employee never has to chase anyone."

---

## Section 3: Demo the Form (5 minutes)

### Preparation
- Ensure the form is empty and ready at `http://localhost:3000`

### Demo Steps

1. **Show the Form (30 seconds)**
   - Point out the clean UI, simple fields
   - "Just five fields — name, email, department, position, start date"

2. **Fill and Submit (1 minute)**
   - Fill in realistic test data (use a real email you can check)
   - Show field validation as you type
   - Click Submit

3. **Show Confirmation (30 seconds)**
   - Display the confirmation message
   - Note the request ID for tracking

4. **Show N8N Received the Request (1 minute)**
   - Switch to N8N dashboard
   - Show the workflow execution log
   - Point out the email node queued

5. **Show Manager Email (2 minutes)**
   - Open email inbox
   - Show the approval email received
   - Highlight: simple "Approve" button, no login required

### Key Message
> "From form submit to manager email in under 30 seconds. That's the speed difference."

---

## Section 4: Approve the Request (5 minutes)

### Demo Steps

1. **Show the Approval Email (1 minute)**
   - Open the email
   - Highlight the approval link URL
   - Explain: "The link contains a token — secure, one-time use"

2. **Click the Approval Link (1 minute)**
   - Open link in browser
   - Show the approval confirmation page
   - Note the request status update

3. **Show the Approval Server Log (2 minutes)**
   - Show server console output (or request log)
   - Demonstrate the approval was recorded with timestamp
   - Show the provisioning trigger was fired

4. **Show Provisioning Complete (1 minute)**
   - Show backend response confirming accounts created
   - Highlight the audit log entry

### Key Message
> "One click. Full provisioning. No IT ticket required."

---

## Section 5: Code Walkthrough (5 minutes)

### Talking Points

**Frontend (1 minute)**
- Show `src/app/page.tsx` — the form component
- Point out: server actions, validation, error handling

**N8N Workflow (1 minute)**
- Open the workflow in N8N
- Show the nodes: Webhook → Store → Email → Respond
- Explain the flow logic

**Manager API (1 minute)**
- Show `servers/mock-api/server.ts`
- Point out: Express routes, validation, JSON responses

**Approval Server (1 minute)**
- Show `servers/approval-server/server.ts`
- Point out: GET /approve/:token, state management, audit logging

**Provisioning API (1 minute)**
- Show the mock provisioning response
- Mention: in production, this would call AD/Google Workspace APIs

### Key Message
> "Under 500 lines of code total. This is a prototype, but it proves the concept."

---

## Section 6: Next Steps Discussion (5 minutes)

### Talking Points

**What's Working:**
- Email-based approval eliminates login barriers
- N8N provides visual workflow editing for non-developers
- Async architecture handles delays gracefully

**What Needs Work:**
- Email delivery (use SendGrid, Resend, or SES in production)
- Token security (implement JWT with expiration)
- Error handling (add retries, dead letter queues)
- Audit compliance (log all PII access)

**Production Considerations:**
- Replace mock APIs with real directory services (Azure AD, Google Workspace)
- Add rate limiting and spam protection
- Implement proper authentication (currently approving via magic link)
- Add monitoring and alerting (Sentry, PagerDuty)

**Discussion Questions:**
- "What other manual processes could benefit from this pattern?"
- "How would you handle rejection? What's the offboarding flow?"
- "What compliance requirements apply to your industry?"

---

## Quick Reference: Demo Commands

```bash
# Terminal 1: Manager API
cd self-service-portal && npm run mock-api

# Terminal 2: Approval Server
cd self-service-portal && npm run approval-server

# Terminal 3: Frontend
cd self-service-portal && npm run dev
```

## Backup Plan

If the live demo fails:
1. Show pre-recorded screenshots of each step
2. Use the `docs/demo-screenshots/` folder if available
3. Fall back to architecture diagram explanation

---

## Tips for Success

- **Practice the demo** at least twice before presentation day
- **Use realistic data** — fake names like "Test User" break immersion
- **Test the email link** before the demo — ensure it resolves correctly
- **Have a backup** — screenshots or recording if live demo fails
- **Stay on time** — 2-3 minutes per section maximum, keep moving
