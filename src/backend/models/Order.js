import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  layaway: {
    type: Boolean,
  },
  layaway_amount: {
    type: Number,
  },
  ship_cost: {
    type: Number,
  },
  orderItems: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'Product',
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
      image: {
        type: String,
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
      type: Number,
      require: true,
    },
    amountPaid: {
      type: Number,
      require: true,
    },
  },
  orderStatus: {
    type: String,
    default: 'Procesando',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  shippingInfo: {
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
