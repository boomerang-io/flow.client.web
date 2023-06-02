const taskTemplate = {
  content: [
    {
      id: "647966b186bfa2195a197262",
      name: "execute-advanced-http-call",
      displayName: "Execute Advanced HTTP Call",
      description: "Execute an Advanced HTTP Call",
      status: "active",
      labels: {},
      annotations: {
        "io.boomerang/kind": "TaskTemplate",
        "io.boomerang/generation": "3"
      },
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
      annotations: {
        "io.boomerang/kind": "TaskTemplate",
        "io.boomerang/generation": "3"
      },
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
      annotations: {
        "io.boomerang/kind": "TaskTemplate",
        "io.boomerang/generation": "3"
      },
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
      annotations: {
        "io.boomerang/kind": "TaskTemplate",
        "io.boomerang/generation": "3"
      },
      version: 2,
      creationDate: "2020-01-09T00:01:00.000+00:00",
      changelog: {
        author: "5fc9c3163727f831e8946186",
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
      id: "647966a186bfa2195a197232",
      name: "send-platform-email",
      displayName: "Send Platform Email",
      description: "Send Email to Member with Subject and Message",
      status: "active",
      labels: {},
      annotations: {
        "io.boomerang/kind": "TaskTemplate",
        "io.boomerang/generation": "3"
      },
      version: 2,
      creationDate: "2020-01-09T00:01:00.000+00:00",
      changelog: {
        author: "5fc9c3163727f831e8946186",
        reason: "Added new URL endpoint",
        date: "2021-06-25T04:36:19.511+00:00"
      },
      category: "IBM Services Essentials",
      type: "template",
      spec: {
        arguments: [
          "ibmessentials",
          "sendMailToMember"
        ],
        command: [],
        params: [
          {
            name: "url",
            type: "string",
            description: "",
            defaultValue: "http://ess-core-services-messaging/messaging/mail/event"
          },
          {
            name: "to",
            type: "string",
            description: "",
            defaultValue: null
          },
          {
            name: "subject",
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
          defaultValue: "http://ess-core-services-messaging/messaging/mail/event",
          value: null,
          values: null,
          readOnly: false,
          hiddenValue: null,
          helperText: "Endpoint to the internal platform service"
        },
        {
          key: "to",
          description: "",
          label: "To",
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
          key: "subject",
          description: "",
          label: "Subject",
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
      id: "6479669a86bfa2195a19721d",
      name: "find-repositories-in-org",
      displayName: "Find Repositories in Org",
      description: "Find Repositories in a GitHub organization",
      status: "active",
      labels: {},
      annotations: {
        "io.boomerang/kind": "TaskTemplate",
        "io.boomerang/generation": "3"
      },
      version: 3,
      creationDate: "2020-01-09T00:01:00.000+00:00",
      changelog: {
        author: "608fb6fb70bfa94ac91f90cb",
        reason: "",
        date: "2021-06-25T09:38:04.792+00:00"
      },
      category: "GitHub",
      type: "template",
      spec: {
        arguments: [
          "github",
          "findReposInOrg"
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
            name: "token",
            type: "string",
            description: "",
            defaultValue: null
          },
          {
            name: "org",
            type: "string",
            description: "",
            defaultValue: null
          },
          {
            name: "visibility",
            type: "string",
            description: "Specifies the types of repositories you want returned",
            defaultValue: "all"
          },
          {
            name: "skipRepos",
            type: "string",
            description: "Newline delimited list",
            defaultValue: null
          },
          {
            name: "numToRetrieve",
            type: "string",
            description: "",
            defaultValue: null
          },
          {
            name: "outputFilePath",
            type: "string",
            description: "If provided, the result parameter is not filled",
            defaultValue: null
          }
        ],
        envs: [],
        image: "",
        results: [
          {
            description: "Filtered repositories list",
            name: "repositories"
          },
          {
            description: "Filtered list based repositories",
            name: "repositoriesPrettyPrint"
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
          key: "token",
          description: "",
          label: "Token",
          type: "password",
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
          key: "org",
          description: "",
          label: "Org",
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
          key: "visibility",
          description: "Specifies the types of repositories you want returned",
          label: "Visibility",
          type: "select",
          minValueLength: null,
          maxValueLength: null,
          options: [
            {
              key: "all",
              value: "all"
            },
            {
              key: "public",
              value: "public"
            },
            {
              key: "private",
              value: "private"
            },
            {
              key: "forks",
              value: "forks"
            },
            {
              key: "sources",
              value: "sources"
            },
            {
              key: "member",
              value: "member"
            },
            {
              key: "internal",
              value: "internal"
            }
          ],
          required: false,
          placeholder: "",
          language: null,
          disabled: null,
          defaultValue: "all",
          value: null,
          values: null,
          readOnly: false,
          hiddenValue: null,
          helperText: ""
        },
        {
          key: "skipRepos",
          description: "Newline delimited list",
          label: "Repositories to Skip",
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
        },
        {
          key: "numToRetrieve",
          description: "",
          label: "Number of Repositories to Retrieve",
          type: "number",
          minValueLength: null,
          maxValueLength: null,
          options: null,
          required: false,
          placeholder: "Default: 30",
          language: null,
          disabled: null,
          defaultValue: null,
          value: null,
          values: null,
          readOnly: false,
          hiddenValue: null,
          helperText: ""
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
          defaultValue: null,
          value: null,
          values: null,
          readOnly: false,
          hiddenValue: null,
          helperText: "File path to store the output response"
        }
      ],
      icon: "API/HTTP call",
      verified: true
    },
    {
      id: "6479669a86bfa2195a19721b",
      name: "find-repositories-in-org",
      displayName: "Find Repositories in Org",
      description: "Find Repositories in a GitHub organization",
      status: "active",
      labels: {},
      annotations: {
        "io.boomerang/kind": "TaskTemplate",
        "io.boomerang/generation": "3"
      },
      version: 2,
      creationDate: "2020-01-09T00:01:00.000+00:00",
      changelog: {
        author: "608fb6fb70bfa94ac91f90cb",
        reason: "",
        date: "2021-06-25T08:54:29.521+00:00"
      },
      category: "GitHub",
      type: "template",
      spec: {
        arguments: [
          "github",
          "findReposInOrg"
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
            name: "token",
            type: "string",
            description: "",
            defaultValue: null
          },
          {
            name: "org",
            type: "string",
            description: "",
            defaultValue: null
          },
          {
            name: "visibility",
            type: "string",
            description: "Specifies the types of repositories you want returned",
            defaultValue: "all"
          },
          {
            name: "skipRepos",
            type: "string",
            description: "Newline delimited list",
            defaultValue: null
          },
          {
            name: "numToRetrieve",
            type: "string",
            description: "",
            defaultValue: null
          }
        ],
        envs: [],
        image: "boomerangio/worker-flow:2.8.6",
        results: [
          {
            description: "Filtered repositories list",
            name: "repositories"
          },
          {
            description: "Filtered list based repositories",
            name: "repositoriesPrettyPrint"
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
          key: "token",
          description: "",
          label: "Token",
          type: "password",
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
          key: "org",
          description: "",
          label: "Org",
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
          key: "visibility",
          description: "Specifies the types of repositories you want returned",
          label: "Visibility",
          type: "select",
          minValueLength: null,
          maxValueLength: null,
          options: [
            {
              key: "all",
              value: "all"
            },
            {
              key: "public",
              value: "public"
            },
            {
              key: "private",
              value: "private"
            },
            {
              key: "forks",
              value: "forks"
            },
            {
              key: "sources",
              value: "sources"
            },
            {
              key: "member",
              value: "member"
            },
            {
              key: "internal",
              value: "internal"
            }
          ],
          required: false,
          placeholder: "",
          language: null,
          disabled: null,
          defaultValue: "all",
          value: null,
          values: null,
          readOnly: false,
          hiddenValue: null,
          helperText: ""
        },
        {
          key: "skipRepos",
          description: "Newline delimited list",
          label: "Repositories to Skip",
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
        },
        {
          key: "numToRetrieve",
          description: "",
          label: "Number of Repositories to Retrieve",
          type: "number",
          minValueLength: null,
          maxValueLength: null,
          options: null,
          required: false,
          placeholder: "Default: 30",
          language: null,
          disabled: null,
          defaultValue: null,
          value: null,
          values: null,
          readOnly: false,
          hiddenValue: null,
          helperText: ""
        }
      ],
      icon: "API/HTTP call",
      verified: true
    },
    {
      id: "6479669786bfa2195a197212",
      name: "execute-shell",
      displayName: "Execute Shell",
      description: "Execute a shell script",
      status: "active",
      labels: {},
      annotations: {
        "io.boomerang/kind": "TaskTemplate",
        "io.boomerang/generation": "3"
      },
      version: 2,
      creationDate: "2020-01-09T00:01:00.000+00:00",
      changelog: {
        author: "5e71f175756f7e000192eb6c",
        reason: "",
        date: "2021-03-31T23:43:57.797+00:00"
      },
      category: "Utilities",
      type: "script",
      spec: {
        arguments: [
          "shell",
          "execute"
        ],
        command: [],
        params: [
          {
            name: "path",
            type: "string",
            description: "",
            defaultValue: null
          },
          {
            name: "shell",
            type: "string",
            description: "",
            defaultValue: null
          },
          {
            name: "script",
            type: "string",
            description: "",
            defaultValue: ""
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
          key: "path",
          description: "",
          label: "Directory Path",
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
          key: "shell",
          description: "",
          label: "Shell Interpreter",
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
          key: "script",
          description: "",
          label: "Shell Script",
          type: "texteditor::shell",
          minValueLength: null,
          maxValueLength: null,
          options: null,
          required: true,
          placeholder: "",
          language: null,
          disabled: null,
          defaultValue: "",
          value: null,
          values: null,
          readOnly: false,
          hiddenValue: null,
          helperText: ""
        }
      ],
      icon: "Terminal",
      verified: true
    },
    {
      id: "6479668d86bfa2195a1971f7",
      name: "find-slack-member-by-email",
      displayName: "Find Slack Member By Email",
      description: "Find a Slack user based on the provided email address using a Slack application through Bot tokens. For further reading on the underlying API see https://api.slack.com/methods/users.lookupByEmail",
      status: "active",
      labels: {},
      annotations: {
        "io.boomerang/kind": "TaskTemplate",
        "io.boomerang/generation": "3"
      },
      version: 2,
      creationDate: "2020-01-09T00:01:00.000+00:00",
      changelog: {
        author: "608fb6fb70bfa94ac91f90cb",
        reason: "",
        date: "2021-06-15T17:09:46.299+00:00"
      },
      category: "Communication with Slack",
      type: "template",
      spec: {
        arguments: [
          "slack",
          "lookUpUser"
        ],
        command: [],
        params: [
          {
            name: "token",
            type: "string",
            description: "Token is associated with the slack app tied to a workspace",
            defaultValue: ""
          },
          {
            name: "emailAddress",
            type: "string",
            description: "",
            defaultValue: ""
          }
        ],
        envs: [],
        image: "",
        results: [
          {
            description: "The slack user id",
            name: "slackUserId"
          }
        ],
        script: "",
        workingDir: ""
      },
      config: [
        {
          key: "token",
          description: "Token is associated with the slack app tied to a workspace",
          label: "Authentication API Token",
          type: "text",
          minValueLength: null,
          maxValueLength: null,
          options: null,
          required: true,
          placeholder: "e.g. xxxx-xxxxxxxxx-xxxx",
          language: null,
          disabled: null,
          defaultValue: "",
          value: null,
          values: null,
          readOnly: false,
          hiddenValue: null,
          helperText: "The token is associated with the slack application"
        },
        {
          key: "emailAddress",
          description: "",
          label: "Email Address",
          type: "text",
          minValueLength: null,
          maxValueLength: null,
          options: null,
          required: true,
          placeholder: "e.g. spengler@ghostbusters.example.com",
          language: null,
          disabled: null,
          defaultValue: "",
          value: null,
          values: null,
          readOnly: false,
          hiddenValue: null,
          helperText: "An email belonging to a user in the workspace"
        }
      ],
      icon: "Search",
      verified: true
    },
    {
      id: "6479668986bfa2195a1971ed",
      name: "artifactory-file-upload",
      displayName: "Artifactory File Upload",
      description: "Upload file to Artifactory",
      status: "active",
      labels: {},
      annotations: {
        "io.boomerang/kind": "TaskTemplate",
        "io.boomerang/generation": "3"
      },
      version: 2,
      creationDate: "2020-01-09T00:01:00.000+00:00",
      changelog: {
        author: "5e71f175756f7e000192eb6c",
        reason: "",
        date: "2021-03-31T23:44:49.840+00:00"
      },
      category: "Artifactory",
      type: "template",
      spec: {
        arguments: [
          "artifactory",
          "uploadFile"
        ],
        command: [],
        params: [
          {
            name: "url",
            type: "string",
            description: "",
            defaultValue: ""
          },
          {
            name: "file",
            type: "string",
            description: "",
            defaultValue: ""
          },
          {
            name: "username",
            type: "string",
            description: "",
            defaultValue: null
          },
          {
            name: "password",
            type: "string",
            description: "",
            defaultValue: null
          },
          {
            name: "apiKey",
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
          type: "text",
          minValueLength: null,
          maxValueLength: null,
          options: null,
          required: false,
          placeholder: "artifactory.url/folder/test.txt",
          language: null,
          disabled: null,
          defaultValue: "",
          value: null,
          values: null,
          readOnly: false,
          hiddenValue: null,
          helperText: "File will be uploaded at the specified path. Include file name"
        },
        {
          key: "file",
          description: "",
          label: "File",
          type: "text",
          minValueLength: null,
          maxValueLength: null,
          options: null,
          required: false,
          placeholder: "/data/test.txt",
          language: null,
          disabled: null,
          defaultValue: "",
          value: null,
          values: null,
          readOnly: false,
          hiddenValue: null,
          helperText: "Specify the desired file in it's absolute path"
        },
        {
          key: "username",
          description: "",
          label: "Username",
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
          key: "password",
          description: "",
          label: "Password",
          type: "password",
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
          key: "apiKey",
          description: "",
          label: "API Key",
          type: "password",
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
      icon: "Upload",
      verified: true
    },
    {
      id: "6479668486bfa2195a1971df",
      name: "create-file",
      displayName: "Create File",
      description: "Create file in worker.",
      status: "active",
      labels: {},
      annotations: {
        "io.boomerang/kind": "TaskTemplate",
        "io.boomerang/generation": "3"
      },
      version: 3,
      creationDate: "2020-01-09T00:01:00.000+00:00",
      changelog: {
        author: "5e71f175756f7e000192eb6c",
        reason: "",
        date: "2021-03-31T23:46:32.143+00:00"
      },
      category: "File Utilities",
      type: "template",
      spec: {
        arguments: [
          "file",
          "createFile"
        ],
        command: [],
        params: [
          {
            name: "path",
            type: "string",
            description: "",
            defaultValue: null
          },
          {
            name: "content",
            type: "string",
            description: "",
            defaultValue: null
          },
          {
            name: "createDir",
            type: "string",
            description: "",
            defaultValue: "false"
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
          key: "path",
          description: "",
          label: "File Path",
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
          key: "content",
          description: "",
          label: "File Content",
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
          key: "createDir",
          description: "",
          label: "Creation Directories",
          type: "boolean",
          minValueLength: null,
          maxValueLength: null,
          options: null,
          required: false,
          placeholder: "",
          language: null,
          disabled: null,
          defaultValue: "false",
          value: null,
          values: null,
          readOnly: false,
          hiddenValue: null,
          helperText: "Recursively create path as needed"
        }
      ],
      icon: "Add",
      verified: true
    },
    {
      id: "6479668486bfa2195a1971dd",
      name: "create-file",
      displayName: "Create File",
      description: "Create file in worker.",
      status: "active",
      labels: {},
      annotations: {
        "io.boomerang/kind": "TaskTemplate",
        "io.boomerang/generation": "3"
      },
      version: 2,
      creationDate: "2020-01-09T00:01:00.000+00:00",
      changelog: {
        author: "5e831153d0827100011c29f6",
        reason: "",
        date: "2020-04-30T22:51:53.014+00:00"
      },
      category: "File Utilities",
      type: "template",
      spec: {
        arguments: [
          "file",
          "createFile"
        ],
        command: [],
        params: [
          {
            name: "path",
            type: "string",
            description: "",
            defaultValue: null
          },
          {
            name: "content",
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
          key: "path",
          description: "",
          label: "File Path",
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
          key: "content",
          description: "",
          label: "File Content",
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
        }
      ],
      icon: "Add",
      verified: true
    },
    {
      id: "6479667e86bfa2195a1971ce",
      name: "upload-slack-file-with-message",
      displayName: "Upload Slack File with Message",
      description: "Upload a message to Slack using a Slack application through Bot tokens. For further reading on the underlying API see https://api.slack.com/methods/files.upload",
      status: "active",
      labels: {},
      annotations: {
        "io.boomerang/kind": "TaskTemplate",
        "io.boomerang/generation": "3"
      },
      version: 2,
      creationDate: "2020-01-09T00:01:00.000+00:00",
      changelog: {
        author: "5e79e5ae2e0ee000015cacde",
        reason: "",
        date: "2021-03-22T10:00:29.629+00:00"
      },
      category: "Communication with Slack",
      type: "template",
      spec: {
        arguments: [
          "slack",
          "uploadFileMessage"
        ],
        command: [],
        params: [
          {
            name: "token",
            type: "string",
            description: "Token is associated with the slack app tied to a workspace",
            defaultValue: ""
          },
          {
            name: "channel",
            type: "string",
            description: "",
            defaultValue: ""
          },
          {
            name: "message",
            type: "string",
            description: "",
            defaultValue: ""
          },
          {
            name: "fileName",
            type: "string",
            description: "",
            defaultValue: null
          },
          {
            name: "fileContent",
            type: "string",
            description: "If omitting this parameter, you must provide a File Path",
            defaultValue: ""
          },
          {
            name: "encoded",
            type: "string",
            description: "Enable if File Content provided is base64 encoded ",
            defaultValue: "false"
          },
          {
            name: "filePath",
            type: "string",
            description: "",
            defaultValue: null
          },
          {
            name: "fileTitle",
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
          key: "token",
          description: "Token is associated with the slack app tied to a workspace",
          label: "Token",
          type: "text",
          minValueLength: null,
          maxValueLength: null,
          options: null,
          required: false,
          placeholder: "xxxx-xxxxxxxxx-xxxx",
          language: null,
          disabled: null,
          defaultValue: "",
          value: null,
          values: null,
          readOnly: false,
          hiddenValue: null,
          helperText: ""
        },
        {
          key: "channel",
          description: "",
          label: "Channel",
          type: "text",
          minValueLength: null,
          maxValueLength: null,
          options: null,
          required: false,
          placeholder: "#channel-name",
          language: null,
          disabled: null,
          defaultValue: "",
          value: null,
          values: null,
          readOnly: false,
          hiddenValue: null,
          helperText: ""
        },
        {
          key: "message",
          description: "",
          label: "Message",
          type: "textarea",
          minValueLength: null,
          maxValueLength: null,
          options: null,
          required: false,
          placeholder: "Your message here.",
          language: null,
          disabled: null,
          defaultValue: "",
          value: null,
          values: null,
          readOnly: false,
          hiddenValue: null,
          helperText: ""
        },
        {
          key: "fileName",
          description: "",
          label: "File Name",
          type: "text",
          minValueLength: null,
          maxValueLength: null,
          options: null,
          required: false,
          placeholder: "foo.txt",
          language: null,
          disabled: null,
          defaultValue: null,
          value: null,
          values: null,
          readOnly: false,
          hiddenValue: null,
          helperText: "Filename of file."
        },
        {
          key: "fileContent",
          description: "If omitting this parameter, you must provide a File Path",
          label: "File Content",
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
          helperText: "File contents via a POST variable"
        },
        {
          key: "encoded",
          description: "Enable if File Content provided is base64 encoded ",
          label: "Decode File Content",
          type: "boolean",
          minValueLength: null,
          maxValueLength: null,
          options: null,
          required: false,
          placeholder: "",
          language: null,
          disabled: null,
          defaultValue: "false",
          value: null,
          values: null,
          readOnly: false,
          hiddenValue: null,
          helperText: ""
        },
        {
          key: "filePath",
          description: "",
          label: "File Path",
          type: "text",
          minValueLength: null,
          maxValueLength: null,
          options: null,
          required: false,
          placeholder: "/workflow/your_file.txt",
          language: null,
          disabled: null,
          defaultValue: null,
          value: null,
          values: null,
          readOnly: false,
          hiddenValue: null,
          helperText: "Full path to desired file"
        },
        {
          key: "fileTitle",
          description: "",
          label: "File Title",
          type: "text",
          minValueLength: null,
          maxValueLength: null,
          options: null,
          required: false,
          placeholder: "My File",
          language: null,
          disabled: null,
          defaultValue: null,
          value: null,
          values: null,
          readOnly: false,
          hiddenValue: null,
          helperText: "Title of file."
        }
      ],
      icon: "Upload",
      verified: true
    },
    {
      id: "5c3d0401352b1b514150545b",
      name: "execute-advanced-http-call",
      displayName: "Execute Advanced HTTP Call",
      description: "Execute an Advanced HTTP Call",
      status: "active",
      labels: {},
      annotations: {
        "io.boomerang/kind": "TaskTemplate",
        "io.boomerang/generation": "3"
      },
      version: 1,
      creationDate: "2020-01-09T00:01:00.000+00:00",
      changelog: {
        author: "5e831153d0827100011c29f6",
        reason: "",
        date: "2020-04-30T22:48:55.795+00:00"
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
            description: "",
            defaultValue: null
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
          description: "",
          label: "Headers",
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
      id: "60f852430b07a54cdc48dc97",
      name: "set-workflow-result-status",
      displayName: "Set Workflow Result Status",
      description: "Override Workflow Execution Status",
      status: "active",
      labels: {},
      annotations: {
        "io.boomerang/kind": "TaskTemplate",
        "io.boomerang/generation": "3"
      },
      version: 1,
      creationDate: "2020-01-09T00:01:00.000+00:00",
      changelog: {
        author: "5e8a6c6cd0827100011c2a35",
        reason: "",
        date: "2020-04-30T22:53:23.337+00:00"
      },
      category: "Workflow",
      type: "setwfstatus",
      spec: {
        arguments: [
          "setwfstatus"
        ],
        command: [],
        params: [
          {
            name: "status",
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
          key: "status",
          description: "",
          label: "Status",
          type: "select",
          minValueLength: null,
          maxValueLength: null,
          options: [
            {
              key: "completed",
              value: "Success"
            },
            {
              key: "failure",
              value: "Failed"
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
        }
      ],
      icon: "Edit",
      verified: true
    },
    {
      id: "5d9e703dc90b5240508869e2",
      name: "run-custom-task",
      displayName: "Run Custom Task",
      description: "Run a trusted custom container as a task",
      status: "active",
      labels: {},
      annotations: {
        "io.boomerang/kind": "TaskTemplate",
        "io.boomerang/generation": "3"
      },
      version: 1,
      creationDate: "2020-01-09T00:01:00.000+00:00",
      changelog: {
        author: "5e736fb0a97b78000125ebe3",
        reason: "Testing ",
        date: "2020-09-25T21:11:01.767+00:00"
      },
      category: "Workflow",
      type: "custom",
      spec: {
        arguments: [
          "."
        ],
        command: [],
        params: [
          {
            name: "image",
            type: "string",
            description: "Can be identified by a container image reference. i.e. registry / namespace / repository:tag",
            defaultValue: ""
          },
          {
            name: "command",
            type: "string",
            description: "",
            defaultValue: null
          },
          {
            name: "arguments",
            type: "string",
            description: "",
            defaultValue: null
          },
          {
            name: "shellScript",
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
          key: "image",
          description: "Can be identified by a container image reference. i.e. registry / namespace / repository:tag",
          label: "Image",
          type: "text",
          minValueLength: null,
          maxValueLength: null,
          options: null,
          required: false,
          placeholder: "e.g. docker.io/docker/whalesay",
          language: null,
          disabled: null,
          defaultValue: "",
          value: null,
          values: null,
          readOnly: false,
          hiddenValue: null,
          helperText: "Enter a valid container image reference"
        },
        {
          key: "command",
          description: "",
          label: "Command",
          type: "textarea",
          minValueLength: null,
          maxValueLength: null,
          options: null,
          required: null,
          placeholder: "e.g. cowsay",
          language: null,
          disabled: null,
          defaultValue: null,
          value: null,
          values: null,
          readOnly: false,
          hiddenValue: null,
          helperText: "New line delimited container command. You can access environment variables using $(variable) notation."
        },
        {
          key: "arguments",
          description: "",
          label: "Arguments",
          type: "textarea",
          minValueLength: null,
          maxValueLength: null,
          options: null,
          required: null,
          placeholder: "e.g. hello world",
          language: null,
          disabled: null,
          defaultValue: null,
          value: null,
          values: null,
          readOnly: false,
          hiddenValue: null,
          helperText: "New line delimited container arguments. You can access environment variables using $(variable) notation."
        },
        {
          key: "shellScript",
          description: "",
          label: "Script",
          type: "texteditor::shell",
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
      icon: "Code",
      verified: true
    },
    {
      id: "5d53016bd83be3cc84bae976",
      name: "send-platform-notification",
      displayName: "Send Platform Notification",
      description: "Send platform notification to user or team",
      status: "active",
      labels: {},
      annotations: {
        "io.boomerang/kind": "TaskTemplate",
        "io.boomerang/generation": "3"
      },
      version: 1,
      creationDate: "2020-01-09T00:01:00.000+00:00",
      changelog: {
        author: "5fc9c3163727f831e8946186",
        reason: "",
        date: "2021-06-25T04:36:29.565+00:00"
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
      id: "5bd98b105a5df954ad599bc2",
      name: "send-platform-email",
      displayName: "Send Platform Email",
      description: "Send Email to Member with Subject and Message",
      status: "active",
      labels: {},
      annotations: {
        "io.boomerang/kind": "TaskTemplate",
        "io.boomerang/generation": "3"
      },
      version: 1,
      creationDate: "2020-01-09T00:01:00.000+00:00",
      changelog: {
        author: "5fc9c3163727f831e8946186",
        reason: "",
        date: "2021-06-25T04:35:49.492+00:00"
      },
      category: "IBM Services Essentials",
      type: "template",
      spec: {
        arguments: [
          "ibmessentials",
          "sendMailToMember"
        ],
        command: [],
        params: [
          {
            name: "to",
            type: "string",
            description: "",
            defaultValue: null
          },
          {
            name: "subject",
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
          key: "to",
          description: "",
          label: "To",
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
          key: "subject",
          description: "",
          label: "Subject",
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
      id: "5d25414c988e7b6b6fb3d5f7",
      name: "find-repositories-in-org",
      displayName: "Find Repositories in Org",
      description: "Find Repositories in a GitHub organization",
      status: "active",
      labels: {},
      annotations: {
        "io.boomerang/kind": "TaskTemplate",
        "io.boomerang/generation": "3"
      },
      version: 1,
      creationDate: "2020-01-09T00:01:00.000+00:00",
      changelog: {
        author: "5e8a6c6cd0827100011c2a35",
        reason: "",
        date: "2020-04-30T22:51:00.560+00:00"
      },
      category: "GitHub",
      type: "template",
      spec: {
        arguments: [
          "github",
          "findPublicReposInOrg"
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
            name: "token",
            type: "string",
            description: "",
            defaultValue: null
          },
          {
            name: "org",
            type: "string",
            description: "",
            defaultValue: null
          },
          {
            name: "skipRepos",
            type: "string",
            description: "Newline delimited list",
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
          key: "token",
          description: "",
          label: "Token",
          type: "password",
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
          key: "org",
          description: "",
          label: "Org",
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
          key: "skipRepos",
          description: "Newline delimited list",
          label: "Repositories to Skip",
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
      icon: "API/HTTP call",
      verified: true
    },
    {
      id: "5c3907a1352b1b51412ed079",
      name: "execute-shell",
      displayName: "Execute Shell",
      description: "Execute a shell script",
      status: "active",
      labels: {},
      annotations: {
        "io.boomerang/kind": "TaskTemplate",
        "io.boomerang/generation": "3"
      },
      version: 1,
      creationDate: "2020-01-09T00:01:00.000+00:00",
      changelog: {
        author: "5e831153d0827100011c29f6",
        reason: "",
        date: "2020-04-30T22:48:44.591+00:00"
      },
      category: "Utilities",
      type: "script",
      spec: {
        arguments: [
          "shell",
          "execute"
        ],
        command: [],
        params: [
          {
            name: "path",
            type: "string",
            description: "",
            defaultValue: null
          },
          {
            name: "shell",
            type: "string",
            description: "",
            defaultValue: null
          },
          {
            name: "script",
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
          key: "path",
          description: "",
          label: "Directory Path",
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
          key: "shell",
          description: "",
          label: "Shell Interpreter",
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
          key: "script",
          description: "",
          label: "Shell Script",
          type: "texteditor::shell",
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
      icon: "Terminal",
      verified: true
    },
    {
      id: "5f6379c974f51934044cbbd6",
      name: "manual-approval",
      displayName: "Manual Approval",
      description: "Pauses workflow until approval is actioned.",
      status: "active",
      labels: {},
      annotations: {
        "io.boomerang/kind": "TaskTemplate",
        "io.boomerang/generation": "3"
      },
      version: 1,
      creationDate: "2020-01-09T00:01:00.000+00:00",
      changelog: {
        author: "608fb6fb70bfa94ac91f90cb",
        reason: "",
        date: "2021-06-18T04:45:17.830+00:00"
      },
      category: "Workflow",
      type: "approval",
      spec: {
        arguments: [
          "approval"
        ],
        command: [],
        params: [],
        envs: [],
        image: "",
        results: [
          {
            description: "The status of the approval task, can be approved or rejected.",
            name: "approvalStatus"
          },
          {
            description: "Date and time of the action",
            name: "approvalDate"
          },
          {
            description: "Username of the approver",
            name: "approvalUserName"
          },
          {
            description: "Email address of the approver",
            name: "approvalUserEmail"
          },
          {
            description: "Additional comments added by the approver",
            name: "approvalComments"
          }
        ],
        script: "",
        workingDir: ""
      },
      config: [],
      icon: "Edit",
      verified: true
    },
  ],
  number: 0,
  size: 21,
  totalElements: 21,
  pageable: {
    sort: {
      unsorted: true,
      sorted: false,
      empty: true
    },
    pageNumber: 0,
    pageSize: 21,
    offset: 0,
    paged: true,
    unpaged: false
  },
  last: true,
  totalPages: 1,
  sort: {
    unsorted: true,
    sorted: false,
    empty: true
  },
  first: true,
  numberOfElements: 21,
  empty: false
};

export default taskTemplate;
