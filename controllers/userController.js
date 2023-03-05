const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const filteredObj = (body, ...allowedFields) => {
  const newObj = {};
  Object.keys(body).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = body[el];
  });
  return newObj;
};

// related to administration
exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: { users }
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // error if post passwordData
  console.log(req.body);
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for updating Password !', 400));
  }
  // update userData -> for safety reasons filter body to only update following data
  const filteredBody = filteredObj(
    req.body,
    'name',
    'email',
    'phone',
    'address'
  );
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });
  res.status(200).json({ status: 'success', data: { user: updatedUser } });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({ status: 'success', data: null });
});

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
//BUG
exports.createUser = async (req, res) => {
  console.log('❌');
  try {
    console.log('✅', req.body);
    const newUser = await User.create(req.body);
    console.log(newUser);
    res.status(201).json({ status: 'success', data: { user: newUser } });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error
    });
  }
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
