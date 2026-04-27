import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : 1.1 Permission Approval Workflow
// Nodes   : 84  |  Connections: 59
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// SubmitWebhook                      webhook                    [retry]
// ApprovalWebhook                    webhook                    [retry]
// NotifyDenied                       gmail                      [creds] [retry]
// DenyWebhook                        webhook                    [retry]
// StickyNote                         stickyNote                 
// StickyNote3                        stickyNote                 
// StickyNote4                        stickyNote                 
// Switch_                            switch                     
// NotifyApproved                     gmail                      [creds] [retry]
// UpdateApproved                     dataTable                  [alwaysOutput] [retry]
// LoopOverItems                      splitInBatches             
// GetRowS                            dataTable                  
// StickyNote6                        stickyNote                 
// HttpRequest                        httpRequest                [retry]
// LoopOverItems1                     splitInBatches             
// GetRowS1                           dataTable                  
// StickyNote8                        stickyNote                 
// HttpRequest1                       httpRequest                [retry]
// ApplyObserver                      executionData              [onError→regular]
// DenyObserver                       executionData              [onError→regular]
// StickyNote9                        stickyNote                 
// StickyNote11                       stickyNote                 
// StickyNote12                       stickyNote                 
// StickyNote15                       stickyNote                 
// Provisioning                       dataTable                  [alwaysOutput] [retry]
// Github                             httpRequest                [creds] [retry]
// Evaluation2                        evaluation                 
// Normalization                      set                        
// Normalization1                     set                        
// Normalization2                     set                        
// UpdateDenied                       dataTable                  [alwaysOutput] [retry]
// Evaluation4                        evaluation                 
// Evaluation6                        evaluation                 
// StickyNote7                        stickyNote                 
// StickyNote19                       stickyNote                 
// Evaluation                         evaluation                 
// Evaluation1                        evaluation                 
// StickyNote13                       stickyNote                 
// StickyNote24                       stickyNote                 
// StickyNote32                       stickyNote                 
// StickyNote34                       stickyNote                 
// StickyNote36                       stickyNote                 
// StickyNote37                       stickyNote                 
// StickyNote38                       stickyNote                 
// StickyNote40                       stickyNote                 
// Evaluation8                        evaluation                 
// Evaluation9                        evaluation                 
// StopAndError1                      stopAndError               
// Evaluation10                       evaluation                 
// Evaluation11                       evaluation                 
// EditFields                         set                        
// Manual                             manualTrigger              
// Evals1                             evaluationTrigger          
// ZendeskTrigger                     zendeskTrigger             
// EmailManager                       gmail                      [creds] [retry]
// StickyNote5                        stickyNote                 
// JedeService                        httpRequest                
// StickyNote39                       stickyNote                 
// Observer                           executionData              [onError→regular]
// StickyNote25                       stickyNote                 
// StickyNote26                       stickyNote                 
// StickyNote29                       stickyNote                 
// StickyNote30                       stickyNote                 
// StickyNote17                       stickyNote                 
// JedeServices                       httpRequest                [retry]
// StickyNote18                       stickyNote                 
// _21Idempotenz                      if                         
// _31Idempotenz                      if                         
// _11Idempotenz                      if                         
// Wh21Idempotenz                     respondToWebhook           
// Wh31Idempotenz                     respondToWebhook           
// WhRespond                          respondToWebhook           
// WhRespond1                         respondToWebhook           
// InsertAnfrage                      dataTable                  [retry]
// LookupAnfrage                      dataTable                  [alwaysOutput] [retry]
// ManagerExistiert                   if                         
// EmailAnfragenden                   gmail                      [creds] [retry]
// _11Evaluation                      evaluation                 
// _21Evaluation                      evaluation                 
// _31Evaluation                      evaluation                 
// AusnahmeWerfen                     stopAndError               
// HttpRequest2                       httpRequest                [creds]
// Normalization3                     set                        
// GetApiManagerRequesteremail        httpRequest                [creds]
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// SubmitWebhook
//    → Normalization
//      → LookupAnfrage
//        → _11Idempotenz
//          → GetApiManagerRequesteremail
//            → ManagerExistiert
//              → InsertAnfrage
//                → EmailAnfragenden
//                  → _11Evaluation
//                    → Evaluation
//                      → Evaluation2
//                → EmailManager
//                  → _11Evaluation (↩ loop)
//                → JedeService
//                  → _11Evaluation (↩ loop)
//             .out(1) → AusnahmeWerfen
//            → Observer
//          → ManagerExistiert (↩ loop)
//          → Observer (↩ loop)
// ApprovalWebhook
//    → Normalization1
//      → UpdateApproved
//        → ApplyObserver
//        → _21Idempotenz
//          → WhRespond1
//            → Switch_
//              → JedeServices
//                → Provisioning
//                  → NotifyApproved
//                    → _21Evaluation
//                      → Evaluation1
//                        → Evaluation4
//             .out(1) → Github
//                → Provisioning (↩ loop)
//             .out(2) → EditFields
//                → Evaluation9
//                  → Evaluation11
//                    → Evaluation10
//                 .out(1) → StopAndError1
//         .out(1) → Wh21Idempotenz
// DenyWebhook
//    → Normalization2
//      → UpdateDenied
//        → DenyObserver
//        → _31Idempotenz
//          → WhRespond
//            → NotifyDenied
//              → _31Evaluation
//                → Evaluation8
//                  → Evaluation6
//         .out(1) → _31Evaluation (↩ loop)
//         .out(1) → Wh31Idempotenz
// GetRowS
//    → LoopOverItems
//     .out(1) → HttpRequest
//        → LoopOverItems (↩ loop)
// GetRowS1
//    → LoopOverItems1
//     .out(1) → HttpRequest1
//        → LoopOverItems1 (↩ loop)
// Manual
//    → Normalization3
//      → HttpRequest2
// Evals1
//    → Normalization1 (↩ loop)
// ZendeskTrigger
//    → Normalization (↩ loop)
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: "I1ZPqmvglRbt4TF8",
    name: "1.1 Permission Approval Workflow",
    active: true,
    isArchived: false,
    projectId: "K9RtK3l6tnJjGFXx",
    settings: { executionOrder: "v1", callerPolicy: "workflowsFromSameOwner", availableInMCP: false, binaryMode: "separate", timeSavedMode: "fixed", timezone: "Europe/Berlin", timeSavedPerExecution: 10, errorWorkflow: "BzPEgYmv3SgFQKjs" }
})
export class _11PermissionApprovalWorkflow {

    // =====================================================================
// CONFIGURATION DES NOEUDS
// =====================================================================

    @node({
        id: "webhook-trigger-submit",
        webhookId: "b008c741-92f5-44a4-bc47-0697cb53c093",
        name: "Submit Webhook",
        type: "n8n-nodes-base.webhook",
        version: 2.1,
        position: [448, 400],
        retryOnFail: true
    })
    SubmitWebhook = {
        httpMethod: "POST",
        path: "submit-request",
        options: {}
    };

    @node({
        id: "approval-webhook",
        webhookId: "approval-webhook-123",
        name: "Approval Webhook",
        type: "n8n-nodes-base.webhook",
        version: 2.1,
        position: [432, 1264],
        retryOnFail: true
    })
    ApprovalWebhook = {
        path: "approve-request",
        responseMode: "responseNode",
        options: {}
    };

    @node({
        id: "notify-denied-via-gmail",
        webhookId: "notify-denied-789",
        name: "Notify Denied",
        type: "n8n-nodes-base.gmail",
        version: 2.2,
        position: [1184, 1952],
        credentials: {gmailOAuth2:{id:"dLNo56TvT6swSEko",name:"Gmail account"}},
        retryOnFail: true
    })
    NotifyDenied = {
        sendTo: "={{ $('Update Denied').item.json.requesterEmail }}",
        subject: "={{ $json.requestId }} - Your access request was denied",
        emailType: "text",
        message: `=Hi {{ $json.requesterName }},

Unfortunately, your access request has been DENIED.

Resource: {{ $json.resourceName }}
Request ID: {{ $json.requestId }}

Please contact your manager if you believe this was in error.`,
        options: {
            appendAttribution: false
        }
    };

    @node({
        id: "approval-webhook-deny",
        webhookId: "deny-webhook-456",
        name: "Deny Webhook",
        type: "n8n-nodes-base.webhook",
        version: 2.1,
        position: [432, 1952],
        retryOnFail: true
    })
    DenyWebhook = {
        path: "deny-request",
        responseMode: "responseNode",
        options: {}
    };

