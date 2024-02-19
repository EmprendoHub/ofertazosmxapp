import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  orderId: {
    type: Number, // This will store the unique incremental order number
  },
  affiliateId: {
    type: String,
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
      variation: {
        type: String,
        require: true,
      },
      name: {
        type: String,
        require: true,
      },
      color: {
        type: String,
      },
      size: {
        type: String,
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
  branch: {
    type: String,
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

// Apply the pre-save hook to generate the orderNumber
OrderSchema.pre('save', async function (next) {
  const doc = this;

  if (!doc.orderId) {
    try {
      // Find the highest order number
      const highestOrder = await this.constructor
        .findOne({}, {}, { sort: { orderId: -1 } })
        .exec();

      // Calculate the next order number
      const nextOrderId = (highestOrder?.orderId || 24000) + 1;

      // Assign the next order number to the document
      doc.orderId = nextOrderId;
    } catch (error) {
      return next(error);
    }
  }

  next();
});

export default mongoose?.models?.Order || mongoose.model('Order', OrderSchema);
