import { AppError } from "./AppError.js"
export const asyncHandler = (fn) => {
    return (req, res, next) => {
        return fn(req, res, next).catch(error => {
            return next(new AppError(error, { cause: 500 }))
        })
    }
}
export const globalErrorHandling = (error, req, res, next) => {
    return res.status(error.cause || 400).json({ msgError: error.message, stack: error.stack })
}




// export const globalErrorHandling = (err, req, res, next) => {
//     err.statusCode = err.statusCode || 500;
//     err.message = err.message || 'Internal server Error';
  
//     // Handle CastError (wrong MongoDB ID)
//     if (err.name === 'CastError') {
//       const message = `Resource not found with this ID. Invalid ${err.path}`;
//       err = new AppError(message, 400);
//     }
  
//     // Handle Duplicate Key Error (MongoDB code 11000)
//     if (err.code === 11000) {
//       const message = `Duplicate key ${Object.keys(err.keyValue)} entered`;
//       err = new AppError(message, 400);
//     }
  
//     // Handle JsonWebTokenError (wrong JWT)
//     if (err.name === 'JsonWebTokenError') {
//       const message = 'Your URL is invalid. Please try again later.';
//       err = new AppError(message, 400);
//     }
  
//     // Handle TokenExpiredError (JWT expired)
//     if (err.name === 'TokenExpiredError') {
//       const message = 'Your URL has expired. Please try again later.';
//       err = new AppError(message, 400);
//     }
  
//     res.status(err.statusCode).json({
//       success: false,
//       message: err.message,
//     });
//   };