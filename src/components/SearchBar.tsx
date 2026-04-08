import React, { memo } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
  StyleSheet,
} from 'react-native';
import { Colors } from '../utils/colors';

interface Props {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
  suggestions?: string[];
  onSuggestionPress?: (suggestion: string) => void;
}

const SearchBar = memo(
  ({
    value,
    onChange,
    placeholder = 'Search posts...',
    suggestions = [],
    onSuggestionPress,
  }: Props) => (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Text style={styles.icon}>🔍</Text>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={Colors.textMuted}
          returnKeyType="search"
          clearButtonMode="never"
          autoCorrect={false}
        />
        {value.length > 0 && (
          <TouchableOpacity
            onPress={() => onChange('')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.clearBtn}>
            <Text style={styles.clear}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
      {suggestions.length > 0 && (
        <View style={styles.dropdown}>
          <FlatList
            data={suggestions}
            keyExtractor={(_, i) => String(i)}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => onSuggestionPress?.(item)}>
                <Text style={styles.suggestionIcon}>↗</Text>
                <Text style={styles.suggestionText} numberOfLines={1}>
                  {item}
                </Text>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>
      )}
    </View>
  ),
);

const styles = StyleSheet.create({
  wrapper: { zIndex: 10, marginHorizontal: 16, marginVertical: 10 },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  icon: { fontSize: 15, marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: Colors.text, padding: 0 },
  clearBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clear: { fontSize: 10, color: Colors.background, fontWeight: '700' },
  dropdown: {
    position: 'absolute',
    top: 56,
    left: 0,
    right: 0,
    backgroundColor: Colors.cardAlt,
    borderRadius: 14,
    maxHeight: 230,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
    zIndex: 20,
    overflow: 'hidden',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  suggestionIcon: {
    fontSize: 13,
    marginRight: 12,
    color: Colors.primary,
    fontWeight: '700',
  },
  suggestionText: { flex: 1, fontSize: 14, color: Colors.text },
  separator: { height: 1, backgroundColor: Colors.border },
});

export default SearchBar;
