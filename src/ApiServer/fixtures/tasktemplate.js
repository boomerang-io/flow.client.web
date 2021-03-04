export default [
  {
  "id": "5d25414c988e7b6b6fb3d5f7",
  "description": "Find Public Repositories in Org.",
  "lastModified": "2020-04-30T22:51:00.560+00:00",
  "name": "Find Public Repositories in Org",
  "category": "GitHub",
  "revisions": [
  {
  "version": 1,
  "image": "",
  "command": "",
  "arguments": [
  "github",
  "findPublicReposInOrg"
  ],
  "config": [
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "url",
  "label": "URL",
  "type": "text"
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "token",
  "label": "Token",
  "type": "password"
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "org",
  "label": "Org",
  "type": "text"
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "Newline delimited list",
  "key": "skipRepos",
  "label": "Repositories to Skip",
  "type": "textarea"
  }
  ],
  "changelog": {
  "userId": "5e8a6c6cd0827100011c2a35",
  "reason": "",
  "date": "2020-04-30T22:51:00.560+00:00",
  "userName": null
  }
  }
  ],
  "status": "active",
  "createdDate": "2020-01-09T00:01:00.000+00:00",
  "icon": "API/HTTP call",
  "verified": true,
  "enableLifecycle": false,
  "currentVersion": 1,
  "nodeType": "templateTask"
  },
  {
  "id": "5c3d0401352b1b514150545b",
  "description": "Execute a HTTP Call",
  "lastModified": "2021-02-05T22:35:45.254+00:00",
  "name": "Execute HTTP Call",
  "category": "utilities",
  "revisions": [
  {
  "version": 1,
  "image": "",
  "command": "",
  "arguments": [
  "http",
  "execute"
  ],
  "config": [
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "url",
  "label": "URL",
  "type": "url"
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "method",
  "label": "Method",
  "type": "select",
  "options": [
  {
  "key": "GET",
  "value": "GET"
  },
  {
  "key": "HEAD",
  "value": "HEAD"
  },
  {
  "key": "PUT",
  "value": "PUT"
  },
  {
  "key": "POST",
  "value": "POST"
  },
  {
  "key": "PATCH",
  "value": "PATCH"
  },
  {
  "key": "OPTIONS",
  "value": "OPTIONS"
  },
  {
  "key": "DELETE",
  "value": "DELETE"
  }
  ]
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "header",
  "label": "Headers",
  "type": "textarea"
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "contentType",
  "label": "Content Type",
  "type": "text"
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "body",
  "label": "Body",
  "type": "texteditor"
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "allowUntrustedCerts",
  "label": "Allow Untrusted SSL Certs",
  "type": "boolean"
  }
  ],
  "changelog": {
  "userId": "5e831153d0827100011c29f6",
  "reason": "",
  "date": "2020-04-30T22:48:55.795+00:00",
  "userName": null
  }
  },
  {
  "version": 2,
  "image": "tools.boomerangplatform.net:8500/ise/bmrg-worker-flow:2.0.1",
  "command": "",
  "arguments": [
  "http",
  "execute"
  ],
  "config": [
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "url",
  "label": "URL",
  "type": "url"
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "method",
  "label": "Method",
  "type": "select",
  "options": [
  {
  "key": "GET",
  "value": "GET"
  },
  {
  "key": "HEAD",
  "value": "HEAD"
  },
  {
  "key": "PUT",
  "value": "PUT"
  },
  {
  "key": "POST",
  "value": "POST"
  },
  {
  "key": "PATCH",
  "value": "PATCH"
  },
  {
  "key": "OPTIONS",
  "value": "OPTIONS"
  },
  {
  "key": "DELETE",
  "value": "DELETE"
  }
  ]
  },
  {
  "required": false,
  "placeholder": "",
  "defaultValue": "",
  "readOnly": false,
  "description": "Start a new line for each header",
  "key": "header",
  "label": "Headers",
  "type": "textarea",
  "helperText": "Headers to add to the request, such as Authorization"
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "contentType",
  "label": "Content Type",
  "type": "text"
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "body",
  "label": "Body",
  "type": "texteditor"
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "allowUntrustedCerts",
  "label": "Allow Untrusted SSL Certs",
  "type": "boolean"
  }
  ],
  "changelog": {
  "userId": "59aebd0b7424530fce952fdc",
  "reason": "Point to image 2.0.1.  Added helper text for Headers field",
  "date": "2020-05-15T16:59:20.522+00:00",
  "userName": null
  }
  },
  {
  "version": 3,
  "image": "",
  "command": "",
  "arguments": [
  "http",
  "execute"
  ],
  "config": [
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "url",
  "label": "URL",
  "type": "url"
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "method",
  "label": "Method",
  "type": "select",
  "options": [
  {
  "key": "GET",
  "value": "GET"
  },
  {
  "key": "HEAD",
  "value": "HEAD"
  },
  {
  "key": "PUT",
  "value": "PUT"
  },
  {
  "key": "POST",
  "value": "POST"
  },
  {
  "key": "PATCH",
  "value": "PATCH"
  },
  {
  "key": "OPTIONS",
  "value": "OPTIONS"
  },
  {
  "key": "DELETE",
  "value": "DELETE"
  }
  ]
  },
  {
  "required": false,
  "placeholder": "",
  "defaultValue": "",
  "readOnly": false,
  "description": "Start a new line for each header",
  "key": "header",
  "label": "Headers",
  "type": "textarea",
  "helperText": "Headers to add to the request, such as Authorization"
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "contentType",
  "label": "Content Type",
  "type": "text"
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "body",
  "label": "Body",
  "type": "texteditor"
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "allowUntrustedCerts",
  "label": "Allow Untrusted SSL Certs",
  "type": "boolean"
  }
  ],
  "changelog": {
  "userId": "5e7417fb2e0ee000015ca6ad",
  "reason": "remove default image",
  "date": "2021-02-05T22:35:45.254+00:00",
  "userName": "Benjamin Ruby"
  }
  }
  ],
  "status": "active",
  "createdDate": "2020-01-09T00:01:00.000+00:00",
  "icon": "API/HTTP call",
  "verified": true,
  "enableLifecycle": false,
  "currentVersion": 3,
  "nodeType": "templateTask"
  },
  {
  "id": "5c3fbc92352b1b51416952d1",
  "description": "Check file or folder exists and fail if not found.",
  "lastModified": "2020-04-30T22:49:27.576+00:00",
  "name": "Check File or Folder Exists",
  "category": "file utilities",
  "revisions": [
  {
  "version": 1,
  "image": "",
  "command": "",
  "arguments": [
  "file",
  "checkFileOrFolderExists"
  ],
  "config": [
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "path",
  "label": "Path",
  "type": "text"
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "expression",
  "label": "Regular Expression",
  "type": "text"
  }
  ],
  "changelog": {
  "userId": "5e831153d0827100011c29f6",
  "reason": "",
  "date": "2020-04-30T22:49:27.576+00:00",
  "userName": null
  }
  }
  ],
  "status": "active",
  "createdDate": "2020-01-09T00:01:00.000+00:00",
  "icon": "Search",
  "verified": true,
  "enableLifecycle": false,
  "currentVersion": 1,
  "nodeType": "templateTask"
  },
  {
  "id": "5eab5488aecb0800014e0b87",
  "description": "Takes the first value returned by a valid JSONPath expression and sets as an output property",
  "lastModified": "2020-04-30T22:50:06.300+00:00",
  "name": "Json Path To Property",
  "category": "Utilities",
  "revisions": [
  {
  "version": 1,
  "image": "tools.boomerangplatform.net:8500/ise/bmrg-worker-flow:2.0.0",
  "command": "",
  "arguments": [
  "system",
  "jsonPathToProperty"
  ],
  "config": [],
  "changelog": {
  "userId": "5e831153d0827100011c29f6",
  "reason": "",
  "date": "2020-04-30T22:43:20.545+00:00",
  "userName": null
  }
  },
  {
  "version": 2,
  "image": "",
  "command": "",
  "arguments": [
  "system",
  "jsonPathToProperty"
  ],
  "config": [
  {
  "required": false,
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "json",
  "label": "Json",
  "type": "textarea",
  "helperText": "Json object to query"
  },
  {
  "required": false,
  "placeholder": "e.g. $.store.book",
  "readOnly": false,
  "description": "",
  "key": "query",
  "label": "Query Expression",
  "type": "text",
  "helperText": "A valid JSON path expression"
  },
  {
  "required": false,
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "propertyKey",
  "label": "Output Property Key",
  "type": "text",
  "helperText": "The name of the output property"
  }
  ],
  "changelog": {
  "userId": "5e831153d0827100011c29f6",
  "reason": "",
  "date": "2020-04-30T22:50:06.300+00:00",
  "userName": null
  }
  }
  ],
  "status": "active",
  "createdDate": "2020-04-30T22:43:20.543+00:00",
  "icon": "Filter",
  "verified": true,
  "enableLifecycle": false,
  "currentVersion": 2,
  "nodeType": "templateTask"
  },
  {
  "id": "5d3145ee988e7b6b6f24d870",
  "description": "Make Repositories Private.",
  "lastModified": "2020-04-30T22:50:28.351+00:00",
  "name": "Make Repositories Private",
  "category": "GitHub",
  "revisions": [
  {
  "version": 1,
  "image": "",
  "command": "",
  "arguments": [
  "github",
  "makeReposInOrgPrivate"
  ],
  "config": [
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "url",
  "label": "URL",
  "type": "text"
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "token",
  "label": "Token",
  "type": "password"
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "org",
  "label": "Org",
  "type": "text"
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "New line delimited list.",
  "key": "repos",
  "label": "Repositories",
  "type": "textarea"
  }
  ],
  "changelog": {
  "userId": "5e8a6c6cd0827100011c2a35",
  "reason": "",
  "date": "2020-04-30T22:50:28.351+00:00",
  "userName": null
  }
  }
  ],
  "status": "active",
  "createdDate": "2020-01-09T00:01:00.000+00:00",
  "icon": "Automated task",
  "verified": true,
  "enableLifecycle": false,
  "currentVersion": 1,
  "nodeType": "templateTask"
  },
  {
  "id": "5c69365b20cfafa2eaeed89c",
  "description": "Get Incidents from ServiceNow with optional State",
  "lastModified": "2020-04-30T22:54:03.745+00:00",
  "name": "Get Incidents",
  "category": "ServiceNow",
  "revisions": [
  {
  "version": 1,
  "image": "",
  "command": "",
  "arguments": [
  "servicenow",
  "getIncidents"
  ],
  "config": [
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "instance",
  "label": "Instance ID",
  "type": "text"
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "username",
  "label": "Username",
  "type": "text"
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "password",
  "label": "Password",
  "type": "password"
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "state",
  "label": "Incident State",
  "type": "select",
  "options": [
  {
  "key": "New",
  "value": "New"
  },
  {
  "key": "In Progress",
  "value": "In Progress"
  },
  {
  "key": "On Hold",
  "value": "On Hold"
  },
  {
  "key": "Resolved",
  "value": "Resolved"
  },
  {
  "key": "Closed",
  "value": "Closed"
  },
  {
  "key": "Canceled",
  "value": "Canceled"
  }
  ]
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "tag",
  "label": "Tag or Label",
  "type": "text"
  }
  ],
  "changelog": {
  "userId": "5e8a6c6cd0827100011c2a35",
  "reason": "",
  "date": "2020-04-30T22:54:03.745+00:00",
  "userName": null
  }
  }
  ],
  "status": "active",
  "createdDate": "2020-01-09T00:01:00.000+00:00",
  "icon": "API/HTTP call",
  "verified": true,
  "enableLifecycle": false,
  "currentVersion": 1,
  "nodeType": "templateTask"
  },
  {
  "id": "5c37af285616d5f3544568fd",
  "description": "Use this step to create decision branches in the workflow based on the value of a property or path.",
  "lastModified": "2020-04-30T22:53:23.337+00:00",
  "name": "Switch",
  "category": "workflow",
  "revisions": [
  {
  "version": 1,
  "image": "",
  "command": "",
  "arguments": [
  "switch"
  ],
  "config": [
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "value",
  "label": "Value",
  "type": "text"
  }
  ],
  "changelog": {
  "userId": "5e8a6c6cd0827100011c2a35",
  "reason": "",
  "date": "2020-04-30T22:53:23.337+00:00",
  "userName": null
  }
  }
  ],
  "status": "active",
  "createdDate": "2020-01-09T00:01:00.000+00:00",
  "icon": "Switch",
  "verified": true,
  "enableLifecycle": false,
  "currentVersion": 1,
  "nodeType": "decision"
  },
  {
  "id": "5d1ed216988e7b6b6f7b3c1c",
  "description": "Check file contains string.",
  "lastModified": "2020-04-30T22:51:20.843+00:00",
  "name": "Check File Contains String",
  "category": "file utilities",
  "revisions": [
  {
  "version": 1,
  "image": "",
  "command": "",
  "arguments": [
  "file",
  "checkFileContainsString"
  ],
  "config": [
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "path",
  "label": "Path",
  "type": "text"
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "expression",
  "label": "Regular Expression",
  "type": "text"
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "flags",
  "label": "Flags",
  "type": "text"
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "failIfNotFound",
  "label": "Fail If Not Found",
  "type": "boolean"
  }
  ],
  "changelog": {
  "userId": "5e831153d0827100011c29f6",
  "reason": "",
  "date": "2020-04-30T22:51:20.843+00:00",
  "userName": null
  }
  }
  ],
  "status": "active",
  "createdDate": "2020-01-09T00:01:00.000+00:00",
  "icon": "Search",
  "verified": true,
  "enableLifecycle": false,
  "currentVersion": 1,
  "nodeType": "templateTask"
  },
  {
  "id": "5c3907a1352b1b51412ed079",
  "description": "Execute a shell script",
  "lastModified": "2020-08-25T15:04:10.173+00:00",
  "name": "Execute Shell",
  "category": "utilities",
  "revisions": [
  {
  "version": 1,
  "image": "",
  "command": "",
  "arguments": [
  "shell",
  "execute"
  ],
  "config": [
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "path",
  "label": "Directory Path",
  "type": "text"
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "shell",
  "label": "Shell Interpreter",
  "type": "text"
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "script",
  "label": "Shell Script",
  "type": "texteditor::shell"
  }
  ],
  "changelog": {
  "userId": "5e831153d0827100011c29f6",
  "reason": "",
  "date": "2020-04-30T22:48:44.591+00:00",
  "userName": null
  }
  },
  {
  "version": 2,
  "image": "",
  "command": "",
  "arguments": [
  "shell",
  "execute"
  ],
  "config": [
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "path",
  "label": "Directory Path",
  "type": "text"
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "shell",
  "label": "Shell Interpreter",
  "type": "text"
  },
  {
  "required": true,
  "placeholder": "",
  "defaultValue": "",
  "readOnly": false,
  "description": "",
  "key": "script",
  "label": "Shell Script",
  "type": "texteditor::shell",
  "helperText": ""
  }
  ],
  "changelog": {
  "userId": "5ecd2d1d0eb5f000012d0895",
  "reason": "-made the shell script field required (bumping up the version to be level with what we have in stage)",
  "date": "2020-08-25T15:04:10.173+00:00",
  "userName": "Benjamin Ruby"
  }
  }
  ],
  "status": "active",
  "createdDate": "2020-01-09T00:01:00.000+00:00",
  "icon": "Terminal",
  "verified": true,
  "enableLifecycle": false,
  "currentVersion": 2,
  "nodeType": "templateTask"
  },
  {
  "id": "5c6939c620cfafa2eaeef2ad",
  "description": "Update Incidents from ServiceNow",
  "lastModified": "2020-04-30T22:52:40.641+00:00",
  "name": "Update Incidents",
  "category": "ServiceNow",
  "revisions": [
  {
  "version": 1,
  "image": "",
  "command": "",
  "arguments": [
  "servicenow",
  "updateIncidents"
  ],
  "config": [
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "instance",
  "label": "Instance ID",
  "type": "text"
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "username",
  "label": "Username",
  "type": "text"
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "password",
  "label": "Password",
  "type": "password"
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "state",
  "label": "Incident State",
  "type": "select",
  "options": [
  {
  "key": "New",
  "value": "New"
  },
  {
  "key": "In Progress",
  "value": "In Progress"
  },
  {
  "key": "On Hold",
  "value": "On Hold"
  },
  {
  "key": "Resolved",
  "value": "Resolved"
  },
  {
  "key": "Closed",
  "value": "Closed"
  },
  {
  "key": "Canceled",
  "value": "Canceled"
  }
  ]
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "incidents",
  "label": "Incidents List",
  "type": "textarea"
  }
  ],
  "changelog": {
  "userId": "5e8a6c6cd0827100011c2a35",
  "reason": "",
  "date": "2020-04-30T22:52:40.641+00:00",
  "userName": null
  }
  }
  ],
  "status": "active",
  "createdDate": "2020-01-09T00:01:00.000+00:00",
  "icon": "Automated task",
  "verified": true,
  "enableLifecycle": false,
  "currentVersion": 1,
  "nodeType": "templateTask"
  },
  {
  "id": "5bd9d0825a5df954ad5bb5c3",
  "description": "Upload file to Artifactory",
  "lastModified": "2020-08-20T13:21:01.778+00:00",
  "name": "Artifactory File Upload",
  "category": "artifactory",
  "revisions": [
  {
  "version": 1,
  "image": "",
  "command": "",
  "arguments": [
  "artifactory",
  "uploadFile"
  ],
  "config": [
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "url",
  "label": "URL",
  "type": "text"
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "file",
  "label": "File",
  "type": "text"
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "username",
  "label": "Username",
  "type": "text"
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "password",
  "label": "Password",
  "type": "password"
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "apiKey",
  "label": "API Key",
  "type": "password"
  }
  ],
  "changelog": {
  "userId": "5e8a6c6cd0827100011c2a35",
  "reason": "",
  "date": "2020-04-30T22:52:58.798+00:00",
  "userName": null
  }
  },
  {
  "version": 2,
  "image": "",
  "command": "",
  "arguments": [
  "artifactory",
  "uploadFile"
  ],
  "config": [
  {
  "required": false,
  "placeholder": "artifactory.url/folder/test.txt",
  "defaultValue": "",
  "readOnly": false,
  "description": "",
  "key": "url",
  "label": "URL",
  "type": "text",
  "helperText": "File will be uploaded at the specified path. Include file name"
  },
  {
  "required": false,
  "placeholder": "/data/test.txt",
  "defaultValue": "",
  "readOnly": false,
  "description": "",
  "key": "file",
  "label": "File",
  "type": "text",
  "helperText": "Specify the desired file in it's absolute path"
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "username",
  "label": "Username",
  "type": "text"
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "password",
  "label": "Password",
  "type": "password"
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "apiKey",
  "label": "API Key",
  "type": "password"
  }
  ],
  "changelog": {
  "userId": "5ecd2d1d0eb5f000012d0895",
  "reason": "remove image reference: tools.boomerangplatform.net:8500/ise/bmrg-worker-flow:2.0.2.rc-1\n-> change to point to default image ",
  "date": "2020-08-20T13:21:01.778+00:00",
  "userName": "Benjamin Ruby"
  }
  }
  ],
  "status": "active",
  "createdDate": "2020-01-09T00:01:00.000+00:00",
  "icon": "Upload",
  "verified": true,
  "enableLifecycle": false,
  "currentVersion": 2,
  "nodeType": "templateTask"
  },
  {
  "id": "5bd97bea5a5df954ad592c06",
  "description": "Sleep for specified duration in milliseconds",
  "lastModified": "2020-04-30T22:49:34.122+00:00",
  "name": "Sleep",
  "category": "utilities",
  "revisions": [
  {
  "version": 1,
  "image": "",
  "command": "",
  "arguments": [
  "system",
  "sleep"
  ],
  "config": [
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "duration",
  "label": "Duration",
  "type": "password"
  }
  ],
  "changelog": {
  "userId": "5e8a6c6cd0827100011c2a35",
  "reason": "",
  "date": "2020-04-30T22:49:34.122+00:00",
  "userName": null
  }
  }
  ],
  "status": "active",
  "createdDate": "2020-01-09T00:01:00.000+00:00",
  "icon": "Power on/off",
  "verified": true,
  "enableLifecycle": false,
  "currentVersion": 1,
  "nodeType": "templateTask"
  },
  {
  "id": "5d1ed36a988e7b6b6f7b470b",
  "description": "Replace String in File.",
  "lastModified": "2020-04-30T22:51:10.757+00:00",
  "name": "Replace String in File",
  "category": "file utilities",
  "revisions": [
  {
  "version": 1,
  "image": "",
  "command": "",
  "arguments": [
  "file",
  "replaceStringInFile"
  ],
  "config": [
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "path",
  "label": "Path",
  "type": "text"
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "expression",
  "label": "Regular Expression",
  "type": "text"
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "replaceString",
  "label": "Replacement String",
  "type": "text"
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "flags",
  "label": "Flags",
  "type": "text"
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "failIfNotFound",
  "label": "Fail If Not Found",
  "type": "boolean"
  }
  ],
  "changelog": {
  "userId": "5e831153d0827100011c29f6",
  "reason": "",
  "date": "2020-04-30T22:51:10.757+00:00",
  "userName": null
  }
  }
  ],
  "status": "active",
  "createdDate": "2020-01-09T00:01:00.000+00:00",
  "icon": "Edit",
  "verified": true,
  "enableLifecycle": false,
  "currentVersion": 1,
  "nodeType": "templateTask"
  },
  {
  "id": "5eab5742aecb0800014e0c87",
  "description": "Finds github issues and removes with optional days since activity and labels",
  "lastModified": "2020-04-30T23:03:49.743+00:00",
  "name": "Find Issues and Remove",
  "category": "Github",
  "revisions": [
  {
  "version": 1,
  "image": null,
  "command": "",
  "arguments": [
  "github",
  "findIssuesInOrgAndRemove"
  ],
  "config": [],
  "changelog": {
  "userId": "5e831153d0827100011c29f6",
  "reason": "",
  "date": "2020-04-30T22:54:58.471+00:00",
  "userName": null
  }
  },
  {
  "version": 2,
  "image": null,
  "command": "",
  "arguments": [
  "github",
  "findIssuesInOrgAndRemove"
  ],
  "config": [
  {
  "required": false,
  "placeholder": "e.g. https://github.com/api/v3",
  "readOnly": false,
  "description": "",
  "key": "url",
  "label": "API Endpoint",
  "type": "url",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "token",
  "label": "API Token",
  "type": "password",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "org",
  "label": "Owner",
  "type": "text",
  "helperText": "Owner or Organization"
  },
  {
  "required": false,
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "repo",
  "label": "Repository",
  "type": "text",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "daysSinceActivity",
  "label": "Days Since Activity",
  "type": "number",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "e.g. stale",
  "readOnly": false,
  "description": "",
  "key": "label",
  "label": "Issue Label",
  "type": "text",
  "helperText": "A label to filter the issues by"
  }
  ],
  "changelog": {
  "userId": "5e831153d0827100011c29f6",
  "reason": "Initial version of the task",
  "date": "2020-04-30T23:03:49.743+00:00",
  "userName": null
  }
  }
  ],
  "status": "active",
  "createdDate": "2020-04-30T22:54:58.469+00:00",
  "icon": "Automated task",
  "verified": true,
  "enableLifecycle": false,
  "currentVersion": 2,
  "nodeType": "templateTask"
  },
  {
  "id": "5bd9b4115a5df954ad5ad8db",
  "description": "Artifactory File Download",
  "lastModified": "2020-04-30T22:52:47.846+00:00",
  "name": "Artifactory File Download",
  "category": "artifactory",
  "revisions": [
  {
  "version": 1,
  "image": "",
  "command": "",
  "arguments": [
  "artifactory",
  "downloadFile"
  ],
  "config": [
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "url",
  "label": "URL",
  "type": "text"
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "username",
  "label": "Username",
  "type": "text"
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "password",
  "label": "Password",
  "type": "password"
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "destinationPath",
  "label": "Destination Path",
  "type": "text"
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "apiKey",
  "label": "API Key",
  "type": "password"
  }
  ],
  "changelog": {
  "userId": "5e8a6c6cd0827100011c2a35",
  "reason": "",
  "date": "2020-04-30T22:52:47.846+00:00",
  "userName": null
  }
  }
  ],
  "status": "active",
  "createdDate": "2020-01-09T00:01:00.000+00:00",
  "icon": "Download",
  "verified": true,
  "enableLifecycle": false,
  "currentVersion": 1,
  "nodeType": "templateTask"
  },
  {
  "id": "5eab59eaaecb0800014e0ccb",
  "description": "Finds issues in a repository based on time since last activity and adds a label and a comment. This is useful for marking issues inactive or reminding users to update an issue.",
  "lastModified": "2020-08-25T15:01:51.006+00:00",
  "name": "Find Issues and Label",
  "category": "Github",
  "revisions": [
  {
  "version": 1,
  "image": null,
  "command": "",
  "arguments": [
  "github",
  "findInactiveIssuesInOrgAndLabel"
  ],
  "config": [],
  "changelog": {
  "userId": "5e831153d0827100011c29f6",
  "reason": "",
  "date": "2020-04-30T23:06:18.143+00:00",
  "userName": null
  }
  },
  {
  "version": 2,
  "image": null,
  "command": "",
  "arguments": [
  "github",
  "findInactiveIssuesInOrgAndLabel"
  ],
  "config": [
  {
  "required": false,
  "placeholder": "e.g. https://github.com/api/v3",
  "readOnly": false,
  "description": "",
  "key": "url",
  "label": "API Endpoint",
  "type": "url",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "token",
  "label": "API Token",
  "type": "password",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "org",
  "label": "Owner",
  "type": "text",
  "helperText": "Owner or Organization"
  },
  {
  "required": false,
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "repo",
  "label": "Repository",
  "type": "text",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "",
  "defaultValue": "30",
  "readOnly": false,
  "description": "",
  "key": "daysSinceActivity",
  "label": "Days Since Activity",
  "type": "number",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "label",
  "label": "Label",
  "type": "text",
  "helperText": "Label to add to issue"
  }
  ],
  "changelog": {
  "userId": "5e831153d0827100011c29f6",
  "reason": "Initial version of task",
  "date": "2020-04-30T23:09:38.470+00:00",
  "userName": null
  }
  },
  {
  "version": 3,
  "image": null,
  "command": "",
  "arguments": [
  "github",
  "findInactiveIssuesInOrgAndLabel"
  ],
  "config": [
  {
  "required": true,
  "placeholder": "e.g. https://github.com/api/v3",
  "defaultValue": "",
  "readOnly": false,
  "description": "",
  "key": "url",
  "label": "API Endpoint",
  "type": "url",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "token",
  "label": "API Token",
  "type": "password",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "org",
  "label": "Owner",
  "type": "text",
  "helperText": "Owner or Organization"
  },
  {
  "required": false,
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "repo",
  "label": "Repository",
  "type": "text",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "",
  "defaultValue": "30",
  "readOnly": false,
  "description": "",
  "key": "daysSinceActivity",
  "label": "Days Since Activity",
  "type": "number",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "label",
  "label": "Label",
  "type": "text",
  "helperText": "Label to add to issue"
  },
  {
  "required": false,
  "placeholder": "",
  "defaultValue": "ignore",
  "readOnly": false,
  "description": "",
  "key": "ignoreLabel",
  "label": "Ignore Label",
  "type": "text",
  "helperText": "Issues with this label will be ignored"
  }
  ],
  "changelog": {
  "userId": "5ecd2d1d0eb5f000012d0895",
  "reason": "Added an ignore label for issues that will not be returned in the search and therefore not labeled.\t(Copying Tyson's updated version from Live to get the rest of the envs level)",
  "date": "2020-08-25T15:01:51.006+00:00",
  "userName": "Benjamin Ruby"
  }
  }
  ],
  "status": "active",
  "createdDate": "2020-04-30T23:06:18.142+00:00",
  "icon": "Automated task",
  "verified": true,
  "enableLifecycle": false,
  "currentVersion": 3,
  "nodeType": "templateTask"
  },
  {
  "id": "5efa9c31aea46a0d823a67c4",
  "description": "Sends a text message using Twilio SMS",
  "lastModified": "2020-08-20T13:19:59.982+00:00",
  "name": "Send Twilio SMS",
  "category": "communication",
  "revisions": [
  {
  "version": 1,
  "image": null,
  "command": "",
  "arguments": [
  "twilio",
  "sendSMS"
  ],
  "config": [],
  "changelog": {
  "userId": "5e71f175756f7e000192eb6c",
  "reason": "",
  "date": "2020-06-30T01:58:09.299+00:00",
  "userName": "Tyson Lawrie"
  }
  },
  {
  "version": 2,
  "image": "",
  "command": "",
  "arguments": [
  "twilio",
  "sendSMS"
  ],
  "config": [
  {
  "required": true,
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "accountSid",
  "label": "Account Sid",
  "type": "text",
  "helperText": "Located on your Twilio project dashboard"
  },
  {
  "required": true,
  "placeholder": "",
  "defaultValue": "",
  "readOnly": false,
  "description": "",
  "key": "token",
  "label": "Auth Token",
  "type": "password",
  "helperText": "Located on your Twilio project dashboard"
  },
  {
  "required": true,
  "placeholder": "",
  "defaultValue": "",
  "readOnly": false,
  "description": "This will be one of your Twilio phone numbers",
  "key": "from",
  "label": "From",
  "type": "text",
  "helperText": "Must include + and a country code, e.g., +1"
  },
  {
  "required": false,
  "placeholder": "",
  "defaultValue": "",
  "readOnly": false,
  "description": "The mobile number for the message to go to",
  "key": "to",
  "label": "To",
  "type": "text",
  "helperText": "Must include + and a country code, e.g., +1"
  },
  {
  "required": true,
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "message",
  "label": "Message",
  "type": "textarea",
  "helperText": ""
  }
  ],
  "changelog": {
  "userId": "5ecd2d1d0eb5f000012d0895",
  "reason": "remove image: tools.boomerangplatform.net:8500/ise/bmrg-worker-flow:2.0.4 -> changed to pointing to the default image ",
  "date": "2020-08-20T13:19:59.982+00:00",
  "userName": "Benjamin Ruby"
  }
  }
  ],
  "status": "active",
  "createdDate": "2020-06-30T01:58:09.297+00:00",
  "icon": "Message",
  "verified": true,
  "enableLifecycle": false,
  "currentVersion": 2,
  "nodeType": "templateTask"
  },
  {
  "id": "5f59946b5683833cf0b13388",
  "description": "A task to clone git code",
  "lastModified": "2020-09-10T05:20:54.768+00:00",
  "name": "Clone Repository",
  "category": "Github",
  "revisions": [
  {
  "version": 1,
  "image": "tools.boomerangplatform.net:8500/ise/bmrg-worker-cicd-git:0.1.2",
  "command": "",
  "arguments": [
  "git",
  "clone"
  ],
  "config": [],
  "changelog": {
  "userId": "5e71f175756f7e000192eb6c",
  "reason": "",
  "date": "2020-09-10T05:20:54.768+00:00",
  "userName": "Tyson Lawrie"
  }
  }
  ],
  "status": "active",
  "createdDate": "2020-09-10T02:50:19.183+00:00",
  "icon": "Code",
  "verified": false,
  "enableLifecycle": false,
  "currentVersion": 1,
  "nodeType": "templateTask"
  },
  {
  "id": "5f6379c974f51934044cbbd6",
  "description": "Pauses workflow until approval is actioned.",
  "lastModified": "2020-04-30T22:53:23.337+00:00",
  "name": "Manual Approval",
  "category": "workflow",
  "revisions": [
  {
  "version": 1,
  "image": "",
  "command": "",
  "arguments": [
  "approval"
  ],
  "config": [],
  "changelog": {
  "userId": "5e8a6c6cd0827100011c2a35",
  "reason": "",
  "date": "2020-04-30T22:53:23.337+00:00",
  "userName": null
  }
  }
  ],
  "status": "active",
  "createdDate": "2020-01-09T00:01:00.000+00:00",
  "icon": "Edit",
  "verified": true,
  "enableLifecycle": false,
  "currentVersion": 1,
  "nodeType": "approval"
  },
  {
  "id": "5f7dcf1ce1d3ce8d52ea45d4",
  "description": "Wait for an event from an external system to resume workflow execution. The event can be a webhook or a Cloud Event.",
  "lastModified": "2020-04-30T22:51:53.014+00:00",
  "name": "Wait For Event",
  "category": "workflow",
  "revisions": [
  {
  "version": 1,
  "image": "",
  "command": null,
  "arguments": [],
  "config": [
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "topic",
  "label": "Topic",
  "type": "text"
  }
  ],
  "changelog": null
  }
  ],
  "status": "active",
  "createdDate": "2020-01-09T00:01:00.000+00:00",
  "icon": "Power on/off",
  "verified": true,
  "enableLifecycle": false,
  "currentVersion": 1,
  "nodeType": "eventwait"
  },
  {
  "id": "5d53016bd83be3cc84bae976",
  "description": "Send platform notification to user or team",
  "lastModified": "2020-10-13T16:49:43.255+00:00",
  "name": "Send Platform Notification",
  "category": "IBM Services Essentials",
  "revisions": [
  {
  "version": 1,
  "image": "",
  "command": "",
  "arguments": [
  "ibmessentials",
  "sendNotification"
  ],
  "config": [
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "type",
  "label": "Target",
  "type": "select",
  "options": [
  {
  "key": "user",
  "value": "user"
  },
  {
  "key": "group",
  "value": "group"
  }
  ]
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "target",
  "label": "User or Group",
  "type": "text"
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "title",
  "label": "Title",
  "type": "text"
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "message",
  "label": "Message",
  "type": "textarea"
  }
  ],
  "changelog": {
  "userId": "5ecd2d1d0eb5f000012d0895",
  "reason": "update arguments",
  "date": "2020-10-13T16:49:43.255+00:00",
  "userName": "Benjamin Ruby"
  }
  }
  ],
  "status": "active",
  "createdDate": "2020-01-09T00:01:00.000+00:00",
  "icon": "Message",
  "verified": true,
  "enableLifecycle": false,
  "currentVersion": 1,
  "nodeType": "templateTask"
  },
  {
  "id": "5bd98b105a5df954ad599bc2",
  "description": "Send Email to Member with Subject and Message",
  "lastModified": "2020-10-13T16:50:02.170+00:00",
  "name": "Send Platform Email",
  "category": "IBM Services Essentials",
  "revisions": [
  {
  "version": 1,
  "image": "",
  "command": "",
  "arguments": [
  "ibmessentials",
  "sendMailToMember"
  ],
  "config": [
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "to",
  "label": "To",
  "type": "text"
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "subject",
  "label": "Subject",
  "type": "text"
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "message",
  "label": "Message",
  "type": "textarea"
  }
  ],
  "changelog": {
  "userId": "5ecd2d1d0eb5f000012d0895",
  "reason": "update category name",
  "date": "2020-10-13T16:50:02.170+00:00",
  "userName": "Benjamin Ruby"
  }
  }
  ],
  "status": "active",
  "createdDate": "2020-01-09T00:01:00.000+00:00",
  "icon": "Message",
  "verified": true,
  "enableLifecycle": false,
  "currentVersion": 1,
  "nodeType": "templateTask"
  },
  {
  "id": "5fa4144bcb28924ba43ab57c",
  "description": "Pauses workflow until manual task is actioned.",
  "lastModified": "2020-04-30T22:53:23.337+00:00",
  "name": "Manual Task",
  "category": "workflow",
  "revisions": [
  {
  "version": 1,
  "image": "",
  "command": "",
  "arguments": [
  "approval"
  ],
  "config": [
  {
  "required": true,
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "instructions",
  "label": "Instructions",
  "type": "texteditor::markdown",
  "helperText": "Steps for end user to follow to perform manual task."
  }
  ],
  "changelog": {
  "userId": "5e8a6c6cd0827100011c2a35",
  "reason": "",
  "date": "2020-04-30T22:53:23.337+00:00",
  "userName": null
  }
  }
  ],
  "status": "active",
  "createdDate": "2020-01-09T00:01:00.000+00:00",
  "icon": "Validate",
  "verified": true,
  "enableLifecycle": false,
  "currentVersion": 1,
  "nodeType": "manual"
  },
  {
  "id": "5fe1309a8663cb0d0bfd68fd",
  "description": "The Boomerang CICD default build execution task",
  "lastModified": "2020-12-23T00:40:42.473+00:00",
  "name": "Build",
  "category": "Development",
  "revisions": [
  {
  "version": 1,
  "image": "tools.boomerangplatform.net:8500/ise/bmrg-worker-cicd:6.0.1",
  "command": "",
  "arguments": [
  "build",
  "$(BMRG_WORKFLOW_ID)"
  ],
  "config": [],
  "changelog": {
  "userId": "5e71f175756f7e000192eb6c",
  "reason": "",
  "date": "2020-12-23T00:40:42.473+00:00",
  "userName": "Tyson Lawrie"
  }
  }
  ],
  "status": "active",
  "createdDate": "2020-12-21T23:32:42.410+00:00",
  "icon": "Code",
  "verified": false,
  "enableLifecycle": false,
  "currentVersion": 1,
  "nodeType": "templateTask"
  },
  {
  "id": "5fe18ab24d80be2da829dea5",
  "description": "The Boomerang CICD default test worker",
  "lastModified": "2020-12-22T05:57:06.903+00:00",
  "name": "Test",
  "category": "Development",
  "revisions": [
  {
  "version": 1,
  "image": "tools.boomerangplatform.net:8500/ise/bmrg-worker-cicd:6.0.1",
  "command": "",
  "arguments": [
  "test",
  "execute"
  ],
  "config": [],
  "changelog": {
  "userId": "5e71f175756f7e000192eb6c",
  "reason": "",
  "date": "2020-12-22T05:57:06.963+00:00",
  "userName": "Tyson Lawrie"
  }
  }
  ],
  "status": "active",
  "createdDate": "2020-12-22T05:57:06.903+00:00",
  "icon": "Code",
  "verified": false,
  "enableLifecycle": false,
  "currentVersion": 1,
  "nodeType": "templateTask"
  },
  {
  "id": "5fe18acd4d80be2da829dea6",
  "description": "The Boomerang CICD default deploy worker",
  "lastModified": "2020-12-22T05:57:33.202+00:00",
  "name": "Deploy",
  "category": "Development",
  "revisions": [
  {
  "version": 1,
  "image": "tools.boomerangplatform.net:8500/ise/bmrg-worker-cicd:6.0.1",
  "command": "",
  "arguments": [
  "deploy",
  "execute"
  ],
  "config": [],
  "changelog": {
  "userId": "5e71f175756f7e000192eb6c",
  "reason": "",
  "date": "2020-12-22T05:57:33.245+00:00",
  "userName": "Tyson Lawrie"
  }
  }
  ],
  "status": "active",
  "createdDate": "2020-12-22T05:57:33.202+00:00",
  "icon": "Code",
  "verified": false,
  "enableLifecycle": false,
  "currentVersion": 1,
  "nodeType": "templateTask"
  },
  {
  "id": "5ff772c5daf8634981eee520",
  "description": "Test for task input read only",
  "lastModified": "2021-02-17T16:46:00.214+00:00",
  "name": "TestInput",
  "category": "Test",
  "revisions": [
  {
  "version": 1,
  "image": null,
  "command": "",
  "arguments": [
  "test",
  "input"
  ],
  "config": [],
  "changelog": {
  "userId": "5e7373c2a97b78000125ecaa",
  "reason": "",
  "date": "2021-01-07T20:44:53.940+00:00",
  "userName": "Isabela Mayumi Kawabata Borges"
  }
  },
  {
  "version": 2,
  "image": null,
  "command": "",
  "arguments": [
  "test",
  "input"
  ],
  "config": [
  {
  "required": false,
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "test",
  "label": "Test",
  "type": "text",
  "helperText": "Testing input"
  },
  {
  "required": false,
  "placeholder": "",
  "defaultValue": "Testing Text",
  "readOnly": true,
  "description": "",
  "key": "testRead",
  "label": "Test Read Only",
  "type": "text",
  "helperText": ""
  }
  ],
  "changelog": {
  "userId": "5e7373c2a97b78000125ecaa",
  "reason": "Add inputs",
  "date": "2021-01-07T20:46:17.477+00:00",
  "userName": "Isabela Mayumi Kawabata Borges"
  }
  },
  {
  "version": 3,
  "image": null,
  "command": "",
  "arguments": [
  "test",
  "input"
  ],
  "config": [
  {
  "required": false,
  "placeholder": "this is placeholder",
  "defaultValue": "Testing Text",
  "readOnly": true,
  "description": "this is description",
  "key": "testRead",
  "label": "Test Read Only",
  "type": "text",
  "helperText": "this is helper text"
  },
  {
  "required": false,
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "test",
  "label": "Test Password",
  "type": "password",
  "helperText": "Testing input"
  },
  {
  "required": false,
  "placeholder": "",
  "defaultValue": "ben testing val",
  "readOnly": false,
  "description": "this is description",
  "key": "textAreaTesting",
  "label": "Text Area Default",
  "type": "textarea",
  "helperText": "this is helper text"
  }
  ],
  "changelog": {
  "userId": "6025b82b351e0063571a3283",
  "reason": "",
  "date": "2021-02-17T16:46:00.214+00:00",
  "userName": "Marcus Roy"
  }
  }
  ],
  "status": "active",
  "createdDate": "2021-01-07T20:44:53.889+00:00",
  "icon": "Validate",
  "verified": false,
  "enableLifecycle": false,
  "currentVersion": 3,
  "nodeType": "templateTask"
  },
  {
  "id": "5d9e703dc90b5240508869e2",
  "description": "Run a trusted custom container as a task",
  "lastModified": "2020-09-25T21:11:01.767+00:00",
  "name": "Run Custom Task",
  "category": "workflow",
  "revisions": [
  {
  "version": 1,
  "image": "",
  "command": "",
  "arguments": [
  "."
  ],
  "config": [
  {
  "required": false,
  "placeholder": "e.g. docker.io/docker/whalesay",
  "defaultValue": "",
  "readOnly": false,
  "description": "Can be identified by a container image reference. i.e. registry / namespace / repository:tag",
  "key": "image",
  "label": "Image",
  "type": "text",
  "helperText": "Enter a valid container image reference"
  },
  {
  "placeholder": "e.g. cowsay",
  "readOnly": false,
  "description": "",
  "key": "command",
  "label": "Command",
  "type": "text",
  "helperText": "Corresponds to the entrypoint of your container and will override the default if provided"
  },
  {
  "placeholder": "e.g. hello world",
  "readOnly": false,
  "description": "",
  "key": "arguments",
  "label": "Arguments",
  "type": "textarea",
  "helperText": "New line delimited container arguments. You can access environment variables using $(variable) notation."
  }
  ],
  "changelog": {
  "userId": "5e736fb0a97b78000125ebe3",
  "reason": "Testing ",
  "date": "2020-09-25T21:11:01.767+00:00",
  "userName": "Marcus Roy"
  }
  }
  ],
  "status": "active",
  "createdDate": "2020-01-09T00:01:00.000+00:00",
  "icon": "Code",
  "verified": true,
  "enableLifecycle": false,
  "currentVersion": 1,
  "nodeType": "customTask"
  },
  {
  "id": "5b92f794844d0700016ea217",
  "description": "Easily configurable slack webhook message. To provide additional parameters, please see our Custom Slack Message task.",
  "lastModified": "2021-02-03T17:53:51.295+00:00",
  "name": "Send Simple Slack Message",
  "category": "communication",
  "revisions": [
  {
  "version": 1,
  "image": "",
  "command": "",
  "arguments": [
  "slack",
  "sendSimpleMessage"
  ],
  "config": [
  {
  "required": false,
  "placeholder": "https://hooks.slack.com/services/...",
  "defaultValue": "",
  "readOnly": false,
  "description": "Found within your webhook integration settings",
  "key": "url",
  "label": "Webhook URL",
  "type": "text",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "#channel-name",
  "defaultValue": "",
  "readOnly": false,
  "description": "",
  "key": "channel",
  "label": "Channel",
  "type": "text",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": ":boomerang:",
  "defaultValue": "",
  "readOnly": false,
  "description": "If left blank, defaults to :boomerang:",
  "key": "icon",
  "label": "Icon",
  "type": "text",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "Test-Bot",
  "defaultValue": "",
  "readOnly": false,
  "description": "",
  "key": "username",
  "label": "Username",
  "type": "text",
  "helperText": "Name displayed as the sender of the slack message"
  },
  {
  "required": false,
  "placeholder": "Your message here.",
  "defaultValue": "",
  "readOnly": false,
  "description": "",
  "key": "message",
  "label": "Message",
  "type": "textarea",
  "helperText": ""
  }
  ],
  "changelog": {
  "userId": "5ecd2d1d0eb5f000012d0895",
  "reason": "updated copy for task description and field configurations",
  "date": "2021-02-03T17:53:51.295+00:00",
  "userName": "Benjamin Ruby"
  }
  }
  ],
  "status": "active",
  "createdDate": "2020-01-09T00:01:00.000+00:00",
  "icon": "Message",
  "verified": true,
  "enableLifecycle": false,
  "currentVersion": 1,
  "nodeType": "templateTask"
  },
  {
  "id": "600b2f7220a674b1d2cb4731",
  "description": "This task releases a lock with the specified name.",
  "lastModified": "2020-04-30T22:53:23.337+00:00",
  "name": "Release Lock",
  "category": "workflow",
  "revisions": [
  {
  "version": 1,
  "image": "",
  "command": "",
  "arguments": [
  "lock"
  ],
  "config": [
  {
  "required": true,
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "key",
  "label": "Lock Name",
  "type": "text",
  "helperText": "A value to identify as the lock."
  }
  ],
  "changelog": {
  "userId": "5e8a6c6cd0827100011c2a35",
  "reason": "",
  "date": "2020-04-30T22:53:23.337+00:00",
  "userName": null
  }
  }
  ],
  "status": "active",
  "createdDate": "2020-01-09T00:01:00.000+00:00",
  "icon": "Edit",
  "verified": true,
  "enableLifecycle": false,
  "currentVersion": 1,
  "nodeType": "releaselock"
  },
  {
  "id": "5e1bf6ca0351fdc9e4319c3b",
  "description": "Upload a message to Slack using a Slack app. For further reading on the underlying API: https://api.slack.com/methods/files.upload",
  "lastModified": "2021-02-03T18:06:56.379+00:00",
  "name": "Upload Slack File with Message",
  "category": "communication",
  "revisions": [
  {
  "version": 1,
  "image": "",
  "command": "",
  "arguments": [
  "slack",
  "uploadFileMessage"
  ],
  "config": [
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "token",
  "label": "Token",
  "type": "text"
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "channel",
  "label": "Channel",
  "type": "text"
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "If left blank, defaults to :boomerang:",
  "key": "icon",
  "label": "Icon",
  "type": "text"
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "username",
  "label": "Username",
  "type": "text"
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "message",
  "label": "Message",
  "type": "textarea"
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "fileName",
  "label": "File Name",
  "type": "textarea"
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "fileContent",
  "label": "File Content",
  "type": "textarea"
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "encoded",
  "label": "Decode File Content",
  "type": "boolean"
  }
  ],
  "changelog": {
  "userId": "5e831153d0827100011c29f6",
  "reason": "",
  "date": "2020-04-30T22:53:22.305+00:00",
  "userName": null
  }
  },
  {
  "version": 2,
  "image": "",
  "command": "",
  "arguments": [
  "slack",
  "uploadFileMessage"
  ],
  "config": [
  {
  "required": false,
  "placeholder": "xxxx-xxxxxxxxx-xxxx",
  "defaultValue": "",
  "readOnly": false,
  "description": "Token is associated with the slack app tied to a workspace",
  "key": "token",
  "label": "Token",
  "type": "text",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "#channel-name",
  "defaultValue": "",
  "readOnly": false,
  "description": "",
  "key": "channel",
  "label": "Channel",
  "type": "text",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "Your message here.",
  "defaultValue": "",
  "readOnly": false,
  "description": "",
  "key": "message",
  "label": "Message",
  "type": "textarea",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "foo.txt",
  "readOnly": false,
  "description": "",
  "key": "fileName",
  "label": "File Name",
  "type": "text",
  "helperText": "Filename of file."
  },
  {
  "required": false,
  "placeholder": "",
  "defaultValue": "",
  "readOnly": false,
  "description": "If omitting this parameter, you must provide a File Path",
  "key": "fileContent",
  "label": "File Content",
  "type": "textarea",
  "helperText": "File contents via a POST variable"
  },
  {
  "required": false,
  "placeholder": "",
  "defaultValue": "false",
  "readOnly": false,
  "description": "Enable if File Content provided is base64 encoded ",
  "key": "encoded",
  "label": "Decode File Content",
  "type": "boolean",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "/workflow/your_file.txt",
  "readOnly": false,
  "description": "",
  "key": "filePath",
  "label": "File Path",
  "type": "text",
  "helperText": "Full path to desired file"
  },
  {
  "required": false,
  "placeholder": "My File",
  "readOnly": false,
  "description": "",
  "key": "fileTitle",
  "label": "File Title",
  "type": "text",
  "helperText": "Title of file."
  }
  ],
  "changelog": {
  "userId": "5ecd2d1d0eb5f000012d0895",
  "reason": "v2: remove unused username and icon. Add filePath and fileTitle so that users can specify a file path optionally instead of file contents",
  "date": "2021-02-03T18:06:56.379+00:00",
  "userName": "Benjamin Ruby"
  }
  }
  ],
  "status": "active",
  "createdDate": "2020-01-09T00:01:00.000+00:00",
  "icon": "Upload",
  "verified": true,
  "enableLifecycle": false,
  "currentVersion": 2,
  "nodeType": "templateTask"
  },
  {
  "id": "600b2f5520a674b1d2cb4635",
  "description": "This task attempts to obtain a lock with the specified name. If no other workflow in the team is using a lock with that name, a lock with that name and is created. If another workflow in the team is using a lock with the specified name, the current workflow waits until the lock is available.",
  "lastModified": "2020-04-30T22:53:23.337+00:00",
  "name": "Acquire Lock",
  "category": "workflow",
  "revisions": [
  {
  "version": 1,
  "image": "",
  "command": "",
  "arguments": [
  "lock"
  ],
  "config": [
  {
  "required": true,
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "key",
  "label": "Lock Name",
  "type": "text",
  "helperText": "A value to identify the lock."
  },
  {
  "required": true,
  "placeholder": "",
  "defaultValue": "300",
  "readOnly": false,
  "description": "",
  "key": "timeout",
  "label": "Timeout",
  "type": "number",
  "helperText": "Duration before lock expires in seconds"
  }
  ],
  "changelog": {
  "userId": "5e8a6c6cd0827100011c2a35",
  "reason": "",
  "date": "2020-04-30T22:53:23.337+00:00",
  "userName": null
  }
  }
  ],
  "status": "active",
  "createdDate": "2020-01-09T00:01:00.000+00:00",
  "icon": "Edit",
  "verified": true,
  "enableLifecycle": false,
  "currentVersion": 1,
  "nodeType": "acquirelock"
  },
  {
  "id": "5e670a1e2d5e6a302de4f41d",
  "description": "Look up Slack user by email address. A Slack app is needed to perform this functionality. Further reading on the underlying API: https://api.slack.com/methods/users.lookupByEmail",
  "lastModified": "2021-02-03T18:02:05.340+00:00",
  "name": "Slack User Look Up",
  "category": "communication",
  "revisions": [
  {
  "version": 1,
  "image": "",
  "command": "",
  "arguments": [
  "slack",
  "lookUpUser"
  ],
  "config": [
  {
  "required": false,
  "placeholder": "xxxx-xxxxxxxxx-xxxx",
  "defaultValue": "",
  "readOnly": false,
  "description": "Token is associated with the slack app tied to a workspace",
  "key": "token",
  "label": "Token",
  "type": "text",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "spengler@ghostbusters.example.com",
  "defaultValue": "",
  "readOnly": false,
  "description": "",
  "key": "emailAddress",
  "label": "Email Address",
  "type": "text",
  "helperText": "An email belonging to a user in the workspace"
  }
  ],
  "changelog": {
  "userId": "5ecd2d1d0eb5f000012d0895",
  "reason": "updated copy",
  "date": "2021-02-03T18:02:05.340+00:00",
  "userName": "Benjamin Ruby"
  }
  }
  ],
  "status": "active",
  "createdDate": "2020-01-09T00:01:00.000+00:00",
  "icon": "Search",
  "verified": true,
  "enableLifecycle": false,
  "currentVersion": 1,
  "nodeType": "templateTask"
  },
  {
  "id": "600132e0d911287a826f0d75",
  "description": "Replace parameters between tokens",
  "lastModified": "2021-01-19T02:06:21.185+00:00",
  "name": "Replace Tokens in Files",
  "category": "file utilities",
  "revisions": [
  {
  "version": 1,
  "image": null,
  "command": "",
  "arguments": [
  "file",
  "replaceTokensInFile"
  ],
  "config": [
  {
  "required": false,
  "placeholder": "",
  "defaultValue": "$(params.deploy-kubernetes-path)",
  "readOnly": false,
  "description": "",
  "key": "path",
  "label": "File Path",
  "type": "text",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "",
  "defaultValue": "$(params.deploy-kubernetes-file)",
  "readOnly": false,
  "description": "",
  "key": "files",
  "label": "Files",
  "type": "text",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "",
  "defaultValue": "@",
  "readOnly": false,
  "description": "",
  "key": "tokenStartDelimiter",
  "label": "Start Delimiter",
  "type": "text",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "",
  "defaultValue": "@",
  "readOnly": false,
  "description": "",
  "key": "tokenEndDelimiter",
  "label": "End Delimiter",
  "type": "text",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "key=value",
  "defaultValue": "$(allParams)",
  "readOnly": false,
  "description": "",
  "key": "allParams",
  "label": "Replacement Values",
  "type": "textarea",
  "helperText": "New line delimited key value pairs"
  },
  {
  "required": false,
  "placeholder": "",
  "defaultValue": "false",
  "readOnly": false,
  "description": "",
  "key": "failIfNotFound",
  "label": "Fail If Not Found",
  "type": "boolean",
  "helperText": ""
  }
  ],
  "changelog": {
  "userId": "5e71f175756f7e000192eb6c",
  "reason": "",
  "date": "2021-01-19T02:06:21.185+00:00",
  "userName": "Tyson Lawrie"
  }
  }
  ],
  "status": "active",
  "createdDate": "2021-01-15T06:14:56.408+00:00",
  "icon": "Edit",
  "verified": true,
  "enableLifecycle": false,
  "currentVersion": 1,
  "nodeType": "templateTask"
  },
  {
  "id": "5e2866c8612203650e389491",
  "description": "Send slack message with file contents via webhook\n",
  "lastModified": "2021-02-03T17:59:55.590+00:00",
  "name": "Send Slack Message with File Contents",
  "category": "communication",
  "revisions": [
  {
  "version": 1,
  "image": "",
  "command": "",
  "arguments": [
  "slack",
  "sendFileMessage"
  ],
  "config": [
  {
  "required": false,
  "placeholder": "https://hooks.slack.com/services/...",
  "defaultValue": "",
  "readOnly": false,
  "description": "Found within your webhook integration settings",
  "key": "url",
  "label": "Webhook URL",
  "type": "text",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "#channel-name",
  "defaultValue": "",
  "readOnly": false,
  "description": "",
  "key": "channel",
  "label": "Channel",
  "type": "text",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": ":boomerang:",
  "defaultValue": "",
  "readOnly": false,
  "description": "If left blank, defaults to :boomerang:",
  "key": "icon",
  "label": "Icon",
  "type": "text",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "Test-Bot",
  "defaultValue": "",
  "readOnly": false,
  "description": "",
  "key": "username",
  "label": "Username",
  "type": "text",
  "helperText": "Name displayed as the sender of the slack message"
  },
  {
  "required": false,
  "placeholder": "Your message here.",
  "defaultValue": "",
  "readOnly": false,
  "description": "",
  "key": "message",
  "label": "Message",
  "type": "textarea",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "",
  "defaultValue": "",
  "readOnly": false,
  "description": "File can be base64 encoded",
  "key": "content",
  "label": "File Content",
  "type": "textarea",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "",
  "defaultValue": "false",
  "readOnly": false,
  "description": "Enable if File Content provided is base64 encoded ",
  "key": "encoded",
  "label": "Decode File Content",
  "type": "boolean",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "Context for use...",
  "defaultValue": "",
  "readOnly": false,
  "description": "A helpful footer",
  "key": "context",
  "label": "Context",
  "type": "text",
  "helperText": ""
  }
  ],
  "changelog": {
  "userId": "5ecd2d1d0eb5f000012d0895",
  "reason": "updated copy",
  "date": "2021-02-03T17:59:55.590+00:00",
  "userName": "Benjamin Ruby"
  }
  }
  ],
  "status": "active",
  "createdDate": "2020-01-09T00:01:00.000+00:00",
  "icon": "Message",
  "verified": true,
  "enableLifecycle": false,
  "currentVersion": 1,
  "nodeType": "templateTask"
  },
  {
  "id": "5e1bcd210351fdc9e42fe4e0",
  "description": "Send custom JSON payload to a specified Slack webhook URL. For more information on the underlying Slack API and potential configurations: https://api.slack.com/messaging/webhooks",
  "lastModified": "2021-02-03T17:50:43.941+00:00",
  "name": "Send Custom Slack Message",
  "category": "communication",
  "revisions": [
  {
  "version": 1,
  "image": "",
  "command": "",
  "arguments": [
  "slack",
  "sendCustomMessage"
  ],
  "config": [
  {
  "required": false,
  "placeholder": "https://hooks.slack.com/services/...",
  "defaultValue": "",
  "readOnly": false,
  "description": "Found within your webhook integration settings",
  "key": "url",
  "label": "URL",
  "type": "text",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "{ \"text\": \"My Slack message.\" }",
  "defaultValue": "",
  "readOnly": false,
  "description": "",
  "key": "message",
  "label": "Message Payload",
  "type": "texteditor",
  "helperText": ""
  }
  ],
  "changelog": {
  "userId": "5ecd2d1d0eb5f000012d0895",
  "reason": "updated copy for task description and field descriptions",
  "date": "2021-02-03T17:50:43.941+00:00",
  "userName": "Benjamin Ruby"
  }
  }
  ],
  "status": "active",
  "createdDate": "2020-01-09T00:01:00.000+00:00",
  "icon": "Message",
  "verified": true,
  "enableLifecycle": false,
  "currentVersion": 1,
  "nodeType": "templateTask"
  },
  {
  "id": "5bd9d03a5a5df954ad5bb3b5",
  "description": "Create file in worker.",
  "lastModified": "2021-02-08T00:44:57.103+00:00",
  "name": "Create File",
  "category": "file utilities",
  "revisions": [
  {
  "version": 1,
  "image": "tools.boomerangplatform.net:8500/ise/bmrg-worker-flow:1.2.1",
  "command": null,
  "arguments": [
  "file",
  "createFile"
  ],
  "config": [
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "path",
  "label": "File Path",
  "type": "text"
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "content",
  "label": "File Content",
  "type": "texteditor"
  }
  ],
  "changelog": null
  },
  {
  "version": 2,
  "image": "",
  "command": "",
  "arguments": [
  "file",
  "createFile"
  ],
  "config": [
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "path",
  "label": "File Path",
  "type": "text"
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "content",
  "label": "File Content",
  "type": "texteditor"
  }
  ],
  "changelog": {
  "userId": "5e831153d0827100011c29f6",
  "reason": "",
  "date": "2020-04-30T22:51:53.014+00:00",
  "userName": null
  }
  },
  {
  "version": 3,
  "image": "",
  "command": "",
  "arguments": [
  "file",
  "createFile"
  ],
  "config": [
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "path",
  "label": "File Path",
  "type": "text"
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "content",
  "label": "File Content",
  "type": "texteditor"
  },
  {
  "required": false,
  "placeholder": "",
  "defaultValue": "false",
  "readOnly": false,
  "description": "",
  "key": "createDir",
  "label": "Creation Directories",
  "type": "boolean",
  "helperText": "Recursively create path as needed"
  }
  ],
  "changelog": {
  "userId": "5e71f175756f7e000192eb6c",
  "reason": "New option to create directories in path",
  "date": "2021-02-08T00:44:57.103+00:00",
  "userName": "Tyson Lawrie"
  }
  }
  ],
  "status": "active",
  "createdDate": "2020-01-09T00:01:00.000+00:00",
  "icon": "Add",
  "verified": true,
  "enableLifecycle": false,
  "currentVersion": 3,
  "nodeType": "templateTask"
  },
  {
  "id": "602ce5a562aa9e7e613e42b2",
  "description": "Send an email containing an attachements",
  "lastModified": "2021-02-18T08:47:28.205+00:00",
  "name": "Send Email with Attachments",
  "category": "Communication",
  "revisions": [
  {
  "version": 1,
  "image": null,
  "command": "",
  "arguments": [
  "none"
  ],
  "config": [
  {
  "required": false,
  "placeholder": "bmrgadmin",
  "defaultValue": "youll-come-a-waltzing-maltilda-with-me",
  "readOnly": false,
  "description": "",
  "key": "apiKey",
  "label": "API Key",
  "type": "password",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "to",
  "label": "To",
  "type": "text",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "from",
  "label": "From",
  "type": "text",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "File paths to attach to email, one per line.",
  "defaultValue": "",
  "readOnly": false,
  "description": "A list of entries (one per line) that select which files to be attached to the email",
  "key": "attachments",
  "label": "Attachments",
  "type": "textarea",
  "helperText": "List of file paths to be attached to the email"
  }
  ],
  "changelog": {
  "userId": "5e79e5ae2e0ee000015cacde",
  "reason": "",
  "date": "2021-02-18T08:47:28.205+00:00",
  "userName": "Costel Moraru"
  }
  }
  ],
  "status": "inactive",
  "createdDate": "2021-02-17T09:45:09.526+00:00",
  "icon": "Message",
  "verified": false,
  "enableLifecycle": false,
  "currentVersion": 1,
  "nodeType": "templateTask"
  },
  {
  "id": "5c39015b352b1b51412e9c85",
  "description": "Read file and add contents to tasks result parameter",
  "lastModified": "2021-02-19T23:46:26.813+00:00",
  "name": "Read File to Parameter",
  "category": "file utilities",
  "revisions": [
  {
  "version": 1,
  "image": "",
  "command": "",
  "arguments": [
  "file",
  "readFileToProperty"
  ],
  "config": [
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "path",
  "label": "File Path",
  "type": "text"
  },
  {
  "required": false,
  "placeholder": "",
  "defaultValue": "",
  "readOnly": false,
  "description": "",
  "key": "propertyName",
  "label": "Parameter Name",
  "type": "text",
  "helperText": ""
  }
  ],
  "changelog": {
  "userId": "5e71f175756f7e000192eb6c",
  "reason": "",
  "date": "2021-02-19T23:46:26.813+00:00",
  "userName": "Tyson Lawrie"
  }
  }
  ],
  "status": "active",
  "createdDate": "2020-01-09T00:01:00.000+00:00",
  "icon": "Search",
  "verified": true,
  "enableLifecycle": false,
  "currentVersion": 1,
  "nodeType": "templateTask"
  },
  {
  "id": "5f6379c974f51934044cbbd4",
  "description": "Set a Result Parameter on the Workflow. These are then available in the workflows activity.",
  "lastModified": "2020-04-30T22:53:23.337+00:00",
  "name": "Set Result Parameter",
  "category": "workflow",
  "revisions": [
  {
  "version": 1,
  "image": "",
  "command": "",
  "arguments": [
  "setwfproperty"
  ],
  "config": [
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "output",
  "label": "Name",
  "type": "text",
  "helperText": "Only alphanumeric, underscore, dash, and period characters allowed"
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "value",
  "label": "Value",
  "type": "text",
  "helperText": ""
  }
  ],
  "changelog": {
  "userId": "5e8a6c6cd0827100011c2a35",
  "reason": "",
  "date": "2020-04-30T22:53:23.337+00:00",
  "userName": null
  }
  }
  ],
  "status": "active",
  "createdDate": "2020-01-09T00:01:00.000+00:00",
  "icon": "Edit",
  "verified": true,
  "enableLifecycle": false,
  "currentVersion": 1,
  "nodeType": "setwfproperty"
  },
  {
  "id": "5c3fb7e2352b1b5141692f75",
  "description": "Read parameters from file",
  "lastModified": "2021-02-19T23:46:40.981+00:00",
  "name": "Read Parameters From File",
  "category": "file utilities",
  "revisions": [
  {
  "version": 1,
  "image": "",
  "command": "",
  "arguments": [
  "file",
  "readPropertiesFromFile"
  ],
  "config": [
  {
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "path",
  "label": "File Path",
  "type": "text"
  },
  {
  "placeholder": "",
  "readOnly": false,
  "description": "Defaults to = if blank.",
  "key": "delimiter",
  "label": "Delimiter",
  "type": "text"
  }
  ],
  "changelog": {
  "userId": "5e71f175756f7e000192eb6c",
  "reason": "",
  "date": "2021-02-19T23:46:40.981+00:00",
  "userName": "Tyson Lawrie"
  }
  }
  ],
  "status": "active",
  "createdDate": "2020-01-09T00:01:00.000+00:00",
  "icon": "Search",
  "verified": true,
  "enableLifecycle": false,
  "currentVersion": 1,
  "nodeType": "templateTask"
  },
  {
  "id": "60338c2ecb88b80a95a63f6e",
  "description": "Using your Sendgrid API Key, send a basic email.",
  "lastModified": "2021-02-23T07:36:01.442+00:00",
  "name": "Send Email with Sendgrid1",
  "category": "Communication",
  "revisions": [
  {
  "version": 1,
  "image": "boomerangio/worker-flow:2.5.27",
  "command": "",
  "arguments": [
  "mail",
  "sendEmailWithSendgrid"
  ],
  "config": [],
  "changelog": {
  "userId": "5e79e5ae2e0ee000015cacde",
  "reason": "",
  "date": "2021-02-22T10:49:18.703+00:00",
  "userName": "Costel Moraru"
  }
  },
  {
  "version": 2,
  "image": "boomerangio/worker-flow:2.5.27",
  "command": "",
  "arguments": [
  "mail",
  "sendEmailWithSendgrid"
  ],
  "config": [
  {
  "required": true,
  "placeholder": "bmrgadmin",
  "defaultValue": "youll-come-a-waltzing-maltilda-with-me",
  "readOnly": false,
  "description": "If you have a Sendgrid account, you will be able to find or create an API key via their UI",
  "key": "apiKey",
  "label": "API Key",
  "type": "password",
  "helperText": ""
  },
  {
  "required": true,
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "to",
  "label": "To",
  "type": "text",
  "helperText": ""
  },
  {
  "required": true,
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "from",
  "label": "From",
  "type": "text",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "cc",
  "label": "CC",
  "type": "text",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "bcc",
  "label": "BCC",
  "type": "text",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "replyTo",
  "label": "Reply to",
  "type": "text",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "subject",
  "label": "Subject",
  "type": "text",
  "helperText": ""
  },
  {
  "required": true,
  "placeholder": "",
  "defaultValue": "",
  "readOnly": false,
  "description": "Email content type, can be text or html.",
  "key": "contentType",
  "label": "Content Type",
  "type": "select",
  "options": [
  {
  "key": "Text",
  "value": "Text"
  },
  {
  "key": "HTML",
  "value": "HTML"
  }
  ],
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "",
  "defaultValue": "",
  "readOnly": false,
  "description": "",
  "key": "bodyContent",
  "label": "Body Content",
  "type": "texteditor",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "i.e. /path/to/attachment.pdf",
  "readOnly": false,
  "description": "",
  "key": "attachments",
  "label": "Attachments",
  "type": "textarea",
  "helperText": "List of files to be used for attachment "
  }
  ],
  "changelog": {
  "userId": "5e79e5ae2e0ee000015cacde",
  "reason": "",
  "date": "2021-02-23T07:36:01.442+00:00",
  "userName": "Costel Moraru"
  }
  }
  ],
  "status": "inactive",
  "createdDate": "2021-02-22T10:49:18.687+00:00",
  "icon": "Message",
  "verified": false,
  "enableLifecycle": false,
  "currentVersion": 2,
  "nodeType": "templateTask"
  },
  {
  "id": "60338642cb88b80a95a63f6d",
  "description": "Using your Sendgrid API Key, send a Dynamic Template email using a template ID and dynamic data.",
  "lastModified": "2021-02-23T08:00:53.339+00:00",
  "name": "Send Email with Sendgrid Template",
  "category": "Communication",
  "revisions": [
  {
  "version": 1,
  "image": null,
  "command": "boomerangio/worker-flow:2.5.27",
  "arguments": [
  "mail",
  "sendEmailWithSendgridTemplate"
  ],
  "config": [],
  "changelog": {
  "userId": "5e79e5ae2e0ee000015cacde",
  "reason": "",
  "date": "2021-02-22T10:24:02.975+00:00",
  "userName": "Costel Moraru"
  }
  },
  {
  "version": 2,
  "image": "",
  "command": "",
  "arguments": [
  "mail",
  "sendEmailWithSendgridTemplate"
  ],
  "config": [
  {
  "required": true,
  "placeholder": "bmrgadmin",
  "defaultValue": "youll-come-a-waltzing-maltilda-with-me",
  "readOnly": false,
  "description": "If you have a Sendgrid account, you will be able to find or create an API key via their UI",
  "key": "apiKey",
  "label": "API Key",
  "type": "password",
  "helperText": ""
  },
  {
  "required": true,
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "to",
  "label": "To",
  "type": "text",
  "helperText": ""
  },
  {
  "required": true,
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "from",
  "label": "From",
  "type": "text",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "cc",
  "label": "CC",
  "type": "text",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "bcc",
  "label": "BCC",
  "type": "text",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "replyTo",
  "label": "Reply to",
  "type": "text",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "subject",
  "label": "Subject",
  "type": "text",
  "helperText": ""
  },
  {
  "required": true,
  "placeholder": "bmrgadmin",
  "defaultValue": "youll-come-a-waltzing-maltilda-with-me",
  "readOnly": false,
  "description": "Template information can be found in the Sendgrid UI",
  "key": "templateId",
  "label": "Template Id",
  "type": "password",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "",
  "readOnly": false,
  "description": "Specify when using a template Id",
  "key": "dynamicTemplateData",
  "label": "Dynamic Template Data",
  "type": "texteditor::javascript",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "i.e. /path/to/attachment.pdf",
  "readOnly": false,
  "description": "",
  "key": "attachments",
  "label": "Attachments",
  "type": "textarea",
  "helperText": "List of files to be used for attachment "
  }
  ],
  "changelog": {
  "userId": "5e71f175756f7e000192eb6c",
  "reason": "",
  "date": "2021-02-23T08:00:53.339+00:00",
  "userName": "Tyson Lawrie"
  }
  }
  ],
  "status": "active",
  "createdDate": "2021-02-22T10:24:02.958+00:00",
  "icon": "Message",
  "verified": true,
  "enableLifecycle": false,
  "currentVersion": 2,
  "nodeType": "templateTask"
  },
  {
  "id": "5f85dba0868d2e2ebebbe2d1",
  "description": "Using your Sendgrid API Key, send a basic email.",
  "lastModified": "2021-02-23T08:00:46.273+00:00",
  "name": "Send Email with Sendgrid",
  "category": "communication",
  "revisions": [
  {
  "version": 1,
  "image": null,
  "command": "",
  "arguments": [
  "mail",
  "sendgridMail"
  ],
  "config": [
  {
  "required": true,
  "placeholder": "",
  "defaultValue": "",
  "readOnly": false,
  "description": "If you have a Sendgrid account, you will be able to find or create an API key via their UI",
  "key": "apiKey",
  "label": "API Key",
  "type": "password",
  "helperText": ""
  },
  {
  "required": true,
  "placeholder": "",
  "defaultValue": "",
  "readOnly": false,
  "description": "",
  "key": "to",
  "label": "To",
  "type": "text",
  "helperText": ""
  },
  {
  "required": true,
  "placeholder": "",
  "defaultValue": "",
  "readOnly": false,
  "description": "",
  "key": "from",
  "label": "From",
  "type": "text",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "cc",
  "label": "CC",
  "type": "text",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "bcc",
  "label": "BCC",
  "type": "text",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "replyTo",
  "label": "Reply to",
  "type": "text",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "subject",
  "label": "Subject",
  "type": "text",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "",
  "defaultValue": "",
  "readOnly": false,
  "description": "If sending a non-template mail. User can provide text or html for the mail content.",
  "key": "text",
  "label": "Text",
  "type": "text",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "",
  "defaultValue": "",
  "readOnly": false,
  "description": "If sending a non-template mail. User can provide text or html for the mail content.",
  "key": "html",
  "label": "HTML",
  "type": "texteditor",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "",
  "defaultValue": "",
  "readOnly": false,
  "description": "Template information can be found in the Sendgrid UI",
  "key": "templateId",
  "label": "Template Id",
  "type": "password",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "",
  "defaultValue": "",
  "readOnly": false,
  "description": "Specify when using a template Id",
  "key": "dynamicTemplateData",
  "label": "Dynamic Template Data",
  "type": "texteditor::javascript",
  "helperText": ""
  }
  ],
  "changelog": {
  "userId": "5ecd2d1d0eb5f000012d0895",
  "reason": "added fields ",
  "date": "2020-10-13T17:06:14.513+00:00",
  "userName": "Benjamin Ruby"
  }
  },
  {
  "version": 2,
  "image": "boomerangio/worker-flow:2.5.26",
  "command": "",
  "arguments": [
  "mail",
  "sendgridMail"
  ],
  "config": [
  {
  "required": true,
  "placeholder": "",
  "defaultValue": "",
  "readOnly": false,
  "description": "If you have a Sendgrid account, you will be able to find or create an API key via their UI",
  "key": "apiKey",
  "label": "API Key",
  "type": "password",
  "helperText": ""
  },
  {
  "required": true,
  "placeholder": "",
  "defaultValue": "",
  "readOnly": false,
  "description": "",
  "key": "to",
  "label": "To",
  "type": "text",
  "helperText": ""
  },
  {
  "required": true,
  "placeholder": "",
  "defaultValue": "",
  "readOnly": false,
  "description": "",
  "key": "from",
  "label": "From",
  "type": "text",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "cc",
  "label": "CC",
  "type": "text",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "bcc",
  "label": "BCC",
  "type": "text",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "replyTo",
  "label": "Reply to",
  "type": "text",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "subject",
  "label": "Subject",
  "type": "text",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "",
  "defaultValue": "",
  "readOnly": false,
  "description": "If sending a non-template mail. User can provide text or html for the mail content.",
  "key": "text",
  "label": "Text",
  "type": "text",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "",
  "defaultValue": "",
  "readOnly": false,
  "description": "If sending a non-template mail. User can provide text or html for the mail content.",
  "key": "html",
  "label": "HTML",
  "type": "texteditor",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "",
  "defaultValue": "",
  "readOnly": false,
  "description": "Template information can be found in the Sendgrid UI",
  "key": "templateId",
  "label": "Template Id",
  "type": "password",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "",
  "defaultValue": "",
  "readOnly": false,
  "description": "Specify when using a template Id",
  "key": "dynamicTemplateData",
  "label": "Dynamic Template Data",
  "type": "texteditor::javascript",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "i.e. /path/to/attachment.pdf",
  "readOnly": false,
  "description": "",
  "key": "attachments",
  "label": "Attachments",
  "type": "textarea",
  "helperText": "List of files to be used for attachment "
  }
  ],
  "changelog": {
  "userId": "5e79e5ae2e0ee000015cacde",
  "reason": "",
  "date": "2021-02-19T10:22:16.951+00:00",
  "userName": "Costel Moraru"
  }
  },
  {
  "version": 3,
  "image": "",
  "command": "",
  "arguments": [
  "mail",
  "sendEmailWithSendgrid"
  ],
  "config": [
  {
  "required": true,
  "placeholder": "",
  "defaultValue": "",
  "readOnly": false,
  "description": "If you have a Sendgrid account, you will be able to find or create an API key via their UI",
  "key": "apiKey",
  "label": "API Key",
  "type": "password",
  "helperText": ""
  },
  {
  "required": true,
  "placeholder": "",
  "defaultValue": "",
  "readOnly": false,
  "description": "",
  "key": "to",
  "label": "To",
  "type": "text",
  "helperText": ""
  },
  {
  "required": true,
  "placeholder": "",
  "defaultValue": "",
  "readOnly": false,
  "description": "",
  "key": "from",
  "label": "From",
  "type": "text",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "cc",
  "label": "CC",
  "type": "text",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "bcc",
  "label": "BCC",
  "type": "text",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "replyTo",
  "label": "Reply to",
  "type": "text",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "subject",
  "label": "Subject",
  "type": "text",
  "helperText": ""
  },
  {
  "required": true,
  "placeholder": "",
  "readOnly": false,
  "description": "Email content type, can be Text or HTML.",
  "key": "contentType",
  "label": "Content Type",
  "type": "select",
  "options": [
  {
  "key": "Text",
  "value": "Text"
  },
  {
  "key": "HTML",
  "value": "HTML"
  }
  ],
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "bodyContent",
  "label": "Body Content",
  "type": "texteditor",
  "helperText": ""
  },
  {
  "required": false,
  "placeholder": "i.e. /path/to/attachment.pdf",
  "readOnly": false,
  "description": "",
  "key": "attachments",
  "label": "Attachments",
  "type": "textarea",
  "helperText": "List of files to be used for attachment "
  }
  ],
  "changelog": {
  "userId": "5e71f175756f7e000192eb6c",
  "reason": "",
  "date": "2021-02-23T08:00:46.273+00:00",
  "userName": "Tyson Lawrie"
  }
  }
  ],
  "status": "active",
  "createdDate": "2020-10-13T16:53:52.235+00:00",
  "icon": "Message",
  "verified": true,
  "enableLifecycle": false,
  "currentVersion": 3,
  "nodeType": "templateTask"
  },
  {
  "id": "603591f5c267b8ce33782571",
  "description": "Runs another workflow",
  "lastModified": "2020-04-30T22:53:23.337+00:00",
  "name": "Run Workflow",
  "category": "workflow",
  "revisions": [
  {
  "version": 1,
  "image": "",
  "command": "",
  "arguments": [
  "runworkflow"
  ],
  "config": [],
  "changelog": {
  "userId": "5e8a6c6cd0827100011c2a35",
  "reason": "",
  "date": "2020-04-30T22:53:23.337+00:00",
  "userName": null
  }
  }
  ],
  "status": "active",
  "createdDate": "2020-01-09T00:01:00.000+00:00",
  "icon": "Edit",
  "verified": true,
  "enableLifecycle": false,
  "currentVersion": 1,
  "nodeType": "runworkflow"
  },
  {
  "id": "603626aaf07e5a5993057ad3",
  "description": "Sending a custom email",
  "lastModified": "2021-02-24T11:12:47.384+00:00",
  "name": "Build Docker Image",
  "category": "Custom",
  "revisions": [
  {
  "version": 1,
  "image": "docker.io/library/docker:stable@sha256:18ff92d3d31725b53fa6633d60bed323effb6d5d4588be7b547078d384e0d4bf",
  "command": "",
  "arguments": [
  "docker",
  "build",
  "."
  ],
  "config": [
  {
  "required": false,
  "placeholder": "",
  "defaultValue": "./Dockerfile",
  "readOnly": false,
  "description": "",
  "key": "dockerfile",
  "label": "Dockerfile",
  "type": "text",
  "helperText": ""
  }
  ],
  "changelog": {
  "userId": "5e79e5ae2e0ee000015cacde",
  "reason": "",
  "date": "2021-02-24T11:12:47.384+00:00",
  "userName": "Costel Moraru"
  }
  }
  ],
  "status": "active",
  "createdDate": "2021-02-24T10:12:58.425+00:00",
  "icon": "API/HTTP call",
  "verified": false,
  "enableLifecycle": false,
  "currentVersion": 1,
  "nodeType": "templateTask"
  },
  {
  "id": "60400caaae000c2e644d9082",
  "description": "This task performs curl operation to transfer data from internet.",
  "lastModified": "2021-03-03T22:24:42.895+00:00",
  "name": "curl",
  "category": "community",
  "revisions": [
  {
  "version": 1,
  "image": "$(params.curl-image)",
  "command": "curl",
  "arguments": [
  "$(params.options[*])",
  "$(params.url)"
  ],
  "config": [
  {
  "placeholder": "",
  "readOnly": false,
  "description": "URL to curl'ed",
  "key": "url",
  "label": "url",
  "type": "text"
  },
  {
  "placeholder": "",
  "defaultValue": "[]",
  "readOnly": false,
  "description": "options of url",
  "key": "options",
  "label": "options",
  "type": "text"
  },
  {
  "placeholder": "",
  "defaultValue": "docker.io/curlimages/curl:7.72.0@sha256:3c3ff0c379abb1150bb586c7d55848ed4dcde4a6486b6f37d6815aed569332fe",
  "readOnly": false,
  "description": "option of curl image",
  "key": "curl-image",
  "label": "curl-image",
  "type": "text"
  }
  ],
  "changelog": {
  "userId": null,
  "reason": null,
  "date": "2021-03-03T22:24:42.895+00:00",
  "userName": null
  }
  }
  ],
  "status": "active",
  "createdDate": "2021-03-03T22:24:42.895+00:00",
  "verified": false,
  "enableLifecycle": false,
  "currentVersion": 1,
  "nodeType": "templateTask"
  },
  {
  "id": "6040d9fb03e8ac417d2ee47e",
  "description": "Add an user to a box folder",
  "lastModified": "2021-03-04T13:03:08.190+00:00",
  "name": "Add User to Box Folder",
  "category": "Box",
  "revisions": [
  {
  "version": 1,
  "image": "tools.boomerangplatform.net:8500/garageonboardingteam/onboarding-function:console-app-77",
  "command": "",
  "arguments": [
  "-props",
  "box",
  "add",
  "folderName"
  ],
  "config": [
  {
  "required": true,
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "userId",
  "label": "User Id",
  "type": "text",
  "helperText": "User Id"
  },
  {
  "required": true,
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "config",
  "label": "Box Integration config",
  "type": "texteditor::javascript",
  "helperText": ""
  },
  {
  "required": true,
  "placeholder": "",
  "readOnly": false,
  "description": "",
  "key": "folderName",
  "label": "Folder Name",
  "type": "text",
  "helperText": ""
  }
  ],
  "changelog": {
  "userId": "5e79e5ae2e0ee000015cacde",
  "reason": "",
  "date": "2021-03-04T13:03:08.190+00:00",
  "userName": "Costel Moraru"
  }
  }
  ],
  "status": "active",
  "createdDate": "2021-03-04T13:00:43.348+00:00",
  "icon": "Add",
  "verified": false,
  "enableLifecycle": false,
  "currentVersion": 1,
  "nodeType": "templateTask"
  }
  ];
