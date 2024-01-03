import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
    unique: true,
  },
  category: {
    type: String,
    require: true,
  },
  mainImage: {
    url: {
      type: String,
      require: true,
    },
  },
  metaTitle: {
    type: String,
  },
  slug: {
    type: String,
  },
  summary: {
    require: true,
    type: String,
  },
  content: {
    require: true,
    type: String,
  },
  images: [
    {
      url: {
        type: String,
      },
    },
  ],
  published: {
    type: Boolean,
    default: false,
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  },
});

export default mongoose?.models?.Post || mongoose.model('Post', PostSchema);
