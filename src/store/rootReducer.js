import { combineReducers } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";

// Feature slices
import authReducer from "../features/auth/authSlice";
import cartReducer from "../features/cart/cartSlice";

const rootReducer = combineReducers({
  // RTK Query API reducer
  [apiSlice.reducerPath]: apiSlice.reducer,

  // Feature reducers
  auth: authReducer,
  cart: cartReducer,

  // Дараа нь нэмэгдэх reducers
  // orders: ordersReducer,
  // user: userReducer,
  // admin: adminReducer,
});

export default rootReducer;
