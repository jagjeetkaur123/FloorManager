const prisma = require('../config/prisma');

const getAllJobs = async ({ page = 1, limit = 10, status, type, location, search }) => {
  const where = {};
  if (status) where.status = status;
  if (type) where.type = type;
  if (location) where.location = { contains: location, mode: 'insensitive' };
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [jobs, total] = await Promise.all([
    prisma.job.findMany({ where, skip, take: Number(limit), orderBy: { createdAt: 'desc' }, include: { postedBy: { select: { id: true, name: true } } } }),
    prisma.job.count({ where }),
  ]);

  return { jobs, total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) };
};

const getJobById = async (id) => {
  const job = await prisma.job.findUnique({ where: { id }, include: { postedBy: { select: { id: true, name: true } } } });
  if (!job) {
    const err = new Error('Job not found.');
    err.statusCode = 404;
    throw err;
  }
  return job;
};

const createJob = async (userId, data) => {
  return prisma.job.create({ data: { ...data, postedById: userId } });
};

const getMyListings = async (userId) => {
  return prisma.job.findMany({ where: { postedById: userId }, orderBy: { createdAt: 'desc' } });
};

const updateJob = async (userId, jobId, data) => {
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) {
    const err = new Error('Job not found.');
    err.statusCode = 404;
    throw err;
  }
  if (job.postedById !== userId) {
    const err = new Error('Forbidden: you can only edit your own listings.');
    err.statusCode = 403;
    throw err;
  }
  return prisma.job.update({ where: { id: jobId }, data });
};

const deleteJob = async (userId, userRole, jobId) => {
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) {
    const err = new Error('Job not found.');
    err.statusCode = 404;
    throw err;
  }
  if (job.postedById !== userId && userRole !== 'ADMIN') {
    const err = new Error('Forbidden.');
    err.statusCode = 403;
    throw err;
  }
  return prisma.job.delete({ where: { id: jobId } });
};

module.exports = { getAllJobs, getJobById, createJob, getMyListings, updateJob, deleteJob };
