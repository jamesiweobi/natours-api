/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
require('dotenv').config();
const app = require('./app');

const DB = process.env.DATABASE;

mongoose
  .connect(DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connection successful'));

const Port = process.env.PORT || 3000;
app.listen(Port, () => {
  console.log(`Server running on port ${Port}...`);
});
