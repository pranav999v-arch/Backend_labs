
const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Connect to SQLite database
const db = new sqlite3.Database('./books.db', (err) => {
    if (err) {
        console.error('Database connection failed:', err.message);
    } else {
        console.log('Connected to SQLite database');
    }
});

// Promise functions for database operations
function runQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve({
                    lastID: this.lastID,
                    changes: this.changes
                });
            }
        });
    });
}

function getQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

function allQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

// Create books table
async function initializeDatabase() {
    await runQuery(`
        CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            author TEXT NOT NULL,
            price REAL NOT NULL
        )
    `);

    // Insert sample books if the table is empty
    const result = await getQuery('SELECT COUNT(*) AS count FROM books');

    if (result.count === 0) {
        const sampleBooks = [
            ['Wings of Fire', 'A.P.J. Abdul Kalam', 250],
            ['Atomic Habits', 'James Clear', 350],
            ['The Alchemist', 'Paulo Coelho', 200],
            ['Rich Dad Poor Dad', 'Robert Kiyosaki', 300],
            ['Think and Grow Rich', 'Napoleon Hill', 280]
        ];

        for (const book of sampleBooks) {
            await runQuery(
                'INSERT INTO books (title, author, price) VALUES (?, ?, ?)',
                book
            );
        }
    }

    console.log('Books table is ready');
}

// Home route
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to Lab 3 - REST API',
        status: 'Server is running successfully'
    });
});

// GET all books with search, sorting, pagination and price filter
app.get('/books', async (req, res, next) => {
    try {
        const {
            search_q = '',
            order_by = 'id',
            order = 'ASC',
            limit = '10',
            offset = '0',
            min_price,
            max_price
        } = req.query;

        // Validate sorting column
        const allowedColumns = ['id', 'title', 'author', 'price'];

        if (!allowedColumns.includes(order_by)) {
            return res.status(400).json({
                message: 'Invalid order_by value'
            });
        }

        // Validate sorting order
        const sortOrder = order.toUpperCase();

        if (!['ASC', 'DESC'].includes(sortOrder)) {
            return res.status(400).json({
                message: 'Order must be ASC or DESC'
            });
        }

        // Validate pagination
        const pageLimit = Number(limit);
        const pageOffset = Number(offset);

        if (!Number.isInteger(pageLimit) || pageLimit < 1 || pageLimit > 100) {
            return res.status(400).json({
                message: 'Limit must be between 1 and 100'
            });
        }

        if (!Number.isInteger(pageOffset) || pageOffset < 0) {
            return res.status(400).json({
                message: 'Offset must be a non-negative integer'
            });
        }

        // Build search and price filters
        let sql = 'SELECT * FROM books WHERE title LIKE ?';
        const params = [`%${search_q}%`];

        if (min_price !== undefined) {
            const min = Number(min_price);

            if (!Number.isFinite(min) || min < 0) {
                return res.status(400).json({
                    message: 'Invalid minimum price'
                });
            }

            sql += ' AND price >= ?';
            params.push(min);
        }

        if (max_price !== undefined) {
            const max = Number(max_price);

            if (!Number.isFinite(max) || max < 0) {
                return res.status(400).json({
                    message: 'Invalid maximum price'
                });
            }

            sql += ' AND price <= ?';
            params.push(max);
        }

        if (min_price !== undefined && max_price !== undefined &&
            Number(min_price) > Number(max_price)) {
            return res.status(400).json({
                message: 'Minimum price cannot exceed maximum price'
            });
        }

        // Add sorting and pagination
        sql += ` ORDER BY ${order_by} ${sortOrder} LIMIT ? OFFSET ?`;
        params.push(pageLimit, pageOffset);

        const books = await allQuery(sql, params);

        res.status(200).json({
            message: 'Books retrieved successfully',
            count: books.length,
            books: books
        });

    } catch (err) {
        next(err);
    }
});

// GET book by ID
app.get('/books/:id', async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id < 1) {
            return res.status(400).json({
                message: 'Invalid book ID'
            });
        }

        const book = await getQuery(
            'SELECT * FROM books WHERE id = ?',
            [id]
        );

        if (!book) {
            return res.status(404).json({
                message: 'Book not found'
            });
        }

        res.status(200).json({
            message: 'Book retrieved successfully',
            book: book
        });

    } catch (err) {
        next(err);
    }
});

// POST - Add a new book
app.post('/books', async (req, res, next) => {
    try {
        const { title, author, price } = req.body;

        if (
            typeof title !== 'string' || !title.trim() ||
            typeof author !== 'string' || !author.trim() ||
            price === undefined || price === null ||
            typeof price !== 'number' ||
            !Number.isFinite(price) || price < 0
        ) {
            return res.status(400).json({
                message: 'Title, author and a valid non-negative numeric price are required'
            });
        }

        const result = await runQuery(
            'INSERT INTO books (title, author, price) VALUES (?, ?, ?)',
            [title.trim(), author.trim(), price]
        );

        const newBook = await getQuery(
            'SELECT * FROM books WHERE id = ?',
            [result.lastID]
        );

        res.status(201).json({
            message: 'Book created successfully',
            book: newBook
        });

    } catch (err) {
        next(err);
    }
});

// PUT - Update a book
app.put('/books/:id', async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const { title, author, price } = req.body;

        if (!Number.isInteger(id) || id < 1) {
            return res.status(400).json({
                message: 'Invalid book ID'
            });
        }

        if (
            typeof title !== 'string' || !title.trim() ||
            typeof author !== 'string' || !author.trim() ||
            typeof price !== 'number' ||
            !Number.isFinite(price) || price < 0
        ) {
            return res.status(400).json({
                message: 'Valid title, author and numeric price are required'
            });
        }

        const result = await runQuery(
            'UPDATE books SET title = ?, author = ?, price = ? WHERE id = ?',
            [title.trim(), author.trim(), price, id]
        );

        if (result.changes === 0) {
            return res.status(404).json({
                message: 'Book not found'
            });
        }

        const updatedBook = await getQuery(
            'SELECT * FROM books WHERE id = ?',
            [id]
        );

        res.status(200).json({
            message: 'Book updated successfully',
            book: updatedBook
        });

    } catch (err) {
        next(err);
    }
});

// DELETE - Delete a book
app.delete('/books/:id', async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id < 1) {
            return res.status(400).json({
                message: 'Invalid book ID'
            });
        }

        const result = await runQuery(
            'DELETE FROM books WHERE id = ?',
            [id]
        );

        if (result.changes === 0) {
            return res.status(404).json({
                message: 'Book not found'
            });
        }

        res.status(200).json({
            message: 'Book deleted successfully'
        });

    } catch (err) {
        next(err);
    }
});

// Handle invalid routes
app.use((req, res) => {
    res.status(404).json({
        message: 'Route not found'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err.message);

    res.status(500).json({
        message: 'Internal server error'
    });
});

// Start server after database initialization
initializeDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Database initialization failed:', err.message);
        process.exit(1);
    });
