import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    active: {
      default: true,
      type: Boolean,
    },
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    phone: {
      type: String,
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
    favorites: [
      {
        _id: {
          type: String,
        },
        title: {
          type: String,
        },
        price: {
          type: Number,
        },
        images: [
          {
            url: {
              type: String,
            },
          },
        ],
      },
    ],
    points: {
      type: Number,
    },
    role: {
      type: String,
      default: 'cliente',
    },
  },
  { timestamps: true }
);

export default mongoose?.models?.User || mongoose.model('User', UserSchema);
