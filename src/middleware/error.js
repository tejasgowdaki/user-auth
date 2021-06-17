const { ResponseCode } = require("../constants");

module.exports = (error, req, res, next) => {
  console.error(error.stack);

  res.status(error.status || ResponseCode.INTERNAL_ERROR).json({
    success: false,
    message: error.status
      ? error.message
      : "Something went wrong, please try again",
  });
};
