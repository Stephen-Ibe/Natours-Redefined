const User = require('../models/user.model');

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

exports.signin = async (data) => {
  try {
    const { email, password } = data;
  } catch (err) {
    throw err;
  }
};
