import mongoose from "mongoose";

const cartCollection = 'carts';

const cartSchema = new mongoose.Schema({
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'products'
    },
    quantity: {
      type: Number,
      default: 1
    },
    subtotal: {
      type: Number,
      default: 0
    }
  }],
  total: {
    type: Number,
    default: 0
  }
});

  
export const cartModel = mongoose.model(cartCollection, cartSchema);
