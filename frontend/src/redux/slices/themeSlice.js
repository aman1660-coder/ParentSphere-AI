import { createSlice } from '@reduxjs/toolkit';

const initialMode =
  localStorage.getItem('parentsphere_theme') ||
  (window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

const themeSlice = createSlice({
  name: 'theme',
  initialState: { mode: initialMode },
  reducers: {
    toggleTheme(state) {
      state.mode = state.mode === 'dark' ? 'light' : 'dark';
      localStorage.setItem('parentsphere_theme', state.mode);
      document.documentElement.classList.toggle('dark', state.mode === 'dark');
    },
    applyTheme(state) {
      document.documentElement.classList.toggle('dark', state.mode === 'dark');
    }
  }
});

export const { toggleTheme, applyTheme } = themeSlice.actions;
export default themeSlice.reducer;
