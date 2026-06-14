import connectDB from '../utils/db.js';
import { verifyAuth } from '../utils/auth.js';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { name, websiteAbout, password } = req.body;

  try {
    await connectDB();
    const user = await verifyAuth(req);

    if (name) {
      user.name = name.trim();
    }

    if (websiteAbout !== undefined) {
      user.websiteAbout = websiteAbout.trim();
    }

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile settings updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        planStatus: user.planStatus,
        planBilling: user.planBilling,
        role: user.role,
        website: user.website || '',
        websiteAbout: user.websiteAbout || '',
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
}
