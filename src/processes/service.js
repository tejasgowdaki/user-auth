const { publisher, subscriber } = require("../config/redis");

const { LoginServiceTopic, LoginServiceResultTopic } = require("../constants");

subscriber.subscribe(LoginServiceTopic);

const canLogin = () => {
  const result = parseInt(Math.random() * 100) % 2 === 0;
  publisher.publish(LoginServiceResultTopic, result);
  return;
};

process.on("message", (message) => {
  console.log("🚀 ~ file: service.js ~ line 2 ~ process.on ~ message", message);
});

process.on("uncaughtException", (error) => {
  console.error("service child process uncaughtException", error);
});

subscriber.on("message", (channel, message) => {
  if (channel === LoginServiceTopic) canLogin();
});
