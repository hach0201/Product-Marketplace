const mongoose = require('mongoose');
//connnect to mongo
mongoose.connect('mongodb://127.0.0.1:27017/myDataBase')
  .then(() => {
    console.log('Connected to the database');
  })
  .catch(err => {
    console.error('Error connecting to the database:', err);
  });
//define a schema
const productSchema = new mongoose.Schema({
    id: Number,
    name: { type: String, required: true },
    price: Number,
    description: { type: String, required: true },
    imageName: { type: String, required: true },
    availability: { type: String, required: true },
    category: { type: String, required: true },
});

const Products = mongoose.model('Products', productSchema);
module.exports = Products;