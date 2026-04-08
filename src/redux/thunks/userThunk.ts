import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiService } from '../../services';
import { User, UsersState } from '../../types';

export const fetchUser = createAsyncThunk<User, number>(
  'users/fetchUser',
  async (userId, { getState, rejectWithValue }) => {
    const state = getState() as { users: UsersState };
    if (state.users.items[userId]) return state.users.items[userId];
    try {
      return await ApiService.fetchUser(userId);
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  },
);
