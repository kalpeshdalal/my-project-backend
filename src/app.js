const express = require("express");
const httpStatus = require("http-status");
const cors = require("cors");
const ApiError = require("./utils/ApiError");
const app = express();

app.use(express.json());

app.use(cors());
app.options("*", cors());

app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info(
      `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`
    );
  });   
  next();
});

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

module.exports = app;
