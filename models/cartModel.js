// models/cartModel.js
const { Pool } = require('pg');

const pool = new Pool({
    user: 'iuuusmrc',
    host: 'satao.db.elephantsql.com',
    database: 'iuuusmrc',
    password: 'OPiEPDLj4EffG7ewYpYnzMxGJtHtseXI',
    port: 5432
});

async function addToCart(id_product, quantity) {
    const client = await pool.connect();
    const result = await client.query('INSERT INTO cart (id_product, quantity) VALUES ($1, $2) RETURNING *', [id_product, quantity]);
    client.release();
    return result.rows[0];
}

async function getCart() {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM cart');
    client.release();
    return result.rows;
}

async function removeFromCart(productId) {
    const client = await pool.connect();
    const result = await client.query('DELETE FROM cart WHERE product_id = $1 RETURNING *', [productId]);
    client.release();
    return result.rows[0];
}

async function clearCart() {
    const client = await pool.connect();
    const result = await client.query('DELETE FROM cart RETURNING *');
    client.release();
    return result.rows;
}

module.exports = {
    addToCart,
    getCart,
    removeFromCart,
    clearCart
};
