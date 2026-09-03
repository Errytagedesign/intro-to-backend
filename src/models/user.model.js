import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
      select: false,
    },
    bio: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['user', 'admin'],
      default: 'user',
    },
    avatar: { type: String },
    username: {
      type: String,
      required: true,
      unique: true,
      minLength: 4,
      maxLength: 12,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (params) {
  // only hash if password is modified or new
  if (!this.isModified('password')) return next();

  try {
    // generate salt and has password

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// method to compare passwords

userSchema.methods.comparePassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
  },
});
export const User = mongoose.model('User', userSchema);
