const jobService = require('../services/jobService');
const { sendSuccess, sendError, sendPaginated } = require('../utils/response');

const createJob = async (req, res, next) => {
  try {
    const { title, description, company, location, salary, type } = req.body;
    if (!title || !description || !company || !location)
      return sendError(res, 'Title, description, company and location are required.', 400);

    const job = await jobService.createJob({ title, description, company, location, salary, type }, req.user.id);
    return sendSuccess(res, job, 'Job created.', 201);
  } catch (err) { next(err); }
};

const getAllJobs = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, type, location, search } = req.query;
    const { jobs, total } = await jobService.getAllJobs({ page, limit, status, type, location, search });
    return sendPaginated(res, jobs, total, page, limit, 'Jobs fetched.');
  } catch (err) { next(err); }
};

const getJobById = async (req, res, next) => {
  try {
    const job = await jobService.getJobById(req.params.id);
    return sendSuccess(res, job, 'Job fetched.');
  } catch (err) { next(err); }
};

const updateJob = async (req, res, next) => {
  try {
    const job = await jobService.updateJob(req.params.id, req.body, req.user);
    return sendSuccess(res, job, 'Job updated.');
  } catch (err) { next(err); }
};

const deleteJob = async (req, res, next) => {
  try {
    await jobService.deleteJob(req.params.id, req.user);
    return sendSuccess(res, null, 'Job deleted.');
  } catch (err) { next(err); }
};

const getMyJobs = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { jobs, total } = await jobService.getMyJobs(req.user.id, { page, limit });
    return sendPaginated(res, jobs, total, page, limit, 'Your jobs fetched.');
  } catch (err) { next(err); }
};

module.exports = { createJob, getAllJobs, getJobById, updateJob, deleteJob, getMyJobs };
