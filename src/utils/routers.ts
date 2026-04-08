import { Post } from '../types';

export type RootStackParamList = {
  MainTabs: undefined;
  PostDetail: { post: Post };
  UserProfile: { userId: number };
};

export type BottomTabParamList = {
  Posts: undefined;
  Bookmarks: undefined;
};

export const Routes = {
  MainTabs: 'MainTabs' as const,
  PostDetail: 'PostDetail' as const,
  UserProfile: 'UserProfile' as const,
  Posts: 'Posts' as const,
  Bookmarks: 'Bookmarks' as const,
};
