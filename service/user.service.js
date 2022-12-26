const User = require('../models/user.model');

exports.getAllUsers = async () => {
  try {
    const allUsers = await User.find();
    return allUsers;
  } catch (err) {
    throw err;
  }
};
