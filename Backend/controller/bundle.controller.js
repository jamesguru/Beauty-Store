import Bundle from "../models/bundle.model.js";
import Product from "../models/product.model.js";
import asyncHandler from "express-async-handler";

// CREATE BUNDLE (Prebuilt or Custom)
const createBundle = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    image,
    badge,
    originalPrice,
    discountedPrice,
    products,
    categories,
    concern,
    skintype,
    isPrebuilt = true
  } = req.body;

  // Validate products exist
  if (products && products.length > 0) {
    for (let product of products) {
      const productExists = await Product.findById(product.productId);
      if (!productExists) {
        res.status(400);
        throw new Error(`Product with ID ${product.productId} not found`);
      }
    }
  }

  const newBundle = new Bundle({
    name,
    description,
    image,
    badge,
    originalPrice,
    discountedPrice,
    products,
    categories,
    concern,
    skintype,
    isPrebuilt,
    createdBy: isPrebuilt ? null : req.user?._id
  });

  const savedBundle = await newBundle.save();

  if (savedBundle) {
    res.status(201).json(savedBundle);
  } else {
    res.status(400);
    throw new Error("Bundle was not created");
  }
});

// UPDATE BUNDLE
const updateBundle = asyncHandler(async (req, res) => {
  const updatedBundle = await Bundle.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    { new: true }
  ).populate('products.productId');

  if (!updatedBundle) {
    res.status(404);
    throw new Error("Bundle not found");
  }

  res.status(200).json(updatedBundle);
});

// DELETE BUNDLE
const deleteBundle = asyncHandler(async (req, res) => {
  const bundle = await Bundle.findByIdAndDelete(req.params.id);
  
  if (!bundle) {
    res.status(404);
    throw new Error("Bundle not found");
  }

  res.status(200).json({ message: "Bundle deleted successfully" });
});

// GET SINGLE BUNDLE
const getBundle = asyncHandler(async (req, res) => {
  const bundle = await Bundle.findById(req.params.id)
    .populate('products.productId')
    .populate('customBundleProducts');

  if (!bundle) {
    res.status(404);
    throw new Error("Bundle not found");
  }

  res.status(200).json(bundle);
});

// GET ALL BUNDLES
const getAllBundles = asyncHandler(async (req, res) => {
  const { 
    type, // 'prebuilt' or 'custom'
    category,
    concern: skinConcern,
    skintype,
    search
  } = req.query;

  let filter = {};

  // Filter by bundle type
  if (type === 'prebuilt') {
    filter.isPrebuilt = true;
  } else if (type === 'custom') {
    filter.isPrebuilt = false;
  }

  // Filter by category
  if (category) {
    filter.categories = { $in: [category] };
  }

  // Filter by skin concern
  if (skinConcern) {
    filter.concern = { $in: [skinConcern] };
  }

  // Filter by skin type
  if (skintype) {
    filter.skintype = { $in: [skintype] };
  }

  // Search by name or description
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const bundles = await Bundle.find(filter)
    .populate('products.productId')
    .populate('customBundleProducts')
    .sort({ createdAt: -1 });

  res.status(200).json(bundles);
});

// CREATE CUSTOM BUNDLE FROM SELECTED PRODUCTS
const createCustomBundle = asyncHandler(async (req, res) => {
  const { name, description, productIds } = req.body;
  const userId = req.user._id;

  if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
    res.status(400);
    throw new Error("At least one product is required to create a custom bundle");
  }

  // Get products details
  const products = await Product.find({ _id: { $in: productIds } });
  
  if (products.length !== productIds.length) {
    res.status(400);
    throw new Error("Some products not found");
  }

  // Calculate bundle pricing
  const originalPrice = products.reduce((total, product) => 
    total + (product.originalPrice || 0), 0
  );
  
  const discountedPrice = products.reduce((total, product) => 
    total + (product.discountedPrice || product.originalPrice || 0), 0
  );

  // Format products for bundle
  const bundleProducts = products.map(product => ({
    productId: product._id,
    title: product.title,
    desc: product.desc,
    img: product.img,
    originalPrice: product.originalPrice,
    discountedPrice: product.discountedPrice || product.originalPrice,
    quantity: 1
  }));

  const newBundle = new Bundle({
    name: name || `My Custom Bundle - ${new Date().toLocaleDateString()}`,
    description: description || "Custom created bundle",
    image: products[0]?.img?.[0] || "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    originalPrice,
    discountedPrice,
    products: bundleProducts,
    isPrebuilt: false,
    createdBy: userId,
    categories: [...new Set(products.flatMap(p => p.categories || []))],
    concern: [...new Set(products.flatMap(p => p.concern || []))],
    skintype: [...new Set(products.flatMap(p => p.skintype || []))]
  });

  const savedBundle = await newBundle.save();

  res.status(201).json(savedBundle);
});

