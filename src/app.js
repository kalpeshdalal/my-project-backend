const express = require("express");
const httpStatus = require("http-status");
const cors = require("cors");
const ApiError = require("./utils/ApiError");
const routes = require('./routes/v1')
const morgan = require('./config/morgan');
const config = require("./config/config");
const app = express();

app.use(express.json());

app.use(cors());
app.options("*", cors());

if (config.env !== 'test') {
	app.use(morgan.successHandler);
	app.use(morgan.errorHandler);
}
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

app.use("/v1", routes);

app.all("/", (req, res) => {
  res.send("My Project Backend is Live");
});

app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

module.exports = app;
