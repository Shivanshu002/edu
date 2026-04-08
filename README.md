# PostFeed — React Native Assessment App

A production-quality React Native app demonstrating navigation, infinite scroll, search, Redux state management, and local persistence.

---

## App Functionality

| Screen | Description |
|---|---|
| **Posts Feed** | Infinite-scrolling list of posts from JSONPlaceholder API with live search |
| **Post Detail** | Full post content + author card that navigates to the user profile |
| **User Profile** | Author details (contact, location, company) |
| **Bookmarks Tab** | Persisted saved posts, badge count on tab bar |

**Key behaviours:**
- Pull-to-refresh on the feed
- Search filters title + body client-side (no extra API calls)
- Bookmarks survive app kill/restart (MMKV storage)
- Cached posts restore instantly on cold start; stale after 5 min
- App foreground event triggers a cache-validity check and re-fetches if stale

---

## How to Run

```sh
# 1. Install JS dependencies
npm install

# 2. iOS only — install native pods
cd ios && bundle exec pod install && cd ..

# 3. Start Metro
npm start

# 4a. Android
npm run android

# 4b. iOS
npm run ios
```

> Requires React Native CLI environment. See https://reactnative.dev/docs/set-up-your-environment

---

## Key Technical Decisions

### Redux Toolkit (RTK)
Used `createSlice` + `createAsyncThunk` for all async data flows. Three slices:
- `postsSlice` — paginated list, search filter, cache TTL
- `usersSlice` — per-user cache (avoids re-fetching the same user)
- `bookmarksSlice` — toggle + persist on every change

### AsyncStorage for Persistence
`@react-native-async-storage/async-storage` persists posts and bookmarks. On app start, `loadCachedPosts` and `loadCachedBookmarks` thunks rehydrate Redux state before the first API call — restoring content instantly after a kill/restart.

### FlatList Performance
`removeClippedSubviews`, `maxToRenderPerBatch=10`, `windowSize=10`, `initialNumToRender=10`, and `memo`-wrapped `PostCard` prevent unnecessary re-renders on a 100-item list.

### Search — Client-side
All 100 posts are loaded page-by-page. Search runs against the in-memory Redux store so results are instant with no debounce needed. Pagination is paused while a search query is active.

### App Lifecycle
`AppState` listener in `PostsScreen` detects foreground transitions and re-fetches only when the 5-minute cache TTL has expired.

### Navigation
`@react-navigation/stack` (modal-style transitions) wraps a `@react-navigation/bottom-tabs` navigator. Stack lives outside the tabs so `PostDetail` and `UserProfile` push over the tab bar.

---

## Improvements With More Time

1. **Offline indicator** — banner when the device has no network, queue retries
2. **Optimistic bookmark toggle** — already instant, but could add undo snackbar
3. **Skeleton loaders** — replace spinner with shimmer placeholders for perceived performance
4. **Unit tests** — RTK slice reducers are pure functions; easy to test with Jest
5. **Error boundary** — catch unexpected render errors gracefully
6. **Accessibility** — `accessibilityLabel` on all interactive elements
7. **Dark mode** — colour tokens via a theme context
