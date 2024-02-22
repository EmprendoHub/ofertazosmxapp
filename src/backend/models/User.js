import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    active: {
      default: false,
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
    verificationToken: {
      type: String,
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
      type: String,
    },
    permissions: [
      {
        name: {
          type: String,
        },
        active: {
          default: false,
          type: Boolean,
        },
      },
    ],
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
    loginAttempts: {
      type: Number,
      default: 0,
    },
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
