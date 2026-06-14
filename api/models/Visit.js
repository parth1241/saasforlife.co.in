import mongoose from 'mongoose';

const VisitSchema = new mongoose.Schema({
  domain: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  path: {
    type: String,
    default: '/',
    trim: true,
  },
  loadTime: {
    type: Number,
    default: 0.5,
  },
  converted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Visit || mongoose.model('Visit', VisitSchema);
