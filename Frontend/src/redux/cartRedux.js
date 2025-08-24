// In your cartRedux.js file
import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    products: [],
    quantity: 0,
    total: 0,
  },
  reducers: {
    addProduct: (state, action) => {
      state.quantity += 1;
      state.products.push(action.payload);
      state.total += action.payload.price * action.payload.quantity;
    },
    removeProduct: (state, action) => {
      const product = action.payload;
      state.quantity -= 1;
      state.total -= product.price * product.quantity;
      state.products = state.products.filter(
        (item) => item._id !== product._id
      );
    },
    updateQuantity: (state, action) => {
      const { _id, quantity } = action.payload;
      const productIndex = state.products.findIndex(item => item._id === _id);
      
      if (productIndex !== -1) {
        const oldQuantity = state.products[productIndex].quantity;
        state.products[productIndex].quantity = quantity;
        state.total += state.products[productIndex].price * (quantity - oldQuantity);
      }
    },
    clearCart: (state) => {
      state.products = [];
      state.quantity = 0;
      state.total = 0;
    },
  },
});

export const { addProduct, removeProduct, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;