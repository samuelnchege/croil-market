const Shop = require('../models/Shop');

// Get all shops
const getShops = async (req, res) => {
  try {
    const shops = await Shop.find().populate('products.product');
    res.json(shops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get shops by product
const getShopsByProduct = async (req, res) => {
  try {
    const shops = await Shop.find({
      'products.product': req.params.productId,
    }).populate('products.product');
    res.json(shops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single shop
const getShopById = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id).populate('products.product');
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }
    res.json(shop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a shop
const createShop = async (req, res) => {
  try {
    const { name, address, phone, products } = req.body;
    const shop = await Shop.create({ name, address, phone, products });
    res.status(201).json(shop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateShop = async (req, res) => {
  try {
    const shop = await Shop.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('products.product');
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }
    res.json(shop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getShops, getShopsByProduct, getShopById, createShop, updateShop };