const User = require('../models/user.model');
const ErrorHandler = require('../utils/errorHandler');

/**
 * @param  {} data
 */
exports.createNewUser = async (data) => {
  try {
    const newUser = await User.create({
      name: data.name,
      email: data.email,
      password: data.password,
      confirmPassword: data.password,
    });

    return newUser;
  } catch (err) {
    throw err;
  }
};

/**
 * @param  {} data
 * @returns {} User object
 */
exports.signin = async (data) => {
  try {
    const { email, password } = data;
    if (!email || !password) {
      throw new ErrorHandler('Email and Password is requiredd', 401);
    }
    const user = await User.findOne({ email }).select('+password');
    const checkIfPasswordMatch = await user.comparePassword(
      password,
      user.password
    );

    return { user, checkIfPasswordMatch };
  } catch (err) {
    throw err;
  }
};
