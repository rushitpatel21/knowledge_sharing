import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import callApi from '../../utils/callApi';

export const createArticle = createAsyncThunk('article/articles', async (data, { rejectWithValue }) => {
  const res = await callApi({ method: 'POST', url: 'article', data });
  return res.error ? rejectWithValue(res.message) : res.data;
});

export const getArticles = createAsyncThunk('article/getArticles', async (_, { rejectWithValue }) => {
  const res = await callApi({ method: 'GET', url: 'article' });
  return res.error ? rejectWithValue(res.message) : res.data;
});

export const getOneArticle = createAsyncThunk('article/getOne', async (id, { rejectWithValue }) => {
  const res = await callApi({ method: 'GET', url: `article/${id}` });
  return res.error ? rejectWithValue(res.message) : res.data;
});

export const updateArticle = createAsyncThunk('article/update', async ({ id, data }, { rejectWithValue }) => {
  const res = await callApi({ method: 'PUT', url: `article/${id}`, data });
  return res.error ? rejectWithValue(res.message) : res.data;
});

export const deleteArticle = createAsyncThunk('article/remove', async (id, { rejectWithValue }) => {
  const res = await callApi({ method: 'DELETE', url: `article/${id}` });
  return res.error ? rejectWithValue(res.message) : res.data;
});

export const aIContent = createAsyncThunk('article/aIContent', async (title, { rejectWithValue }) => {
  const res = await callApi({ method: 'POST', url: `article/${title}/summary` });
  return res.error ? rejectWithValue(res.message) : res.data;
});

const articleApi = createSlice({
  name: 'articleApi',
  initialState: {
    articles: [],
    selected: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createArticle.pending, setPending)
      .addCase(createArticle.fulfilled, (state, action) => {
        state.loading = false;
        state.articles.push(action.payload);
      })
      .addCase(createArticle.rejected, setRejected)

      // GET MY ARTICLES
      .addCase(getArticles.pending, setPending)
      .addCase(getArticles.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = action.payload;
      })
      .addCase(getArticles.rejected, setRejected)

      // GET ONE
      .addCase(getOneArticle.pending, setPending)
      .addCase(getOneArticle.fulfilled, (state, action) => {
        state.loading = false;
        state.selected = action.payload;
      })
      .addCase(getOneArticle.rejected, setRejected)

      // UPDATE
      .addCase(updateArticle.pending, setPending)
      .addCase(updateArticle.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.articles.findIndex(a => a._id === action.payload._id);
        if (index !== -1) state.articles[index] = action.payload;
      })
      .addCase(updateArticle.rejected, setRejected)

      // DELETE
      .addCase(deleteArticle.pending, setPending)
      .addCase(deleteArticle.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = state.articles.filter(a => a._id !== action.payload.article._id);
      })
      .addCase(deleteArticle.rejected, setRejected);
  }
});

// Common Handlers
const setPending = (state) => {
  state.loading = true;
  state.error = null;
};

const setRejected = (state, action) => {
  state.loading = false;
  state.error = action.payload || action.error?.message || 'Something went wrong';
};

// Export reducer
export default articleApi.reducer;