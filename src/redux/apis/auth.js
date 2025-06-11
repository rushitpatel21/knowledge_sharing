import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import callApi from '../../utils/callApi';


export const login = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  const res = await callApi({ method: 'POST', url: 'auth/login', data });
  return res.error ? rejectWithValue(res.message) : res.data;
});

export const logout = createAsyncThunk('auth/logout', async (data, { rejectWithValue }) => {
  const res = await callApi({ method: 'POST', url: 'auth/logout', data });
  return res.error ? rejectWithValue(res.message) : res.data;
});

export const signUp = createAsyncThunk('auth/signUp', async (data, { rejectWithValue }) => {
  const res = await callApi({ method: 'POST', url: 'auth/signup', data });
  return res.error ? rejectWithValue(res.message) : res.data;
});

export const validateUser = createAsyncThunk('auth/validateUser', async (_, { rejectWithValue }) => {
  const res = await callApi({ method: 'GET', url: 'auth/validateUser' });

  if (res.error) {
    return rejectWithValue(res.message);
  }
  return res.data;
});

// Slice
const authApi = createSlice({
  name: 'authApi',
  initialState: {
    auth: null,
    token: null,
    loading: false,
    error: null,
    askLoggedIn: false,
    theme: {
      isDarkMode: false,
    }
  },
  reducers: {
    // setToken: (state, action) => {
    //   setCookie('token', action.payload, { maxAge: 60 * 60 * 24 * 7 });
    //   state.token = action.payload;
    // },
    // toggleDarkMode: (state) => {
    //   state.theme.isDarkMode = !state.theme.isDarkMode;
    //   localStorage.setItem('isDarkMode', JSON.stringify(state.theme.isDarkMode));
    // },
    // setCurrentTheme: (state) => {
    //   state.theme.isDarkMode = getThemeStyle();
    // },
    // showLogin: (state) => {
    //   state.askLoggedIn = true;
    // },
    // hideLogin: (state) => {
    //   state.askLoggedIn = false;
    // }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, setPending)
      .addCase(login.fulfilled, (state, action) => {        
        state.loading = false;
        state.auth = action.payload.user;
      })
      .addCase(login.rejected, setRejected)
      
      .addCase(signUp.pending, setPending)
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.auth = action.payload;
      })
      .addCase(signUp.rejected, setRejected)

      .addCase(validateUser.pending, setPending)
      .addCase(validateUser.fulfilled, (state, action) => {        
        state.loading = false;
        state.auth = action.payload?.user;
      })
      .addCase(validateUser.rejected, setRejected);
  },
});

// Common handlers
const setPending = (state) => {
  state.loading = true;
  state.error = null;
};

const setRejected = (state, action) => {
  state.loading = false;
  state.error = action.payload || action.error?.message || 'Something went wrong';
};

// Exports
// export const { setToken, toggleDarkMode, setCurrentTheme, showLogin, hideLogin } = authApi.actions;
export default authApi.reducer;