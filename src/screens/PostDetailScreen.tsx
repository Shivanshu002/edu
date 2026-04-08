import React, { useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { toggleBookmark } from '../redux/slices/bookmarkSlice';
import { fetchUser } from '../redux/thunks/userThunk';
import { RootStackParamList, Routes } from '../utils/routers';
import { Colors } from '../utils/colors';
import { LoadingSpinner } from '../components/StateViews';

type Route = RouteProp<RootStackParamList, 'PostDetail'>;
type Nav = StackNavigationProp<RootStackParamList>;

export default function PostDetailScreen() {
  const { post } = useRoute<Route>().params;
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();
  const isBookmarked = useAppSelector(s => s.bookmarks.ids.includes(post.id));
  const user = useAppSelector(s => s.users.items[post.userId]);
  const userLoading = useAppSelector(s => s.users.loading);

  useEffect(() => {
    dispatch(fetchUser(post.userId));
  }, [dispatch, post.userId]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <View style={styles.idRow}>
          <View style={styles.idBadge}>
            <Text style={styles.idText}>POST #{post.id}</Text>
          </View>
          <TouchableOpacity
            style={[styles.saveBtn, isBookmarked && styles.saveBtnActive]}
            onPress={() => dispatch(toggleBookmark(post.id))}>
            <Text style={[styles.saveBtnText, isBookmarked && styles.saveBtnTextActive]}>
              {isBookmarked ? '★ Saved' : '☆ Save'}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>{post.title}</Text>
      </View>

      <View style={styles.bodyCard}>
        <Text style={styles.body}>{post.body}</Text>
      </View>

      <Text style={styles.sectionLabel}>Author</Text>

      {userLoading && !user ? (
        <LoadingSpinner />
      ) : user ? (
        <TouchableOpacity
          style={styles.authorCard}
          onPress={() => navigation.navigate(Routes.UserProfile, { userId: user.id })}
          activeOpacity={0.75}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user.name[0]}</Text>
          </View>
          <View style={styles.authorInfo}>
            <Text style={styles.authorName}>{user.name}</Text>
            <Text style={styles.authorEmail}>{user.email}</Text>
          </View>
          <View style={styles.chevronWrap}>
            <Text style={styles.chevron}>›</Text>
          </View>
        </TouchableOpacity>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 40 },
  hero: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  idRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  idBadge: {
    backgroundColor: Colors.tagBg,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  idText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 1,
  },
  saveBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  saveBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  saveBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  saveBtnTextActive: {
    color: Colors.background,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
    lineHeight: 30,
    letterSpacing: 0.1,
  },
  bodyCard: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  body: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 26,
  },
  sectionLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '700',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginLeft: 4,
  },
  authorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarText: { color: Colors.avatarText, fontSize: 20, fontWeight: '800' },
  authorInfo: { flex: 1 },
  authorName: { fontSize: 15, fontWeight: '700', color: Colors.text },
  authorEmail: { fontSize: 13, color: Colors.textMuted, marginTop: 3 },
  chevronWrap: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: Colors.cardAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevron: { fontSize: 18, color: Colors.primary, fontWeight: '700' },
});
