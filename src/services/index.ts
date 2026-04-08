import AsyncStorage from '@react-native-async-storage/async-storage';
import { Post, User } from '../types';

// ─── Storage ────────────────────────────────────────────────────────────────

const POSTS_KEY = 'cached_posts';
const BOOKMARKS_KEY = 'bookmarks';

export const StorageService = {
  savePosts: (posts: Post[]) =>
    AsyncStorage.setItem(POSTS_KEY, JSON.stringify(posts)),
  getPosts: async (): Promise<Post[]> => {
    const data = await AsyncStorage.getItem(POSTS_KEY);
    return data ? JSON.parse(data) : [];
  },
  saveBookmarks: (ids: number[]) =>
    AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(ids)),
  getBookmarks: async (): Promise<number[]> => {
    const data = await AsyncStorage.getItem(BOOKMARKS_KEY);
    return data ? JSON.parse(data) : [];
  },
};

// ─── API ─────────────────────────────────────────────────────────────────────

const BASE = 'https://jsonplaceholder.typicode.com';
export const PAGE_SIZE = 20;

export const ApiService = {
  fetchPosts: async (page: number): Promise<Post[]> => {
    const res = await fetch(`${BASE}/posts?_page=${page}&_limit=${PAGE_SIZE}`);
    if (!res.ok) throw new Error('Failed to fetch posts');
    return res.json();
  },
  fetchUser: async (userId: number): Promise<User> => {
    const res = await fetch(`${BASE}/users/${userId}`);
    if (!res.ok) throw new Error('Failed to fetch user');
    return res.json();
  },
};
