// Wraps an async route handler so rejected promises are forwarded to Express's error middleware.
export default function asyncHandler(fn) {
  return function wrapped(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
