import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import themeReducer from "./slices/themeSlice";
import countReducer from "./slices/totalSlice";
import productReducer from "./slices/productSlice";
import postReducer from "./slices/postSlice";
import orderReducer from "./slices/orderSlice";
import contactReducer from "./slices/contactSlice";
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
import { setStore } from "./storeAccessor";

const rootReducer = combineReducers({
  auth: authReducer,
  count: countReducer,
  theme: themeReducer,
  product: productReducer,
  post: postReducer,
  orders: orderReducer,
  contacts: contactReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "theme"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

setStore(store);

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
