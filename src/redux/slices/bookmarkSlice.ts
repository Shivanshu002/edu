import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BookmarksState } from '../../types';
import { StorageService } from '../../services';
import { loadCachedBookmarks } from '../thunks/bookmarkThunk';

const bookmarkSlice = createSlice({
  name: 'bookmarks',
  initialState: { ids: [] } as BookmarksState,
  reducers: {
    toggleBookmark(state, action: PayloadAction<number>) {
      const id = action.payload;
      const idx = state.ids.indexOf(id);
      if (idx >= 0) {
        state.ids.splice(idx, 1);
      } else {
        state.ids.push(id);
      }
      StorageService.saveBookmarks(state.ids);
    },
  },
  extraReducers: builder => {
    builder.addCase(
      loadCachedBookmarks.fulfilled,
      (state, action: PayloadAction<number[]>) => {
        state.ids = action.payload;
      },
    );
  },
});

export const { toggleBookmark } = bookmarkSlice.actions;
export default bookmarkSlice.reducer;
