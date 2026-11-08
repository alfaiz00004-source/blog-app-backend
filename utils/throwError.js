function throwError(errorMessage,errorCode) {
    const error = new Error(errorMessage);
    error.statusCode = errorCode;
    throw error
}

module.exports = throwError;