    @node({
        id: "d7a2eb72-0a83-4b7b-93ad-66f7b2a634d9",
        name: "Sticky Note",
        type: "n8n-nodes-base.stickyNote",
        version: 1,
        position: [432, 256]
    })
    StickyNote = {
        content: "## Neue Anfrage",
        height: 480,
        width: 1168,
        color: 5
    };

    @node({
        id: "0c778a07-6264-481c-a235-066b37b3c502",
        name: "Sticky Note3",
        type: "n8n-nodes-base.stickyNote",
        version: 1,
        position: [416, 1008]
    })
    StickyNote3 = {
        content: "## Approval Flow",
        height: 496,
        width: 352,
        color: "#092015"
    };

    @node({
        id: "8ae9d1d5-9171-41c9-8e34-1a46af61e3ae",
        name: "Sticky Note4",
        type: "n8n-nodes-base.stickyNote",
        version: 1,
        position: [416, 1808]
    })
    StickyNote4 = {
        content: "## Deny Flow",
        height: 400,
        width: 352,
        color: "#41060C"
    };

    @node({
        id: "3c1cb68a-bf61-4c61-831d-d6e59b7e53ea",
        name: "Switch",
        type: "n8n-nodes-base.switch",
        version: 3.4,
        position: [1152, 1248]
    })
    Switch_ = {
        rules: {
            values: [
                {
                    conditions: {
                        options: {
                            caseSensitive: true,
                            leftValue: "",
                            typeValidation: "strict",
                            version: 3
                        },
                        conditions: [
                            {
                                id: "66c0836d-4515-4ea8-ad67-df163740896a",
                                leftValue: "={{ $json.resourceName }}",
                                rightValue: "=Others",
                                operator: {
                                    type: "string",
                                    operation: "equals"
                                }
                            }
                        ],
                        combinator: "and"
                    },
                    renameOutput: true,
                    outputKey: "Others"
                },
                {
                    conditions: {
                        options: {
                            caseSensitive: true,
                            leftValue: "",
                            typeValidation: "strict",
                            version: 3
                        },
                        conditions: [
                            {
                                leftValue: "={{ $json.resourceName }}",
                                rightValue: "GitHub Organization Access",
                                operator: {
                                    type: "string",
                                    operation: "equals"
                                },
                                id: "b2cbb0e3-5707-41af-bd49-590c853f835f"
                            }
                        ],
                        combinator: "and"
                    },
                    renameOutput: true,
                    outputKey: "GitHub"
                }
            ]
        },
        options: {
            fallbackOutput: "extra"
        }
    };

    @node({
        id: "notify-approved-via-gmail",
        webhookId: "2f4536e1-ab6f-44e7-893c-40ecaf397b6c",
        name: "Notify Approved",
        type: "n8n-nodes-base.gmail",
        version: 2.2,
        position: [1600, 1264],
        credentials: {gmailOAuth2:{id:"dLNo56TvT6swSEko",name:"Gmail account"}},
        retryOnFail: true
    })
    NotifyApproved = {
        sendTo: "={{ $('Update Approved').item.json.requesterEmail }}",
        subject: "={{ $('Update Approved').item.json.requestId }} - Your access request was approved",
        emailType: "text",
        message: `=Hi {{ $('Update Approved').item.json.requesterName }},

Great news! Your access request has been APPROVED.

Resource: {{ $('Update Approved').item.json.resourceName }}
Request ID: {{ $('Update Approved').item.json.requestId }}

Access is being provisioned. You should have access shortly.

Thank you for your patience.`,
        options: {
            appendAttribution: false
        }
    };

    @node({
        id: "update-status-approved",
        name: "Update Approved",
        type: "n8n-nodes-base.dataTable",
        version: 1.1,
        position: [720, 1264],
        alwaysOutputData: true,
        retryOnFail: true
    })
    UpdateApproved = {
        operation: "update",
        dataTableId: {
            __rl: true,
            value: "ywzGM56DwJJCSq1T",
            mode: "list",
            cachedResultName: "requests",
            cachedResultUrl: "/projects/K9RtK3l6tnJjGFXx/datatables/ywzGM56DwJJCSq1T"
        },
        matchType: "allConditions",
        filters: {
            conditions: [
                {
                    keyName: "requestId",
                    keyValue: "={{ $json.body.requestId }}"
                },
                {
                    keyName: "approvalStatus",
                    keyValue: "=pending"
                }
            ]
        },
        columns: {
            mappingMode: "defineBelow",
            value: {
                approvalStatus: "approved"
            },
            matchingColumns: [],
            schema: [
                {
                    id: "requestId",
                    displayName: "requestId",
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: "string",
                    readOnly: false,
                    removed: false
                },
                {
                    id: "requesterEmail",
                    displayName: "requesterEmail",
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: "string",
                    readOnly: false,
                    removed: false
                },
                {
                    id: "requesterName",
                    displayName: "requesterName",
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: "string",
                    readOnly: false,
                    removed: false
                },
                {
                    id: "resourceName",
                    displayName: "resourceName",
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: "string",
                    readOnly: false,
                    removed: false
                },
                {
                    id: "justification",
                    displayName: "justification",
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: "string",
                    readOnly: false,
                    removed: false
                },
                {
                    id: "approvalStatus",
                    displayName: "approvalStatus",
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: "string",
                    readOnly: false,
                    removed: false
                },
                {
                    id: "provisioningStatus",
                    displayName: "provisioningStatus",
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: "string",
                    readOnly: false,
                    removed: false
                }
            ],
            attemptToConvertTypes: false,
            convertFieldsToString: false
        },
        options: {}
    };

    @node({
        id: "6d8c7eb0-e546-4c83-bcd8-c580578706ab",
        name: "Loop Over Items",
        type: "n8n-nodes-base.splitInBatches",
        version: 3,
        position: [48, 304]
    })
    LoopOverItems = {
        options: {}
    };

    @node({
        id: "903f68a3-ca00-48bf-85a6-87e19efc609b",
        name: "Get row(s)",
        type: "n8n-nodes-base.dataTable",
        version: 1.1,
        position: [-128, 304]
    })
    GetRowS = {
        operation: "get",
        dataTableId: {
            __rl: true,
            value: "Hy9Sl4HieyfcdQOg",
            mode: "list",
            cachedResultName: "evals",
            cachedResultUrl: "/projects/K9RtK3l6tnJjGFXx/datatables/Hy9Sl4HieyfcdQOg"
        },
        filters: {
            conditions: [
                {
                    keyName: "action",
                    keyValue: "submit-request"
                }
            ]
        }
    };

    @node({
        id: "371be5cb-f76e-4c9d-b04a-d19836fa20de",
        name: "Sticky Note6",
        type: "n8n-nodes-base.stickyNote",
        version: 1,
        position: [-320, 256]
    })
    StickyNote6 = {
        content: "Test Cases",
        height: 256,
        width: 724,
        color: "#292924"
    };

    @node({
        id: "fe483dd9-411b-4479-b0b9-bd0a60f409ec",
        name: "HTTP Request",
        type: "n8n-nodes-base.httpRequest",
        version: 4.4,
        position: [240, 304],
        retryOnFail: true
    })
    HttpRequest = {
        method: "POST",
        url: "=https://n8n-production-d20d.up.railway.app/webhook/{{ $('Get row(s)').item.json.action }}",
        sendBody: true,
        bodyParameters: {
            parameters: [
                {
                    name: "requestId",
                    value: "={{ $('Get row(s)').item.json.requestId }}"
                },
                {
                    name: "requesterName",
                    value: "={{ $('Get row(s)').item.json.requesterName }}"
                },
                {
                    name: "requesterEmail",
                    value: "={{ $('Get row(s)').item.json.requesterEmail }}"
                },
                {
                    name: "resource",
                    value: "GitHub Organization Access"
                },
                {
                    name: "justification",
                    value: "={{ $('Get row(s)').item.json.justification }}"
                },
                {
                    name: "timestamp"
                },
                {
                    name: "=testCase",
                    value: "={{ $('Get row(s)').item.json.testCase }}"
                }
            ]
        },
        options: {}
    };

    @node({
        id: "38a73384-f11e-4e04-9273-10068ea199d2",
        name: "Loop Over Items1",
        type: "n8n-nodes-base.splitInBatches",
        version: 3,
        position: [32, 1088]
    })
    LoopOverItems1 = {
        options: {}
    };

