import { configureStore } from "@reduxjs/toolkit";
import earthquakeReducer  from "../reducers/earthquakeReducer";

const store = configureStore({
  reducer: {
    earthquake: earthquakeReducer,
  },
});

export default store;
