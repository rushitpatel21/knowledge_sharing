import { configureStore } from '@reduxjs/toolkit'
import authApi from './apis/auth';
import articleApi from './apis/article';

export const store = configureStore({
  reducer: {
    auth: authApi,
    article: articleApi,
  },
})
