import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
  },
  plan: {
    type: String,
    enum: ['None', 'Starter', 'Growth', 'Scale', 'Custom'],
    default: 'None',
  },
  planStatus: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Inactive',
  },
  planBilling: {
    type: String,
    enum: ['Monthly', 'Annual', 'None'],
    default: 'None',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
