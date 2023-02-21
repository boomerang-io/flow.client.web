const taskTemplateValidate = {
  lastModified: "2022-08-29T06:20:45.131+00:00",
  name: "print-date",
  revisions: [
    {
      arguments: null,
      changelog: null,
      command: null,
      config: null,
      envs: null,
      image: "bash:latest",
      results: [
        {
          description: "The current date in unix timestamp format",
          name: "current-date-unix-timestamp",
        },
        {
          description: "The current date in human readable format",
          name: "current-date-human-readable",
        },
      ],
      script: "#!/usr/bin/env bash\ndate +%s | tee $(results.current-date-unix-timestamp.path)",
      version: 1,
      workingDir: null,
    },
  ],
  status: "active",
  createdDate: "2022-08-29T06:20:45.131+00:00",
  verified: false,
  currentVersion: 1,
  nodeType: "templateTask",
};

export default taskTemplateValidate;
