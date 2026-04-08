import { createAsyncThunk } from '@reduxjs/toolkit';
import { StorageService } from '../../services';

export const loadCachedBookmarks = createAsyncThunk<number[]>(
  'bookmarks/loadCached',
  async () => StorageService.getBookmarks(),
);
