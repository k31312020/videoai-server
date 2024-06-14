module.exports = {
    apps : [
        {
          name: "app",
          script: "./dist/server.js",
          watch: true,
          env: {
            "HOSTNAME":"localhost",
            "PORT":5000,
            "DATABASE_URL":"postgres://postgres:postgres@localhost:5432/video",
            "SECRET":"videosecret"
          }
        }
    ]
  }