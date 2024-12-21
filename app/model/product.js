const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    p_name: {
        type: String,
        required: "p_name is required",
        minlength: [3, 'p_name must be at least 3 characters']
    },
    p_size: {
        type: Array, // Array of strings for sizes
    },
    p_color: {
        type: Array, // Array of strings for colors
    },
    brand: {
        type: String,
        required: "Brand is required",
        minlength: [3, 'Brand must be at least 3 characters']
    },
    price: {
        type: Number,
        required: "Price is Required"
    },
    image: {
        type: String,
    },
    p_description: {
        type: String,
        required: "p_description is required",
        minlength: [10, 'p_description must be at least 10 characters']
    }
}, { timestamps: true });

const ProductModel = mongoose.model('product', ProductSchema);

module.exports = ProductModel;
