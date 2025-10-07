import mongoose from "mongoose";

const BundleSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  badge: {
    type: String,
    enum: ["BEST VALUE", "POPULAR", "PREMIUM", "NEW"],
    default: null
  },
  originalPrice: {
    type: Number,
    required: true,
  },
  discountedPrice: {
    type: Number,
    required: true,
  },
  products: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    title: String,
    desc: String,
    img: [String],
    originalPrice: Number,
    discountedPrice: Number,
    quantity: {
      type: Number,
      default: 1
    }
  }],
  categories: {
    type: [String],
  },
  concern: {
    type: [String],
  },
  skintype: {
    type: [String],
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  isPrebuilt: {
    type: Boolean,
    default: true,
  },
  customBundleProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

const Bundle = mongoose.model("Bundle", BundleSchema);
export default Bundle;