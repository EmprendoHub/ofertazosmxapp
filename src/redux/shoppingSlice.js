import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  productsData: [],
  productsPOS: [],
  favoritesData: [],
  userInfo: null,
  shippingInfo: null,
  orderData: [],
  affiliateInfo: null,
  emailListData: [],
  qrListData: [],
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
    addToPOSCart: (state, action) => {
      const existingProduct = state.productsPOS.find(
        (item) => item._id === action.payload._id
      );
      if (existingProduct) {
        existingProduct.quantity += action.payload.quantity;
      } else {
        state.productsPOS.push(action.payload);
      }
    },
    increasePOSQuantity: (state, action) => {
      const existingProduct = state.productsPOS.find(
        (item) => item._id === action.payload._id
      );

      if (existingProduct && existingProduct.stock > existingProduct.quantity) {
        existingProduct.quantity++;
      }
    },
    decreasePOSQuantity: (state, action) => {
      const existingProduct = state.productsPOS.find(
        (item) => item._id === action.payload._id
      );
      if (existingProduct?.quantity === 1) {
        existingProduct.quantity === 1;
      } else {
        existingProduct && existingProduct.quantity--;
      }
    },
    deletePOSProduct: (state, action) => {
      state.productsPOS = state.productsPOS.filter(
        (item) => item._id !== action.payload
      );
    },
    resetPOSCart: (state) => {
      state.productsPOS = [];
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
    increaseQuantity: (state, action) => {
      const existingProduct = state.productsData.find(
        (item) => item._id === action.payload._id
      );
      existingProduct.quantity++;
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
    deleteFavorite: (state, action) => {
      state.favoritesData = state.favoritesData.filter(
        (item) => item._id !== action.payload
      );
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
    savePOSOrder: (state, action) => {
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
    saveQRToPrint: (state, action) => {
      const existingEmail = state.qrListData.find(
        (item) => item.id === action.payload.id
      );
      if (existingEmail) {
        const productIdToRemove = action.payload.id;
        state.qrListData = state.qrListData.filter(
          (item) => item.id !== productIdToRemove
        );
      } else {
        state.qrListData.push(action.payload);
      }
    },
    removeQRToPrint: (state, action) => {
      const productIdToRemove = action.payload;
      state.qrListData = state.qrListData.filter(
        (item) => item.id !== productIdToRemove
      );
    },
    resetQRToPrint: (state) => {
      state.qrListData = [];
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
  addToPOSCart,
  increasePOSQuantity,
  decreasePOSQuantity,
  deletePOSProduct,
  resetPOSCart,
  addUser,
  addAffiliate,
  deleteUser,
  saveOrder,
  savePOSOrder,
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
  saveQRToPrint,
  removeQRToPrint,
  resetQRToPrint,
} = shoppingSlice.actions;

export default shoppingSlice.reducer;
