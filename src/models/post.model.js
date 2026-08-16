import mongoose, { Schema } from 'mongoose';

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      required: true,
      trim: true,
    },
    body: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    coverImage: { type: String },
    tags: [{ type: String, lowercase: String, trim: true }],
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  },
);

export const Post = mongoose.model('Post', postSchema);
