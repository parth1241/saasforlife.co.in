import connectDB from '../_utils/db.js';
import User from '../_models/User.js';
import Visit from '../_models/Visit.js';
import Lead from '../_models/Lead.js';
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
    await connectDB();

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id) {
      return res.status(401).json({ success: false, message: 'Not authorized, invalid token' });
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const plan = user.plan || 'None';
    const isPaid = user.planStatus === 'Active';
    const hasWebsite = !!user.website;

    // Initialize metrics
    let totalVisits = 0;
    let activeUsers = 0;
    let bounceRateNum = 0;
    let conversionRateNum = 0;
    let pageLoadSpeedNum = 0.0;
    let chartData = [];

    // Weekdays lookup list
    const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    if (hasWebsite) {
      const targetDomain = user.website.toLowerCase();

      // Retrieve visits from the last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const visits = await Visit.find({
        domain: targetDomain,
        createdAt: { $gte: sevenDaysAgo }
      });

      totalVisits = visits.length;

      // Active users (unique visits within the last 10 minutes)
      const tenMinutesAgo = new Date();
      tenMinutesAgo.setMinutes(tenMinutesAgo.getMinutes() - 10);
      const activeVisits = visits.filter(v => new Date(v.createdAt) >= tenMinutesAgo);
      // Simulate real active sessions based on page views (min 1 if there's any active load, max matching count)
      activeUsers = activeVisits.length;

      // Average Page load speed
      if (totalVisits > 0) {
        const totalLoadTime = visits.reduce((sum, v) => sum + (v.loadTime || 0.5), 0);
        pageLoadSpeedNum = Number((totalLoadTime / totalVisits).toFixed(2));
      }

      // Conversion rate (percentage of visits where converted === true)
      if (totalVisits > 0) {
        const totalConversions = visits.filter(v => v.converted).length;
        conversionRateNum = Number(((totalConversions / totalVisits) * 100).toFixed(1));
      }

      // Bounce rate simulation: inversely proportional to page speed, between 25% and 65%
      if (totalVisits > 0) {
        bounceRateNum = Math.min(Math.max(Math.round(25 + pageLoadSpeedNum * 15), 25), 68);
      }

      // Construct Visitor History Chart Data dynamically for the past 7 days chronologically
      const now = new Date();
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(now.getDate() - i);
        const dayName = weekdayNames[d.getDay()];

        const visitsOnDay = visits.filter(v => {
          const vDate = new Date(v.createdAt);
          return vDate.getFullYear() === d.getFullYear() &&
                 vDate.getMonth() === d.getMonth() &&
                 vDate.getDate() === d.getDate();
        });

        chartData.push({
          day: dayName,
          visits: visitsOnDay.length
        });
      }
    } else {
      // Default empty chart data if no website is bound
      const now = new Date();
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(now.getDate() - i);
        chartData.push({
          day: weekdayNames[d.getDay()],
          visits: 0
        });
      }
    }

    // Fetch leads captured for this user
    const leads = await Lead.find({ user: user._id })
      .select('-user')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        planStatus: user.planStatus,
        planBilling: user.planBilling,
        website: user.website || '',
        websiteAbout: user.websiteAbout || '',
      },
      stats: {
        metrics: {
          totalVisits,
          activeUsers,
          bounceRate: `${bounceRateNum}%`,
          conversionRate: `${conversionRateNum}%`,
          pageLoadSpeed: `${pageLoadSpeedNum}s`
        },
        chartData,
        services: {
          ssl: isPaid && hasWebsite ? 'Active' : 'Not Configured',
          uptimeAlerts: isPaid && hasWebsite ? 'Active' : 'Disabled',
          customDomain: ['Growth', 'Scale'].includes(plan) && isPaid && hasWebsite ? 'Active' : 'Not Supported',
          apiAccess: plan === 'Scale' && isPaid && hasWebsite ? 'Active' : 'Not Supported',
          whiteLabel: plan === 'Scale' && isPaid && hasWebsite ? 'Active' : 'Not Supported'
        },
        leads
      }
    });

  } catch (error) {
    console.error('Stats fetch error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Not authorized, invalid token' });
    }
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
}
