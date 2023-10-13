const mongoose = require('mongoose');
const express = require('express');
const app = express();
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
//advanced querying and filtering
// Create a route for filtering products
app.post('/products/filter', async (req, res) => {
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

    const products = await Products.find(filter);

    res.json(products);
  } catch (err) {
    console.error('Error filtering products:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//sorting
app.get('/products/sort', async (req, res) => {
  try {
    const query = {};
    const { sortBy, sortOrder } = req.query;

    if (sortBy && sortOrder) {
      const sort = {};
      sort[sortBy] = parseInt(sortOrder);
      const cursor = await Products.find(query).sort(sort);

      const sortedProducts = [];
      for await (const doc of cursor) {
        sortedProducts.push(doc);
      }

      res.json(sortedProducts);
    } else {
      res.status(400).json({ error: 'Invalid sort criteria' });
    }
  } catch (err) {
    console.error('Error sorting products:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// async function main() {
//     const query = {};
//     // sort in descending (-1) order by price
//     const sort = { price: -1 };
//     const cursor = await Products.find(query).sort(sort);
//     for await (const doc of cursor) {
//       console.dir(doc);
//     }
//   }
  
//   main();
  

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});