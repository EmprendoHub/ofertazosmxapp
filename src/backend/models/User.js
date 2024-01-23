import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    stripe_id: {
      type: String,
    },
    password: {
      type: String,
      require: true,
      select: false,
    },
    avatar: {
      public_id: String,
      url: String,
    },
    role: {
      type: String,
      default: 'cliente',
    },
  },
  { timestamps: true }
);

export default mongoose?.models?.User || mongoose.model('User', UserSchema);
