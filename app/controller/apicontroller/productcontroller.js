const Product = require('../../model/product');
const path = require('path');
const fs = require('fs');

class ProductController {

    // POST API 
    async create(req, res) { 
        try {
            // This code is for uploading image with validation
            if (!req.file) {
                return res.status(400).json({
                    message: "Validation error",
                    errors: ["Please enter image it is required"]
                });
            }
            // Validation for size 
            if (req.body.p_size.length < 1) {
                return res.status(400).json({
                    message: "Validation error",
                    errors: ["Please enter size it is required"]
                });
            }
            // Validation for color 
            if (req.body.p_color.length < 1) {
                return res.status(400).json({
                    message: "Validation error",
                    errors: ["Please enter color it is required"]
                });
            }
            // Handle Array for p_color and p_size
            const p_sizes = Array.isArray(req.body.p_size) ? req.body.p_size : req.body.p_size.split(',').map(size => size.trim());
            const p_colors = Array.isArray(req.body.p_color) ? req.body.p_color : req.body.p_color.split(',').map(color => color.trim());

            const productdata = new Product({ ...req.body, p_size: p_sizes, p_color: p_colors, image: req.file.path }); // Assign the image path for validation

            const data = await productdata.save();
            res.status(200).json({ success: true, message: "Product added successfully", data });
        } catch (error) {
            const statusCode = error.name === 'ValidationError' ? 400 : 500;
            const message = error.name === 'ValidationError'
                ? { message: "Validation error", errors: Object.values(error.errors).map(err => err.message) }
                : { message: "An unexpected error occurred" };

            console.error(error);
            res.status(statusCode).json(message);
        }
    }


    // GET API 
    async getall(req, res) {
        try {
            const data = await Product.find();
            res.status(200).json({
                succes: true,
                message: "Product list Fetched successfully",
                total: data.length,
                products: data
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Error retrieving product data" });
        }
    }


    // GET Single API
    async getsingle(req, res) {
        const id = req.params.id;
        try {
            const data = await Product.findById(id);
            if (data) {
                res.status(200).json({ message: "Single data fetched", data });
            } else {
                res.status(404).json({ message: "Product not found" });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Error retrieving product data" });
        }
    }


    // Update Data
    async productupdate(req, res) {
        const id = req.params.id;
        // Validation for size
        if (req.body.p_size.length < 1) {
            return res.status(400).json({
                message: "Validation error",
                errors: ["Please enter Size it is required"]
            });
        }

        // Validation for color 
        if (req.body.p_color.length < 1) {
            return res.status(400).json({
                message: "Validation error",
                errors: ["Please enter color it is required"]
            });
        }
        // Deleting image from uploads folder start
        if (req.file) {
            const product = await Product.findById(id); // Find product by id
            const imagePath = path.resolve(__dirname, '../../../', product.image);
            if (fs.existsSync(imagePath)) {
                fs.unlink(imagePath, (err) => {
                    if (err) {
                        console.error('Error deleting image file:', err);
                    } else {
                        console.log('Image file deleted successfully:', product.image);
                    }
                });
            } else {
                console.log('File does not exist:', imagePath);
            }
        }
        // Deleting image from uploads folder end
        try {

            // Handle Array for p_color and p_size
            const p_sizes = Array.isArray(req.body.p_size) ? req.body.p_size : req.body.p_size.split(',').map(size => size.trim());
            const p_colors = Array.isArray(req.body.p_color) ? req.body.p_color : req.body.p_color.split(',').map(color => color.trim());

            const updatedProduct = await Product.findByIdAndUpdate(id, { ...req.body, p_size: p_sizes, p_color: p_colors }, { new: true, runValidators: true }
            );
            // File Handling Area 
            if (req.file) {
                updatedProduct.image = req.file.path
                await updatedProduct.save(); // Save the document with the updated image
            }
            if (!updatedProduct) {
                return res.status(404).json({ message: "Product not found" });
            }
            res.status(200).json({ message: "Product updated successfully", data: updatedProduct });
        } catch (error) {
            const statusCode = error.name === 'ValidationError' ? 400 : 500;
            const message = error.name === 'ValidationError'
                ? { message: "Validation error", errors: Object.values(error.errors).map(err => err.message) }
                : { message: "Error updating product data" };

            console.error(error);
            res.status(statusCode).json(message);
        }
    }


    // DELETE Api For Delete product
    async productdelete(req, res) {
        const id = req.params.id;
        // Deleting image from uploads folder start
        const product = await Product.findById(id); // Find product by id
        const imagePath = path.resolve(__dirname, '../../../', product.image);
        if (fs.existsSync(imagePath)) {
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error('Error deleting image file:', err);
                } else {
                    console.log('Image file deleted successfully:', product.image);
                }
            });
        } else {
            console.log('File does not exist:', imagePath);
        }
        // Deleting image from uploads folder end
        try {
            const deletedProduct = await Product.findByIdAndDelete(id);
            res.status(deletedProduct ? 200 : 404).json(
                deletedProduct ? { message: "Product deleted successfully" } : { message: "Product not found" }
            );
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error deleting product" });
        }
    }


    // Search API for filtering products by Brand
    async search(req, res) {
        const { brand } = req.query;
        const filter = {};
        if (brand) {
            filter.brand = { $regex: new RegExp(brand, 'i') }; // Case-insensitive search
        }
        try {
            const products = await Product.find(filter);
            res.status(200).json({
                message: "Search products retrieving successfully",
                total: products.length,
                products: products
            });
        } catch (error) {
            console.error("Error retrieving search products:", error);
            res.status(500).json({ message: "Error retrieving products" });
        }
    }


    // Brand List API
    async getBrands(req, res) {
        try {
            const brands = await Product.distinct("brand");
            const brandData = brands.map((brand) => ({
                slug: brand.toLowerCase().replace(/\s+/g, '-'),
                name: brand,
                url: `/api/products/brand/${brand.toLowerCase().replace(/\s+/g, '-')}`
            }));
            res.json(brandData);
        } catch (error) {
            console.error("Error fetching brands:", error);
            res.status(500).json({ message: "Error fetching brands" });
        }
    }


    // Single Brand
    async branddetails(req, res) {
        try {
            const products = await Product.find({ brand: new RegExp(`^${req.params.brand.replace(/-/g, ' ')}`, 'i') });
            res.json({
                success: true,
                message: `Found ${products.length} products for brand "${req.params.brand}"`,
                totalProducts: products.length,
                products
            });
        } catch (error) {
            console.error("Error fetching products by brand:", error);
            res.status(500).json({ success: false, message: "Error retrieving products" });
        }
    }


}

module.exports = new ProductController();
