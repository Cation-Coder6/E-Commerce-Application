const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please Provide product name"],
      maxlength: [100, "Name cannot be more than 100 characters long"],
    },
    price: {
      type: Number,
      required: [true, "Please Provide product price"],
      default: 0,
    },
    description: {
      type: String,
      required: [true, "Please provide Product Description"],
      maxlength: [1000, "Description cannot be more than 1000 characters"],
    },
    image: {
      type: String,
      default: "/uploads/example.jpeg",
    },
    category: {
      type: String,
      required: [true, "Please Provide Product Category"],
      enum: ["office", "kitchen", "bedroom"],
    },
    company: {
      type: String,
      required: [true, "Please Provide a Company Name"],
      enum: {
        values: ["ikea", "liddy", "marcos"],
        message: "${VALUE} is not supported by our website",
      },
    },
    colors: {
      type: [String],
      default: ["#2222"],
      required: [true, "PLease Provide A Color For the Product"],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    inventory: {
      type: Number,
      required: true,
      default: 15,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    numberOfReviews: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

//this is a virtual property and can be edited as required
ProductSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
  justOne: false,
  // match: { rating: 5 }, //to match only those reviews where rating is equal to 5
});

//deletes all the reviews of a product once a product gets deleted

ProductSchema.pre("remove", async function (next) {
  await this.model("Review").deleteMany({ product: this._id });
});

module.exports = mongoose.model("Product", ProductSchema);
