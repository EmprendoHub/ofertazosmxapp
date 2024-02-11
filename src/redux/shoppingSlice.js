import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  productsData: [],
  favoritesData: [],
  userInfo: null,
  shippingInfo: null,
  orderData: [],
  affiliateInfo: null,
  emailListData: [],
  loginAttempts: null,
};

export const shoppingSlice = createSlice({
  name: 'compras',
  initialState,
  reducers: {
    increaseLoginAttempts: (state, action) => {
      console.log(state.loginAttempts, 'before', action.payload.count);
      state.loginAttempts += action.payload.count;
      console.log(state.loginAttempts, 'after', action.payload.count);
    },
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
    addToFavorites: (state, action) => {
      const existingProduct = state.favoritesData.find(
        (item) => item._id === action.payload._id
      );
      if (existingProduct) {
        state.favoritesData = state.favoritesData.filter(
          (item) => item._id !== action.payload._id
        );
      } else {
        state.favoritesData.push(action.payload);
      }
    },
    increaseQuantity: (state, action) => {
      const existingProduct = state.productsData.find(
        (item) => item._id === action.payload._id
      );

      if (existingProduct && existingProduct.stock > existingProduct.quantity) {
        existingProduct.quantity++;
      }
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
    deleteFavorite: (state, action) => {
      state.favoritesData = state.favoritesData.filter(
        (item) => item._id !== action.payload
      );
    },
    resetCart: (state) => {
      state.productsData = [];
    },
    resetFavorites: (state) => {
      state.favoritesData = [];
    },
    addUser: (state, action) => {
      state.userInfo = action.payload;
    },
    addAffiliate: (state, action) => {
      state.affiliateInfo = action.payload;
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
    repopulateCart: (state, action) => {
      state.productsData.push(action.payload);
    },
    repopulateFavorites: (state, action) => {
      state.favoritesData.push(action.payload);
    },
    resetOrder: (state) => {
      state.orderData = {};
    },
    saveEmailReceiver: (state, action) => {
      const existingEmail = state.emailListData.find(
        (item) => item.id === action.payload.id
      );
      if (existingEmail) {
        const clientIdToRemove = action.payload.id;
        state.emailListData = state.emailListData.filter(
          (item) => item.id !== clientIdToRemove
        );
      } else {
        state.emailListData.push(action.payload);
      }
    },
    removeEmailReceiver: (state, action) => {
      const clientIdToRemove = action.payload;
      state.emailListData = state.emailListData.filter(
        (item) => item.id !== clientIdToRemove
      );
    },
    resetEmailReceiver: (state) => {
      state.emailListData = [];
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
  addAffiliate,
  deleteUser,
  saveOrder,
  repopulateCart,
  addShippingInfo,
  saveEmailReceiver,
  removeEmailReceiver,
  resetEmailReceiver,
  repopulateFavorites,
  resetFavorites,
  deleteFavorite,
  addToFavorites,
  increaseLoginAttempts,
} = shoppingSlice.actions;

export default shoppingSlice.reducer;
