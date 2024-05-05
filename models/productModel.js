// models/productModel.js
const { Pool } = require('pg');

const pool = new Pool({
    user: 'iuuusmrc',
    host: 'satao.db.elephantsql.com',
    database: 'iuuusmrc',
    password: 'OPiEPDLj4EffG7ewYpYnzMxGJtHtseXI',
    port: 5432
});

async function getAllProducts() {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM products');
    client.release();
    return result.rows;
}

async function addProduct(name, price, stock, description, brand) {
    const client = await pool.connect();
    const result = await client.query('INSERT INTO products (name, price, stock, description, brand) VALUES ($1, $2, $3, $4, $5) RETURNING *', [name, price, stock, description, brand]);
    client.release();
    return result.rows[0];
}

async function updateProduct(id, name, price, stock, description, brand) {
    const client = await pool.connect();
    const result = await client.query('UPDATE products SET name = $1, price = $2, stock = $3, description = $4, brand = $5 WHERE id_product = $6 RETURNING *', [name, price, stock, description, brand, id]);
    client.release();
    return result.rows[0];
}

async function deleteProduct(id) {
    const client = await pool.connect();
    const result = await client.query('DELETE FROM products WHERE id_product = $1 RETURNING *', [id]);
    client.release();
    return result.rows[0];
}

module.exports = {
    getAllProducts,
    addProduct,
    updateProduct,
    deleteProduct
};
