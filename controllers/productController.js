// controllers/productController.js
const productModel = require('../models/productModel');

async function getAllProducts(req, res) {
    try {
        const products = await productModel.getAllProducts();
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Error fetching products' });
    }
}

async function addProduct(req, res) {
    const { name, price, stock, description, brand } = req.body;
    try {
        const product = await productModel.addProduct(name, price, stock, description, brand);
        res.json(product);
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ error: 'Error adding product' });
    }
}

async function updateProduct(req, res) {
    const id = req.params.id;
    const { name, price, stock, description, brand } = req.body;
    try {
        const product = await productModel.updateProduct(id, name, price, stock, description, brand);
        res.json(product);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Error updating product' });
    }
}

async function deleteProduct(req, res) {
    const id = req.params.id;
    try {
        await productModel.deleteProduct(id);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Error deleting product' });
    }
}

module.exports = {
    getAllProducts,
    addProduct,
    updateProduct,
    deleteProduct
};
