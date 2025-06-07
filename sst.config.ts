/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "optiscape",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },

  async run() {
    new sst.x.DevCommand("DockerCompose", {
      dev: {
        command: 'docker compose --profile dev up',
      },
    });

    const vpc = new sst.aws.Vpc("Vpc");
    const cluster = new sst.aws.Cluster("Cluster", { vpc });

    new sst.aws.Service("Frontend", {
      cluster,
      loadBalancer: {
        ports: [{ listen: "80/http", forward: "3000/http" }],
      },
      dev: {
        command: 'docker compose attach frontend-dev'
      },
    });
  },
});
