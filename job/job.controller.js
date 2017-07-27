const { ObjectID } = require('mongodb');
const Job = require('./job.model');

const find = (req, res) => {
  const { offset, limit } = req.query;
  if (offset < 0 || limit < 0) {
    res.status(400).json({ error: 'BAD_REQUEST' });
  }
  Job.find({}).limit(Number(limit)).skip(Number(offset)).then(
    jobs =>
      res.status(200).json({
        jobs,
        offset,
        limit
      }),
    e => res.status(400).json(e)
  );
};

const findById = (req, res) => {
  const id = req.params.jobId;

  if (!ObjectID.isValid(id)) {
    return res.status(404).json({ error: 'NOT_FOUND' });
  }

  Job.findById(id)
    .then(job => {
      if (!job) {
        return res.status(404).json({ error: 'NOT_FOUND' });
      }
      res.status(200).json({ job });
    })
    .catch(() => {
      res.status(400).json({ error: 'BAD_REQUEST' });
    });
};

const create = (req, res) => {
  const {
    title,
    location,
    description,
    category,
    company,
    email,
    url
  } = req.body;
  const newJob = new Job({
    title,
    location,
    description,
    category,
    company,
    email,
    url
  });
  newJob.save().then(
    job =>
      res.status(200).json({
        job
      }),
    () => res.status(400).json({ error: 'BAD_REQUEST' })
  );
};

const deleteById = (req, res) => {
  const id = req.params.jobId;

  if (!ObjectID.isValid(id)) {
    return res.status(404).json({ error: 'NOT_FOUND' });
  }

  Job.findByIdAndRemove(id)
    .then(job => {
      if (!job) {
        return res.status(404).json({ error: 'NOT_FOUND' });
      }
      res.status(200).json({ job });
    })
    .catch(() => {
      res.status(400).json({ error: 'BAD_REQUEST' });
    });
};
module.exports = {
  find,
  findById,
  create,
  deleteById
};
