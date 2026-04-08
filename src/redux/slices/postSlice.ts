import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Post, PostsState } from '../../types';
import { StorageService } from '../../services';
import { fetchPosts, loadCachedPosts } from '../thunks/postThunk';

export const CACHE_TTL = 5 * 60 * 1000;

export const selectCacheValid = (lastFetched: number | null) =>
  lastFetched !== null && Date.now() - lastFetched < CACHE_TTL;

const applySearch = (items: Post[], query: string): Post[] => {
  if (!query.trim()) return items;
  const q = query.toLowerCase();
  return items.filter(
    p =>
      p.title.toLowerCase().includes(q) || p.body.toLowerCase().includes(q),
  );
};

export const PAGE_SIZE = 10;

const initialState: PostsState = {
  items: [],
  filteredItems: [],
  searchQuery: '',
  page: 1,
  hasMore: true,
  loading: false,
  loadingMore: false,
  error: null,
  lastFetched: null,
  currentPage: 1,
};

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
      state.filteredItems = applySearch(state.items, action.payload);
      state.currentPage = 1;
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
    resetPosts(state) {
      state.items = [];
      state.filteredItems = [];
      state.page = 1;
      state.hasMore = true;
      state.error = null;
      state.lastFetched = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadCachedPosts.fulfilled, (state, action) => {
        if (action.payload.length > 0) {
          state.items = action.payload;
          state.filteredItems = action.payload;
          state.page = Math.ceil(action.payload.length / 20) + 1;
        }
      })
      .addCase(fetchPosts.pending, (state, action) => {
        action.meta.arg === 1
          ? (state.loading = true)
          : (state.loadingMore = true);
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        const { posts, page } = action.payload;
        state.loading = false;
        state.loadingMore = false;
        state.hasMore = posts.length === 20;
        state.page = page + 1;
        state.lastFetched = Date.now();

        if (page === 1) {
          state.items = posts;
        } else {
          const existingIds = new Set(state.items.map(p => p.id));
          state.items = [
            ...state.items,
            ...posts.filter(p => !existingIds.has(p.id)),
          ];
        }

        StorageService.savePosts(state.items);
        state.filteredItems = applySearch(state.items, state.searchQuery);
        state.currentPage = 1;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSearchQuery, resetPosts, setCurrentPage } = postSlice.actions;
export default postSlice.reducer;
