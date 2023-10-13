
const{Schema , model} = require("mongoose")

const productSchema = new Schema({
    id: Number,
    name: { type: String, required: true },
    price: Number,
    description: { type: String, required: true },
    imageName: { type: String, required: true },
    availability: { type: String, required: true },
    category: { type: String, required: true },
});

const Product = model('Product', productSchema);
module.exports = Product;