import { configureStore } from '@reduxjs/toolkit';
import categoriesReducer from './features/categoriesSlice';
import productsReducer from './features/productsSlice';

export const store = configureStore({
  reducer: {
    categories: categoriesReducer,
    products: productsReducer,
  },
});
