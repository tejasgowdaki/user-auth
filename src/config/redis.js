const redis = require("redis");

const subscriber = redis.createClient();
const publisher = redis.createClient();

subscriber.on("error", function (error) {
  console.error("subscriber", error);
});

publisher.on("error", function (error) {
  console.error("publisher", error);
});

module.exports = { publisher, subscriber };
