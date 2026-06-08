import Message from '../models/Message';
import { verifyAuth } from '../utils/auth';
import connectDB from '../utils/db';

export default async function handler(req, res) {
  try {
    await connectDB();
    const currentUser = await verifyAuth(req);

    if (req.method === 'GET') {
      // If admin, we check if a userId query param is provided to fetch that specific user's chat
      if (currentUser.role === 'admin') {
        const { userId } = req.query;
        if (!userId) {
          return res.status(400).json({ success: false, message: 'userId query parameter is required for admin' });
        }
        const messages = await Message.find({ user: userId }).sort({ createdAt: 1 });
        return res.status(200).json({ success: true, messages });
      } else {
        // Standard user fetches their own chat logs
        const messages = await Message.find({ user: currentUser._id }).sort({ createdAt: 1 });
        return res.status(200).json({ success: true, messages });
      }
    } else if (req.method === 'POST') {
      const { text, userId } = req.body;

      if (!text || !text.trim()) {
        return res.status(400).json({ success: false, message: 'Message text is required' });
      }

      let messageData = {
        text: text.trim(),
        createdAt: new Date(),
      };

      if (currentUser.role === 'admin') {
        if (!userId) {
          return res.status(400).json({ success: false, message: 'userId is required for admin replies' });
        }
        messageData.user = userId;
        messageData.sender = 'admin';
      } else {
        messageData.user = currentUser._id;
        messageData.sender = 'user';
      }

      const newMessage = await Message.create(messageData);
      return res.status(201).json({ success: true, message: newMessage });
    } else {
      return res.status(405).json({ success: false, message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Support messages error:', error);
    return res.status(401).json({ success: false, message: error.message || 'Unauthorized' });
  }
}
