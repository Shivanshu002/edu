import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from './src/redux/store';
import { loadCachedPosts } from './src/redux/thunks/postThunk';
import { loadCachedBookmarks } from './src/redux/thunks/bookmarkThunk';
import RootNavigator from './src/navigation/RootNavigator';

function AppBootstrap() {
  useEffect(() => {
    store.dispatch(loadCachedPosts());
    store.dispatch(loadCachedBookmarks());
  }, []);

  return <RootNavigator />;
}

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <AppBootstrap />
      </SafeAreaProvider>
    </Provider>
  );
}
