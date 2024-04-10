// Route for user registration
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./database');


const register = async (req, res, next) => {
    try {
        // Extract username and password from request body
        const { username, password } = req.body;
        
        // Check if username already exists in the database
        db.query('SELECT * FROM users WHERE username = ?', [username], async (error, results, fields) => {
            if (error) {
                console.error('Error checking username:', error);
                return res.status(500).json({ message: 'Failed to register user' });
            }

            if (results.length > 0) {
                return res.status(400).json({ message: 'Username already exists' });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert new user into the database
            db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (error, results, fields) => {
                if (error) {
                    console.error('Error registering user:', error);
                    return res.status(500).json({ message: 'Failed to register user' });
                }

                const userId = results.insertId;

                // Generate JWT token
                const token = jwt.sign({ userId: userId, username: username }, process.env.JWT_SECRET);

                res.status(201).json({ message: 'User registered successfully', userId: userId, token: token });
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to register user' });
    }
};




const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if user exists in the database
        db.query('SELECT * FROM users WHERE username = ?', [username], async (error, results, fields) => {
            if (error) {
                console.error('Error checking username:', error);
                return res.status(500).json({ message: 'Login failed' });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            const user = results[0];

            // Compare passwords
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(401).send('Invalid password');
            }

            // Generate JWT token
            const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET);

            res.status(200).json({ message: 'Login successful', token: token });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Login failed');
    }
};

module.exports = {
    register,
    login
};