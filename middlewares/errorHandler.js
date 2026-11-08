function errorHandler(err,req, res, next) {
  console.log(err.message)
  const statusCode = err.statusCode || 500;
  const message = err.statusCode ? err.message : "Internal Server Error";
  res.status(statusCode).json({
    message: message,
  });
}

module.exports = errorHandler;