    @node({
        id: "f2f0fb33-6248-4e99-a28f-c56bd5b2d709",
        name: "Get row(s)1",
        type: "n8n-nodes-base.dataTable",
        version: 1.1,
        position: [-144, 1088]
    })
    GetRowS1 = {
        operation: "get",
        dataTableId: {
            __rl: true,
            value: "Hy9Sl4HieyfcdQOg",
            mode: "list",
            cachedResultName: "evals",
            cachedResultUrl: "/projects/K9RtK3l6tnJjGFXx/datatables/Hy9Sl4HieyfcdQOg"
        },
        filters: {
            conditions: [
                {
                    keyName: "action",
                    keyValue: "approve-request"
                },
                {
                    keyName: "action",
                    keyValue: "deny-request"
                }
            ]
        }
    };

    @node({
        id: "8754ec6b-cccd-46ae-bd68-c45673184baf",
        name: "Sticky Note8",
        type: "n8n-nodes-base.stickyNote",
        version: 1,
        position: [-336, 1056]
    })
    StickyNote8 = {
        content: "Approve/Deny Flows",
        height: 240,
        width: 720,
        color: "#292924"
    };

    @node({
        id: "467a620d-3afa-467d-8d25-47c733322528",
        name: "HTTP Request1",
        type: "n8n-nodes-base.httpRequest",
        version: 4.4,
        position: [224, 1088],
        retryOnFail: true
    })
    HttpRequest1 = {
        url: "=https://n8n-production-d20d.up.railway.app/webhook/{{ $('Get row(s)1').item.json.action }}?id={{ $json.requestId }}",
        options: {
            response: {
                response: {
                    responseFormat: "text"
                }
            }
        }
    };

    @node({
        id: "e2e5a179-dbca-46ec-b543-8bef12b3076e",
        name: "Apply Observer",
        type: "n8n-nodes-base.executionData",
        version: 1.1,
        position: [880, 1408],
        onError: "continueRegularOutput"
    })
    ApplyObserver = {
        dataToSave: {
            values: [
                {
                    key: "requestId",
                    value: "={{ $('Normalization1').item.json.body.requestId }}"
                },
                {
                    key: "requesterName",
                    value: "={{ $json.requesterName }}"
                },
                {
                    key: "requesterEmail",
                    value: "={{ $json.requesterEmail }}"
                },
                {
                    key: "resourceName",
                    value: "={{ $json.resourceName }}"
                },
                {
                    key: "justification",
                    value: "={{ $json.justification }}"
                },
                {
                    key: "approvalStatus",
                    value: "={{ $json.approval_status }}"
                },
                {
                    key: "provisioningStatus",
                    value: "={{ $json.provisioning_status }}"
                }
            ]
        }
    };

    @node({
        id: "24d56c27-0ba4-490d-8919-87bcd899dcbe",
        name: "Deny Observer",
        type: "n8n-nodes-base.executionData",
        version: 1.1,
        position: [880, 2096],
        onError: "continueRegularOutput"
    })
    DenyObserver = {
        dataToSave: {
            values: [
                {
                    key: "requestId",
                    value: "={{ $('Normalization2').item.json.query.id }}"
                },
                {
                    key: "requesterName",
                    value: "={{ $json.requesterName }}"
                },
                {
                    key: "requesterEmail",
                    value: "={{ $json.requesterEmail }}"
                },
                {
                    key: "resourceName",
                    value: "={{ $json.resourceName }}"
                },
                {
                    key: "justification",
                    value: "={{ $json.justification }}"
                },
                {
                    key: "approval_status",
                    value: "={{ $json.approvalStatus }}"
                },
                {
                    key: "provisioning_status",
                    value: "={{ $json.provisioningStatus }}"
                }
            ]
        }
    };

    @node({
        id: "1bfa67d4-26a2-4b73-8979-205692be713a",
        name: "Sticky Note9",
        type: "n8n-nodes-base.stickyNote",
        version: 1,
        position: [416, 1056]
    })
    StickyNote9 = {
        content: "## 2.1",
        height: 496,
        width: 294,
        color: 4
    };

    @node({
        id: "7aff1dd0-2c38-4256-b365-9d1818a35125",
        name: "Sticky Note11",
        type: "n8n-nodes-base.stickyNote",
        version: 1,
        position: [704, 1056]
    })
    StickyNote11 = {
        content: "## 2.2",
        height: 496,
        width: 150,
        color: 4
    };

    @node({
        id: "1d53e853-3573-4518-840b-5ac0143ebfc7",
        name: "Sticky Note12",
        type: "n8n-nodes-base.stickyNote",
        version: 1,
        position: [848, 1056]
    })
    StickyNote12 = {
        content: "## 2.3",
        height: 496,
        width: 294,
        color: 4
    };

    @node({
        id: "1f1cd04c-aba4-4966-a43b-72243ba32b9a",
        name: "Sticky Note15",
        type: "n8n-nodes-base.stickyNote",
        version: 1,
        position: [1136, 1056]
    })
    StickyNote15 = {
        content: "## 2.4",
        height: 496,
        width: 294,
        color: 4
    };

    @node({
        id: "f5ba3341-a5c5-4441-89c2-b110a4207cb5",
        name: "provisioning",
        type: "n8n-nodes-base.dataTable",
        version: 1.1,
        position: [1472, 1264],
        alwaysOutputData: true,
        retryOnFail: true
    })
    Provisioning = {
        operation: "update",
        dataTableId: {
            __rl: true,
            value: "ywzGM56DwJJCSq1T",
            mode: "list",
            cachedResultName: "requests",
            cachedResultUrl: "/projects/K9RtK3l6tnJjGFXx/datatables/ywzGM56DwJJCSq1T"
        },
        matchType: "allConditions",
        filters: {
            conditions: [
                {
                    keyName: "requestId",
                    condition: "like",
                    keyValue: "={{ $('Approval Webhook').item.json.query.id }}"
                },
                {
                    keyName: "provisioningStatus",
                    condition: "like",
                    keyValue: "=pending"
                }
            ]
        },
        columns: {
            mappingMode: "defineBelow",
            value: {
                provisioningStatus: "success "
            },
            matchingColumns: [],
            schema: [
                {
                    id: "requestId",
                    displayName: "requestId",
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: "string",
                    readOnly: false,
                    removed: false
                },
                {
                    id: "requesterEmail",
                    displayName: "requesterEmail",
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: "string",
                    readOnly: false,
                    removed: false
                },
                {
                    id: "requesterName",
                    displayName: "requesterName",
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: "string",
                    readOnly: false,
                    removed: false
                },
                {
                    id: "resourceName",
                    displayName: "resourceName",
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: "string",
                    readOnly: false,
                    removed: false
                },
                {
                    id: "justification",
                    displayName: "justification",
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: "string",
                    readOnly: false,
                    removed: false
                },
                {
                    id: "approvalStatus",
                    displayName: "approvalStatus",
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: "string",
                    readOnly: false,
                    removed: false
                },
                {
                    id: "provisioningStatus",
                    displayName: "provisioningStatus",
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: "string",
                    readOnly: false,
                    removed: false
                }
            ],
            attemptToConvertTypes: false,
            convertFieldsToString: false
        },
        options: {}
    };

    @node({
        id: "c858f59d-0e8a-4735-a99c-8bffe23b67cf",
        name: "GitHub",
        type: "n8n-nodes-base.httpRequest",
        version: 4.4,
        position: [1312, 1264],
        credentials: {httpBearerAuth:{id:"PFl8wkJxzRrDAVXy",name:"Github Bearer Auth account"}},
        retryOnFail: true
    })
    Github = {
        method: "PUT",
        url: "=https://api.github.com/orgs/Allpply/teams/permission-requests/memberships/{{ $json.requesterEmail.split(\"@\")[0] }}",
        authentication: "genericCredentialType",
        genericAuthType: "httpBearerAuth",
        sendHeaders: true,
        headerParameters: {
            parameters: [
                {
                    name: "X-GitHub-Api-Version",
                    value: "2022-11-28"
                }
            ]
        },
        options: {}
    };

    @node({
        id: "3f765bec-a58d-45a6-abcf-2e43d2b79049",
        name: "Evaluation2",
        type: "n8n-nodes-base.evaluation",
        version: 4.8,
        position: [2064, 416]
    })
    Evaluation2 = {
        operation: "setMetrics",
        metric: "categorization",
        expectedAnswer: "SENT",
        actualAnswer: "={{ $json.labelIds[0] }}",
        options: {}
    };

