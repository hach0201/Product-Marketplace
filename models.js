const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/myDataBase')
  .then(() => {
    console.log('Connected to the database');
  })
  .catch(err => {
    console.error('Error connecting to the database:', err);
  });

// Creating a schema
const ProductsSchema = new mongoose.Schema({
  id: Number,
  name: { type: String, required: true },
  price: Number,
  description: { type: String, required: true },
  imageName: { type: String, required: true },
  availability: { type: String, required: true },
  category: { type: String, required: true },
});

// Creating a model
const Products = mongoose.model('Products', ProductsSchema);

// Insert a new product
const newProducts = new Products({
  id: 6,
  name: "Redmi",
  price: 2000.00,
  description: "Description for Product 6",
  imageName: "Redmi.jpg",
  availability: "true",
  category: "phone",
});

// Save the document to the database
newProducts.save()
  .then(Products => {
    console.log('Product created successfully:', Products);
  })
  .catch(err => {
    console.error('Error creating product:', err);
  });
  
 //reading a product

// Example of using findById to retrieve a product by its _id

const productIdToFind = '65217e3d2c1ccea0258bcb00'; // Replace with the actual _id of the product

Products.findById(productIdToFind)
  .then(product => {
    if (product) {
      console.log('Found product:', product);
    } else {
      console.log('Product not found.');
    }
  })
  .catch(err => {
    console.error('Error:', err);
  });
  
 //modifying a product

 // Example of using updateOne to update a product by its _id
const productIdToUpdate = '6526a7c13ed74b46a3a8da47'; // Replace with the actual _id of the product
const updateData = { price: 2500.00, description: 'Updated description' };

Products.updateOne({ _id: productIdToUpdate }, updateData)
  .then(result => {
    if (result.nModified === 1) {
      console.log('Product updated successfully.');
    } else {
      console.log('Product not found or no update performed.');
    }
  })
  .catch(err => {
    console.error('Error:', err);
  });
//deleting a product
const productIdToDelete = '6526a71e93d53cab111a428e'; // Replace with the actual _id of the product

Products.deleteOne({ _id: productIdToDelete })
  .then(result => {
    if (result.deletedCount === 1) {
      console.log('Product deleted successfully.');
    } else {
      console.log('Product not found or no deletion performed.');
    }
  })
  .catch(err => {
    console.error('Error:', err);
  });