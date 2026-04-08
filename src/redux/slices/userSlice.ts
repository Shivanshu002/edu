import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UsersState } from '../../types';
import { fetchUser } from '../thunks/userThunk';

const userSlice = createSlice({
  name: 'users',
  initialState: { items: {}, loading: false, error: null } as UsersState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.items[action.payload.id] = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default userSlice.reducer;
