const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['ngo', 'canteen', 'admin'],
      required: true,
    },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    capacity: { type: Number }, // meals per pickup, used for NGOs
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  }
);

module.exports = mongoose.model('User', UserSchema);
