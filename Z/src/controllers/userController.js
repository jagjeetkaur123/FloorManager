const userService = require('../services/userService');
const { sendSuccess, sendError, sendPaginated } = require('../utils/response');

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return sendError(res, 'Name, email and password are required.', 400);
    if (password.length < 6)
      return sendError(res, 'Password must be at least 6 characters.', 400);

    const result = await userService.register({ name, email, password });
    return sendSuccess(res, result, 'Registration successful.', 201);
  } catch (err) { next(err); }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return sendError(res, 'Email and password are required.', 400);

    const result = await userService.login({ email, password });
    return sendSuccess(res, result, 'Login successful.');
  } catch (err) { next(err); }
};

const getMe = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.user.id);
    return sendSuccess(res, user, 'Profile fetched.');
  } catch (err) { next(err); }
};

const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { users, total } = await userService.getAllUsers({ page, limit });
    return sendPaginated(res, users, total, page, limit, 'Users fetched.');
  } catch (err) { next(err); }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    return sendSuccess(res, user, 'User fetched.');
  } catch (err) { next(err); }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body, req.user);
    return sendSuccess(res, user, 'User updated.');
  } catch (err) { next(err); }
};

const deleteUser = async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.id);
    return sendSuccess(res, null, 'User deleted.');
  } catch (err) { next(err); }
};

module.exports = { register, login, getMe, getAllUsers, getUserById, updateUser, deleteUser };
