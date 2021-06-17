const response = require("../../helpers/response");

const { User } = require("../../models");

const { publisher, subscriber } = require("../../config/redis");

const {
  validateSignUp,
  getHashedPassword,
  validateLogIn,
  checkPassword,
  canLogin,
  validateThirdPartyLogin,
} = require("./service");

const {
  ResponseCode,
  LoginServiceTopic,
  LoginServiceResultTopic,
} = require("../../constants");

const signUp = async (req, res) => {
  const username = (req.body.username || "").trim();
  const password = req.body.password || "";

  await validateSignUp(username, password);

  const hashedPassword = await getHashedPassword(password);

  const { _id } = await User.create({
    username,
    password: hashedPassword,
  });

  res
    .status(ResponseCode.SUCCESS)
    .json(response.success({ user: { _id, username } }));
};

const logIn = async (req, res) => {
  const username = (req.body.username || "").trim();
  const password = req.body.password || "";

  // presence validation
  const user = await validateLogIn(username, password);

  // password match validation
  await checkPassword(password, user.password);

  // log count multiple of 5 validation
  await canLogin();

  // third party login validation
  const canLoginThirdPary = await validateThirdPartyLogin();

  if (!canLoginThirdPary) {
    let error = new Error("Login blocked by 3rd party");
    error.status = ResponseCode.VALIDATION_ERROR;
    throw error;
  }

  res
    .status(ResponseCode.SUCCESS)
    .json(response.success({ user: { _id: user._id, username } }));
};

module.exports = { signUp, logIn };
