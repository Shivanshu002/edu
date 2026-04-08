import React, { useCallback } from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { toggleBookmark } from '../redux/slices/bookmarkSlice';
import { Post } from '../types';
import { RootStackParamList, Routes } from '../utils/routers';
import { Colors } from '../utils/colors';
import PostCard from '../components/PostCard';
import { EmptyView } from '../components/StateViews';

type Nav = StackNavigationProp<RootStackParamList>;

export default function BookmarksScreen() {
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();
  const bookmarkIds = useAppSelector(s => s.bookmarks.ids);
  const allPosts = useAppSelector(s => s.posts.items);
  const bookmarkedPosts = allPosts.filter(p => bookmarkIds.includes(p.id));

  const renderItem = useCallback(
    ({ item }: { item: Post }) => (
      <PostCard
        post={item}
        isBookmarked
        onPress={() => navigation.navigate(Routes.PostDetail, { post: item })}
        onBookmark={() => dispatch(toggleBookmark(item.id))}
      />
    ),
    [navigation, dispatch],
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Saved</Text>
        {bookmarkedPosts.length > 0 && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{bookmarkedPosts.length}</Text>
          </View>
        )}
      </View>
      <FlatList
        data={bookmarkedPosts}
        renderItem={renderItem}
        keyExtractor={item => String(item.id)}
        ListEmptyComponent={
          <EmptyView message={'No bookmarks yet.\nStar posts to save them here.'} />
        }
        contentContainerStyle={
          bookmarkedPosts.length === 0 ? styles.empty : styles.list
        }
        removeClippedSubviews
        maxToRenderPerBatch={10}
        windowSize={10}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 10,
    gap: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: 0.2,
  },
  countBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    minWidth: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  countText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.background,
  },
  list: { paddingVertical: 6, paddingBottom: 12 },
  empty: { flex: 1 },
});