    @node({
        id: "fdd676d7-98bd-4237-88a9-347486b3b193",
        name: "Normalization",
        type: "n8n-nodes-base.set",
        version: 3.4,
        position: [592, 400]
    })
    Normalization = {
        assignments: {
            assignments: [
                {
                    id: "dc599d9e-14b8-4875-880c-16487ef9cccf",
                    name: "body.requestId",
                    value: "={{ $json.requestId }}{{ $json.body.requestId }}",
                    type: "string"
                },
                {
                    id: "45e65b31-63d8-422b-b555-d9b335821125",
                    name: "body.requesterName",
                    value: "={{ $json.requesterName }}{{ $json.body.requesterName }}",
                    type: "string"
                },
                {
                    id: "d7e26dfe-2bc1-4ff9-9f97-fd55636ebdef",
                    name: "body.requesterEmail",
                    value: "={{ $json.requesterEmail }}{{ $json.body.requesterEmail }}",
                    type: "string"
                },
                {
                    id: "db375511-7f01-45e6-8cee-59978d1420a1",
                    name: "body.resourceName",
                    value: "={{ $json.resource }}{{ $json.body.resource }}",
                    type: "string"
                },
                {
                    id: "a38c9af1-a7c2-457d-8578-22f96f09b975",
                    name: "body.justification",
                    value: "={{ $json.justification }}{{ $json.body.justification }}",
                    type: "string"
                },
                {
                    id: "ce8223a8-afde-4b4a-9df8-4487ebd82d9f",
                    name: "body.testCase",
                    value: "={{ $json.testCase }}{{ $json.body.testCase }}",
                    type: "string"
                }
            ]
        },
        options: {}
    };

    @node({
        id: "c33f3322-66ad-4666-9c03-6b54eb0e760e",
        name: "Normalization1",
        type: "n8n-nodes-base.set",
        version: 3.4,
        position: [576, 1264]
    })
    Normalization1 = {
        assignments: {
            assignments: [
                {
                    id: "dc599d9e-14b8-4875-880c-16487ef9cccf",
                    name: "body.requestId",
                    value: "={{ $json.query.id }}{{ $json.requestId }}",
                    type: "string"
                }
            ]
        },
        options: {}
    };

    @node({
        id: "17c69714-661b-4ad9-804b-234d5ef3fffd",
        name: "Normalization2",
        type: "n8n-nodes-base.set",
        version: 3.4,
        position: [576, 1952]
    })
    Normalization2 = {
        assignments: {
            assignments: [
                {
                    id: "dc599d9e-14b8-4875-880c-16487ef9cccf",
                    name: "query.id",
                    value: "={{ $json.query.id }}{{ $json.requestId }}",
                    type: "string"
                }
            ]
        },
        options: {}
    };

    @node({
        id: "update-status-denied",
        name: "Update Denied",
        type: "n8n-nodes-base.dataTable",
        version: 1.1,
        position: [720, 1952],
        alwaysOutputData: true,
        retryOnFail: true
    })
    UpdateDenied = {
        operation: "update",
        dataTableId: {
            __rl: true,
            value: "ywzGM56DwJJCSq1T",
            mode: "list",
            cachedResultName: "requests",
            cachedResultUrl: "/projects/K9RtK3l6tnJjGFXx/datatables/ywzGM56DwJJCSq1T"
        },
        matchType: "allConditions",
        filters: {
            conditions: [
                {
                    keyName: "requestId",
                    keyValue: "={{ $json.query.id }}"
                },
                {
                    keyName: "approvalStatus",
                    keyValue: "=pending"
                }
            ]
        },
        columns: {
            mappingMode: "defineBelow",
            value: {
                approvalStatus: "denied",
                provisioningStatus: "success "
            },
            matchingColumns: [],
            schema: [
                {
                    id: "requestId",
                    displayName: "requestId",
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: "string",
                    readOnly: false,
                    removed: false
                },
                {
                    id: "requesterEmail",
                    displayName: "requesterEmail",
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: "string",
                    readOnly: false,
                    removed: false
                },
                {
                    id: "requesterName",
                    displayName: "requesterName",
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: "string",
                    readOnly: false,
                    removed: false
                },
                {
                    id: "resourceName",
                    displayName: "resourceName",
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: "string",
                    readOnly: false,
                    removed: false
                },
                {
                    id: "justification",
                    displayName: "justification",
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: "string",
                    readOnly: false,
                    removed: false
                },
                {
                    id: "approvalStatus",
                    displayName: "approvalStatus",
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: "string",
                    readOnly: false,
                    removed: false
                },
                {
                    id: "provisioningStatus",
                    displayName: "provisioningStatus",
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: "string",
                    readOnly: false,
                    removed: false
                }
            ],
            attemptToConvertTypes: false,
            convertFieldsToString: false
        },
        options: {}
    };

    @node({
        id: "8df3d9ac-e586-4f4b-8474-c6e151afce59",
        name: "Evaluation4",
        type: "n8n-nodes-base.evaluation",
        version: 4.8,
        position: [2064, 1136]
    })
    Evaluation4 = {
        operation: "setMetrics",
        metric: "categorization",
        expectedAnswer: "SENT",
        actualAnswer: "={{ $('Notify Approved').item.json.labelIds[0] }}",
        options: {}
    };

    @node({
        id: "fb0a1d10-b86f-4bbc-b9ca-d605e087d9bb",
        name: "Evaluation6",
        type: "n8n-nodes-base.evaluation",
        version: 4.8,
        position: [2064, 1936]
    })
    Evaluation6 = {
        operation: "setMetrics",
        metric: "categorization",
        expectedAnswer: "SENT",
        actualAnswer: "={{ $('Notify Denied').item.json.labelIds[0] }}",
        options: {}
    };

    @node({
        id: "f35893ce-57d9-47f8-95e6-032486417246",
        name: "Sticky Note7",
        type: "n8n-nodes-base.stickyNote",
        version: 1,
        position: [1296, 592]
    })
    StickyNote7 = {
        content: "",
        height: 144,
        width: 150
    };

    @node({
        id: "082323c4-6b6c-4c07-905b-66e6103ea34e",
        name: "Sticky Note19",
        type: "n8n-nodes-base.stickyNote",
        version: 1,
        position: [1744, 1056]
    })
    StickyNote19 = {
        content: "## 2.5",
        height: 496,
        width: 438,
        color: 7
    };

    @node({
        id: "104ac1f7-cd1e-4b87-9b42-e8b4769a6069",
        name: "Evaluation",
        type: "n8n-nodes-base.evaluation",
        version: 4.8,
        position: [1920, 416]
    })
    Evaluation = {
        operation: "setInputs",
        inputs: {
            values: [
                {
                    inputName: "requestId",
                    inputValue: "={{ $('Normalization').item.json.body.requestId }}"
                },
                {
                    inputName: "requesterName",
                    inputValue: "={{ $('Normalization').item.json.body.requesterName }}"
                },
                {
                    inputName: "requesterEmail",
                    inputValue: "={{ $('Normalization').item.json.body.requesterEmail }}"
                },
                {
                    inputName: "resource",
                    inputValue: "={{ $('Normalization').item.json.body.resource }}"
                },
                {
                    inputName: "justification",
                    inputValue: "={{ $('Normalization').item.json.body.justification }}"
                },
                {
                    inputName: "testCase",
                    inputValue: "={{ $('Normalization').item.json.body.testCase }}"
                }
            ]
        }
    };

    @node({
        id: "2d9ba797-83b1-45db-9897-4793ef40eb5f",
        name: "Evaluation1",
        type: "n8n-nodes-base.evaluation",
        version: 4.8,
        position: [1920, 1136]
    })
    Evaluation1 = {
        operation: "setInputs",
        inputs: {
            values: [
                {
                    inputName: "requestId",
                    inputValue: "={{ $('Update Approved').item.json.requestId }}"
                },
                {
                    inputName: "requesterName",
                    inputValue: "={{ $('Update Approved').item.json.requesterName }}"
                },
                {
                    inputName: "requesterEmail",
                    inputValue: "={{ $('Update Approved').item.json.requesterEmail }}"
                },
                {
                    inputName: "resourceName",
                    inputValue: "={{ $('Update Approved').item.json.resourceName }}"
                },
                {
                    inputName: "justification",
                    inputValue: "={{ $('Update Approved').item.json.justification }}"
                }
            ]
        }
    };

    @node({
        id: "8ebe2be5-6696-47fa-be95-774b994bbed2",
        name: "Sticky Note13",
        type: "n8n-nodes-base.stickyNote",
        version: 1,
        position: [416, 1856]
    })
    StickyNote13 = {
        content: "## 3.1",
        height: 368,
        width: 278,
        color: 3
    };

    @node({
        id: "c13fa7a8-23ea-4a09-a8a3-f4ed0379ad7d",
        name: "Sticky Note24",
        type: "n8n-nodes-base.stickyNote",
        version: 1,
        position: [688, 1856]
    })
    StickyNote24 = {
        content: "## 3.2",
        height: 368,
        width: 326,
        color: 3
    };

