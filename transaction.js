const mongoose = require('mongoose');
const express = require('express');
const socketIo = require('socket.io');
const http = require('http');

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
// Middleware for JSON request and error handling
app.use(express.json());
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Transaction route
app.post('/update-stock', async (req, res) => {
  const { productId, newStock } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const product = await Products.findById(productId).session(session);
    if (!product) {
      throw new Error('Product not found');
    }

    product.stock = newStock;
    await product.save();

    await session.commitTransaction();
    session.endSession();

    // Notify clients about the stock update in real-time
    io.emit('stock-update', { productId, newStock });

    res.json({ message: 'Stock updated successfully' });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

// Real-time notification
io.on('connection', (socket) => {
  console.log('A user connected');
}); 

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});