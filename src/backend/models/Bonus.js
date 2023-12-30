import mongoose from 'mongoose';

const BonusSchema = new mongoose.Schema({
  b_name: {
    require: true,
    type: String,
  },
  b_amount: {
    type: Number,
    require: true,
  },
  b_description: {
    type: String,
  },
  b_published: {
    type: Boolean,
    default: true,
  },
  b_images: [
    {
      url: {
        type: String,
      },
    },
  ],
  b_videos: [
    {
      url: {
        type: String,
      },
    },
  ],
  b_lottery: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: 'Lottery',
  },
  b_user: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: 'User',
  },
  b_createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose?.models?.Bonus || mongoose.model('Bonus', BonusSchema);
