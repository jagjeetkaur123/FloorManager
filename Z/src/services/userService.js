const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/config');
const { AppError } = require('../middleware/errorHandler');

const generateToken = (user) =>
  jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

const register = async ({ name, email, password }) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new AppError('Email already in use.', 409);

  const hashed = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { name, email, password: hashed },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  const token = generateToken(user);
  return { user, token };
};

const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AppError('Invalid email or password.', 401);

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new AppError('Invalid email or password.', 401);

  const { password: _, ...safeUser } = user;
  const token = generateToken(safeUser);
  return { user: safeUser, token };
};

const getAllUsers = async ({ page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: parseInt(limit),
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count(),
  ]);
  return { users, total };
};

const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(id) },
    select: { id: true, name: true, email: true, role: true, createdAt: true, jobs: true },
  });
  if (!user) throw new AppError('User not found.', 404);
  return user;
};

const updateUser = async (id, data, requestingUser) => {
  if (requestingUser.id !== parseInt(id) && requestingUser.role !== 'ADMIN') {
    throw new AppError('You can only update your own profile.', 403);
  }
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 12);
  }
  const user = await prisma.user.update({
    where: { id: parseInt(id) },
    data,
    select: { id: true, name: true, email: true, role: true, updatedAt: true },
  });
  return user;
};

const deleteUser = async (id) => {
  await prisma.user.delete({ where: { id: parseInt(id) } });
};

module.exports = { register, login, getAllUsers, getUserById, updateUser, deleteUser };
