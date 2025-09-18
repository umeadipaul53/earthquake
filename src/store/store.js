import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import earthquakeReducer from "../reducers/earthquakeReducer";

//persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["data"],
};

const persistedEarthquakeReducer = persistReducer(
  persistConfig,
  earthquakeReducer
);

const store = configureStore({
  reducer: {
    earthquake: persistedEarthquakeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // needed for redux-persist
    }),
});

export const persistor = persistStore(store);
export default store;
