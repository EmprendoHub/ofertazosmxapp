import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  type: {
    type: String,
    require: true,
  },
  amount: {
    require: true,
    type: Number,
  },
  method: {
    name: {
      type: String,
    },
    _id: {
      type: String,
      require: true,
    },
    type: {
      type: String,
      require: true,
    },
    confirmation: {
      type: String,
    },
  },
  pay_date: {
    type: Date,
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: 'Order',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: 'User',
  },
});

export default mongoose?.models?.Payment ||
  mongoose.model('Payment', PaymentSchema);
