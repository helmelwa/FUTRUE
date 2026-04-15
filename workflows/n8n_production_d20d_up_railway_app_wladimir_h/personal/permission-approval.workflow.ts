import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : Permission Approval Workflow
// Nodes   : 6  |  Connections: 5
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// WebhookTrigger                     webhook
// GetManager                         httpRequest
// SubmitToApprovalServer             httpRequest
// SendApprovalEmailToManager         emailSend
// ConfirmRequestReceived             emailSend
// StoreRequestData                   writeBinaryFile
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// WebhookTrigger
//    → GetManager
//      → SubmitToApprovalServer
//        → SendApprovalEmailToManager
//        → ConfirmRequestReceived
//          → StoreRequestData
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'I1ZPqmvglRbt4TF8',
    name: 'Permission Approval Workflow',
    active: false,
    settings: { executionOrder: 'v1', callerPolicy: 'workflowsFromSameOwner', availableInMCP: false },
})
export class PermissionApprovalWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: '6f91c8d3-8728-48b1-9595-577aeba02e28',
        webhookId: 'b008c741-92f5-44a4-bc47-0697cb53c093',
        name: 'Webhook Trigger',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [250, 300],
    })
    WebhookTrigger = {
        multipleMethods: false,
        httpMethod: 'POST',
        path: 'permission-request',
        authentication: 'none',
        responseMode: 'onReceived',
        responseCode: 200,
        responseData: 'firstEntryJson',
        responseBinaryPropertyName: 'data',
        options: [],
    };

    @node({
        id: 'ccce426a-76e3-4ed7-848d-610c9a4fd45c',
        name: 'Get Manager',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [450, 300],
    })
    GetManager = {
        url: '=http://localhost:3000/api/manager/{{ $json.body.requesterEmail }}',
        method: 'GET',
        authentication: 'none',
        nodeCredentialType: '',
        genericAuthType: '',
        provideSslCertificates: false,
        options: [],
    };

    @node({
        id: 'submit-to-approval-server',
        name: 'Submit to Approval Server',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [650, 300],
    })
    SubmitToApprovalServer = {
        url: '=http://localhost:8080/submit',
        method: 'POST',
        authentication: 'none',
        contentType: 'raw',
        rawContentType: 'application/json',
        body: '={"requestId": "{{ $json.body.requestId }}", "requesterEmail": "{{ $json.body.requesterEmail }}", "requesterName": "{{ $json.body.requesterName }}", "resourceName": "{{ $json.body.resource }}", "accessType": "standard", "justification": "{{ $json.body.justification }}"}',
        options: [],
    };

    @node({
        id: '6ea54f70-b186-4e03-b6b3-4b61f7986e45',
        webhookId: '2fa119b7-b4ff-471e-a0ad-ec83c3317ac1',
        name: 'Send Approval Email to Manager',
        type: 'n8n-nodes-base.emailSend',
        version: 2.1,
        position: [850, 200],
    })
    SendApprovalEmailToManager = {
        resource: 'email',
        operation: 'send',
        fromEmail: 'noreply@company.com',
        toEmail: '={{ $json.managerEmail }}',
        subject: 'Permission Approval Request',
        emailFormat: 'text',
        message: `Hi {{ $json.managerName }},

{{ $json.body.requesterName }} ({{ $json.body.requesterEmail }}) is requesting access to: {{ $json.body.resourceName }}

Justification: {{ $json.body.justification }}

Request ID: {{ $json.body.requestId }}

Please approve or deny:
Approve: http://localhost:8080/approve?id={{ $json.body.requestId }}
Deny: http://localhost:8080/deny?id={{ $json.body.requestId }}`,
        options: [],
    };

    @node({
        id: 'confirm-request-received',
        webhookId: 'd90d5139-235e-4283-8f5a-52524508b2fc',
        name: 'Confirm Request Received',
        type: 'n8n-nodes-base.emailSend',
        version: 2.1,
        position: [850, 400],
    })
    ConfirmRequestReceived = {
        resource: 'email',
        operation: 'send',
        fromEmail: 'noreply@company.com',
        toEmail: '={{ $json.body.requesterEmail }}',
        subject: 'Your access request has been submitted',
        emailFormat: 'text',
        message: `Hi {{ $json.body.requesterName }},

Your access request has been successfully submitted.

Requested Resource: {{ $json.body.resourceName }}
Request ID: {{ $json.body.requestId }}

Your manager has been notified and will review your request shortly.
You will receive another email once a decision has been made.

Please await further notification.`,
        options: [],
    };

    @node({
        id: '61974c3b-5683-4e28-8d72-25eff3256677',
        name: 'Store Request Data',
        type: 'n8n-nodes-base.writeBinaryFile',
        version: 1,
        position: [1050, 300],
    })
    StoreRequestData = {
        fileName: '=/tmp/permission-request-{{ $json.body.requestId }}.json',
        dataPropertyName: 'data',
        options: {},
    };

    // =====================================================================
    // ROUTAGE ET CONNEXIONS
    // =====================================================================

    @links()
    defineRouting() {
        this.WebhookTrigger.out(0).to(this.GetManager.in(0));
        this.GetManager.out(0).to(this.SubmitToApprovalServer.in(0));
        this.SubmitToApprovalServer.out(0).to(this.SendApprovalEmailToManager.in(0));
        this.SubmitToApprovalServer.out(0).to(this.ConfirmRequestReceived.in(0));
        this.ConfirmRequestReceived.out(0).to(this.StoreRequestData.in(0));
    }
}
