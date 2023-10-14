const workflowRun = {
    "id": "651e4789ab1cb56bc8976ae4",
    "creationDate": "2023-10-05T05:20:08.956+00:00",
    "status": "succeeded",
    "phase": "finalized",
    "startTime": "2023-10-05T05:20:09.648+00:00",
    "duration": 8336,
    "workflowRef": "651b91a77fbb1a64ab8b7154",
    "workflowRevisionRef": "651cffa3e99fd73f5122879d",
    "labels": {},
    "annotations": {
        "boomerang.io/task-deletion": "Never",
        "boomerang.io/task-default-image": "boomerangio/worker-flow:2.11.15",
        "boomerang.io/context-params": {
            "workflow-id": "651b91a77fbb1a64ab8b7154",
            "taskrun-id": "",
            "wfe-url": "localhost:7700/api/v2/wfe",
            "event-url": "localhost:7700/api/v2/event",
            "taskrun-name": "",
            "taskrun-type": "",
            "workflow-name": "",
            "webhook-url": "localhost:7700/api/v2/webhook",
            "workflow-version": "",
            "workflowrun-initiator": "",
            "workflowrun-id": "651e4789ab1cb56bc8976ae4",
            "workflowrun-trigger": "manual"
        },
        "boomerang.io/team-name": "Team",
        "boomerang.io/kind": "WorkflowRun",
        "boomerang.io/team-params": {
            "echo-parameter": "test"
        },
        "boomerang.io/global-params": {},
        "boomerang.io/generation": "4"
    },
    "params": [
        {
            "name": "echo-team-parameter",
            "value": "test"
        }
    ],
    "trigger": "manual",
    "results": [],
    "workspaces": [],
    "workflowName": "Parameter Resolution Check",
    "awaitingApproval": false
};

export default workflowRun;