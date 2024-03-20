const expressErrorMiddleware = (error, req, res, next) => {
  const timestamp = (new Date()).toISOString();

  return res.status(500).json({
    timestamp,
    name: 'InternalServerError',
    message: 'Something unexpected happened.',
  });
};

module.exports = expressErrorMiddleware;
