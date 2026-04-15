import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : Permission Approval Workflow
// Nodes   : 4  |  Connections: 3
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// WebhookTrigger                  webhook
// GetManager                      httpRequest
// SendApprovalEmail               emailSend
// StoreRequestData                writeBinaryFile
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// WebhookTrigger
//   → GetManager
//     → SendApprovalEmail
//       → StoreRequestData
// </workflow-map>

@workflow({
  name: 'Permission Approval Workflow',
  active: false
})
export class PermissionApprovalWorkflow {
  @node({
    name: 'Webhook Trigger',
    type: 'n8n-nodes-base.webhook',
    version: 2.1,
    position: [250, 300]
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
    options: []
  };

  @node({
    name: 'Get Manager',
    type: 'n8n-nodes-base.httpRequest',
    version: 4.4,
    position: [450, 300]
  })
  GetManager = {
    url: '=http://localhost:3000/api/manager/{{ $json.body.requesterEmail }}',
    method: 'GET',
    authentication: 'none',
    nodeCredentialType: '',
    genericAuthType: '',
    provideSslCertificates: false,
    options: []
  };

  @node({
    name: 'Send Approval Email',
    type: 'n8n-nodes-base.emailSend',
    version: 2.1,
    position: [650, 300]
  })
  SendApprovalEmail = {
    resource: 'email',
    operation: 'send',
    fromEmail: 'noreply@company.com',
    toEmail: '={{ $json.managerEmail }}',
    subject: 'Permission Approval Request',
    emailFormat: 'text',
    message: '=Hi {{ $json.managerName }},\n\n{{ $json.body.requesterName }} is requesting access to {{ $json.body.resourceName }}.\n\nRequest ID: {{ $json.body.requestId }}\n\nPlease approve or deny this request.',
    options: []
  };

  @node({
    name: 'Store Request Data',
    type: 'n8n-nodes-base.writeBinaryFile',
    version: 1,
    position: [850, 300]
  })
  StoreRequestData = {
    fileName: '=/tmp/permission-request-{{ $json.body.requestId }}.json',
    dataPropertyName: 'data',
    options: {}
  };

  @links()
  defineRouting() {
    this.WebhookTrigger.out(0).to(this.GetManager.in(0));
    this.GetManager.out(0).to(this.SendApprovalEmail.in(0));
    this.SendApprovalEmail.out(0).to(this.StoreRequestData.in(0));
  }
}
