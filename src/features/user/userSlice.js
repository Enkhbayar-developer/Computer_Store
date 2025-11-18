import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  wishlist: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Wishlist-д нэмэх
    addToWishlist: (state, action) => {
      const productId = action.payload;
      if (!state.wishlist.includes(productId)) {
        state.wishlist.push(productId);
      }
    },

    // Wishlist-аас хасах
    removeFromWishlist: (state, action) => {
      const productId = action.payload;
      state.wishlist = state.wishlist.filter((id) => id !== productId);
    },

    // Toggle wishlist
    toggleWishlist: (state, action) => {
      const productId = action.payload;
      if (state.wishlist.includes(productId)) {
        state.wishlist = state.wishlist.filter((id) => id !== productId);
      } else {
        state.wishlist.push(productId);
      }
    },

    // Wishlist тохируулах (Firebase-ээс ирэх үед)
    setWishlist: (state, action) => {
      state.wishlist = action.payload;
    },

    // Wishlist цэвэрлэх
    clearWishlist: (state) => {
      state.wishlist = [];
    },
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  setWishlist,
  clearWishlist,
} = userSlice.actions;

// Selectors
export const selectWishlist = (state) => state.user.wishlist;
export const selectIsInWishlist = (productId) => (state) =>
  state.user.wishlist.includes(productId);

export default userSlice.reducer;
