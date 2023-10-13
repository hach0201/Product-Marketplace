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
      const { price } = req.query;
  
      if (!price) {
        return res.status(400).json({ error: 'Invalid sort criteria' });
      }
  
      const sort = {};
       sort[price] = 1; // Ascending order
  
      const sortedProducts = await Product.find({}).sort(sort);
  
      res.json(sortedProducts);
    } catch (err) {
      console.error('Error sorting products:', err);
      res.status(500).json({ error: 'Internal Server Error' });
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
  

module.exports = route;
