const mongoose = require('mongoose');
const express = require('express');
require('express-async-errors')
const cors = require('cors');
const config = require('./utils/config');
const logger = require('./utils/logger');
const blogRouter = require('./controllers/blog');
const userRouter = require('./controllers/user')
const middleware = require('./utils/middleware');

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(config.mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message);
  });

// app.use(middleware.requestLogger);
// app.use(middleware.tokenExtractor);


app.use('/api/blogs', blogRouter);
// app.use('/api/users', userRouter);
// app.use('/api/login', loginRouter);

// if (process.env.NODE_ENV === 'test') {
//   const testingRouter = require('./controllers/testing');
//   app.use('/api/testing', testingRouter);
// }

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;