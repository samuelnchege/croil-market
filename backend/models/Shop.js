const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  area: {
  type: String,
  required: false,
  default: '',
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
}, { timestamps: true });

module.exports = mongoose.model('Shop', shopSchema);