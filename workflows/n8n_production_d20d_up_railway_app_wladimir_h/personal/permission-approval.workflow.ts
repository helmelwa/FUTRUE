import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : Permission Approval Workflow
// Nodes   : 8  |  Connections: 6
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// SubmitWebhook                      webhook
// LookupManager                      dataTable
// InsertRequest                      dataTable
// SendSmtpToManager                  emailSend                  [creds]
// ConfirmSmtpToRequester             emailSend                  [creds]
// ApprovalWebhook                    webhook
// UpdateStatusApproved               dataTable
// NotifyRequesterApproved            emailSend                  [creds]
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// SubmitWebhook
//    → LookupManager
//      → InsertRequest
//        → SendSmtpToManager
//        → ConfirmSmtpToRequester
// ApprovalWebhook
//    → UpdateStatusApproved
//      → NotifyRequesterApproved
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'I1ZPqmvglRbt4TF8',
    name: 'Permission Approval Workflow',
    active: true,
    settings: {
        executionOrder: 'v1',
        callerPolicy: 'workflowsFromSameOwner',
        availableInMCP: false,
        binaryMode: 'separate',
    },
})
export class PermissionApprovalWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'webhook-trigger-submit',
        webhookId: 'b008c741-92f5-44a4-bc47-0697cb53c093',
        name: 'Submit Webhook',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [250, 300],
    })
    SubmitWebhook = {
        multipleMethods: false,
        httpMethod: 'POST',
        path: 'submit-request',
        authentication: 'none',
        responseMode: 'onReceived',
        responseCode: 200,
        responseData: 'firstEntryJson',
        responseBinaryPropertyName: 'data',
        options: [],
    };

    @node({
        id: 'lookup-manager',
        name: 'Lookup Manager',
        type: 'n8n-nodes-base.dataTable',
        version: 1.1,
        position: [450, 300],
    })
    LookupManager = {
        resource: 'row',
        operation: 'get',
        dataTableId: {
            mode: 'list',
            value: 'managers',
        },
        filters: {
            conditions: [
                {
                    keyName: 'employeeEmail',
                    condition: 'equals',
                    keyValue: '={{ $json.body.requesterEmail }}',
                },
            ],
        },
        returnAll: false,
        limit: 1,
        options: [],
    };

    @node({
        id: 'insert-request',
        name: 'Insert Request',
        type: 'n8n-nodes-base.dataTable',
        version: 1.1,
        position: [650, 300],
    })
    InsertRequest = {
        resource: 'row',
        operation: 'insert',
        dataTableId: {
            mode: 'list',
            value: 'requests',
        },
        columns: {
            mappingMode: 'defineBelow',
            value: [
                {
                    columnName: 'requestId',
                    columnValue: '={{ $json.body.requestId }}',
                },
                {
                    columnName: 'requesterEmail',
                    columnValue: '={{ $json.body.requesterEmail }}',
                },
                {
                    columnName: 'requesterName',
                    columnValue: '={{ $json.body.requesterName }}',
                },
                {
                    columnName: 'resourceName',
                    columnValue: '={{ $json.body.resource }}',
                },
                {
                    columnName: 'justification',
                    columnValue: '={{ $json.body.justification }}',
                },
                {
                    columnName: 'status',
                    columnValue: 'pending',
                },
                {
                    columnName: 'createdAt',
                    columnValue: '={{ $now }}',
                },
            ],
        },
        tableName: 'requests',
        options: [],
    };

    @node({
        id: 'send-smtp-to-manager',
        webhookId: 'd958faa8-84de-4cd1-9b67-7ab0d6b50792',
        name: 'Send SMTP to Manager',
        type: 'n8n-nodes-base.emailSend',
        version: 2.1,
        position: [850, 200],
        credentials: { smtp: { id: 'WrMRluFnw1HVYzeg', name: 'helmelwa@gmail.com' } },
    })
    SendSmtpToManager = {
        resource: 'email',
        operation: 'send',
        fromEmail: 'helmelwa@gmail.com',
        toEmail: '={{ $json.body.requesterEmail }}',
        subject: 'Permission Approval Request',
        emailFormat: 'text',
        message: `Hi,

{{ $json.body.requesterName }} is requesting access to: {{ $json.body.resource }}

Justification: {{ $json.body.justification }}

Request ID: {{ $json.body.requestId }}

Please approve or deny:
Approve: https://n8n-production-d20d.up.railway.app/webhook/approve-request?id={{ $json.body.requestId }}
Deny: https://n8n-production-d20d.up.railway.app/webhook/deny-request?id={{ $json.body.requestId }}`,
        options: [],
    };

    @node({
        id: 'confirm-smtp-to-requester',
        webhookId: '22df7d15-804e-4e16-a931-c25fc66220d0',
        name: 'Confirm SMTP to Requester',
        type: 'n8n-nodes-base.emailSend',
        version: 2.1,
        position: [850, 400],
        credentials: { smtp: { id: 'WrMRluFnw1HVYzeg', name: 'helmelwa@gmail.com' } },
    })
    ConfirmSmtpToRequester = {
        resource: 'email',
        operation: 'send',
        fromEmail: 'helmelwa@gmail.com',
        toEmail: '={{ $json.body.requesterEmail }}',
        subject: 'Your access request has been submitted',
        emailFormat: 'text',
        message: `Hi {{ $json.body.requesterName }},

Your access request has been successfully submitted.

Requested Resource: {{ $json.body.resource }}
Request ID: {{ $json.body.requestId }}

Your manager has been notified and will review your request shortly.
You will receive another email once a decision has been made.

Please await further notification.`,
        options: [],
    };

    @node({
        id: 'approval-webhook',
        webhookId: 'approval-webhook-123',
        name: 'Approval Webhook',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [250, 600],
    })
    ApprovalWebhook = {
        multipleMethods: true,
        httpMethod: 'GET',
        path: 'approve-request',
        authentication: 'none',
        responseMode: 'responseNode',
        responseCode: 200,
        responseData: 'firstEntryJson',
        responseBinaryPropertyName: 'data',
        options: [],
    };

    @node({
        id: 'update-status-approved',
        name: 'Update Status Approved',
        type: 'n8n-nodes-base.dataTable',
        version: 1.1,
        position: [450, 600],
    })
    UpdateStatusApproved = {
        resource: 'row',
        operation: 'update',
        dataTableId: {
            mode: 'list',
            value: 'requests',
        },
        filters: {
            conditions: [
                {
                    keyName: 'requestId',
                    condition: 'equals',
                    keyValue: '={{ $json.query.id }}',
                },
            ],
        },
        columns: {
            mappingMode: 'defineBelow',
            value: [
                {
                    columnName: 'status',
                    columnValue: 'approved',
                },
                {
                    columnName: 'updatedAt',
                    columnValue: '={{ $now }}',
                },
            ],
        },
        options: [],
    };

    @node({
        id: 'notify-requester-approved',
        webhookId: '0fafca89-fc6a-4cd3-8bab-88a3b70fa96a',
        name: 'Notify Requester Approved',
        type: 'n8n-nodes-base.emailSend',
        version: 2.1,
        position: [650, 600],
        credentials: { smtp: { id: 'WrMRluFnw1HVYzeg', name: 'helmelwa@gmail.com' } },
    })
    NotifyRequesterApproved = {
        resource: 'email',
        operation: 'send',
        fromEmail: 'helmelwa@gmail.com',
        toEmail: '={{ $json.requesterEmail }}',
        subject: 'Your access request was approved',
        emailFormat: 'text',
        message: `Hi {{ $json.requesterName }},

Great news! Your access request has been APPROVED.

Resource: {{ $json.resourceName }}
Request ID: {{ $json.requestId }}

Access is being provisioned. You should have access shortly.

Thank you for your patience.`,
        options: [],
    };

    // =====================================================================
    // ROUTAGE ET CONNEXIONS
    // =====================================================================

    @links()
    defineRouting() {
        this.SubmitWebhook.out(0).to(this.LookupManager.in(0));
        this.LookupManager.out(0).to(this.InsertRequest.in(0));
        this.InsertRequest.out(0).to(this.SendSmtpToManager.in(0));
        this.InsertRequest.out(0).to(this.ConfirmSmtpToRequester.in(0));
        this.ApprovalWebhook.out(0).to(this.UpdateStatusApproved.in(0));
        this.UpdateStatusApproved.out(0).to(this.NotifyRequesterApproved.in(0));
    }
}
