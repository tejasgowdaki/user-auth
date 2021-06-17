const child_process = require("child_process");

const init = () => {
  const serviceChild = child_process.fork("./src/processes/service");

  serviceChild.on("error", (error) => {
    console.error("Service process error", error);
  });

  serviceChild.on("message", (message) => {
    console.log(
      "🚀 ~ file: index.js ~ line 11 ~ serviceChild.on ~ message",
      message
    );
  });

  serviceChild.on("exit", (code, signal) => {
    console.log(
      "🚀 ~ file: index.js ~ line 20 ~ serviceChild.on exit ~ code, signal",
      code,
      signal
    );

    if (serviceChild) serviceChild.kill();
  });
};

init();
