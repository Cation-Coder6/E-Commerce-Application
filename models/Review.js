const mongoose = require("mongoose");

const ReviewSchema = mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Please Provide A Rating"],
    },
    title: {
      type: String,
      trim: true,
      required: [true, "Please Provide a Review Title"],
      maxlength: 100,
    },
    comment: {
      type: String,
      required: [true, "Please Provide review text"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);
ReviewSchema.index({ product: 1, user: 1 }, { unique: true });
module.exports = mongoose.model("Review", ReviewSchema);