import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  title: {
    require: true,
    type: String,
  },
  description: {
    require: true,
    type: String,
  },
  brand: {
    type: String,
  },
  category: {
    require: true,
    type: String,
  },
  colors: [
    {
      value: {
        type: String,
      },
      hex: {
        type: String,
      },
    },
  ],
  sizes: [
    {
      value: {
        type: String,
      },
      label: {
        type: String,
      },
    },
  ],
  images: [
    {
      url: {
        type: String,
      },
      color: {
        type: String,
      },
    },
  ],
  gender: {
    type: String,
  },
  availability: {
    type: Boolean,
    default: true,
  },
  stock: {
    require: true,
    type: Number,
    default: 1,
  },
  rating: {
    type: Number,
    default: 5,
  },
  price: {
    require: true,
    type: Number,
  },
  sale_price: {
    type: Number,
  },
  sale_price_end_date: {
    type: Date,
  },
  cost: {
    type: Number,
  },
  active: {
    default: true,
    type: Boolean,
  },
  createdAt: {
    type: Date,
  },
  published: {
    type: Boolean,
    default: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
  reviews: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: 'User',
  },
});

export default mongoose?.models?.Product ||
  mongoose.model('Product', ProductSchema);
