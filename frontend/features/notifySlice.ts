import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NotifyState {
  hasNotify: boolean;
}

const initialState: NotifyState = {
  hasNotify: false,
};

const notifySlice = createSlice({
  name: 'notify',
  initialState,
  reducers: {
    setHasNotify: (state, action: PayloadAction<boolean>) => {
      state.hasNotify = action.payload;
    },
    toggleHasNotify: (state) => {
      state.hasNotify = !state.hasNotify;
    },
  },
});

export const { setHasNotify, toggleHasNotify } = notifySlice.actions;
export default notifySlice.reducer;