    @node({
        id: "bd305c34-23a4-4f35-95fe-61a11641806b",
        name: "Sticky Note32",
        type: "n8n-nodes-base.stickyNote",
        version: 1,
        position: [1744, 1840]
    })
    StickyNote32 = {
        content: "## 3.5",
        height: 368,
        width: 438,
        color: 7
    };

    @node({
        id: "a527badf-9ae9-4fbe-ae1a-93cb9b8a5158",
        name: "Sticky Note34",
        type: "n8n-nodes-base.stickyNote",
        version: 1,
        position: [432, 256]
    })
    StickyNote34 = {
        content: `## 1.1

Zendesk
Jira`,
        height: 480,
        width: 278,
        color: 5
    };

    @node({
        id: "a53b8004-0331-4213-aed3-498a33640fed",
        name: "Sticky Note36",
        type: "n8n-nodes-base.stickyNote",
        version: 1,
        position: [704, 256]
    })
    StickyNote36 = {
        content: `## 1.2

Postgres
MS SQL`,
        height: 480,
        width: 310,
        color: 5
    };

    @node({
        id: "03452da0-7928-49f9-92b3-16508033e651",
        name: "Sticky Note37",
        type: "n8n-nodes-base.stickyNote",
        version: 1,
        position: [1008, 256]
    })
    StickyNote37 = {
        content: `## 1.3

MS AD`,
        height: 480,
        width: 294,
        color: 5
    };

    @node({
        id: "fade92c7-f038-428d-9bd9-9acf0b769a4b",
        name: "Sticky Note38",
        type: "n8n-nodes-base.stickyNote",
        version: 1,
        position: [1296, 256]
    })
    StickyNote38 = {
        content: `## 1.4

Eintrag erstellen`,
        height: 480,
        width: 150,
        color: 5
    };

    @node({
        id: "06f8a4a5-9588-4560-9c45-b3de9a7c311a",
        name: "Sticky Note40",
        type: "n8n-nodes-base.stickyNote",
        version: 1,
        position: [1744, 256]
    })
    StickyNote40 = {
        content: `## 1.6

Auto-Evals`,
        height: 480,
        width: 438,
        color: 7
    };

    @node({
        id: "5a61b65c-ec61-4b94-a0b0-73031ec921d0",
        name: "Evaluation8",
        type: "n8n-nodes-base.evaluation",
        version: 4.8,
        position: [1920, 1936]
    })
    Evaluation8 = {
        operation: "setInputs",
        inputs: {
            values: [
                {
                    inputName: "requestId",
                    inputValue: "={{ $('Update Denied').item.json.requestId }}"
                },
                {
                    inputName: "requesterName",
                    inputValue: "={{ $('Update Denied').item.json.requesterName }}"
                },
                {
                    inputName: "requesterEmail",
                    inputValue: "={{ $('Update Denied').item.json.requesterEmail }}"
                },
                {
                    inputName: "resourceName",
                    inputValue: "={{ $('Update Denied').item.json.resourceName }}"
                },
                {
                    inputName: "justification",
                    inputValue: "={{ $('Update Denied').item.json.justification }}"
                }
            ]
        }
    };

    @node({
        id: "f13a13f7-16ac-4291-80b6-75cd4b35c913",
        name: "Evaluation9",
        type: "n8n-nodes-base.evaluation",
        version: 4.8,
        position: [1776, 1424]
    })
    Evaluation9 = {
        operation: "checkIfEvaluating"
    };

    @node({
        id: "d6d425c4-77d7-4452-b7b6-3aa9e92b3fbd",
        name: "Stop and Error1",
        type: "n8n-nodes-base.stopAndError",
        version: 1,
        position: [1936, 1424]
    })
    StopAndError1 = {
        errorMessage: "={{ $('GitHub').item.json.error.status }}"
    };

    @node({
        id: "1b24eade-0901-4eda-965d-b7e75e78e16a",
        name: "Evaluation10",
        type: "n8n-nodes-base.evaluation",
        version: 4.8,
        position: [2064, 1264]
    })
    Evaluation10 = {
        operation: "setMetrics",
        metric: "categorization",
        expectedAnswer: "evals",
        actualAnswer: "={{ $('Edit Fields').item.json.evals }}",
        options: {}
    };

    @node({
        id: "c5df205b-969d-48cc-9f60-68dc7890b93d",
        name: "Evaluation11",
        type: "n8n-nodes-base.evaluation",
        version: 4.8,
        position: [1920, 1264]
    })
    Evaluation11 = {
        operation: "setInputs",
        inputs: {
            values: [
                {
                    inputName: "requestId",
                    inputValue: "={{ $('Update Approved').item.json.requestId }}"
                },
                {
                    inputName: "requesterName",
                    inputValue: "={{ $('Update Approved').item.json.requesterName }}"
                },
                {
                    inputName: "requesterEmail",
                    inputValue: "={{ $('Update Approved').item.json.requesterEmail }}"
                },
                {
                    inputName: "resourceName",
                    inputValue: "={{ $('Update Approved').item.json.resourceName }}"
                },
                {
                    inputName: "justification",
                    inputValue: "={{ $('Update Approved').item.json.justification }}"
                }
            ]
        }
    };

    @node({
        id: "7fde2073-22d2-4c38-af6a-22f9a70633ca",
        name: "Edit Fields",
        type: "n8n-nodes-base.set",
        version: 3.4,
        position: [1312, 1408]
    })
    EditFields = {
        assignments: {
            assignments: [
                {
                    id: "963c969e-32f8-4f1b-9aa1-1346c455f921",
                    name: "evals",
                    value: "=evals",
                    type: "string"
                }
            ]
        },
        options: {}
    };

    @node({
        id: "deb73a90-f210-4bbe-9ab3-64cc906ac1b6",
        name: "Manual",
        type: "n8n-nodes-base.manualTrigger",
        version: 1,
        position: [-320, 560]
    })
    Manual = {};

    @node({
        id: "0de1950b-8231-44b6-9809-0801d8f21949",
        name: "Evals1",
        type: "n8n-nodes-base.evaluationTrigger",
        version: 4.7,
        position: [240, 1424]
    })
    Evals1 = {
        dataTableId: {
            __rl: true,
            value: "Hy9Sl4HieyfcdQOg",
            mode: "list",
            cachedResultName: "evals",
            cachedResultUrl: "/projects/K9RtK3l6tnJjGFXx/datatables/Hy9Sl4HieyfcdQOg"
        },
        filterRows: true,
        filters: {
            conditions: [
                {
                    keyName: "action",
                    keyValue: "approve-request"
                }
            ]
        }
    };

    @node({
        id: "9292c8f5-7f02-47ce-8220-073db7e06aa6",
        webhookId: "97e36955-90ee-4793-acdf-653b6d25deab",
        name: "Zendesk Trigger",
        type: "n8n-nodes-base.zendeskTrigger",
        version: 1,
        position: [448, 528]
    })
    ZendeskTrigger = {
        options: {}
    };

