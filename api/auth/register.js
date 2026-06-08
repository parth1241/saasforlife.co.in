import connectDB from '../utils/db.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { name, email, password } = req.body;

  // Basic validation
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Please fill in all fields' });
  }

  try {
    await connectDB();

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Determine role based on email
    const role = email.toLowerCase() === 'parthdhimman@gmail.com' ? 'admin' : 'user';

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // Sign JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        planStatus: user.planStatus,
        planBilling: user.planBilling,
        role: user.role,
        website: user.website || '',
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
