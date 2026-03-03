const jobService = require('../services/jobService');
const { success } = require('../utils/response');

const getAllJobs = async (req, res, next) => {
  try {
    const result = await jobService.getAllJobs(req.query);
    return success(res, result);
  } catch (err) { next(err); }
};

const getJobById = async (req, res, next) => {
  try {
    const job = await jobService.getJobById(req.params.id);
    return success(res, job);
  } catch (err) { next(err); }
};

const createJob = async (req, res, next) => {
  try {
    const job = await jobService.createJob(req.user.id, req.body);
    return success(res, job, 'Job created.', 201);
  } catch (err) { next(err); }
};

const getMyListings = async (req, res, next) => {
  try {
    const jobs = await jobService.getMyListings(req.user.id);
    return success(res, jobs);
  } catch (err) { next(err); }
};

const updateJob = async (req, res, next) => {
  try {
    const job = await jobService.updateJob(req.user.id, req.params.id, req.body);
    return success(res, job, 'Job updated.');
  } catch (err) { next(err); }
};

const deleteJob = async (req, res, next) => {
  try {
    await jobService.deleteJob(req.user.id, req.user.role, req.params.id);
    return success(res, null, 'Job deleted.');
  } catch (err) { next(err); }
};

module.exports = { getAllJobs, getJobById, createJob, getMyListings, updateJob, deleteJob };
