const Product = require('../../model/product'); // Adjust the path based on your project structure
const path = require('path');
const fs = require('fs');

class productuicontroller {

    // Show add product form
    async addproductGet(req, res) {
        res.render('productview/addproduct');
    }


    // Post data in add product form
    async addproductPost(req, res) {
        try {
            const { p_name, p_size, p_color, brand, price, p_description } = req.body;
            if (!p_name || !p_size || !p_color || !brand || !price || !p_description) {
                return res.status(400).send('All fields are required.');
            }
            const productData = {
                p_name: p_name.trim(),
                p_size: p_size.split(',').map(s => s.trim()).filter(Boolean),
                p_color: p_color.split(',').map(c => c.trim()).filter(Boolean),
                brand: brand.trim(),
                price: Number(price), // Use Number() for a cleaner conversion
                image: req.file.path, // Image path for handling image
                p_description: p_description.trim(),
            };
            const product = new Product(productData);
            await product.save();
            req.flash('sucess', "Product created successfully")
            return res.redirect('/product');
        } catch (error) {
            req.flash('err', "Error creating product")
            console.error('Error saving product:', error);
            return res.status(500).send('Error saving product');
        }
    }

    // Handle GET product
    async showproduct(req, res) {
        try {
            const products = await Product.find(); // Fetch all products from the database
            res.render('productview/product', { products }); // Render the product page with products data
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error retrieving products" });
        }
    }

    // Handle GET single Details product 
    async detailsproduct(req, res) {
        const id = req.params.id;
        try {
            const product = await Product.findById(id);
            if (!product) {
                return res.status(404).send('Product not found');
            }
            res.render('productview/detailsproduct', { product });
        } catch (error) {
            console.error('Error fetching product:', error);
            return res.status(500).send('Error fetching product');
        }
    }

    // Handle GET single product 
    async singleproduct(req, res) {
        const id = req.params.id;
        try {
            const product = await Product.findById(id);
            if (!product) {
                return res.status(404).send('Product not found');
            }
            res.render('productview/editproduct', { product });
        } catch (error) {
            console.error('Error fetching product:', error);
            return res.status(500).send('Error fetching product');
        }
    }

    // Handle PUT or PATCH for update product
    async updateproduct(req, res) {
        const id = req.params.id;
        // Deleting image from uploads folder start
        if (req.file) {
            const product = await Product.findById(id);
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
            const { p_name, p_size, p_color, brand, price, p_description } = req.body;
            if (!p_name || !p_size || !p_color || !brand || !price || !p_description) {
                return res.status(400).send('All fields are required.');
            }
            const existingProduct = await Product.findById(id);
            if (!existingProduct) {
                return res.status(404).send('Product not found.');
            }
            const productData = {
                p_name: p_name.trim(),
                p_size: p_size.split(',').map(s => s.trim()),
                p_color: p_color.split(',').map(c => c.trim()),
                brand: brand.trim(),
                price: parseFloat(price),
                image: req.file ? req.file.path : existingProduct.image,
                p_description: p_description.trim(),
            };
            await Product.findByIdAndUpdate(id, productData);
            console.log(`Product with ID ${id} updated`);
            req.flash('sucess', "Product updated successfully")
            return res.redirect('/product'); // Redirect after updating
        } catch (error) {
            console.error('Error updating product:', error);
            return res.status(500).send('Error updating product');
        }
    }

    // Handle DELETE for delete product
    async deleteproduct(req, res) {
        const id = req.params.id;
        // Deleting image from uploads folder start
        const product = await Product.findById(id);
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
            // Deleting image from uploads folder start
            const product = await Product.findById(id);
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
            await Product.findByIdAndDelete(id);
            req.flash('sucess', "Product deleted successfully")
            return res.redirect('/product'); // Redirect product after deleting data
        } catch (error) {
            console.error('Error deleting product:', error);
            return res.status(500).send('Error deleting product');
        }
    }

    // Handle GET Search for filtering products by brand
    async searchproduct(req, res) {
        const { brand } = req.query;
        const filter = {};
        if (brand) {
            filter.brand = { $regex: new RegExp(brand, 'i') }; // Case-insensitive search
        }
        try {
            const products = await Product.find(filter);
            res.render('productview/product', {
                products,
                brand,
            });
        } catch (error) {
            console.error("Error retrieving search products:", error);
            res.status(500).send('Error retrieving products');
        }
    }


}

module.exports = new productuicontroller();