    @node({
        id: "bcb42f65-851f-4a7f-a3fe-32557c16f7b7",
        webhookId: "a8640aa7-d25f-4eef-b3c7-070f774e84b5",
        name: "Email Manager",
        type: "n8n-nodes-base.gmail",
        version: 2.2,
        position: [1472, 336],
        credentials: {gmailOAuth2:{id:"dLNo56TvT6swSEko",name:"Gmail account"}},
        retryOnFail: true
    })
    EmailManager = {
        sendTo: "={{ $('GET /api/manager/:requesterEmail').item.json.managerEmail }}",
        subject: "={{ $('Normalization').item.json.body.requestId }} - Permission Approval Request",
        message: `= <html lang='en'>

 <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>Permission Approval Request</title>
 </head>

 <body style="font-family: Arial, sans-serif; font-size: 14px; background-color:      
 #fbfcfe; margin: 0; padding: 0;">
     <table width="100%" cellpadding="0" cellspacing="0" style="background-color:     
 #fbfcfe;">
         <tr>
             <td align="center" style="padding: 24px 0;">

                 <!-- Main Card with Request Info -->
                 <table width="448" cellpadding="0" cellspacing="0" border="0"        
                     style="width: 100%; max-width: 448px; background-color: #ffffff; 
  border: 1px solid #dbdfe7; border-radius: 12px; padding: 24px; box-shadow: 0px 4px  
 16px rgba(99, 77, 255, 0.06);">
                     <tr>
                         <td style="text-align: center; font-family: Arial,
 sans-serif; font-size: 16px; font-weight: bold; color: #4a4a4a; padding-bottom:      
 16px;">
                             ACCESS REQUEST
                         </td>
                     </tr>
                     <tr>
                         <td style="font-family: Arial, sans-serif; font-size: 14px;  
 color: #555555; text-align: left;">
                             <p style="margin: 0 0 10px 0;"><strong>Requester Name:</strong> {{ $('Normalization').item.json.body.requesterName }}</p>
<p style="margin: 0 0 10px 0;"><strong>Email:</strong> {{ $('Normalization').item.json.body.requesterEmail }}</p>
                             <p style="margin: 0 0 10px
 0;"><strong>Resource:</strong> {{ $('Normalization').item.json.body.resourceName }}</p>      
                             <p style="margin: 0 0 10px
 0;"><strong>Justification:</strong> {{ $('Normalization').item.json.body.justification }}</p>
                             <p style="margin: 0;"><strong>Request ID:</strong> {{ $('Normalization').item.json.body.requestId }}</p>
                         </td>
                     </tr>
                     <tr>
                         <td align="center" style="padding-top: 16px;">
    <a href="https://n8n-production-d20d.up.railway.app/webhook/approve-request?id={{ $('Normalization').item.json.body.requestId }}" target="_blank" style="display: inline-block; text-decoration: none; background-color: #5FAF5E; color: #ffffff; padding: 12px 24px; font-family: Arial, sans-serif; font-size: 14px; font-weight: 600; border-radius: 6px; min-width: 120px; margin: 0 4px;">Approve</a>
    <a href="https://n8n-production-d20d.up.railway.app/webhook/deny-request?id={{ $('Normalization').item.json.body.requestId }}" target="_blank" style="display: inline-block; text-decoration: none; background-color: #ff6d4a; color: #ffffff; padding: 12px 24px; font-family: Arial, sans-serif; font-size: 14px; font-weight: 600; border-radius: 6px; min-width: 120px; margin: 0 4px;">Decline</a>
</td>
                     </tr>
                 </table>

                 <!-- Automated Request Management Block -->
                 <table width="448" cellpadding="0" cellspacing="0" border="0"        
                     style="width: 100%; max-width: 448px; margin-top: 20px;
 background-color: #ffffff; border: 1px solid #dbdfe7; border-radius: 12px; padding:  
 24px; box-shadow: 0px 4px 16px rgba(99, 77, 255, 0.06);">
                     <tr>
                         <td style="text-align: center; font-family: Arial,
 sans-serif;">
                             <p style="margin: 0 0 8px 0; font-size: 14px;
 font-weight: bold; color: #4a4a4a;">Automated Request Management</p>
                             <p style="margin: 0 0 16px 0; font-size: 12px; color:    
 #7e8186;">This request was submitted through our self-service portal. Manage your    
 requests and track approvals online.</p>
                             <a href="https://helmelwa.github.io/FUTRUE/"
 target="_blank" style="display: inline-block; text-decoration: none;
 background-color: #4a4a4a; color: #fff; padding: 10px 20px; font-family: Arial,      
 sans-serif; font-size: 12px; border-radius: 6px;">Go to Request Portal</a>
                         </td>
                     </tr>
                 </table>

                 <!-- Contact & Footer -->
                 <table width="448" cellpadding="0" cellspacing="0" border="0"        
                     style="width: 100%; max-width: 448px; margin-top: 20px;">        
                     <tr>
                         <td style="text-align: center; font-family: Arial,
 sans-serif; font-size: 12px; color: #aaaaaa; padding: 8px 0;">
                             <p style="margin: 0 0 4px 0;">Questions? Contact us at   
 <a href="mailto:automation@company.com" style="color:
 #7e8186;">automation@company.com</a></p>
                             <p style="margin: 0;">This email was sent automatically  
 with <a href="https://n8n.io" target="_blank" style="color: #7e8186;">n8n</a></p>    
                         </td>
                     </tr>
                 </table>

             </td>
         </tr>
     </table>
 </body>

 </html>`,
        options: {
            appendAttribution: false
        }
    };

    @node({
        id: "979a40d8-3fb5-43c6-a8a7-25269b319b09",
        name: "Sticky Note5",
        type: "n8n-nodes-base.stickyNote",
        version: 1,
        position: [1440, 256]
    })
    StickyNote5 = {
        content: `## 1.5

Anfrage senden`,
        height: 480,
        width: 166,
        color: 5
    };

    @node({
        id: "2a6c3480-2e71-408a-8126-eb86244511cd",
        name: "jede Service",
        type: "n8n-nodes-base.httpRequest",
        version: 4.4,
        position: [1472, 608]
    })
    JedeService = {
        method: "POST",
        options: {}
    };

    @node({
        id: "4381f67b-bce8-4e4a-aa04-340b871da65e",
        name: "Sticky Note39",
        type: "n8n-nodes-base.stickyNote",
        version: 1,
        position: [1152, 592]
    })
    StickyNote39 = {
        content: "",
        height: 144,
        width: 150,
        color: "#243B52"
    };

    @node({
        id: "27c7752f-97c3-4284-8b19-218c9d395e02",
        name: "Observer",
        type: "n8n-nodes-base.executionData",
        version: 1.1,
        position: [1184, 608],
        onError: "continueRegularOutput"
    })
    Observer = {
        dataToSave: {
            values: [
                {
                    key: "requestId",
                    value: "={{ $json.requestId }}"
                },
                {
                    key: "requesterName",
                    value: "={{ $json.requesterName }}"
                },
                {
                    key: "requesterEmail",
                    value: "={{ $json.requesterEmail }}"
                },
                {
                    key: "resourceName",
                    value: "={{ $json.resourceName }}"
                },
                {
                    key: "justification",
                    value: "={{ $json.justification }}"
                },
                {
                    key: "approval_status",
                    value: "={{ $json.approvalStatus }}"
                },
                {
                    key: "provisioning_status",
                    value: "={{ $json.provisioningStatus }}"
                }
            ]
        }
    };

    @node({
        id: "11e3e914-0a39-4de9-9ef7-4df3a46ec51e",
        name: "Sticky Note25",
        type: "n8n-nodes-base.stickyNote",
        version: 1,
        position: [480, 80]
    })
    StickyNote25 = {
        content: "# ↓power",
        height: 80,
        width: 198,
        color: "#FAFAFA"
    };

    @node({
        id: "9a632f46-8f74-4e63-b281-4a27290be721",
        name: "Sticky Note26",
        type: "n8n-nodes-base.stickyNote",
        version: 1,
        position: [432, 208]
    })
    StickyNote26 = {
        content: "## Neue Anfrage",
        height: 480,
        width: 336,
        color: "#071522"
    };

    @node({
        id: "84f56c21-38cc-486a-ae7d-d92780f3975d",
        name: "Sticky Note29",
        type: "n8n-nodes-base.stickyNote",
        version: 1,
        position: [1008, 1856]
    })
    StickyNote29 = {
        content: `## 3.3

Idempotenz`,
        height: 368,
        width: 150,
        color: 3
    };

    @node({
        id: "f092cb7a-c3ef-41da-87fa-5b8fffc3d0ab",
        name: "Sticky Note30",
        type: "n8n-nodes-base.stickyNote",
        version: 1,
        position: [1152, 1856]
    })
    StickyNote30 = {
        content: "## 3.4",
        height: 368,
        width: 150,
        color: 3
    };

    @node({
        id: "2bb983d9-427c-475b-a341-0ed70cff8efa",
        name: "Sticky Note17",
        type: "n8n-nodes-base.stickyNote",
        version: 1,
        position: [1424, 1056]
    })
    StickyNote17 = {
        content: "## 2.5",
        height: 496,
        width: 150,
        color: 4
    };

    @node({
        id: "ce74d961-0f88-47ed-b50f-899f9fd6e460",
        name: "jede Services",
        type: "n8n-nodes-base.httpRequest",
        version: 4.4,
        position: [1312, 1120],
        retryOnFail: true
    })
    JedeServices = {
        method: "PUT",
        url: "=https://api.github.com/orgs/Allpply/teams/permission-requests/memberships/{{ $json.requesterEmail.split(\"@\")[0] }}",
        sendHeaders: true,
        options: {}
    };

    @node({
        id: "f5e019e7-0b6d-4345-b33d-01af7f43a8ec",
        name: "Sticky Note18",
        type: "n8n-nodes-base.stickyNote",
        version: 1,
        position: [1568, 1056]
    })
    StickyNote18 = {
        content: "## 2.6",
        height: 496,
        width: 150,
        color: 4
    };

