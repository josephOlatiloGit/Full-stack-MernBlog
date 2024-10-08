import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import themeReducer from "./theme/themeSlice";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import persistStore from "redux-persist/es/persistStore";

/**
 * We import the reducer function from the userSlice.
 * If you are having more than one reducers then we wanna combine them with combineReducers.
 * We then import the PersistReducer and then set up the persistConfig.
 * We add the persistor in the main.jsx or index.js
 * We need to wrap all out app ith the theme in the main.jsx file. but we have to create a component called ThemeProvider.
 * NOTE: import the reducer function without curly braces.
 */

const rootReducer = combineReducers({
  user: userReducer,
  theme: themeReducer,
});

const persistConfig = {
  key: "root",
  storage,
  version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
