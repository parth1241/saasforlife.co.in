import jwt from 'jsonwebtoken';
import connectDB from './db.js';
import User from '../models/User.js';

export async function verifyAuth(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await connectDB();
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

export async function verifyAdmin(req) {
  const user = await verifyAuth(req);
  // Ensure that the email is also parthdhimman@gmail.com as a strict constraint
  if (user.role !== 'admin' || user.email.toLowerCase() !== 'parthdhimman@gmail.com') {
    throw new Error('Not authorized as admin');
  }
  return user;
}
