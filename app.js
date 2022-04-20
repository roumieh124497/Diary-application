const express = require('express');
const morgan = require('morgan');
const authRouter = require('./routers/authRouter');
const userRouter = require('./routers/userRouter');
const diaryRouter = require('./routers/diaryRouter');
const inboxRouter = require('./routers/inboxRouter');
const notificationRouter = require('./routers/notificationRouter');
const AppError = require('./utils/appError');
const globalErrorController = require('./controllers/errorController');
const session = require('express-session');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const app = express();
const server = require('http').createServer(app);

dotenv.config({ path: './config.env' });
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('client/build'));
app.use(morgan('tiny'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);
// deployment
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/client/build')));
  // app.get('*', (req, res) => {
  //   res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  // });
}

app.use('/api', authRouter, userRouter);
app.use('/api/diary', diaryRouter);
app.use('/api/inbox', inboxRouter);
app.use('/api/notification', notificationRouter);
app.all('*', (req, res, next) => {
  next(new AppError(`can\'t find ${req.originalUrl} on this server`, 404));
});
app.use(globalErrorController);

module.exports = { server };