    @node({
        id: "c04a64ed-70ab-4a46-a2d3-77e1a5139ecd",
        name: "2.1 Idempotenz",
        type: "n8n-nodes-base.if",
        version: 2.3,
        position: [880, 1264],
        retryOnFail: false
    })
    _21Idempotenz = {
        conditions: {
            options: {
                caseSensitive: true,
                leftValue: "",
                typeValidation: "strict",
                version: 3
            },
            conditions: [
                {
                    id: "1efd0bc4-62a5-49b5-a3fb-3b590cda9021",
                    leftValue: "={{ $json.id }}",
                    rightValue: 0,
                    operator: {
                        type: "number",
                        operation: "exists",
                        singleValue: true
                    }
                }
            ],
            combinator: "and"
        },
        options: {}
    };

    @node({
        id: "be34f1fd-2b1f-4dd8-988d-350d96301c9e",
        name: "3.1 Idempotenz",
        type: "n8n-nodes-base.if",
        version: 2.3,
        position: [880, 1952],
        retryOnFail: false
    })
    _31Idempotenz = {
        conditions: {
            options: {
                caseSensitive: true,
                leftValue: "",
                typeValidation: "strict",
                version: 3
            },
            conditions: [
                {
                    id: "1efd0bc4-62a5-49b5-a3fb-3b590cda9021",
                    leftValue: "={{ $json.id }}",
                    rightValue: 0,
                    operator: {
                        type: "number",
                        operation: "exists",
                        singleValue: true
                    }
                }
            ],
            combinator: "and"
        },
        options: {}
    };

    @node({
        id: "25a62fb4-eaae-4b4a-b5fb-148b4525055f",
        name: "1.1 Idempotenz",
        type: "n8n-nodes-base.if",
        version: 2.3,
        position: [880, 400]
    })
    _11Idempotenz = {
        conditions: {
            options: {
                caseSensitive: true,
                leftValue: "",
                typeValidation: "strict",
                version: 3
            },
            conditions: [
                {
                    id: "1efd0bc4-62a5-49b5-a3fb-3b590cda9021",
                    leftValue: "={{ $json.id }}",
                    rightValue: 0,
                    operator: {
                        type: "number",
                        operation: "notExists",
                        singleValue: true
                    }
                }
            ],
            combinator: "and"
        },
        options: {}
    };

    @node({
        id: "c7186a73-6f31-41f3-a3ee-db1ad1b3d6d0",
        name: "WH 2.1 Idempotenz",
        type: "n8n-nodes-base.respondToWebhook",
        version: 1.5,
        position: [1024, 1408]
    })
    Wh21Idempotenz = {
        respondWith: "text",
        responseBody: "<h3>🛡️ Idempotenz</h3> <p>You can close this tab.</p>",
        options: {
            responseCode: 200,
            responseHeaders: {
                entries: [
                    {
                        name: "Content-Type",
                        value: "text/html; charset=utf-8"
                    }
                ]
            }
        }
    };

    @node({
        id: "c9893407-868a-468f-bea3-dd114c0f085c",
        name: "WH 3.1 Idempotenz",
        type: "n8n-nodes-base.respondToWebhook",
        version: 1.5,
        position: [1040, 2096]
    })
    Wh31Idempotenz = {
        respondWith: "text",
        responseBody: "<h3>🛡️ Idempotenz</h3> <p>You can close this tab.</p>",
        options: {
            responseCode: 200,
            responseHeaders: {
                entries: [
                    {
                        name: "Content-Type",
                        value: "text/html; charset=utf-8"
                    }
                ]
            }
        }
    };

    @node({
        id: "7906821c-7125-4892-ad0f-8aa109ca9046",
        name: "WH Respond -",
        type: "n8n-nodes-base.respondToWebhook",
        version: 1.5,
        position: [1040, 1952]
    })
    WhRespond = {
        respondWith: "text",
        responseBody: "<h3>❌ Request denied</h3> <p>You can close this tab.</p>",
        options: {
            responseCode: 200,
            responseHeaders: {
                entries: [
                    {
                        name: "Content-Type",
                        value: "text/html; charset=utf-8"
                    }
                ]
            }
        }
    };

    @node({
        id: "502012b4-bc19-41c6-a7d1-802c91467dc5",
        name: "WH Respond +",
        type: "n8n-nodes-base.respondToWebhook",
        version: 1.5,
        position: [1024, 1264]
    })
    WhRespond1 = {
        respondWith: "text",
        responseBody: "<h3>✅ Request approved</h3> <p>You can close this tab.</p>",
        options: {
            responseCode: 200,
            responseHeaders: {
                entries: [
                    {
                        name: "Content-Type",
                        value: "text/html; charset=utf-8"
                    }
                ]
            }
        }
    };

    @node({
        id: "insert-request",
        name: "Insert-Anfrage",
        type: "n8n-nodes-base.dataTable",
        version: 1.1,
        position: [1328, 400],
        retryOnFail: true
    })
    InsertAnfrage = {
        dataTableId: {
            __rl: true,
            value: "ywzGM56DwJJCSq1T",
            mode: "list",
            cachedResultName: "requests",
            cachedResultUrl: "/projects/K9RtK3l6tnJjGFXx/datatables/ywzGM56DwJJCSq1T"
        },
        columns: {
            mappingMode: "defineBelow",
            value: {
                requestId: "={{ $('Normalization').item.json.body.requestId }}",
                requesterEmail: "={{ $('Normalization').item.json.body.requesterEmail }}",
                requesterName: "={{ $('Normalization').item.json.body.requesterName }}",
                resourceName: "={{ $('Normalization').item.json.body.resourceName }}",
                justification: "={{ $('Normalization').item.json.body.justification }}",
                approvalStatus: "pending",
                provisioningStatus: "pending"
            },
            matchingColumns: [],
            schema: [
                {
                    id: "requestId",
                    displayName: "requestId",
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: "string",
                    readOnly: false,
                    removed: false
                },
                {
                    id: "requesterEmail",
                    displayName: "requesterEmail",
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: "string",
                    readOnly: false,
                    removed: false
                },
                {
                    id: "requesterName",
                    displayName: "requesterName",
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: "string",
                    readOnly: false,
                    removed: false
                },
                {
                    id: "resourceName",
                    displayName: "resourceName",
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: "string",
                    readOnly: false,
                    removed: false
                },
                {
                    id: "justification",
                    displayName: "justification",
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: "string",
                    readOnly: false,
                    removed: false
                },
                {
                    id: "approvalStatus",
                    displayName: "approvalStatus",
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: "string",
                    readOnly: false,
                    removed: false
                },
                {
                    id: "provisioningStatus",
                    displayName: "provisioningStatus",
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: "string",
                    readOnly: false,
                    removed: false
                }
            ],
            attemptToConvertTypes: false,
            convertFieldsToString: false
        },
        options: {}
    };

    @node({
        id: "lookup-request",
        name: "Lookup-Anfrage",
        type: "n8n-nodes-base.dataTable",
        version: 1.1,
        position: [736, 400],
        alwaysOutputData: true,
        retryOnFail: true
    })
    LookupAnfrage = {
        operation: "get",
        dataTableId: {
            __rl: true,
            value: "ywzGM56DwJJCSq1T",
            mode: "list",
            cachedResultName: "requests",
            cachedResultUrl: "/projects/K9RtK3l6tnJjGFXx/datatables/ywzGM56DwJJCSq1T"
        },
        matchType: "allConditions",
        filters: {
            conditions: [
                {
                    keyName: "requestId",
                    keyValue: "={{ $json.body.requestId }}"
                },
                {
                    keyName: "approvalStatus",
                    keyValue: "pending"
                }
            ]
        }
    };

    @node({
        id: "fe9d0910-5987-46e7-b971-b34b1e4625e3",
        name: "Manager existiert?",
        type: "n8n-nodes-base.if",
        version: 2.3,
        position: [1184, 400]
    })
    ManagerExistiert = {
        conditions: {
            options: {
                caseSensitive: true,
                leftValue: "",
                typeValidation: "strict",
                version: 3
            },
            conditions: [
                {
                    id: "623740c8-6dae-4346-bf53-fb21f34d1552",
                    leftValue: "={{ $json.managerEmail }}",
                    rightValue: "",
                    operator: {
                        type: "string",
                        operation: "notEmpty",
                        singleValue: true
                    }
                }
            ],
            combinator: "and"
        },
        options: {}
    };

    @node({
        id: "confirm-to-requester-via-gmail",
        webhookId: "66113086-8a45-4a9a-a0f3-668bc3961df3",
        name: "Email Anfragenden",
        type: "n8n-nodes-base.gmail",
        version: 2.2,
        position: [1472, 480],
        credentials: {gmailOAuth2:{id:"dLNo56TvT6swSEko",name:"Gmail account"}},
        retryOnFail: true
    })
    EmailAnfragenden = {
        sendTo: "={{ $('Normalization').item.json.body.requesterEmail }}",
        subject: "={{ $('Normalization').item.json.body.requestId }} - Your access request has been submitted",
        emailType: "text",
        message: `=Hi {{ $('Normalization').item.json.body.requesterName }},

Your access request has been successfully submitted.

Requested Resource: {{ $('Normalization').item.json.body.resourceName }}
Request ID: {{ $('Normalization').item.json.body.requestId }}

Your manager has been notified and will review your request shortly.
You will receive another email once a decision has been made.

Please await further notification.`,
        options: {
            appendAttribution: false
        }
    };

