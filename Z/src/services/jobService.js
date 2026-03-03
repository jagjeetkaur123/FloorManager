const prisma = require('../config/prisma');
const { AppError } = require('../middleware/errorHandler');

const createJob = async (data, userId) => {
  const job = await prisma.job.create({
    data: { ...data, userId },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
  return job;
};

const getAllJobs = async ({ page = 1, limit = 10, status, type, location, search }) => {
  const skip = (page - 1) * limit;
  const where = {};

  if (status) where.status = status;
  if (type)   where.type   = type;
  if (location) where.location = { contains: location, mode: 'insensitive' };
  if (search) {
    where.OR = [
      { title:       { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { company:     { contains: search, mode: 'insensitive' } },
    ];
  }

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      skip,
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, name: true, email: true } } },
    }),
    prisma.job.count({ where }),
  ]);

  return { jobs, total };
};

const getJobById = async (id) => {
  const job = await prisma.job.findUnique({
    where: { id: parseInt(id) },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
  if (!job) throw new AppError('Job not found.', 404);
  return job;
};

const updateJob = async (id, data, requestingUser) => {
  const job = await prisma.job.findUnique({ where: { id: parseInt(id) } });
  if (!job) throw new AppError('Job not found.', 404);

  if (job.userId !== requestingUser.id && requestingUser.role !== 'ADMIN') {
    throw new AppError('You can only update your own job listings.', 403);
  }

  return prisma.job.update({
    where: { id: parseInt(id) },
    data,
    include: { user: { select: { id: true, name: true, email: true } } },
  });
};

const deleteJob = async (id, requestingUser) => {
  const job = await prisma.job.findUnique({ where: { id: parseInt(id) } });
  if (!job) throw new AppError('Job not found.', 404);

  if (job.userId !== requestingUser.id && requestingUser.role !== 'ADMIN') {
    throw new AppError('You can only delete your own job listings.', 403);
  }

  await prisma.job.delete({ where: { id: parseInt(id) } });
};

const getMyJobs = async (userId, { page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;
  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where: { userId },
      skip,
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
    }),
    prisma.job.count({ where: { userId } }),
  ]);
  return { jobs, total };
};

module.exports = { createJob, getAllJobs, getJobById, updateJob, deleteJob, getMyJobs };
