const mongoose = require('mongoose');

const SurplusFoodSchema = new mongoose.Schema(
  {
    canteenId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    foodName: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true }, // number of meals or kg
    preparedTime: { type: Date, required: true },
    vegOrNonVeg: { type: String, enum: ['veg', 'non-veg'], required: true },
    safetyChecklist: [{ type: String }],
    status: {
      type: String,
      enum: ['available', 'assigned', 'pickedup', 'delivered'],
      default: 'available',
    },
    assignedNGO: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  }
);

module.exports = mongoose.model('SurplusFood', SurplusFoodSchema);
