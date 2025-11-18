import { combineReducers } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";

// Feature slices
import authReducer from "../features/auth/authSlice";
import cartReducer from "../features/cart/cartSlice";
import userReducer from "../features/user/userSlice";

const rootReducer = combineReducers({
  // RTK Query API reducer
  [apiSlice.reducerPath]: apiSlice.reducer,

  // Feature reducers
  auth: authReducer,
  cart: cartReducer,
  user: userReducer,

  // Дараа нь нэмэгдэх reducers
  // admin: adminReducer,
});

export default rootReducer;
