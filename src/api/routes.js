const express = require("express");

const { apiError } = require("../helpers/response");

const { ResponseCode } = require("../constants");

const userRouter = require("./user/routes");

const router = (app) => {
  const mainRouter = express.Router();

  mainRouter.use("/users", userRouter, apiError);

  // If no routes matches
  mainRouter.use((req, res, next) => {
    if (!req.route) {
      const error = new Error("No route matched");
      error.status = ResponseCode.NOT_FOUND;
      return next(error);
    }

    next();
  });

  app.use("/api", mainRouter);
};

module.exports = router;
