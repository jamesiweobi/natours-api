const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Tours = require('../../models/tourModel');
const DB = process.env.DATABASE;
dotenv.config();

mongoose
  .connect(DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connection successful'));

const tours = fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf8');

// Import data
const importData = async () => {
  try {
    await Tours.create(JSON.parse(tours));
    console.log('Data successfully imported');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};
const deleteData = async () => {
  try {
    await Tours.deleteMany();
    console.log('Deleted data successfully');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};
const command = process.argv[2];
if (command === 'import') importData();
if (command === 'delete') deleteData();
