const express = require('express');
const requestValidator = require('express-validator');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { logger } = require('./utils');

const result = dotenv.config();
if (result.error) {
  throw result.error;
}

// Connect to DB
require('./db/redis');

// custom modules
const allRoutes = require('./routes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.disable('x-powered-by');
app.use(
  morgan('dev', {
    skip: () => app.get('env') === 'test',
    stream: logger.stream,
  }),
);
app.use(requestValidator());

app.get('/', (req, res) => {
  res.status(200).json({
    msg: 'Welcome to User Management Services',
  });
});

app.use(allRoutes);

app.listen(process.envPORT, () => logger.info(`App running at http://localhost:${process.env.PORT}`));

module.exports = app;
