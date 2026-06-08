import User from '../models/User.js';
import Message from '../models/Message.js';
import { verifyAdmin } from '../utils/auth.js';
import connectDB from '../utils/db.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    await connectDB();
    await verifyAdmin(req);

    // Get all users (except passwords)
    const users = await User.find({}, '-password').sort({ createdAt: -1 });

    // For each user, calculate support message count
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const messageCount = await Message.countDocuments({ user: user._id });
        return {
          ...user.toObject(),
          messageCount,
        };
      })
    );

    return res.status(200).json({
      success: true,
      users: usersWithStats,
    });
  } catch (error) {
    console.error('Admin users error:', error);
    return res.status(403).json({ success: false, message: error.message || 'Forbidden' });
  }
}
