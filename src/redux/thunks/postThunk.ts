import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiService, StorageService } from '../../services';
import { Post } from '../../types';

export const loadCachedPosts = createAsyncThunk<Post[]>(
  'posts/loadCached',
  async () => StorageService.getPosts(),
);

export const fetchPosts = createAsyncThunk<
  { posts: Post[]; page: number },
  number
>('posts/fetchPosts', async (page, { rejectWithValue }) => {
  try {
    const posts = await ApiService.fetchPosts(page);
    return { posts, page };
  } catch (e: any) {
    return rejectWithValue(e.message);
  }
});
