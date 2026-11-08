const throwError = require("../utils/throwError");

function validateSignUp(req, res, next) {
  const { name, email, password } = req.body;

  // Name validation
  if (!name || !name.trim()) {
    return throwError("Name is required", 400);
  }

  if (name.trim().length < 4) {
    return throwError("Name must be at least 4 characters", 400);
  }

  if (name.trim().length > 50) {
    return throwError("Name cannot exceed 50 characters", 400);
  }

  // Email validation
  if (!email || !email.trim()) {
    return throwError("Email is required", 400);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return throwError("Invalid email format", 400);
  }

  // Password validation
  if (!password) {
    return throwError("Password is required", 400);
  }

  if (password.length < 6) {
    return throwError("Password must be at least 6 characters", 400);
  }

  next();
}

function validateLogin(req, res, next) {
    const { email, password } = req.body
  // Email validation
  if (!email || !email.trim()) {
    return throwError("Email is required", 400);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return throwError("Invalid email format", 400);
  }

  // Password validation
  if (!password) {
    return throwError("Password is required", 400);
  }

  if (password.length < 6) {
    return throwError("Password must be at least 6 characters", 400);
  }

  next();
}
module.exports = { validateSignUp, validateLogin };
