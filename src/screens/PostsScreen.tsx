import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  FlatList,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  AppState,
  AppStateStatus,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { fetchPosts } from '../redux/thunks/postThunk';
import {
  setSearchQuery,
  resetPosts,
  selectCacheValid,
  setCurrentPage,
  PAGE_SIZE,
} from '../redux/slices/postSlice';
import { toggleBookmark } from '../redux/slices/bookmarkSlice';
import { Post } from '../types';
import { RootStackParamList, Routes } from '../utils/routers';
import { Colors } from '../utils/colors';
import PostCard from '../components/PostCard';
import SearchBar from '../components/SearchBar';
import { LoadingSpinner, ErrorView, EmptyView } from '../components/StateViews';

type Nav = StackNavigationProp<RootStackParamList>;

const MAX_SUGGESTIONS = 5;

export default function PostsScreen() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<Nav>();
  const {
    filteredItems,
    items,
    searchQuery,
    loading,
    loadingMore,
    error,
    hasMore,
    page,
    lastFetched,
    currentPage,
  } = useAppSelector(s => s.posts);
  const bookmarkIds = useAppSelector(s => s.bookmarks.ids);
  const appState = useRef(AppState.currentState);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const pagedItems = useMemo(
    () => filteredItems.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filteredItems, currentPage],
  );

  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    const seen = new Set<string>();
    const result: string[] = [];
    for (const post of items) {
      if (result.length >= MAX_SUGGESTIONS) break;
      const title = post.title;
      if (title.toLowerCase().includes(q) && !seen.has(title)) {
        seen.add(title);
        result.push(title);
      }
    }
    return result;
  }, [searchQuery, items]);

  const loadInitial = useCallback(() => {
    if (!selectCacheValid(lastFetched)) {
      dispatch(resetPosts());
      dispatch(fetchPosts(1));
    }
  }, [dispatch, lastFetched]);

  useEffect(() => { loadInitial(); }, [loadInitial]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (next: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        next === 'active' &&
        !selectCacheValid(lastFetched)
      ) {
        dispatch(resetPosts());
        dispatch(fetchPosts(1));
      }
      appState.current = next;
    });
    return () => sub.remove();
  }, [dispatch, lastFetched]);

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore && !searchQuery && currentPage === totalPages) {
      dispatch(fetchPosts(page));
    }
  }, [dispatch, loadingMore, hasMore, page, searchQuery, currentPage, totalPages]);

  const handleRefresh = useCallback(() => {
    dispatch(resetPosts());
    dispatch(fetchPosts(1));
  }, [dispatch]);

  const renderItem = useCallback(
    ({ item }: { item: Post }) => (
      <PostCard
        post={item}
        isBookmarked={bookmarkIds.includes(item.id)}
        onPress={() => navigation.navigate(Routes.PostDetail, { post: item })}
        onBookmark={() => dispatch(toggleBookmark(item.id))}
      />
    ),
    [bookmarkIds, navigation, dispatch],
  );

  const ListFooter = useCallback(
    () =>
      loadingMore ? (
        <View style={styles.footer}>
          <ActivityIndicator size="small" color={Colors.primary} />
        </View>
      ) : null,
    [loadingMore],
  );

  if (loading && filteredItems.length === 0) {
    return <LoadingSpinner message="Loading posts..." />;
  }
  if (error && filteredItems.length === 0) {
    return <ErrorView message={error} onRetry={handleRefresh} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover</Text>
        <Text style={styles.headerSub}>
          {filteredItems.length} posts
        </Text>
      </View>

      <SearchBar
        value={searchQuery}
        onChange={q => dispatch(setSearchQuery(q))}
        suggestions={suggestions}
        onSuggestionPress={s => dispatch(setSearchQuery(s))}
      />

      {searchQuery.length > 0 && (
        <Text style={styles.resultCount}>
          {filteredItems.length} result{filteredItems.length !== 1 ? 's' : ''} for "{searchQuery}"
        </Text>
      )}

      <FlatList
        data={pagedItems}
        renderItem={renderItem}
        keyExtractor={item => String(item.id)}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.4}
        ListFooterComponent={ListFooter}
        ListEmptyComponent={<EmptyView message="No posts found" />}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
          />
        }
        removeClippedSubviews
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={10}
        contentContainerStyle={
          pagedItems.length === 0 ? styles.emptyContainer : styles.list
        }
      />

      {totalPages > 1 && (
        <View style={styles.pagination}>
          <TouchableOpacity
            style={[styles.pageBtn, currentPage === 1 && styles.pageBtnDisabled]}
            disabled={currentPage === 1}
            onPress={() => dispatch(setCurrentPage(currentPage - 1))}>
            <Text style={[styles.pageBtnText, currentPage === 1 && styles.pageBtnTextDisabled]}>‹</Text>
          </TouchableOpacity>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
            .reduce<(number | '...')[]>((acc, p, idx, arr) => {
              if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) acc.push('...');
              acc.push(p);
              return acc;
            }, [])
            .map((p, idx) =>
              p === '...' ? (
                <Text key={`e-${idx}`} style={styles.ellipsis}>…</Text>
              ) : (
                <TouchableOpacity
                  key={p}
                  style={[styles.pageBtn, currentPage === p && styles.pageBtnActive]}
                  onPress={() => dispatch(setCurrentPage(p as number))}>
                  <Text style={[styles.pageBtnText, currentPage === p && styles.pageBtnTextActive]}>
                    {p}
                  </Text>
                </TouchableOpacity>
              ),
            )}

          <TouchableOpacity
            style={[styles.pageBtn, currentPage === totalPages && styles.pageBtnDisabled]}
            disabled={currentPage === totalPages}
            onPress={() => dispatch(setCurrentPage(currentPage + 1))}>
            <Text style={[styles.pageBtnText, currentPage === totalPages && styles.pageBtnTextDisabled]}>›</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: 0.2,
  },
  headerSub: {
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  list: { paddingVertical: 6, paddingBottom: 12 },
  emptyContainer: { flex: 1 },
  footer: { paddingVertical: 16, alignItems: 'center' },
  resultCount: {
    fontSize: 12,
    color: Colors.primary,
    marginHorizontal: 20,
    marginBottom: 6,
    fontWeight: '600',
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 6,
  },
  pageBtn: {
    minWidth: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    backgroundColor: Colors.cardAlt,
  },
  pageBtnActive: { backgroundColor: Colors.primary },
  pageBtnDisabled: { opacity: 0.3 },
  pageBtnText: { fontSize: 14, color: Colors.textSecondary, fontWeight: '600' },
  pageBtnTextActive: { color: Colors.background, fontWeight: '800' },
  pageBtnTextDisabled: { color: Colors.textMuted },
  ellipsis: { fontSize: 14, color: Colors.textMuted, paddingHorizontal: 2 },
});