// GET USER'S CUSTOM BUNDLES
const getUserCustomBundles = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const bundles = await Bundle.find({ 
    isPrebuilt: false, 
    createdBy: userId 
  })
    .populate('products.productId')
    .sort({ createdAt: -1 });

  res.status(200).json(bundles);
});

// ADD PRODUCT TO CUSTOM BUNDLE
const addProductToBundle = asyncHandler(async (req, res) => {
  const { bundleId, productId } = req.params;

  const bundle = await Bundle.findById(bundleId);
  const product = await Product.findById(productId);

  if (!bundle) {
    res.status(404);
    throw new Error("Bundle not found");
  }

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Check if user owns the bundle (for custom bundles)
  if (!bundle.isPrebuilt && bundle.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to modify this bundle");
  }

  // Check if product already in bundle
  const existingProduct = bundle.products.find(p => 
    p.productId.toString() === productId
  );

  if (existingProduct) {
    res.status(400);
    throw new Error("Product already in bundle");
  }

  // Add product to bundle
  bundle.products.push({
    productId: product._id,
    title: product.title,
    desc: product.desc,
    img: product.img,
    originalPrice: product.originalPrice,
    discountedPrice: product.discountedPrice || product.originalPrice,
    quantity: 1
  });

  // Update bundle pricing
  bundle.originalPrice += product.originalPrice || 0;
  bundle.discountedPrice += product.discountedPrice || product.originalPrice || 0;

  // Update categories and concerns
  if (product.categories) {
    bundle.categories = [...new Set([...bundle.categories, ...product.categories])];
  }
  if (product.concern) {
    bundle.concern = [...new Set([...bundle.concern, ...product.concern])];
  }
  if (product.skintype) {
    bundle.skintype = [...new Set([...bundle.skintype, ...product.skintype])];
  }

  await bundle.save();
  await bundle.populate('products.productId');

  res.status(200).json(bundle);
});

// REMOVE PRODUCT FROM BUNDLE
const removeProductFromBundle = asyncHandler(async (req, res) => {
  const { bundleId, productId } = req.params;

  const bundle = await Bundle.findById(bundleId);

  if (!bundle) {
    res.status(404);
    throw new Error("Bundle not found");
  }

  // Check if user owns the bundle (for custom bundles)
  if (!bundle.isPrebuilt && bundle.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to modify this bundle");
  }

  const productIndex = bundle.products.findIndex(p => 
    p.productId.toString() === productId
  );

  if (productIndex === -1) {
    res.status(404);
    throw new Error("Product not found in bundle");
  }

  const removedProduct = bundle.products[productIndex];

  // Remove product
  bundle.products.splice(productIndex, 1);

  // Update bundle pricing
  bundle.originalPrice -= removedProduct.originalPrice || 0;
  bundle.discountedPrice -= removedProduct.discountedPrice || removedProduct.originalPrice || 0;

  await bundle.save();
  await bundle.populate('products.productId');

  res.status(200).json(bundle);
});

export {
  createBundle,
  updateBundle,
  deleteBundle,
  getBundle,
  getAllBundles,
  createCustomBundle,
  getUserCustomBundles,
  addProductToBundle,
  removeProductFromBundle
};