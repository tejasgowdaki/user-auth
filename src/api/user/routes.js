const express = require("express");

const userRouter = express.Router();

const async = require("../../middleware/async");

const user = require("./index");

userRouter.post("/sign-up", async(user.signUp));

userRouter.post("/log-in", async(user.logIn));

module.exports = userRouter;
