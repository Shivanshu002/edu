import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList, Routes } from '../utils/routers';
import { Colors } from '../utils/colors';
import BottomTabs from './BottomTabs';
import PostDetailScreen from '../screens/PostDetailScreen';
import UserProfileScreen from '../screens/UserProfileScreen';

const Stack = createStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: Colors.card },
          headerTintColor: Colors.primary,
          headerTitleStyle: { fontWeight: '700', color: Colors.text },
          headerBackTitleVisible: false,
        }}>
        <Stack.Screen
          name={Routes.MainTabs}
          component={BottomTabs}
          options={{ title: 'PostFeed' }}
        />
        <Stack.Screen
          name={Routes.PostDetail}
          component={PostDetailScreen}
          options={{ title: 'Post Detail' }}
        />
        <Stack.Screen
          name={Routes.UserProfile}
          component={UserProfileScreen}
          options={{ title: 'Profile' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
