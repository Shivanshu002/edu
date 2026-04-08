export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  phone: string;
  website: string;
  company: { name: string };
  address: { city: string };
}

export interface PostsState {
  items: Post[];
  filteredItems: Post[];
  searchQuery: string;
  page: number;
  hasMore: boolean;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  lastFetched: number | null;
  currentPage: number;
}

export interface UsersState {
  items: Record<number, User>;
  loading: boolean;
  error: string | null;
}

export interface BookmarksState {
  ids: number[];
}
