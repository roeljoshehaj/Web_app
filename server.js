const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken'); 

const app = express();
app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'WebApp',
  password: 'lewis1919',
  port: 5432,
});

app.post('/register', async (req, res) => {
  const { fullName, username, email, phone, password, role, gender } = req.body;

  console.log('🔵 Incoming data:', req.body); 

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (full_name, username, email, phone, password, role, gender)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [fullName, username, email, phone, hashedPassword, role, gender]
    );

    res.status(201).json({ message: 'User registered!', user: result.rows[0] });
  } catch (err) {
    console.error('🔴 Register error:', err.message); 
    res.status(500).json({ error: 'Failed to register user', details: err.message });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log("Login attempt received for:", email);
    
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      console.log("User not found for email:", email);
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];
    console.log("User found:", user);

    if (!user.password) {
      console.log("Error: No password found in database.");
      return res.status(500).json({ error: 'Server error: Password missing' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password does not match.");
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, 'your_jwt_secret', { expiresIn: '1h' });
        res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error("Login Error:", err.stack);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
app.get('/', (req, res) => {
  res.send('Welcome to the homepage!');
});

app.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, 'your_jwt_secret'); 
    const userId = decoded.id;

    pool.query('SELECT * FROM users WHERE id = $1', [userId], (err, result) => {
      if (err) return res.status(500).json({ error: 'Database error', details: err.message });
      if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });

      const user = result.rows[0];
      res.json({
        fullName: user.full_name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        gender: user.gender
      });
          });
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
});
