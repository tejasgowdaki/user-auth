require("dotenv").config();

const expressApp = require("./src/expressApp");

require("./src/processes/index");

process.on("SIGINT", () => {
  console.error("process exit on SIGINT");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.error("process exit on SIGTERM");
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.error(error.stack);
  process.exit(1);
});

process.on("unhandledRejection", (error) => {
  console.error(error.stack);
  process.exit(1);
});

process.on("exit", (code) => {
  console.log(`process exit code: ${process.env.PORT}`);
});

const port = process.env.PORT || 4000;

expressApp.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
