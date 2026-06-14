import connectDB from '../utils/db.js';
import Visit from '../models/Visit.js';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { domain, path, loadTime, converted } = req.body;

  if (!domain) {
    return res.status(400).json({ success: false, message: 'Domain is required for tracking page view' });
  }

  try {
    await connectDB();

    const cleanDomain = domain.trim().toLowerCase().replace(/^www\./, '');
    const cleanPath = path ? path.trim() : '/';
    const numLoadTime = loadTime ? parseFloat(loadTime) : 0.5;
    const isConverted = converted === true || converted === 'true';

    const newVisit = await Visit.create({
      domain: cleanDomain,
      path: cleanPath,
      loadTime: isNaN(numLoadTime) ? 0.5 : numLoadTime,
      converted: isConverted,
    });

    return res.status(201).json({
      success: true,
      message: 'Event tracked successfully',
      visitId: newVisit._id,
    });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
}
