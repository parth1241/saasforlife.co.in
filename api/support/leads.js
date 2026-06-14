import connectDB from '../_utils/db.js';
import Lead from '../_models/Lead.js';
import User from '../_models/User.js';

export default async function handler(req, res) {
  // Allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { name, email, phone, company, plan, message, domain } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Name, email, and message are required fields' });
  }

  try {
    await connectDB();

    let clientUser = null;
    let targetDomain = 'saasforlife.co.in';

    // If domain is provided and is not the main site, try to associate it with a client account
    if (domain && domain.trim().toLowerCase() !== 'saasforlife.co.in' && domain.trim().toLowerCase() !== 'www.saasforlife.co.in') {
      const cleanDomain = domain.trim().toLowerCase();
      // Find a user that has this website bound
      const user = await User.findOne({ website: cleanDomain });
      if (user) {
        clientUser = user._id;
        targetDomain = cleanDomain;
      }
    }

    const newLead = await Lead.create({
      user: clientUser,
      domain: targetDomain,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      company: company ? company.trim() : '',
      plan: plan ? plan.trim() : 'Growth',
      message: message.trim(),
    });

    return res.status(201).json({
      success: true,
      message: 'Lead saved successfully',
      lead: newLead,
    });
  } catch (error) {
    console.error('Lead submission API error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
}
