import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  productsData: [],
  userInfo: null,
  shippingInfo: null,
  orderData: [],
};

export const shoppingSlice = createSlice({
  name: "compras",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingProduct = state.productsData.find(
        (item) => item._id === action.payload._id
      );
      if (existingProduct) {
        existingProduct.quantity += action.payload.quantity;
      } else {
        state.productsData.push(action.payload);
      }
    },
    increaseQuantity: (state, action) => {
      const existingProduct = state.productsData.find(
        (item) => item._id === action.payload._id
      );
      existingProduct && existingProduct.quantity++;
    },
    decreaseQuantity: (state, action) => {
      const existingProduct = state.productsData.find(
        (item) => item._id === action.payload._id
      );
      if (existingProduct?.quantity === 1) {
        existingProduct.quantity === 1;
      } else {
        existingProduct && existingProduct.quantity--;
      }
    },
    deleteProduct: (state, action) => {
      state.productsData = state.productsData.filter(
        (item) => item._id !== action.payload
      );
    },
    resetCart: (state) => {
      state.productsData = [];
    },
    addUser: (state, action) => {
      state.userInfo = action.payload;
    },
    addShippingInfo: (state, action) => {
      state.shippingInfo = action.payload;
    },
    deleteUser: (state) => {
      state.userInfo = null;
    },
    saveOrder: (state, action) => {
      state.orderData = action.payload;
    },
    resetOrder: (state) => {
      state.orderData = {};
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  deleteProduct,
  resetCart,
  addUser,
  deleteUser,
  saveOrder,
  addShippingInfo,
} = shoppingSlice.actions;

export default shoppingSlice.reducer;
