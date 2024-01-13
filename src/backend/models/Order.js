import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  orderId: {
    type: Number, // This will store the unique incremental order number
  },
  layaway: {
    type: Boolean,
  },
  layaway_amount: {
    type: Number,
  },
  ship_cost: {
    type: Number,
    default: 200,
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
    paymentIntent: {
      type: String,
    },
  },
  orderStatus: {
    type: String,
    default: 'Procesando',
  },
  createdAt: {
    type: Date,
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

OrderSchema.pre('save', function (next) {
  console.log('Simple pre hook triggered');
  next();
});

// Apply the pre-save hook to generate the orderNumber
OrderSchema.pre('save', async function (next) {
  const doc = this;

  if (!doc.orderId) {
    console.log('pre hook triggered');
    try {
      // Find the highest order number
      const highestOrder = await Order.findOne(
        {},
        {},
        { sort: { orderId: -1 } }
      ).exec();

      console.log('highestOrder', highestOrder);

      // Calculate the next order number
      const nextOrderId = (highestOrder?.orderId || 1000) + 1;

      console.log('nextOrderId', nextOrderId);

      // Assign the next order number to the document
      doc.orderId = nextOrderId;
    } catch (error) {
      console.error('Error in pre hook:', error);
      return next(error);
    }
  }

  console.log('after If');

  next();
});

export default mongoose?.models?.Order || mongoose.model('Order', OrderSchema);
