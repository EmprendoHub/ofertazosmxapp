import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema(
  {
    stripe_customer_id: {
      type: String,
      require: true,
    },
    name: {
      type: String,
      require: true,
      unique: true,
    },
    last_name: {
      type: String,
      require: true,
      unique: true,
    },
    phone: {
      type: String,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: 'User',
    },
  },
  { timestamps: true }
);

export default mongoose?.models?.Customer ||
  mongoose.model('Customer', CustomerSchema);
