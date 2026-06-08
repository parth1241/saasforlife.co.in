import connectDB from '../utils/db';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({ success: false, message: 'Google credential token is required' });
  }

  try {
    await connectDB();

    // Decode the token header to retrieve the Key ID (kid)
    const decodedToken = jwt.decode(credential, { complete: true });
    if (!decodedToken || !decodedToken.header || !decodedToken.header.kid) {
      return res.status(400).json({ success: false, message: 'Invalid Google token format' });
    }

    const { kid } = decodedToken.header;

    // Fetch Google's active PEM public certificates
    const certsResponse = await axios.get('https://www.googleapis.com/oauth2/v1/certs');
    const certs = certsResponse.data;
    const cert = certs[kid];

    if (!cert) {
      return res.status(400).json({ success: false, message: 'Google signature validation key expired or not found' });
    }

    // Cryptographically verify the signature and audience (aud claim) locally
    const payload = jwt.verify(credential, cert, {
      algorithms: ['RS256'],
      audience: process.env.VITE_GOOGLE_CLIENT_ID,
    });

    const { email, name, email_verified } = payload;

    // Google returns email_verified as a boolean or string "true"
    if (email_verified !== 'true' && email_verified !== true) {
      return res.status(400).json({ success: false, message: 'Google email is not verified' });
    }

    // Check if user already exists
    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Create a new user with Google login details
      // Create a random placeholder password since authentication is offloaded to Google
      const randomPassword = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      // Determine role based on email
      const role = email.toLowerCase() === 'parthdhimman@gmail.com' ? 'admin' : 'user';

      user = await User.create({
        name: name || 'Google User',
        email: email.toLowerCase(),
        password: randomPassword,
        role,
      });
    } else {
      // Failsafe: if email is parthdhimman@gmail.com, make sure role is admin
      if (email.toLowerCase() === 'parthdhimman@gmail.com' && user.role !== 'admin') {
        user.role = 'admin';
        await user.save();
      }
    }

    // Sign JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    return res.status(200).json({
      success: true,
      token,
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
    console.error('Google login error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error', 
      error: error.message,
      stack: error.stack,
      details: error.response?.data || null
    });
  }
}
