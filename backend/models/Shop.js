const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      price: {
        type: Number,
        required: true,
      },
      inStock: {
        type: Boolean,
        default: true,
      },
      quantity: {
        type: Number,
        default: 0,
      },
    },
  ],
  area: {
  type: String,
  required: true,
},
}, { timestamps: true });

module.exports = mongoose.model('Shop', shopSchema);