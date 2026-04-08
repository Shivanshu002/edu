# PostFeed — React Native Assessment App

A React Native app with navigation, infinite scroll, search, Redux state management, and local persistence.

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
- Bookmarks survive app kill/restart (AsyncStorage)
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

## How Redux Works in This App 

Think of Redux as a single shared notebook that every screen in the app can read from and write to. Instead of each screen keeping its own copy of data, they all look at the same notebook — so everything stays in sync.

### The Notebook has 3 sections (Slices)

**1. Posts (`postsSlice`)**
This section keeps the list of posts fetched from the API. When you open the app, it checks if there's already a saved list (from last time). If yes, it shows that instantly. If the list is older than 5 minutes, it goes and fetches fresh posts. When you scroll to the bottom, it loads the next page and adds them to the list. When you type in the search bar, it filters the already-loaded posts — no new API call needed.

**2. Users (`usersSlice`)**
When you tap on a post and want to see who wrote it, the app needs that user's details. This section caches each user by their ID. So if you visit the same author twice, it doesn't call the API again — it just reads from the notebook.

**3. Bookmarks (`bookmarksSlice`)**
When you tap the bookmark icon on a post, this section adds or removes that post from your saved list. Every time it changes, it also saves to AsyncStorage (phone storage) — so your bookmarks are still there even after you kill the app.

### How a screen talks to Redux

1. Screen calls a **thunk** (an async function) — e.g. "go fetch posts from the API"
2. The thunk does the API call, then tells the slice "here's the data, store it"
3. The slice updates the notebook
4. The screen automatically re-renders because it's watching that part of the notebook

```
Screen → dispatch(fetchPosts()) → API call → store posts in Redux → screen re-renders
```

### How data flows step by step

**Opening the app:**
- App loads → checks AsyncStorage for cached posts → loads them into Redux instantly → screen shows them right away → if cache is older than 5 min, fetches fresh posts in background

**Scrolling down:**
- User reaches end of list → screen dispatches `fetchPosts(nextPage)` → new posts appended to existing list in Redux → FlatList shows them

**Searching:**
- User types in search bar → screen dispatches `setSearchQuery("react")` → Redux filters the in-memory list → filtered results shown instantly (no API call)

**Bookmarking:**
- User taps bookmark → screen dispatches `toggleBookmark(post)` → Redux adds/removes from bookmarks array → saves updated array to AsyncStorage → Bookmarks tab badge updates

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
