import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./../reducers/index";

// configureStore from Redux Toolkit includes redux-thunk by default
const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
