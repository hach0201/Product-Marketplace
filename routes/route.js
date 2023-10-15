const express = require('express');
const route = express.Router();
const Product = require("../model/Product");
console.log(Product);


//get products
route.get('/products', async (req, res) => {
    try {
      // Assuming you have a "Product" model defined
      const Products = await Product.find();
      res.json(Products);
    } catch (err) {
      console.error('Error fetching products:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  


//sorting
route.get('/products/sort', async (req, res) => {
    try {
      const { price,order } = req.query;

      if (order !== 'asc' && order !== 'desc') {
        return res.status(400).json({ error: 'Invalid sort order' });
      }
  
      const sort = {};
      sort['price'] = order === 'asc' ? 1 : -1;

      let query = Product.find();
      if (price) {
        query = query.where('price').equals(price);
      }
    
      const sortedProducts = await query.sort(sort);
      res.json(sortedProducts);
    } catch (err) {
      res.status(500).json({ error: 'Error fetching data from MongoDB sort' });
    }
  });
  
  
  
//filtering  
route.post('/products/filter', async (req, res) => {
    try {
      const { minPrice, maxPrice, category, available } = req.body;
  
      const filter = {};
  
      if (minPrice) {
        filter.price = { $gte: parseFloat(minPrice) };
      }
  
      if (maxPrice) {
        filter.price = { ...filter.price, $lte: parseFloat(maxPrice) };
      }
  
      if (category) {
        filter.category = category;
      }
  
      if (available !== undefined) {
        filter.availability = available === true;
      }
  
      const Products = await Product.find(filter);
  
      res.json(Products);
    } catch (err) {
      console.error('Error filtering products:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
//skip
route.get('/products/skip', async (req, res) => {
    try {
      const { price, order, skip } = req.query;
  
      if (order !== 'asc' && order !== 'desc') {
        return res.status(400).json({ error: 'Invalid sort order' });
      }
  
      const sort = {};
      sort['price'] = order === 'asc' ? 1 : -1;
  
      let query = Product.find();
  
      if (price) {
        query = query.where('price').equals(price);
      }
  
      // Calculate the skip value based on the number of products to skip
      const skipValue = parseInt(skip) || 0;
  
      const sortedProducts = await query.sort(sort).skip(skipValue);
      res.json(sortedProducts);
    } catch (err) {
      res.status(500).json({ error: 'Error fetching data from MongoDB sort' });
    }
  });
  
    

module.exports = route;