    @node({
        id: "1f1323a5-2116-423b-a382-0bc5cb922da8",
        name: "1.1 Evaluation",
        type: "n8n-nodes-base.evaluation",
        version: 4.8,
        position: [1776, 416]
    })
    _11Evaluation = {
        operation: "checkIfEvaluating"
    };

    @node({
        id: "5d152597-1d3f-48a3-b51f-cb93e247f24b",
        name: "2.1 Evaluation",
        type: "n8n-nodes-base.evaluation",
        version: 4.8,
        position: [1776, 1264]
    })
    _21Evaluation = {
        operation: "checkIfEvaluating"
    };

    @node({
        id: "72cf2639-c3fb-499d-956e-e28024a293b1",
        name: "3.1 Evaluation",
        type: "n8n-nodes-base.evaluation",
        version: 4.8,
        position: [1776, 1936]
    })
    _31Evaluation = {
        operation: "checkIfEvaluating"
    };

    @node({
        id: "1189642e-f9df-4a11-bc48-2d594a43b26c",
        name: "Ausnahme werfen",
        type: "n8n-nodes-base.stopAndError",
        version: 1,
        position: [1328, 608]
    })
    AusnahmeWerfen = {
        errorMessage: "managerName = null"
    };

    @node({
        id: "77e8b58d-a3d1-48bd-954d-aa98ca504045",
        name: "HTTP Request2",
        type: "n8n-nodes-base.httpRequest",
        version: 4.4,
        position: [16, 560],
        credentials: {n8nApi:{id:"pEFlr3bq58GqCev9",name:"n8n API"},httpBearerAuth:{id:"r8tHjyCJcNGyYcvI",name:"Bearer Auth account"},httpHeaderAuth:{id:"cDmyhG9HxaTvTXFF",name:"Manager Lookup - Header Auth - Test"}}
    })
    HttpRequest2 = {
        url: "=https://n8n-production-d20d.up.railway.app/webhook/7081a664-df62-434b-82b5-6d774194327d/api/manager/{{ $json.requesterEmail }}",
        authentication: "genericCredentialType",
        genericAuthType: "httpHeaderAuth",
        options: {}
    };

    @node({
        id: "406088d9-57a3-4fb2-b3e0-17d007835449",
        name: "Normalization3",
        type: "n8n-nodes-base.set",
        version: 3.4,
        position: [-160, 560]
    })
    Normalization3 = {
        assignments: {
            assignments: [
                {
                    id: "d7e26dfe-2bc1-4ff9-9f97-fd55636ebdef",
                    name: "requesterEmail",
                    value: "=gelmelv@gmail.com",
                    type: "string"
                }
            ]
        },
        options: {}
    };

    @node({
        id: "9ddbe351-3dfb-485b-9bd1-e4e92045ea38",
        name: "GET /api/manager/:requesterEmail",
        type: "n8n-nodes-base.httpRequest",
        version: 4.4,
        position: [1040, 400],
        credentials: {n8nApi:{id:"pEFlr3bq58GqCev9",name:"n8n API"},httpHeaderAuth:{id:"cDmyhG9HxaTvTXFF",name:"Manager Lookup - Header Auth - Test"}}
    })
    GetApiManagerRequesteremail = {
        url: "=https://n8n-production-d20d.up.railway.app/webhook/7081a664-df62-434b-82b5-6d774194327d/api/manager/{{ $('Normalization').item.json.body.requesterEmail }}",
        authentication: "genericCredentialType",
        genericAuthType: "httpHeaderAuth",
        options: {}
    };


    // =====================================================================
// ROUTAGE ET CONNEXIONS
// =====================================================================

    @links()
    defineRouting() {
        this.SubmitWebhook.out(0).to(this.Normalization.in(0));
        this.ApprovalWebhook.out(0).to(this.Normalization1.in(0));
        this.NotifyDenied.out(0).to(this._31Evaluation.in(0));
        this.DenyWebhook.out(0).to(this.Normalization2.in(0));
        this.Switch_.out(0).to(this.JedeServices.in(0));
        this.Switch_.out(1).to(this.Github.in(0));
        this.Switch_.out(2).to(this.EditFields.in(0));
        this.NotifyApproved.out(0).to(this._21Evaluation.in(0));
        this.UpdateApproved.out(0).to(this.ApplyObserver.in(0));
        this.UpdateApproved.out(0).to(this._21Idempotenz.in(0));
        this.LoopOverItems.out(1).to(this.HttpRequest.in(0));
        this.GetRowS.out(0).to(this.LoopOverItems.in(0));
        this.HttpRequest.out(0).to(this.LoopOverItems.in(0));
        this.LoopOverItems1.out(1).to(this.HttpRequest1.in(0));
        this.GetRowS1.out(0).to(this.LoopOverItems1.in(0));
        this.HttpRequest1.out(0).to(this.LoopOverItems1.in(0));
        this.Provisioning.out(0).to(this.NotifyApproved.in(0));
        this.Github.out(0).to(this.Provisioning.in(0));
        this.Normalization.out(0).to(this.LookupAnfrage.in(0));
        this.Normalization2.out(0).to(this.UpdateDenied.in(0));
        this.UpdateDenied.out(0).to(this.DenyObserver.in(0));
        this.UpdateDenied.out(0).to(this._31Idempotenz.in(0));
        this.Normalization1.out(0).to(this.UpdateApproved.in(0));
        this.Evaluation.out(0).to(this.Evaluation2.in(0));
        this.Evaluation1.out(0).to(this.Evaluation4.in(0));
        this.Evaluation8.out(0).to(this.Evaluation6.in(0));
        this.Evaluation9.out(0).to(this.Evaluation11.in(0));
        this.Evaluation9.out(1).to(this.StopAndError1.in(0));
        this.Evaluation11.out(0).to(this.Evaluation10.in(0));
        this.EditFields.out(0).to(this.Evaluation9.in(0));
        this.Manual.out(0).to(this.Normalization3.in(0));
        this.Evals1.out(0).to(this.Normalization1.in(0));
        this.ZendeskTrigger.out(0).to(this.Normalization.in(0));
        this.EmailManager.out(0).to(this._11Evaluation.in(0));
        this.JedeService.out(0).to(this._11Evaluation.in(0));
        this.JedeServices.out(0).to(this.Provisioning.in(0));
        this._21Idempotenz.out(0).to(this.WhRespond1.in(0));
        this._21Idempotenz.out(1).to(this.Wh21Idempotenz.in(0));
        this._31Idempotenz.out(0).to(this.WhRespond.in(0));
        this._31Idempotenz.out(1).to(this._31Evaluation.in(0));
        this._31Idempotenz.out(1).to(this.Wh31Idempotenz.in(0));
        this._11Idempotenz.out(0).to(this.GetApiManagerRequesteremail.in(0));
        this._11Idempotenz.out(0).to(this.ManagerExistiert.in(0));
        this._11Idempotenz.out(0).to(this.Observer.in(0));
        this.WhRespond.out(0).to(this.NotifyDenied.in(0));
        this.WhRespond1.out(0).to(this.Switch_.in(0));
        this.InsertAnfrage.out(0).to(this.EmailAnfragenden.in(0));
        this.InsertAnfrage.out(0).to(this.EmailManager.in(0));
        this.InsertAnfrage.out(0).to(this.JedeService.in(0));
        this.LookupAnfrage.out(0).to(this._11Idempotenz.in(0));
        this.ManagerExistiert.out(0).to(this.InsertAnfrage.in(0));
        this.ManagerExistiert.out(1).to(this.AusnahmeWerfen.in(0));
        this.EmailAnfragenden.out(0).to(this._11Evaluation.in(0));
        this._11Evaluation.out(0).to(this.Evaluation.in(0));
        this._21Evaluation.out(0).to(this.Evaluation1.in(0));
        this._31Evaluation.out(0).to(this.Evaluation8.in(0));
        this.Normalization3.out(0).to(this.HttpRequest2.in(0));
        this.GetApiManagerRequesteremail.out(0).to(this.ManagerExistiert.in(0));
        this.GetApiManagerRequesteremail.out(0).to(this.Observer.in(0));
    }
}