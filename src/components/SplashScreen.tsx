import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  View,
  StatusBar,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface Props {
  onDone: () => void;
}

export default function SplashScreen({ onDone }: Props) {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.7)).current;
  const tagOpacity = useRef(new Animated.Value(0)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(logoScale, { toValue: 1, friction: 5, useNativeDriver: true }),
      ]),
      Animated.timing(tagOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.delay(900),
      Animated.timing(screenOpacity, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start(onDone);
  }, [logoOpacity, logoScale, tagOpacity, screenOpacity, onDone]);

  return (
    <Animated.View style={[styles.container, { opacity: screenOpacity }]}>
      <StatusBar barStyle="light-content" backgroundColor="#1A73E8" />

      <View style={styles.circleLarge} />
      <View style={styles.circleSmall} />

      <Animated.View
        style={[styles.content, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
        <View style={styles.logoBox}>
          <Text style={styles.logoLetter}>E</Text>
        </View>

        <Text style={styles.appName}>Educase India</Text>
      </Animated.View>

      <Animated.Text style={[styles.tagline, { opacity: tagOpacity }]}>
        Empowering Education
      </Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width,
    height,
    backgroundColor: '#1A73E8',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  circleLarge: {
    position: 'absolute',
    width: width * 1.1,
    height: width * 1.1,
    borderRadius: width * 0.55,
    backgroundColor: 'rgba(255,255,255,0.06)',
    top: -width * 0.35,
    left: -width * 0.05,
  },
  circleSmall: {
    position: 'absolute',
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width * 0.35,
    backgroundColor: 'rgba(255,255,255,0.06)',
    bottom: -width * 0.15,
    right: -width * 0.15,
  },
  content: { alignItems: 'center', gap: 20 },
  logoBox: {
    width: 100,
    height: 100,
    borderRadius: 28,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  logoLetter: {
    fontSize: 56,
    fontWeight: '900',
    color: '#1A73E8',
    lineHeight: 64,
  },
  appName: {
    fontSize: 30,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.4,
  },
  tagline: {
    position: 'absolute',
    bottom: 60,
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
});
