import mongoose from 'mongoose';

const PriceSchema = new mongoose.Schema({
  p_name: {
    require: true,
    type: String,
  },
  p_amount: {
    type: Number,
    require: true,
  },
  p_description: {
    type: String,
  },
  p_published: {
    type: Boolean,
    default: true,
  },
  p_images: [
    {
      url: {
        type: String,
      },
    },
  ],
  p_videos: [
    {
      url: {
        type: String,
      },
    },
  ],
  p_lottery: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: 'Lottery',
  },
  p_user: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: 'User',
  },
  p_createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose?.models?.Price || mongoose.model('Price', PriceSchema);
