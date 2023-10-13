const express = require('express');
const app = express();

let products = [
    { id: 1, name: 'iPhone 12 Pro', price: 1099.99 },
    { id: 2, name: 'Samsung Galaxy S21', price: 999.99 },
    { id: 3, name: 'Sony PlayStation 5', price: 499.99 },
    { id: 4, name: 'MacBook Pro 16', price: 2399.99 },
    { id: 5, name: 'DJI Mavic Air 2', price: 799.99 },
  ];
//get /products
app.get('/products', (req, res) => {
    res.json(products);
});
//get /products/:id
app.get('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const product = products.find((product) => product.id === id);
    if (product) {
        res.json(product);
      } else {
        res.status(404).json({ error: 'Product not found' });
      }

});
//get /products/search

app.get('/products/search/item', (req, res) => {
    const {q, minPrice, maxPrice} = req.query;
    const produitfiltrer = products.filter((product) => {       //filtrer les produits
        const memeproduit = product.name.toLowerCase().includes(q.toLowerCase());
        const prixintervale = product.price >= parseFloat(minPrice) && product.price <= parseFloat(maxPrice);   //range pour le prix
        return prixintervale || memeproduit
    });
    res.json(produitfiltrer)
});


// POST /products
app.post('/products', (req, res) => {
    const { name, price } = req.query;
    
    const newProduct = {
      id: products.length + 1,
      name,
      price,
    };
    
    products.push(newProduct);    //Ajouter du nouveau produit
    
    res.status(201).json(newProduct);
  });
  
  // PUT /products/:id
  app.put('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    
    const index = products.findIndex((product) => product.id === id);
    
    if (index !== -1) {      // vérifie si le produit a été trouvé dans la liste
      const { name, price } = req.query;
      
      products[index] = {
        ...products[index],     //met à jour le produit trouvé
        name,
        price,
      };
      
      res.json(products[index]);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  });
  
  // DELETE /products/:id
  app.delete('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    
    const index = products.findIndex((product) => product.id === id);
    
    if (index !== -1) {
      products.splice(index, 1);
      
      res.sendStatus(204);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  });

  app.listen(3000, () => {
    console.log('Server is listening on port 3000');
  });