// controllers/cartController.js
const Cart = require('../models/cartModel');

async function getCart(req, res) {
    try {
        const cartItems = await Cart.getCart();
        res.json(cartItems);
    } catch (error) {
        console.error('Error getting cart items:', error);
        res.status(500).json({ error: 'Error getting cart items' });
    }
}

async function addToCart(req, res) {
    const { productId, quantity } = req.body;
    try {
        const result = await Cart.addToCart(productId, quantity);
        res.json(result);
    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).json({ error: 'Error adding product to cart' });
    }
}

async function removeFromCart(req, res) {
    const productId = req.params.productId;
    try {
        const result = await Cart.removeFromCart(productId);
        res.json(result);
    } catch (error) {
        console.error('Error removing product from cart:', error);
        res.status(500).json({ error: 'Error removing product from cart' });
    }
}

async function clearCart(req, res) {
    try {
        const result = await Cart.clearCart();
        res.json(result);
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({ error: 'Error clearing cart' });
    }
}

module.exports = {
    getCart,
    addToCart,
    removeFromCart,
    clearCart
};
