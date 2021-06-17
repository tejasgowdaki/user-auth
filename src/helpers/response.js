const userErrorMessage = "Something went wrong. Please try again";

const success = (data = {}) => ({ success: true, ...data });

const error = (errorObject, message = null, data = {}) => {
  let errorMessage = "";
  if (errorObject) {
    console.error(errorObject.stack);
    errorMessage = errorObject.message;
  }

  return {
    success: false,
    message: message || errorMessage || userErrorMessage,
    ...data,
  };
};

const apiError = (err, req, res, next) =>
  res.status(err.status || 500).json(error(err));

module.exports = { success, error, apiError };
