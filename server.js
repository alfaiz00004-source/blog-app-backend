const { app } = require("./app");
const connectDB = require("./db");
const dns = require("node:dns")

dns.setServers(["8.8.8.8"]);
const PORT = process.env.PORT;


async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log("Server Started");
  });
}

startServer();
