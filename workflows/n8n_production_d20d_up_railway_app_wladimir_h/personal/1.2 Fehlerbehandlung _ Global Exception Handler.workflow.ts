import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : 1.2 Fehlerbehandlung / Global Exception Handler
// Nodes   : 5  |  Connections: 4
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// UpdateStatusFailed                 dataTable                  [alwaysOutput] [retry]
// NotifyCoe                          gmail                      [creds]
// FehlerAnfangen                     errorTrigger               
// GetWorkflowDaten                   httpRequest                [creds] [retry]
// SchribeAnfrageId                   set                        
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// FehlerAnfangen
//    → GetWorkflowDaten
//      → SchribeAnfrageId
//        → UpdateStatusFailed
//        → NotifyCoe
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: "BzPEgYmv3SgFQKjs",
    name: "1.2 Fehlerbehandlung / Global Exception Handler",
    active: true,
    isArchived: false,
    projectId: "K9RtK3l6tnJjGFXx",
    settings: { executionOrder: "v1", binaryMode: "separate" }
})
export class _12FehlerbehandlungGlobalExceptionHandlerWorkflow {

    // =====================================================================
// CONFIGURATION DES NOEUDS
// =====================================================================

    @node({
        id: "db1a2985-06e6-44d7-8a9f-dc99833d2e0b",
        name: "Update Status Failed",
        type: "n8n-nodes-base.dataTable",
        version: 1.1,
        position: [720, -80],
        alwaysOutputData: true,
        retryOnFail: true
    })
    UpdateStatusFailed = {
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
                    keyValue: "={{ $json.requestId }}"
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
                provisioningStatus: "failed"
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
        id: "06e5cc65-1a38-4c9a-9524-afd446691312",
        webhookId: "2f4536e1-ab6f-44e7-893c-40ecaf397b6c",
        name: "Notify CoE",
        type: "n8n-nodes-base.gmail",
        version: 2.2,
        position: [720, 112],
        credentials: {gmailOAuth2:{id:"dLNo56TvT6swSEko",name:"Gmail account"}}
    })
    NotifyCoe = {
        sendTo: "=am_us_733289_1771700024721@agentmail.to",
        subject: "={{ $('Schribe Anfrage ID').item.json.requestId }} - Error",
        emailType: "text",
        message: `={{ $('Fehler Anfangen').item.json.execution.error.tags }}

wokrkflow: {{ $('Fehler Anfangen').item.json.execution.executionContext.triggerNode.name }},
id: {{ $('Fehler Anfangen').item.json.execution.id }},
url: {{ $('Fehler Anfangen').item.json.execution.url }},
node: {{ $('Fehler Anfangen').item.json.execution.lastNodeExecuted }},
errorMsg: {{ $('Fehler Anfangen').item.json.execution.error.stack }}`,
        options: {
            appendAttribution: false
        }
    };

    @node({
        id: "52850041-aa37-49c7-9e71-31e59e92f587",
        name: "Fehler Anfangen",
        type: "n8n-nodes-base.errorTrigger",
        version: 1,
        position: [224, 16]
    })
    FehlerAnfangen = {};

    @node({
        id: "2f33256a-60dc-4668-b36e-0beb2646fcb4",
        name: "GET Workflow Daten",
        type: "n8n-nodes-base.httpRequest",
        version: 4.4,
        position: [384, 16],
        credentials: {httpBearerAuth:{id:"ul0wmp0mBdKUl3YR",name:"n8n Bearer Auth account"},n8nApi:{id:"pEFlr3bq58GqCev9",name:"n8n API"}},
        retryOnFail: true
    })
    GetWorkflowDaten = {
        url: "=https://n8n-production-d20d.up.railway.app/api/v1/executions/{{ $json.execution.id + \"?includeData=true\"}}",
        authentication: "predefinedCredentialType",
        nodeCredentialType: "n8nApi",
        options: {}
    };

    @node({
        id: "08c36557-379b-47c2-b9ec-31f57fc9e09f",
        name: "Schribe Anfrage ID",
        type: "n8n-nodes-base.set",
        version: 3.4,
        position: [544, 16]
    })
    SchribeAnfrageId = {
        assignments: {
            assignments: [
                {
                    id: "b77faf47-edcb-474e-bba9-67e6750e5598",
                    name: "requestId",
                    value: "={{ $json.data.resultData.runData.Normalization1[0].data.main[0][0].json.body.requestId }}",
                    type: "string"
                }
            ]
        },
        options: {}
    };


    // =====================================================================
// ROUTAGE ET CONNEXIONS
// =====================================================================

    @links()
    defineRouting() {
        this.FehlerAnfangen.out(0).to(this.GetWorkflowDaten.in(0));
        this.GetWorkflowDaten.out(0).to(this.SchribeAnfrageId.in(0));
        this.SchribeAnfrageId.out(0).to(this.UpdateStatusFailed.in(0));
        this.SchribeAnfrageId.out(0).to(this.NotifyCoe.in(0));
    }
}