const ResponseCode = {
  SUCCESS: 200,
  NOT_FOUND: 404,
  VALIDATION_ERROR: 422,
  INTERNAL_ERROR: 500,
};

const LoginServiceTopic = "CanLoginThirdParty";
const LoginServiceResultTopic = "CanLoginThirdPartyResult";

module.exports = Object.freeze({
  ResponseCode,
  LoginServiceTopic,
  LoginServiceResultTopic,
});
