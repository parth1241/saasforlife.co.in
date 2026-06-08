import connectDB from '../utils/db';
import User from '../models/User';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  // Extract token from Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Not authorized, token missing' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id) {
      return res.status(401).json({ success: false, message: 'Not authorized, invalid token' });
    }

    await connectDB();
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Generate custom stats based on plan level
    const plan = user.plan || 'None';
    const isPaid = user.planStatus === 'Active';

    let totalVisits = 1205;
    let activeUsers = 3;
    let bounceRate = 54.8;
    let conversionRate = 1.2;
    let pageLoadSpeed = 2.4;
    let chartData = [
      { day: 'Mon', visits: 120 },
      { day: 'Tue', visits: 150 },
      { day: 'Wed', visits: 130 },
      { day: 'Thu', visits: 180 },
      { day: 'Fri', visits: 210 },
      { day: 'Sat', visits: 190 },
      { day: 'Sun', visits: 225 }
    ];

    if (isPaid) {
      if (plan === 'Starter') {
        totalVisits = 14285;
        activeUsers = 18;
        bounceRate = 42.1;
        conversionRate = 2.4;
        pageLoadSpeed = 1.1;
        chartData = [
          { day: 'Mon', visits: 1800 },
          { day: 'Tue', visits: 2100 },
          { day: 'Wed', visits: 1950 },
          { day: 'Thu', visits: 2300 },
          { day: 'Fri', visits: 2100 },
          { day: 'Sat', visits: 1850 },
          { day: 'Sun', visits: 2185 }
        ];
      } else if (plan === 'Growth') {
        totalVisits = 68412;
        activeUsers = 84;
        bounceRate = 34.6;
        conversionRate = 4.1;
        pageLoadSpeed = 0.7;
        chartData = [
          { day: 'Mon', visits: 8200 },
          { day: 'Tue', visits: 9500 },
          { day: 'Wed', visits: 9100 },
          { day: 'Thu', visits: 10400 },
          { day: 'Fri', visits: 11200 },
          { day: 'Sat', visits: 9800 },
          { day: 'Sun', visits: 10212 }
        ];
      } else if (plan === 'Scale') {
        totalVisits = 248190;
        activeUsers = 312;
        bounceRate = 28.2;
        conversionRate = 5.8;
        pageLoadSpeed = 0.35;
        chartData = [
          { day: 'Mon', visits: 31000 },
          { day: 'Tue', visits: 34500 },
          { day: 'Wed', visits: 33800 },
          { day: 'Thu', visits: 37200 },
          { day: 'Fri', visits: 39500 },
          { day: 'Sat', visits: 35100 },
          { day: 'Sun', visits: 37090 }
        ];
      }
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        planStatus: user.planStatus,
        planBilling: user.planBilling
      },
      stats: {
        metrics: {
          totalVisits,
          activeUsers,
          bounceRate: `${bounceRate}%`,
          conversionRate: `${conversionRate}%`,
          pageLoadSpeed: `${pageLoadSpeed}s`
        },
        chartData,
        services: {
          ssl: isPaid ? 'Active' : 'Not Configured',
          uptimeAlerts: isPaid ? 'Active' : 'Disabled',
          customDomain: ['Growth', 'Scale'].includes(plan) && isPaid ? 'Active' : 'Not Supported',
          apiAccess: plan === 'Scale' && isPaid ? 'Active' : 'Not Supported',
          whiteLabel: plan === 'Scale' && isPaid ? 'Active' : 'Not Supported'
        }
      }
    });

  } catch (error) {
    console.error('Stats fetch error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Not authorized, invalid token' });
    }
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
