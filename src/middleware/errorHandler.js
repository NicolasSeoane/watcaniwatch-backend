export default function errorHandler(err, req, res, next) {
  console.error("Error stack:", err.stack);
  console.error("Error message:", err.message);
  console.error("Error:", err.message);
  if (err.response && err.response.status) {
    return res.status(err.response.status).json({
      message: err.response.data?.status_message || "Error fetching TMDB",
    });
  }

  if (err.status) {
    return res.status(err.status).json({
      message: err.message,
    });
  }

  res.status(500).json({
    message: "Internal Server Error",
  });
}
