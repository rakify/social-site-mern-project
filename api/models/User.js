const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      minlength: 5,
      maxlength: 100,
      required: true,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    desc: {
      type: String,
      maxlength: 50,
    },
    city: {
      type: String,
      maxlength: 50,
    },
    hometown: {
      type: String,
      maxlength: 50,
    },
    relationship: {
      type: Number,
      enum: [1, 2, 3],
    },
    gender: {
      type: String,
      maxlength: 50,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Users", UserSchema);
