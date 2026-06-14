import connectDB from '../utils/db.js';
import Lead from '../models/Lead.js';
import { verifyAdmin } from '../utils/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    await connectDB();
    await verifyAdmin(req);

    // Fetch all leads (populate user info if present)
    const leads = await Lead.find({})
      .populate('user', 'name email website')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      leads,
    });
  } catch (error) {
    console.error('Admin leads fetch error:', error);
    return res.status(403).json({ success: false, message: error.message || 'Forbidden' });
  }
}
