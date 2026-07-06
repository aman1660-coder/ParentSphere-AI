import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api, { apiError } from '../../services/api';

const savedUser = localStorage.getItem('parentsphere_user');

export const loginUser = createAsyncThunk('auth/login', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/login', payload);
    return data;
  } catch (error) {
    return rejectWithValue(apiError(error));
  }
});

export const registerUser = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/register', payload);
    return data;
  } catch (error) {
    return rejectWithValue(apiError(error));
  }
});

export const loadMe = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/auth/me');
    return data.user;
  } catch (error) {
    return rejectWithValue(apiError(error));
  }
});

const persistSession = ({ user, accessToken, refreshToken }) => {
  localStorage.setItem('parentsphere_user', JSON.stringify(user));
  if (accessToken) localStorage.setItem('parentsphere_access_token', accessToken);
  if (refreshToken) localStorage.setItem('parentsphere_refresh_token', refreshToken);
};

const clearSession = () => {
  localStorage.removeItem('parentsphere_user');
  localStorage.removeItem('parentsphere_access_token');
  localStorage.removeItem('parentsphere_refresh_token');
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: savedUser ? JSON.parse(savedUser) : null,
    status: 'idle',
    error: null
  },
  reducers: {
    logout(state) {
      clearSession();
      state.user = null;
      state.status = 'idle';
      state.error = null;
    },
    updateUser(state, action) {
      state.user = action.payload;
      localStorage.setItem('parentsphere_user', JSON.stringify(action.payload));
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        persistSession(action.payload);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        persistSession(action.payload);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(loadMe.fulfilled, (state, action) => {
        state.user = action.payload;
        localStorage.setItem('parentsphere_user', JSON.stringify(action.payload));
      });
  }
});

export const { logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
