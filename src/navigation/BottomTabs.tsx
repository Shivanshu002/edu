import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';
import PostsScreen from '../screens/PostsScreen';
import BookmarksScreen from '../screens/BookmarksScreen';
import { BottomTabParamList, Routes } from '../utils/routers';
import { Colors } from '../utils/colors';
import { useAppSelector } from '../redux/store';

const Tab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabs() {
  const bookmarkCount = useAppSelector(s => s.bookmarks.ids.length);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
      }}>
      <Tab.Screen
        name={Routes.Posts}
        component={PostsScreen}
        options={{
          tabBarLabel: 'Feed',
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>📰</Text>
          ),
        }}
      />
      <Tab.Screen
        name={Routes.Bookmarks}
        component={BookmarksScreen}
        options={{
          tabBarLabel: 'Saved',
          tabBarIcon: ({ focused }) => (
            <View>
              <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>★</Text>
              {bookmarkCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {bookmarkCount > 99 ? '99+' : bookmarkCount}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.card,
    borderTopColor: Colors.border,
    borderTopWidth: 1,
    height: 60,
    paddingBottom: 8,
    paddingTop: 6,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.background,
  },
});
