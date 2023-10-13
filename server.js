const express = require('express');
const app = express();
const cacheControl = require('cache-control');
const { MongoClient } = require("mongodb");
const path = require('path');
const mongoose = require('mongoose');

// Declare db variable at the top
let db;

// Connection URL
const uri = 'mongodb://127.0.0.1:27017';
const dbName = 'myDataBase'; // database name

// Public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve static assets from the 'public' directory with caching headers
app.use('/images', cacheControl({ maxAge: 3600 }));

// Connect to MongoDB
const client = new MongoClient(uri);

async function connectToMongoDB() {
  try {
    // Connect the client to the server
    await client.connect();
    // Set the 'db' variable to the desired database
    db= client.db(dbName);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
  }
}

// Run the MongoDB connection function
connectToMongoDB();
// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Error handler middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).send('Internal Server Error');
});

// Routes
app.get('/', async (req, res, next) => {
  try {
    // console.log(db);
    const products = await db.collection('Products').find().toArray();
    res.render('home', { products });
  } catch (err) {
    next(err); // Pass the error to the error handler middleware
  }
});

app.get('/products/:id', async (req, res, next) => {
  const productId = parseInt(req.params.id);
  if (isNaN(productId)) {
    return res.status(400).send('Invalid product ID');
  }

  try {
    const product = await db.collection('Products').findOne({ id: productId });
    if (product) {
      res.render('productDetail', { product });
    } else {
      res.status(404).send('Product not found');
    }
  } catch (err) {
    next(err); // Pass the error to the error handler middleware
  }
});
//new page foe searching
// Route for Handling Search Results
app.get('/search', async (req, res, next) => {
  try {
    const { category, price, availability } = req.query;

    // Define an empty query object to build the MongoDB query based on the search criteria
    //const query = {category: "phone", availability: "true", price: {$gte:1000}};
    const query = {};

    if (category) {
      query.category = category;
    }

    if (price) {
      query.price = { $lte: parseInt(price) };
    }

    if (availability) {
      query.availability = availability === 'true'; // Convert the string to a boolean
    }

    const products = await db.collection('Products').find(query).toArray();
    res.render('searchResults', { products });
  } catch (err) {
    next(err); // Pass any errors to the error handler middleware
  }
});
//indexing
async function createIndexes() {
  const client = new MongoClient(uri, { useUnifiedTopology: true });

  try {
    await client.connect();

    const db = client.db(dbName);
    const collection = db.collection('Products');
    await collection.dropIndexes()   //delete previous indexes
    // Create a text index on the 'name' field
    // await collection.createIndex({ name: 'text' });

    console.log('Indexes created successfully.');
  } catch (err) {
    console.error('Error creating indexes:', err);
  } finally {
    client.close();
  }
}


app.get('/searchInput', async (req, res) => {
  console.log(req.query);
  const searchText = req.query.q; // Get the search query from the URL parameter 'q'
  console.log(searchText);
  try {
    const collection = db.collection('Products');
    await collection.createIndex({ name: 'text' });
    // Perform the text search using the text index
    const products = await collection.find({ $text: { $search: searchText } }).toArray();

    // Render the search results
    res.render('searchResults', { products, searchText });
  } catch (err) {
    console.error('Error searching for products:', err.message);
    res.status(500).send('Internal Server Error');
  }
});
//sales

app.get('/sales-dashboard', async (req, res) => {
  try {
    const collection = db.collection('Products'); // Replace with your actual collection name
    const pipeline = [  {
      $group: {
        _id: null,
        totalSales: { $sum: '$sales' }, // Replace 'sales' with your actual sales field
        averagePrice: { $avg: '$price' } // Replace 'price' with your actual price field
      }
    },];
    const result = await collection.aggregate(pipeline).toArray();

    // Render the Sales Dashboard page with the aggregation results
    res.render('salesDashboard', { stats: result[0] }); // Passing the aggregation result to the view
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).send('Internal Server Error');
  }
});




// Call the createIndexes function to create indexes
createIndexes();
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

