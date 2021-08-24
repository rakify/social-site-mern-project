const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      trim: true,
      maxlength: 500,
      required: true,
    },
    img: {
      type: String,
      default: "",
    },
    img_id: {
      type: String,
      default: "",
    },
    likes: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Posts", PostSchema);
