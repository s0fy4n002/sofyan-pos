const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { isEmail } = require('validator');

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [isEmail, 'invalid email'],
    },
    password: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 1000,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: 'customer',
    },
    avatar: {
      type: { url: { type: String }, cloudinary_id: { type: String } },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
