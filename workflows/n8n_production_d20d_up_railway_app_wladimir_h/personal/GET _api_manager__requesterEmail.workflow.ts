import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : GET /api/manager/:requesterEmail
// Nodes   : 3  |  Connections: 2
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// Webhook                            webhook                    [creds]
// LookupManager                      dataTable                  [alwaysOutput] [retry]
// RespondToWebhook                   respondToWebhook           
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// Webhook
//    → LookupManager
//      → RespondToWebhook
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: "6dTN9NnSffcSmY0u",
    name: "GET /api/manager/:requesterEmail",
    active: true,
    isArchived: false,
    projectId: "K9RtK3l6tnJjGFXx",
    settings: { executionOrder: "v1", binaryMode: "separate" }
})
export class GetApiManagerRequesteremailWorkflow {

    // =====================================================================
// CONFIGURATION DES NOEUDS
// =====================================================================

    @node({
        id: "a5cfd704-afa3-418b-b641-cee50d8a87d2",
        webhookId: "7081a664-df62-434b-82b5-6d774194327d",
        name: "Webhook",
        type: "n8n-nodes-base.webhook",
        version: 2.1,
        position: [0, 0],
        credentials: {httpHeaderAuth:{id:"cDmyhG9HxaTvTXFF",name:"Manager Lookup - Header Auth - Test"}}
    })
    Webhook = {
        path: "api/manager/:requesterEmail",
        authentication: "headerAuth",
        responseMode: "responseNode",
        options: {}
    };

    @node({
        id: "324be4d7-f02b-4bf7-9b52-c9a555c64cfa",
        name: "Lookup-Manager",
        type: "n8n-nodes-base.dataTable",
        version: 1.1,
        position: [192, 0],
        alwaysOutputData: true,
        retryOnFail: true
    })
    LookupManager = {
        operation: "get",
        dataTableId: {
            __rl: true,
            value: "bcgytuA7wOiRSFiq",
            mode: "list",
            cachedResultName: "managers",
            cachedResultUrl: "/projects/K9RtK3l6tnJjGFXx/datatables/bcgytuA7wOiRSFiq"
        },
        filters: {
            conditions: [
                {
                    keyName: "employeeEmail",
                    keyValue: "={{ $json.params.requesterEmail }}"
                }
            ]
        },
        limit: 1
    };

    @node({
        id: "a3a3e306-c33e-4979-9b8d-77748ae5f86f",
        name: "Respond to Webhook",
        type: "n8n-nodes-base.respondToWebhook",
        version: 1.5,
        position: [384, 0]
    })
    RespondToWebhook = {
        options: {
            responseCode: 200,
            responseHeaders: {
                entries: [
                    {
                        name: "managerEmail",
                        value: "={{ $json.managerEmail }}"
                    }
                ]
            }
        }
    };


    // =====================================================================
// ROUTAGE ET CONNEXIONS
// =====================================================================

    @links()
    defineRouting() {
        this.Webhook.out(0).to(this.LookupManager.in(0));
        this.LookupManager.out(0).to(this.RespondToWebhook.in(0));
    }
}