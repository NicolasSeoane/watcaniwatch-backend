import app from "./src/app.js";

const PORT = process.env.PORT || 4000;

console.log("Starting server...");
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});