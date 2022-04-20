const { server } = require('./app');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
require('./controllers/socketController');
dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE_URL.replace(
  '<password>',
  process.env.DATABASE_PASSWORD,
);
mongoose
  .connect(DB)
  .then(con => {
    console.log('database connected successfully');
  })
  .catch(err => {
    console.log(err);
  });

//open the server
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`app is running on port ${port}`);
});
