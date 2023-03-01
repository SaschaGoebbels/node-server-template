const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

//catch uncaught exceptions
process.on('uncaughtException', err => {
  console.log('💥💥 uncaught exception - shutdown 💥💥');
  console.log(err.name, '🚩', err.message);
  process.exit(1);
});

// // // temporary solution to test production
// process.env.NODE_ENV = 'production';

dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() =>
    console.log(
      `✅ server starting successfully 💥 Mode: ${process.env.NODE_ENV}`
    )
  );

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// catch unhandled promise rejections
process.on('unhandledRejection', err => {
  console.log('💥💥 unhandled rejection - shutdown 💥💥');
  console.log(err.name, '🚩', err.message);
  //first shutdown the server then exit the process
  server.close(() => process.exit(1));
});
