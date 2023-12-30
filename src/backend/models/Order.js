import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  total: {
    type: Number,
    require: true,
  },
  total_items: {
    type: Number,
    require: true,
  },
  date: {
    type: Date,
  },
  layaway: {
    type: Boolean,
  },
  layaway_amount: {
    type: Number,
  },
  ship_amount: {
    type: Number,
  },
  tax_amount: {
    type: Number,
  },
  orderItems: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'Product',
      },
      image: {
        type: String,
        require: true,
      },
      name: {
        type: String,
        require: true,
      },
      quantity: {
        type: Number,
        require: true,
      },
      price: {
        type: Number,
        require: true,
      },
    },
  ],
  paymentInfo: {
    id: {
      type: String,
      require: true,
    },
    status: {
      type: String,
      require: true,
    },
    taxPaid: {
      type: String,
      require: true,
    },
    amountPaid: {
      type: String,
      require: true,
    },
  },
  orderStatus: {
    type: String,
    default: 'Processing',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  address: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: 'Address',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: 'User',
  },
});

export default mongoose?.models?.Order || mongoose.model('Order', OrderSchema);
