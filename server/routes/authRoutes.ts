import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Example user data (replace with your database)
const users = [
  { email: 'user@example.com', password: '$2a$10$hashofpassword' }, // Use hashed passwords
];

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(401).send('Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).send('Invalid email or password');
  }

  const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET!, { expiresIn: '1h' });

  res.json({ token });
});

export default router;
