import React from 'react';
import { View, ActivityIndicator, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../utils/colors';

export const LoadingSpinner = ({ message }: { message?: string }) => (
  <View style={styles.center}>
    <View style={styles.spinnerWrap}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
    {message && <Text style={styles.msg}>{message}</Text>}
  </View>
);

export const ErrorView = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) => (
  <View style={styles.center}>
    <Text style={styles.icon}>⚠️</Text>
    <Text style={styles.errorText}>{message}</Text>
    <TouchableOpacity style={styles.retryBtn} onPress={onRetry}>
      <Text style={styles.retryText}>Try Again</Text>
    </TouchableOpacity>
  </View>
);

export const EmptyView = ({ message }: { message: string }) => (
  <View style={styles.center}>
    <Text style={styles.icon}>📭</Text>
    <Text style={styles.emptyText}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: Colors.background,
  },
  spinnerWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  msg: { color: Colors.textSecondary, fontSize: 14, marginTop: 4 },
  icon: { fontSize: 48, marginBottom: 16 },
  errorText: {
    fontSize: 15,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  retryBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryText: { fontSize: 15, fontWeight: '700', color: Colors.avatarText },
  emptyText: { fontSize: 15, color: Colors.textMuted, textAlign: 'center', lineHeight: 22 },
});
