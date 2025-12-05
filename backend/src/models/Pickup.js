const mongoose = require('mongoose');

const StatusEventSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['posted', 'assigned', 'pickedup', 'delivered'],
      required: true,
    },
    at: { type: Date, default: Date.now },
  },
  { _id: false }
);

const PickupSchema = new mongoose.Schema(
  {
    surplusId: { type: mongoose.Schema.Types.ObjectId, ref: 'SurplusFood', required: true },
    ngoId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    statusTimeline: { type: [StatusEventSchema], default: [] },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Pickup', PickupSchema);
