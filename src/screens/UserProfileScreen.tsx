import React, { useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { fetchUser } from '../redux/thunks/userThunk';
import { RootStackParamList } from '../utils/routers';
import { Colors } from '../utils/colors';
import { LoadingSpinner, ErrorView } from '../components/StateViews';

type Route = RouteProp<RootStackParamList, 'UserProfile'>;

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View style={styles.card}>
    <View style={styles.sectionHeader}>
      <View style={styles.sectionDot} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    {children}
  </View>
);

export default function UserProfileScreen() {
  const { userId } = useRoute<Route>().params;
  const dispatch = useAppDispatch();
  const user = useAppSelector(s => s.users.items[userId]);
  const { loading, error } = useAppSelector(s => s.users);

  useEffect(() => {
    dispatch(fetchUser(userId));
  }, [dispatch, userId]);

  if (loading && !user) return <LoadingSpinner message="Loading profile..." />;
  if (error && !user)
    return <ErrorView message={error} onRetry={() => dispatch(fetchUser(userId))} />;
  if (!user) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.heroCard}>
        <View style={styles.avatarRing}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user.name[0]}</Text>
          </View>
        </View>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.username}>@{user.username}</Text>
        <View style={styles.companyBadge}>
          <Text style={styles.companyText}>{user.company.name}</Text>
        </View>
      </View>

      <SectionCard title="Contact">
        <InfoRow label="Email" value={user.email} />
        <InfoRow label="Phone" value={user.phone} />
        <InfoRow label="Website" value={user.website} />
      </SectionCard>

      <SectionCard title="Location">
        <InfoRow label="City" value={user.address.city} />
      </SectionCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 40 },
  heroCard: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  avatarRing: {
    width: 88,
    height: 88,
    borderRadius: 26,
    borderWidth: 3,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: Colors.avatarText, fontSize: 34, fontWeight: '800' },
  name: { fontSize: 22, fontWeight: '800', color: Colors.text, letterSpacing: 0.2 },
  username: { fontSize: 14, color: Colors.textMuted, marginTop: 4, marginBottom: 14 },
  companyBadge: {
    backgroundColor: Colors.tagBg,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  companyText: { fontSize: 13, fontWeight: '600', color: Colors.primary },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  label: { fontSize: 14, color: Colors.textMuted },
  value: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
    marginLeft: 12,
  },
});
