import { configureStore } from '@reduxjs/toolkit';
import notifyReducer from '@/features/notifySlice';

export const store = configureStore({
  reducer: {
    notify: notifyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;