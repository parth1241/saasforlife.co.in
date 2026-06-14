import connectDB from './utils/db.js';
import User from './models/User.js';
import Message from './models/Message.js';
import Lead from './models/Lead.js';
import Visit from './models/Visit.js';
import { verifyAdmin } from './utils/auth.js';

export default async function handler(req, res) {
  try {
    await connectDB();
    await verifyAdmin(req);

    const pathname = req.url.split('?')[0];

    if (pathname === '/api/admin/users') {
      return await handleGetUsers(req, res);
    } else if (pathname === '/api/admin/leads') {
      return await handleGetLeads(req, res);
    } else if (pathname === '/api/admin/update-user-website') {
      return await handleUpdateUserWebsite(req, res);
    } else {
      return res.status(404).json({ success: false, message: 'Admin route not found' });
    }
  } catch (error) {
    console.error('Admin router error:', error);
    return res.status(403).json({ success: false, message: error.message || 'Forbidden' });
  }
}

async function handleGetUsers(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
  const users = await User.find({}, '-password').sort({ createdAt: -1 });
  const usersWithStats = await Promise.all(
    users.map(async (user) => {
      const messageCount = await Message.countDocuments({ user: user._id });
      return {
        ...user.toObject(),
        messageCount,
      };
    })
  );
  return res.status(200).json({ success: true, users: usersWithStats });
}

async function handleGetLeads(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
  const leads = await Lead.find({})
    .populate('user', 'name email website')
    .sort({ createdAt: -1 });
  return res.status(200).json({ success: true, leads });
}

async function handleUpdateUserWebsite(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
  const { userId, website } = req.body;
  if (!userId) {
    return res.status(400).json({ success: false, message: 'User ID is required' });
  }
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  const cleanWebsite = website ? website.trim().toLowerCase() : '';
  user.website = cleanWebsite;
  await user.save();

  if (cleanWebsite) {
    const visitCount = await Visit.countDocuments({ domain: cleanWebsite });
    if (visitCount === 0) {
      console.log(`Seeding analytics visits for domain: ${cleanWebsite}`);
      const paths = ['/', '/pricing', '/features', '/about', '/contact', '/blog'];
      const seedVisits = [];
      const now = new Date();
      for (let d = 0; d < 7; d++) {
        const targetDay = new Date();
        targetDay.setDate(now.getDate() - d);
        const visitsForDay = Math.floor(Math.random() * 24) + 12;
        for (let v = 0; v < visitsForDay; v++) {
          const visitTime = new Date(targetDay);
          visitTime.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60), 0, 0);
          if (visitTime.getTime() <= now.getTime()) {
            const path = paths[Math.floor(Math.random() * paths.length)];
            const loadTime = Number((Math.random() * 1.5 + 0.15 + (path === '/' ? 0 : 0.3)).toFixed(2));
            const converted = Math.random() < 0.04;
            seedVisits.push({
              domain: cleanWebsite,
              path,
              loadTime,
              converted,
              createdAt: visitTime,
            });
          }
        }
      }
      if (seedVisits.length > 0) {
        await Visit.insertMany(seedVisits);
        console.log(`Seeded ${seedVisits.length} visits successfully.`);
      }
    }
  }

  return res.status(200).json({
    success: true,
    message: 'Website domain updated successfully',
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
}
