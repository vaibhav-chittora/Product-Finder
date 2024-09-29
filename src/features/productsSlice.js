import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for fetching products (with pagination)
export const fetchProducts = createAsyncThunk('products/fetchProducts', async ({ category, skip, search }) => {
  const baseUrl = 'https://dummyjson.com/products';
  let url = `${baseUrl}?limit=10&skip=${skip}`;
  if (category) url = `${baseUrl}/category/${category}?limit=10&skip=${skip}`;
  if (search) url += `&search=${search}`;

  const response = await axios.get(url);
  return response.data.products;
});

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    loading: false,
    error: null,
    skip: 0,
  },
  reducers: {
    incrementSkip(state) {
      state.skip += 10;
    },
    resetProducts(state) {
      state.products = [];
      state.skip = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = [...state.products, ...action.payload];
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { incrementSkip, resetProducts } = productsSlice.actions;
export default productsSlice.reducer;
