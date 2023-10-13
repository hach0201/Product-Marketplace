const mongoose = require('mongoose');
//connnect to mongo
mongoose.connect('mongodb://127.0.0.1:27017/myDataBase')
  .then(() => {
    console.log('Connected to the database');
  })
  .catch(err => {
    console.error('Error connecting to the database:', err);
  });
