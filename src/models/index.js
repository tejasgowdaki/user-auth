const mongoDb = require("../config/mongoDb");

// Import schemas
const UserSchema = require("./user");

// Create collections
const User = UserSchema(mongoDb);

// Export
module.exports = {
  User,
};
