const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;
const secretKey = 'your_secret_key';

// Middleware
app.use(bodyParser.json());

// Mock user database
const users = [
  { id: 1, username: 'user1', password: 'password1' },
  { id: 2, username: 'user2', password: 'password2' }
];

// Routes
app.post('/signup', (req, res) => {
  const { username, password } = req.body;
  const id = users.length + 1;
  users.push({ id, username, password });
  res.status(201).json({ message: 'User created successfully' });
});

app.post('/signin', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  // Generate and sign a JWT
  const token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '1h' });

  res.json({ token });
});

// Protected route
app.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'Protected route accessed successfully' });
});

// Verify JWT middleware
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = decoded;
    next();
  });
}

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
