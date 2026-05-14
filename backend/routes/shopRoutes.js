const express = require('express');
const router = express.Router();
const { getShops, getShopsByProduct, getShopById, createShop, updateShop } = require('../controllers/shopController');

router.get('/', getShops);
router.get('/by-product/:productId', getShopsByProduct);
router.get('/:id', getShopById);
router.post('/', createShop);
router.put('/:id', updateShop);

module.exports = router;