import multer from "multer";

export const errorHandler = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;

  let message =
    err.message ||
    "Internal Server Error";

  if (err instanceof multer.MulterError) {
    statusCode = 400;
    if (err.code === "LIMIT_FILE_SIZE") {
      message = "File size must be 2 MB or less"
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE_TYPE") {
      message = "Unsupported file type"
    }
  }

  const isProduction = process.env.NODE_ENV === "production";

  res.status(statusCode).json({
    success: false,

    message:
      isProduction && statusCode === 500
        ? "Internal Server Error"
        : message,
  });
};
