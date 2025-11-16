import { createSlice } from "@reduxjs/toolkit";

const TAX_RATE = 0.1; // 10% НӨАТ

const initialState = {
  items: [],
  subtotal: 0,
  tax: 0,
  total: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Сагсанд бүтээгдэхүүн нэмэх
    addToCart: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find((item) => item.id === product.id);

      if (existingItem) {
        // Хэрэв аль хэдийн сагсанд байвал тоо ширхэг нэмнэ
        if (existingItem.quantity < product.stock) {
          existingItem.quantity += 1;
        }
      } else {
        // Шинээр нэмэх
        state.items.push({
          id: product.id,
          name: product.name,
          price: product.discountPrice || product.price,
          originalPrice: product.price,
          image: product.images?.[0] || null,
          stock: product.stock,
          quantity: 1,
        });
      }

      // Дүн тооцоолох
      calculateTotals(state);
    },

    // Тоо ширхэг нэмэх
    incrementQuantity: (state, action) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item && item.quantity < item.stock) {
        item.quantity += 1;
        calculateTotals(state);
      }
    },

    // Тоо ширхэг хасах
    decrementQuantity: (state, action) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        calculateTotals(state);
      }
    },

    // Тоо ширхэг шууд өөрчлөх
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);

      if (item) {
        const newQuantity = Math.max(1, Math.min(quantity, item.stock));
        item.quantity = newQuantity;
        calculateTotals(state);
      }
    },

    // Сагснаас устгах
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      calculateTotals(state);
    },

    // Сагс хоослох
    clearCart: (state) => {
      state.items = [];
      state.subtotal = 0;
      state.tax = 0;
      state.total = 0;
    },

    // Stock шинэчлэх (real-time Firebase-ээс ирнэ)
    updateCartItemStock: (state, action) => {
      const { id, stock } = action.payload;
      const item = state.items.find((item) => item.id === id);

      if (item) {
        item.stock = stock;
        // Хэрэв одоогийн quantity stock-оос их бол багасгана
        if (item.quantity > stock) {
          item.quantity = stock;
          calculateTotals(state);
        }
      }
    },

    // Үнэ шинэчлэх (real-time Firebase-ээс ирнэ)
    updateCartItemPrice: (state, action) => {
      const { id, price, originalPrice } = action.payload;
      const item = state.items.find((item) => item.id === id);

      if (item) {
        item.price = price;
        item.originalPrice = originalPrice;
        calculateTotals(state);
      }
    },
  },
});

// Нийт дүн тооцоолох helper function
const calculateTotals = (state) => {
  state.subtotal = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  state.tax = state.subtotal * TAX_RATE;
  state.total = state.subtotal + state.tax;

  // Float-ийн алдаа арилгах
  state.subtotal = parseFloat(state.subtotal.toFixed(2));
  state.tax = parseFloat(state.tax.toFixed(2));
  state.total = parseFloat(state.total.toFixed(2));
};

export const {
  addToCart,
  incrementQuantity,
  decrementQuantity,
  updateQuantity,
  removeFromCart,
  clearCart,
  updateCartItemStock,
  updateCartItemPrice,
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) =>
  state.cart.items.reduce((count, item) => count + item.quantity, 0);
export const selectCartSubtotal = (state) => state.cart.subtotal;
export const selectCartTax = (state) => state.cart.tax;
export const selectCartTotal = (state) => state.cart.total;

export default cartSlice.reducer;
