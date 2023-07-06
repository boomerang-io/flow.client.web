const tasktemplate = {
  content: [
    {
      id: "647966b186bfa2195a197262",
      name: "execute-advanced-http-call",
      displayName: "Execute Advanced HTTP Call",
      description: "Execute an Advanced HTTP Call",
      status: "active",
      labels: {},
      version: 4,
      creationDate: "2020-01-09T00:01:00.000+00:00",
      changelog: {
        author: "608fb6fb70bfa94ac91f90cb",
        reason: "",
        date: "2022-05-13T08:49:42.733+00:00"
      },
      category: "Utilities",
      type: "template",
      spec: {
        arguments: [
          "http",
          "execute"
        ],
        command: [],
        params: [
          {
            name: "url",
            type: "string",
            description: "",
            defaultValue: null
          },
          {
            name: "method",
            type: "string",
            description: "",
            defaultValue: null
          },
          {
            name: "header",
            type: "string",
            description: "Start a new line for each header",
            defaultValue: ""
          },
          {
            name: "contentType",
            type: "string",
            description: "",
            defaultValue: null
          },
          {
            name: "body",
            type: "string",
            description: "",
            defaultValue: null
          },
          {
            name: "allowUntrustedCerts",
            type: "string",
            description: "",
            defaultValue: null
          },
          {
            name: "outputFilePath",
            type: "string",
            description: "If provided, the result parameter is not filled",
            defaultValue: ""
          },
          {
            name: "successcodes",
            type: "string",
            description: "If left empty, success will be considered: 2xx",
            defaultValue: "1xx,2xx"
          },
          {
            name: "errorcodes",
            type: "string",
            description: "No retry calls are done for these HTTP status codes",
            defaultValue: ""
          },
          {
            name: "retrycodes",
            type: "string",
            description: "HTTP response codes for which the task will retry the call",
            defaultValue: "502,503"
          },
          {
            name: "retrydelay",
            type: "string",
            description: "",
            defaultValue: null
          },
          {
            name: "retrynumber",
            type: "string",
            description: "",
            defaultValue: "3"
          }
        ],
        envs: [],
        image: "",
        results: [
          {
            description: "HTTP execution response content",
            name: "response"
          },
          {
            description: "The received HTTP status code",
            name: "statusCode"
          }
        ],
        script: "",
        workingDir: ""
      },
      config: [
        {
          key: "url",
          description: "",
          label: "URL",
          type: "url",
          minValueLength: null,
          maxValueLength: null,
          options: null,
          required: null,
          placeholder: "",
          language: null,
          disabled: null,
          defaultValue: null,
          value: null,
          values: null,
          readOnly: false,
          hiddenValue: null,
          helperText: null
        },
        {
          key: "method",
          description: "",
          label: "Method",
          type: "select",
          minValueLength: null,
          maxValueLength: null,
          options: [
            {
              key: "GET",
              value: "GET"
            },
            {
              key: "HEAD",
              value: "HEAD"
            },
            {
              key: "PUT",
              value: "PUT"
            },
            {
              key: "POST",
              value: "POST"
            },
            {
              key: "PATCH",
              value: "PATCH"
            },
            {
              key: "OPTIONS",
              value: "OPTIONS"
            },
            {
              key: "DELETE",
              value: "DELETE"
            }
          ],
          required: null,
          placeholder: "",
          language: null,
          disabled: null,
          defaultValue: null,
          value: null,
          values: null,
          readOnly: false,
          hiddenValue: null,
          helperText: null
        },
        {
          key: "header",
          description: "Start a new line for each header",
          label: "Headers",
          type: "textarea",
          minValueLength: null,
          maxValueLength: null,
          options: null,
          required: false,
          placeholder: "",
          language: null,
          disabled: null,
          defaultValue: "",
          value: null,
          values: null,
          readOnly: false,
          hiddenValue: null,
          helperText: "Headers to add to the request, such as Authorization"
        },
        {
          key: "contentType",
          description: "",
          label: "Content Type",
          type: "text",
          minValueLength: null,
          maxValueLength: null,
          options: null,
          required: null,
          placeholder: "",
          language: null,
          disabled: null,
          defaultValue: null,
          value: null,
          values: null,
          readOnly: false,
          hiddenValue: null,
          helperText: null
        },
        {
          key: "body",
          description: "",
          label: "Body",
          type: "texteditor",
          minValueLength: null,
          maxValueLength: null,
          options: null,
          required: null,
          placeholder: "",
          language: null,
          disabled: null,
          defaultValue: null,
          value: null,
          values: null,
          readOnly: false,
          hiddenValue: null,
          helperText: null
        },
        {
          key: "allowUntrustedCerts",
          description: "",
          label: "Allow Untrusted SSL Certs",
          type: "boolean",
          minValueLength: null,
          maxValueLength: null,
          options: null,
          required: null,
          placeholder: "",
          language: null,
          disabled: null,
          defaultValue: null,
          value: null,
          values: null,
          readOnly: false,
          hiddenValue: null,
          helperText: null
        },
        {
          key: "outputFilePath",
          description: "If provided, the result parameter is not filled",
          label: "Response File Path",
          type: "text",
          minValueLength: null,
          maxValueLength: null,
          options: null,
          required: false,
          placeholder: "",
          language: null,
          disabled: null,
          defaultValue: "",
          value: null,
          values: null,
          readOnly: false,
          hiddenValue: null,
          helperText: "File path to store the output response"
        },
        {
          key: "successcodes",
          description: "If left empty, success will be considered: 2xx",
          label: "HTTP response codes for successful execution",
          type: "text",
          minValueLength: null,
          maxValueLength: null,
          options: null,
          required: false,
          placeholder: "",
          language: null,
          disabled: null,
          defaultValue: "1xx,2xx",
          value: null,
          values: null,
          readOnly: false,
          hiddenValue: null,
          helperText: ""
        },
        {
          key: "errorcodes",
          description: "No retry calls are done for these HTTP status codes",
          label: "HTTP response codes for failure",
          type: "text",
          minValueLength: null,
          maxValueLength: null,
          options: null,
          required: false,
          placeholder: "e.g. 5xx,404",
          language: null,
          disabled: null,
          defaultValue: "",
          value: null,
          values: null,
          readOnly: false,
          hiddenValue: null,
          helperText: "HTTP response codes which marks the call as failed"
        },
        {
          key: "retrycodes",
          description: "HTTP response codes for which the task will retry the call",
          label: "HTTP response codes for execution retry",
          type: "text",
          minValueLength: null,
          maxValueLength: null,
          options: null,
          required: false,
          placeholder: "",
          language: null,
          disabled: null,
          defaultValue: "502,503",
          value: null,
          values: null,
          readOnly: false,
          hiddenValue: null,
          helperText: "HTTP response codes for retry"
        },
        {
          key: "retrydelay",
          description: "",
          label: "Number of milliseconds to wait until the next retry",
          type: "number",
          minValueLength: null,
          maxValueLength: null,
          options: null,
          required: false,
          placeholder: "e.g. 200",
          language: null,
          disabled: null,
          defaultValue: null,
          value: null,
          values: null,
          readOnly: false,
          hiddenValue: null,
          helperText: "Cool down between retries in millis (100, 300000)"
        },
        {
          key: "retrynumber",
          description: "",
          label: "Number of retries",
          type: "number",
          minValueLength: null,
          maxValueLength: null,
          options: null,
          required: false,
          placeholder: "",
          language: null,
          disabled: null,
          defaultValue: "3",
          value: null,
          values: null,
          readOnly: false,
          hiddenValue: null,
          helperText: "Number of retries to be attempted, between (1, 9)"
        }
      ],
      icon: "API/HTTP call",
      verified: true
    },
    {
      id: "647966b186bfa2195a197260",
      name: "execute-advanced-http-call",
      displayName: "Execute Advanced HTTP Call",
      description: "Execute an Advanced HTTP Call",
      status: "active",
      labels: {},
      annotations: {},
      version: 3,
      creationDate: "2020-01-09T00:01:00.000+00:00",
      changelog: {
        author: "5e71f175756f7e000192eb6c",
        reason: "",
        date: "2021-03-31T23:43:36.805+00:00"
      },
      category: "Utilities",
      type: "template",
      spec: {
        arguments: [
          "http",
          "execute"
        ],
        command: [],
        params: [
          {
            name: "url",
            type: "string",
            description: "",
            defaultValue: null
          },
          {
            name: "method",
            type: "string",
            description: "",
            defaultValue: null
          },
          {
            name: "header",
            type: "string",
            description: "Start a new line for each header",
            defaultValue: ""
          },
          {
            name: "contentType",
            type: "string",
            description: "",
            defaultValue: null
          },
          {
            name: "body",
            type: "string",
            description: "",
            defaultValue: null
          },
          {
            name: "allowUntrustedCerts",
            type: "string",
            description: "",
            defaultValue: null
          }
        ],
        envs: null,
        image: "",
        results: null,
        script: null,
        workingDir: null
      },
      config: [
        {
          key: "url",
          description: "",
          label: "URL",
          type: "url",
          minValueLength: null,
          maxValueLength: null,
          options: null,
          required: null,
          placeholder: "",
          language: null,
          disabled: null,
          defaultValue: null,
          value: null,
          values: null,
          readOnly: false,
          hiddenValue: null,
          helperText: null
        },
        {
          key: "method",
          description: "",
          label: "Method",
          type: "select",
          minValueLength: null,
          maxValueLength: null,
          options: [
            {
              key: "GET",
              value: "GET"
            },
            {
              key: "HEAD",
              value: "HEAD"
            },
            {
              key: "PUT",
              value: "PUT"
            },
            {
              key: "POST",
              value: "POST"
            },
            {
              key: "PATCH",
              value: "PATCH"
            },
            {
              key: "OPTIONS",
              value: "OPTIONS"
            },
            {
              key: "DELETE",
              value: "DELETE"
            }
          ],
          required: null,
          placeholder: "",
          language: null,
          disabled: null,
          defaultValue: null,
          value: null,
          values: null,
          readOnly: false,
          hiddenValue: null,
          helperText: null
        },
        {
          key: "header",
          description: "Start a new line for each header",
          label: "Headers",
          type: "textarea",
          minValueLength: null,
          maxValueLength: null,
          options: null,
          required: false,
          placeholder: "",
          language: null,
          disabled: null,
          defaultValue: "",
          value: null,
          values: null,
          readOnly: false,
          hiddenValue: null,
          helperText: "Headers to add to the request, such as Authorization"
        },
        {
          key: "contentType",
          description: "",
          label: "Content Type",
          type: "text",
          minValueLength: null,
          maxValueLength: null,
          options: null,
          required: null,
          placeholder: "",
          language: null,
          disabled: null,
          defaultValue: null,
          value: null,
          values: null,
          readOnly: false,
          hiddenValue: null,
          helperText: null
        },
        {
          key: "body",
          description: "",
          label: "Body",
          type: "texteditor",
          minValueLength: null,
          maxValueLength: null,
          options: null,
          required: null,
          placeholder: "",
          language: null,
          disabled: null,
          defaultValue: null,
          value: null,
          values: null,
          readOnly: false,
          hiddenValue: null,
          helperText: null
        },
        {
          key: "allowUntrustedCerts",
          description: "",
          label: "Allow Untrusted SSL Certs",
          type: "boolean",
          minValueLength: null,
          maxValueLength: null,
          options: null,
          required: null,
          placeholder: "",
          language: null,
          disabled: null,
          defaultValue: null,
          value: null,
          values: null,
          readOnly: false,
          hiddenValue: null,
          helperText: null
        }
      ],
      icon: "API/HTTP call",
      verified: true
    },
    {
      id: "647966b086bfa2195a19725e",
      name: "execute-advanced-http-call",
      displayName: "Execute Advanced HTTP Call",
      description: "Execute an Advanced HTTP Call",
      status: "active",
      labels: {},
      annotations: {},
      version: 2,
      creationDate: "2020-01-09T00:01:00.000+00:00",
      changelog: {
        author: "59aebd0b7424530fce952fdc",
        reason: "Point to image 2.0.1.  Added helper text for Headers field",
        date: "2020-05-15T16:59:20.522+00:00"
      },
      category: "Utilities",
      type: "template",
      spec: {
        arguments: [
          "http",
          "execute"
        ],
        command: [],
        params: [
          {
            name: "url",
            type: "string",
            description: "",
            defaultValue: null
          },
          {
            name: "method",
            type: "string",
            description: "",
            defaultValue: null
          },
          {
            name: "header",
            type: "string",
            description: "Start a new line for each header",
            defaultValue: ""
          },
          {
            name: "contentType",
            type: "string",
            description: "",
            defaultValue: null
          },
          {
            name: "body",
            type: "string",
            description: "",
            defaultValue: null
          },
          {
            name: "allowUntrustedCerts",
            type: "string",
            description: "",
            defaultValue: null
          }
        ],
        envs: null,
        image: "tools.boomerangplatform.net:8500/ise/bmrg-worker-flow:2.0.1",
        results: null,
        script: null,
        workingDir: null
      },
      config: [
        {
          key: "url",
          description: "",
          label: "URL",
          type: "url",
          minValueLength: null,
          maxValueLength: null,
          options: null,
          required: null,
          placeholder: "",
          language: null,
          disabled: null,
          defaultValue: null,
          value: null,
          values: null,
          readOnly: false,
          hiddenValue: null,
          helperText: null
        },
        {
          key: "method",
          description: "",
          label: "Method",
          type: "select",
          minValueLength: null,
          maxValueLength: null,
          options: [
            {
              key: "GET",
              value: "GET"
            },
            {
              key: "HEAD",
              value: "HEAD"
            },
            {
              key: "PUT",
              value: "PUT"
            },
            {
              key: "POST",
              value: "POST"
            },
            {
              key: "PATCH",
              value: "PATCH"
            },
            {
              key: "OPTIONS",
              value: "OPTIONS"
            },
            {
              key: "DELETE",
              value: "DELETE"
            }
          ],
          required: null,
          placeholder: "",
          language: null,
          disabled: null,
          defaultValue: null,
          value: null,
          values: null,
          readOnly: false,
          hiddenValue: null,
          helperText: null
        },
        {
          key: "header",
          description: "Start a new line for each header",
          label: "Headers",
          type: "textarea",
          minValueLength: null,
          maxValueLength: null,
          options: null,
          required: false,
          placeholder: "",
          language: null,
          disabled: null,
          defaultValue: "",
          value: null,
          values: null,
          readOnly: false,
          hiddenValue: null,
          helperText: "Headers to add to the request, such as Authorization"
        },
        {
          key: "contentType",
          description: "",
          label: "Content Type",
          type: "text",
          minValueLength: null,
          maxValueLength: null,
          options: null,
          required: null,
          placeholder: "",
          language: null,
          disabled: null,
          defaultValue: null,
          value: null,
          values: null,
          readOnly: false,
          hiddenValue: null,
          helperText: null
        },
        {
          key: "body",
          description: "",
          label: "Body",
          type: "texteditor",
          minValueLength: null,
          maxValueLength: null,
          options: null,
          required: null,
          placeholder: "",
          language: null,
          disabled: null,
          defaultValue: null,
          value: null,
          values: null,
          readOnly: false,
          hiddenValue: null,
          helperText: null
        },
        {
          key: "allowUntrustedCerts",
          description: "",
          label: "Allow Untrusted SSL Certs",
          type: "boolean",
          minValueLength: null,
          maxValueLength: null,
          options: null,
          required: null,
          placeholder: "",
          language: null,
          disabled: null,
          defaultValue: null,
          value: null,
          values: null,
          readOnly: false,
          hiddenValue: null,
          helperText: null
        }
      ],
      icon: "API/HTTP call",
      verified: true
    },
    {
      id: "647966a286bfa2195a197235",
      name: "send-platform-notification",
      displayName: "Send Platform Notification",
      description: "Send platform notification to user or team",
      status: "active",
      labels: {},
      annotations: {},
      version: 1,
      creationDate: "2020-01-01T00:01:00.000+00:00",
      changelog: {
        author: "5fc9c3163727f831e8946186",
        reason: "Initial version",
        date: "2021-06-25T04:36:52.164+00:00"
      },
      category: "IBM Services Essentials",
      type: "template",
      spec: {
        arguments: [
          "ibmessentials",
          "sendNotification"
        ],
        command: [],
        params: [
          {
            name: "type",
            type: "string",
            description: "",
            defaultValue: null
          },
          {
            name: "target",
            type: "string",
            description: "",
            defaultValue: null
          },
          {
            name: "title",
            type: "string",
            description: "",
            defaultValue: null
          },
          {
            name: "message",
            type: "string",
            description: "",
            defaultValue: null
          }
        ],
        envs: [],
        image: "",
        results: [],
        script: "",
        workingDir: ""
      },
      config: [
        {
          key: "type",
          description: "",
          label: "Target",
          type: "select",
          minValueLength: null,
          maxValueLength: null,
          options: [
            {
              key: "user",
              value: "user"
            },
            {
              key: "group",
              value: "group"
            }
          ],
          required: null,
          placeholder: "",
          language: null,
          disabled: null,
          defaultValue: null,
          value: null,
          values: null,
          readOnly: false,
          hiddenValue: null,
          helperText: null
        },
        {
          key: "target",
          description: "",
          label: "User or Group",
          type: "text",
          minValueLength: null,
          maxValueLength: null,
          options: null,
          required: null,
          placeholder: "",
          language: null,
          disabled: null,
          defaultValue: null,
          value: null,
          values: null,
          readOnly: false,
          hiddenValue: null,
          helperText: null
        },
        {
          key: "title",
          description: "",
          label: "Title",
          type: "text",
          minValueLength: null,
          maxValueLength: null,
          options: null,
          required: null,
          placeholder: "",
          language: null,
          disabled: null,
          defaultValue: null,
          value: null,
          values: null,
          readOnly: false,
          hiddenValue: null,
          helperText: null
        },
        {
          key: "message",
          description: "",
          label: "Message",
          type: "textarea",
          minValueLength: null,
          maxValueLength: null,
          options: null,
          required: null,
          placeholder: "",
          language: null,
          disabled: null,
          defaultValue: null,
          value: null,
          values: null,
          readOnly: false,
          hiddenValue: null,
          helperText: null
        }
      ],
      icon: "Message",
      verified: true
    },
    {
      id: "647966a286bfa2195a197235",
      name: "send-platform-notification",
      displayName: "Send Platform Notification Latest",
      description: "Send platform notification to user or team",
      status: "active",
      labels: {},
      annotations: {},
      version: 2,
      creationDate: "2020-01-09T00:01:00.000+00:00",
      changelog: {
        author: "Tyson Lawrie",
        reason: "Added new URL input parameter",
        date: "2021-06-25T04:36:52.164+00:00"
      },
      category: "IBM Services Essentials",
      type: "template",
      spec: {
        arguments: [
          "ibmessentials",
          "sendNotification"
        ],
        command: [],
        params: [
          {
            name: "url",
            type: "string",
            description: "",
            defaultValue: "https://ess-core-services-notifications/notifications/submit"
          },
          {
            name: "type",
            type: "string",
            description: "",
            defaultValue: null
          },
          {
            name: "target",
            type: "string",
            description: "",
            defaultValue: null
          },
          {
            name: "title",
            type: "string",
            description: "",
            defaultValue: null
          },
          {
            name: "message",
            type: "string",
            description: "",
            defaultValue: null
          }
        ],
        envs: [],
        image: "",
        results: [],
        script: "",
        workingDir: ""
      },
      config: [
        {
          key: "url",
          description: "",
          label: "URL",
          type: "text",
          minValueLength: null,
          maxValueLength: null,
          options: null,
          required: true,
          placeholder: "",
          language: null,
          disabled: null,
          defaultValue: "https://ess-core-services-notifications/notifications/submit",
          value: null,
          values: null,
          readOnly: false,
          hiddenValue: null,
          helperText: "Endpoint to the internal platform service"
        },
        {
          key: "type",
          description: "",
          label: "Target",
          type: "select",
          minValueLength: null,
          maxValueLength: null,
          options: [
            {
              key: "user",
              value: "user"
            },
            {
              key: "group",
              value: "group"
            }
          ],
          required: null,
          placeholder: "",
          language: null,
          disabled: null,
          defaultValue: null,
          value: null,
          values: null,
          readOnly: false,
          hiddenValue: null,
          helperText: null
        },
        {
          key: "target",
          description: "",
          label: "User or Group",
          type: "text",
          minValueLength: null,
          maxValueLength: null,
          options: null,
          required: null,
          placeholder: "",
          language: null,
          disabled: null,
          defaultValue: null,
          value: null,
          values: null,
          readOnly: false,
          hiddenValue: null,
          helperText: null
        },
        {
          key: "title",
          description: "",
          label: "Title",
          type: "text",
          minValueLength: null,
          maxValueLength: null,
          options: null,
          required: null,
          placeholder: "",
          language: null,
          disabled: null,
          defaultValue: null,
          value: null,
          values: null,
          readOnly: false,
          hiddenValue: null,
          helperText: null
        },
        {
          key: "message",
          description: "",
          label: "Message",
          type: "textarea",
          minValueLength: null,
          maxValueLength: null,
          options: null,
          required: null,
          placeholder: "",
          language: null,
          disabled: null,
          defaultValue: null,
          value: null,
          values: null,
          readOnly: false,
          hiddenValue: null,
          helperText: null
        }
      ],
      icon: "Message",
      verified: true
    },
    {
      "name": "tysons-test-inactive-task",
      "displayName": "Tyson's Test Inactive Task",
      "description": "This is my wonderful test task",
      "status": "inactive",
      "labels": {},
      "annotations": {
          "boomerang.io/generation": "4",
          "boomerang.io/kind": "TaskTemplate"
      },
      "version": 1,
      "creationDate": "2023-07-05T04:16:34.436+00:00",
      "changelog": {
          "author": "admin@flowabl.io",
          "reason": "Initial Task Template",
          "date": "2023-07-05T04:16:32.653+00:00"
      },
      "category": "Test",
      "type": "template",
      "spec": {
          "arguments": [],
          "command": [],
          "params": null,
          "envs": [],
          "image": null,
          "results": [],
          "script": "",
          "workingDir": ""
      },
      "config": [],
      "icon": "Automated task",
      "verified": false
  }
  ],
  number: 0,
  size: 4,
  totalElements: 4,
  pageable: "INSTANCE",
  last: true,
  totalPages: 1,
  sort: {
      sorted: false,
      empty: true,
      unsorted: true
  },
  first: true,
  numberOfElements: 4,
  empty: false
};

export default tasktemplate;
