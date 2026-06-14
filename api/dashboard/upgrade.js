import connectDB from '../_utils/db.js';
import { verifyAuth } from '../_utils/auth.js';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { plan, billingCycle } = req.body;

  if (!plan || !billingCycle) {
    return res.status(400).json({ success: false, message: 'Plan and billing cycle are required' });
  }

  try {
    await connectDB();
    const user = await verifyAuth(req);

    // Update the user's plan details
    user.plan = plan;
    user.planStatus = 'Active';
    user.planBilling = billingCycle;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Plan upgraded successfully',
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
    console.error('Subscription upgrade error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to upgrade subscription plan', 
      error: error.message 
    });
  }
}
