const userService = require('../services/userService');
const { success, error } = require('../utils/response');

const register = async (req, res, next) => {
  try {
    const result = await userService.register(req.body);
    return success(res, result, 'User registered successfully.', 201);
  } catch (err) { next(err); }
};

const login = async (req, res, next) => {
  try {
    const result = await userService.login(req.body);
    return success(res, result, 'Login successful.');
  } catch (err) { next(err); }
};

const getMe = async (req, res, next) => {
  try {
    const user = await userService.getMe(req.user.id);
    return success(res, user);
  } catch (err) { next(err); }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.user.id, req.params.id, req.body);
    return success(res, user, 'User updated.');
  } catch (err) { next(err); }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    return success(res, users);
  } catch (err) { next(err); }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    return success(res, user);
  } catch (err) { next(err); }
};

const deleteUser = async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.id);
    return success(res, null, 'User deleted.');
  } catch (err) { next(err); }
};

module.exports = { register, login, getMe, updateUser, getAllUsers, getUserById, deleteUser };
