module.exports = {
  apps: [
    {
      name: "creator-back",
      script: "dist/src/main.js",
      cwd: "/home/deploy/nest_back",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 5001
      }
    }
  ]
};
