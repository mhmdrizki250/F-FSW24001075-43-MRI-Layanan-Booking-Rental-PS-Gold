    const express = require('express');
    const bodyParser = require('body-parser');
    const { Pool } = require('pg');

    const app = express();
    const port = 3000;

    // Middleware untuk meng-handle data yang dikirim dari form
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    // Middleware untuk menangani CORS
    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        next();
    });

    // Konfigurasi koneksi ke database PostgreSQL
    const pool = new Pool({
        user: 'iuuusmrc',
        host: 'satao.db.elephantsql.com',
        database: 'iuuusmrc',
        password: 'OPiEPDLj4EffG7ewYpYnzMxGJtHtseXI',
        port: 5432 // Tambahkan port disini
    });

    // Endpoint untuk membuat produk baru (POST request)
    app.post('/api/products', async (req, res) => {
        const { name, price, stock, description, brand } = req.body;
    
        try {
            // Lakukan kueri untuk menyimpan produk baru ke database
            const client = await pool.connect();
            const result = await client.query('INSERT INTO products (name, price, stock, description, brand) VALUES ($1, $2, $3, $4, $5) RETURNING *', [name, price, stock, description, brand]);
            client.release();
    
            // Mengirimkan data produk yang baru dibuat sebagai respons
            res.json(result.rows[0]);
        } catch (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'Terjadi kesalahan saat membuat produk baru.' });
        }
    });
    
    // Endpoint untuk mendapatkan daftar semua produk (GET request)
    app.get('/api/products', async (req, res) => {
        try {
            // Lakukan kueri untuk mendapatkan daftar semua produk dari database
            const client = await pool.connect();
            const result = await client.query('SELECT * FROM products');
            client.release();

            // Mengirimkan daftar produk sebagai respons
            res.json(result.rows);
        } catch (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'Terjadi kesalahan saat mengambil daftar produk.' });
        }
    });

    // Endpoint untuk memperbarui produk (PUT request)
    app.put('/api/products/:id', async (req, res) => {
        const id_product = req.params.id;
        const { name, price, stock, description, brand } = req.body;

        try {
            // Lakukan kueri untuk memperbarui produk dalam database
            const client = await pool.connect();
            const result = await client.query('UPDATE products SET name = $1, price = $2, stock = $3, description = $4, brand = $5 WHERE id_product = $6 RETURNING *', [name, price, stock, description, brand, id_product]);
            client.release();

            // Periksa apakah produk telah diperbarui dengan sukses
            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Produk tidak ditemukan.' });
            }

            // Mengirimkan data produk yang telah diperbarui sebagai respons
            res.json(result.rows[0]);
        } catch (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'Terjadi kesalahan saat memperbarui produk.' });
        }
    });

    // Endpoint untuk menghapus produk (DELETE request)
    app.delete('/api/products/:id', async (req, res) => {
        const id_product = req.params.id;

        try {
            // Lakukan kueri untuk menghapus produk dari database
            const client = await pool.connect();
            const result = await client.query('DELETE FROM products WHERE id_product = $1 RETURNING *', [id_product]);
            client.release();

            // Periksa apakah produk telah berhasil dihapus
            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Produk tidak ditemukan.' });
            }

            // Mengirimkan data produk yang telah dihapus sebagai respons
            res.json({ message: 'Produk berhasil dihapus.' });
        } catch (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'Terjadi kesalahan saat menghapus produk.' });
        }
    });


    // Objek untuk menyimpan produk dalam keranjang belanja
    let cart = {};

    // Endpoint untuk menambahkan produk ke keranjang
    app.post('/api/cart', async (req, res) => {
        const { productId, quantity } = req.body;

        // Validasi data
        if (!productId || !quantity || isNaN(quantity) || quantity <= 0) {
            return res.status(400).json({ message: 'Invalid productId or quantity' });
        }

        try {
            // Lakukan kueri ke database untuk mencari produk dengan ID yang sesuai
            const product = await pool.query('SELECT * FROM products WHERE id_product = $1', [productId]);

            // Periksa apakah produk ditemukan di database
            if (product.rows.length === 0) {
                return res.status(404).json({ message: 'Product not found in database' });
            }

            // Produk ditemukan, lanjutkan untuk menambahkannya ke keranjang
            // Lakukan validasi apakah produk sudah ada di keranjang
            if (cart[productId]) {
                // Jika produk sudah ada di keranjang, tambahkan jumlahnya
                cart[productId].quantity += parseInt(quantity);
            } else {
                // Jika produk belum ada di keranjang, tambahkan sebagai item baru
                cart[productId] = {
                    productId,
                    name: product.rows[0].name,
                    quantity: parseInt(quantity),
                    price: product.rows[0].price
                };
            }

            // Hitung total harga berdasarkan produk yang ada di keranjang
            let total = 0;
            Object.values(cart).forEach(item => {
                total += item.price * item.quantity;
            });

            res.status(200).json({ message: 'Product added to cart successfully', cart, total });
        } catch (error) {
            console.error('Error querying database:', error);
            res.status(500).json({ error: 'Error querying database' });
        }
    });

    // Endpoint untuk menampilkan cart
    app.get('/api/cart', (req, res) => {
        return res.json({ data: Object.values(cart) });
    });

    // Endpoint untuk menghapus produk dari keranjang
    app.delete('/api/cart/:productId', (req, res) => {
        const productId = req.params.productId;

        if (cart[productId]) {
            delete cart[productId];
            return res.json({ message: 'Product removed from cart successfully' });
        } else {
            return res.status(404).json({ message: 'Product not found in cart' });
        }
    });

    // Endpoint untuk mengosongkan cart
    app.delete('/api/cart', (req, res) => {
        cart = {};
        return res.json({ message: 'Cart berhasil dikosongkan' });
    });



    // Endpoint untuk checkout
    app.post('/api/checkout', (req, res) => {
        // ambil data dari body request
        const { name, address, phone } = req.body;

        // cek apakah cart kosong
        if (Object.keys(cart).length === 0) {
            return res.status(400).json({
                message: 'Cart masih kosong',
                });
        }

         // kirim pesan
    return res.json({
        message: 'Pesan berhasil diproses',
        data: {
            name,
            address,
            phone
        },
            });
    });
 


    // Jalankan server
    app.listen(port, () => {
        console.log(`Server berjalan di http://localhost:${port}`);
    });