import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Post } from '../types';
import { Colors } from '../utils/colors';

interface Props {
  post: Post;
  isBookmarked: boolean;
  onPress: () => void;
  onBookmark: () => void;
}

const PostCard = memo(({ post, isBookmarked, onPress, onBookmark }: Props) => (
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
    <View style={styles.accentBar} />
    <View style={styles.inner}>
      <View style={styles.header}>
        <View style={styles.idBadge}>
          <Text style={styles.idText}>#{post.id}</Text>
        </View>
        <TouchableOpacity
          onPress={onBookmark}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={[styles.bookmarkBtn, isBookmarked && styles.bookmarkBtnActive]}>
          <Text style={[styles.bookmarkIcon, isBookmarked && styles.bookmarkIconActive]}>
            {isBookmarked ? '★' : '☆'}
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {post.title}
      </Text>
      <Text style={styles.body} numberOfLines={3}>
        {post.body}
      </Text>
      <View style={styles.footer}>
        <Text style={styles.readMore}>Read more →</Text>
      </View>
    </View>
  </TouchableOpacity>
));

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    marginHorizontal: 16,
    marginVertical: 7,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  accentBar: {
    width: 4,
    backgroundColor: Colors.primary,
  },
  inner: {
    flex: 1,
    padding: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  idBadge: {
    backgroundColor: Colors.tagBg,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  idText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  bookmarkBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Colors.bookmarkInactive,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookmarkBtnActive: {
    backgroundColor: Colors.primary,
  },
  bookmarkIcon: {
    fontSize: 16,
    color: Colors.textMuted,
  },
  bookmarkIconActive: {
    color: Colors.avatarText,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    lineHeight: 22,
    marginBottom: 8,
    letterSpacing: 0.1,
  },
  body: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  footer: {
    marginTop: 12,
  },
  readMore: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
    letterSpacing: 0.3,
  },
});

export default PostCard;
