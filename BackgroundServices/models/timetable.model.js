// models/timetable.model.js
import mongoose from "mongoose";

const timetableSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  skinType: {
    type: String,
    required: true,
    enum: ['dry', 'oily', 'combination', 'normal', 'sensitive']
  },
  concerns: [{
    type: String,
    enum: ['acne', 'aging', 'darkSpots', 'redness', 'dryness', 'oiliness']
  }],
  morningTime: {
    type: String,
    default: '7:00 AM'
  },
  eveningTime: {
    type: String,
    default: '9:00 PM'
  },
  status: {
    type: Number,
    default: 0 // 0 = pending, 1 = processed
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  processedAt: {
    type: Date
  }
});

export default mongoose.model('Timetable', timetableSchema);