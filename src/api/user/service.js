const bcrypt = require("bcrypt");

const { publisher, subscriber } = require("../../config/redis");

const { User } = require("../../models");

const {
  ResponseCode,
  LoginServiceTopic,
  LoginServiceResultTopic,
} = require("../../constants");

const SALT_FACTOR = 5;

const validate = (username, password) => {
  if (!username) {
    let error = new Error("Username is required");
    error.status = ResponseCode.VALIDATION_ERROR;
    throw error;
  }

  if (!password) {
    let error = new Error("Password is required");
    error.status = ResponseCode.VALIDATION_ERROR;
    throw error;
  }

  return true;
};

const validateSignUp = async (username, password) => {
  validate(username, password);

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    let error = new Error("Username already exists");
    error.status = ResponseCode.VALIDATION_ERROR;
    throw error;
  }

  return true;
};

const getHashedPassword = async (password) => {
  const salt = await bcrypt.genSalt(SALT_FACTOR);
  return bcrypt.hash(password, salt);
};

const validateLogIn = async (username, password) => {
  validate(username, password);

  const existingUser = await User.findOne({ username });
  if (!existingUser) {
    let error = new Error("User does not exist");
    error.status = ResponseCode.NOT_FOUND;
    throw error;
  }

  return existingUser;
};

const checkPassword = async (password, hashedPassword) => {
  const result = await bcrypt.compare(password, hashedPassword);

  if (!result) {
    let error = new Error("Invalid password");
    error.status = ResponseCode.VALIDATION_ERROR;
    throw error;
  }

  return result;
};

const canLogin = async () => {
  return new Promise((resolve, reject) => {
    publisher.get("logInCount", (err, value) => {
      try {
        if (err) throw err;

        const newValue = value ? +value + 1 : 1;

        publisher.set("logInCount", newValue);

        if (newValue % 5 === 0) {
          let errorObject = new Error(
            "Login blocked, because login count is multile of 5"
          );
          errorObject.status = ResponseCode.VALIDATION_ERROR;
          throw errorObject;
        }

        return resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  });
};

const validateThirdPartyLogin = () => {
  return new Promise((resolve, reject) => {
    try {
      subscriber.subscribe(LoginServiceResultTopic);

      publisher.publish(LoginServiceTopic, "hello");

      subscriber.on("message", (channel, message) => {
        if (channel === LoginServiceResultTopic) {
          subscriber.unsubscribe();
          return resolve(message === "true");
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  validateSignUp,
  getHashedPassword,
  validateLogIn,
  checkPassword,
  canLogin,
  validateThirdPartyLogin,
};
