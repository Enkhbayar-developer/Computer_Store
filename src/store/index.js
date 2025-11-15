import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { setupListeners } from "@reduxjs/toolkit/query";
import rootReducer from "./rootReducer";
import { apiSlice } from "./api/apiSlice";

// Redux Persist тохиргоо
const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["cart", "auth", "wishlist"], // Зөвхөн эдгээр reducer-ийг persist хийнэ
  blacklist: ["api"], // RTK Query cache-ийг persist хийхгүй
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Store үүсгэх
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Redux Persist-ийн action-уудыг ignore хийх
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiSlice.middleware), // RTK Query middleware нэмэх
  devTools: import.meta.env.MODE !== "production", // Production дээр DevTools идэвхгүй
});

// Persistor үүсгэх
export const persistor = persistStore(store);

// RTK Query listener-үүд тохируулах (refetching, cache-ing)
setupListeners(store.dispatch);
