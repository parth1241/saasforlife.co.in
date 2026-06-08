import { verifyAuth } from '../utils/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'PUT') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const user = await verifyAuth(req);
    const { website } = req.body;

    if (website === undefined) {
      return res.status(400).json({ success: false, message: 'Website field is required' });
    }

    user.website = website.trim();
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Website domain updated successfully',
      website: user.website,
    });
  } catch (error) {
    console.error('Update website error:', error);
    return res.status(401).json({ success: false, message: error.message || 'Unauthorized' });
  }
}
