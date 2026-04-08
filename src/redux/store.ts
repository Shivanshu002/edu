import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import postReducer from './slices/postSlice';
import userReducer from './slices/userSlice';
import bookmarkReducer from './slices/bookmarkSlice';

export const store = configureStore({
  reducer: {
    posts: postReducer,
    users: userReducer,
    bookmarks: bookmarkReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
