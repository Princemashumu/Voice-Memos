import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const Header = ({ searchQuery = '', onSearch = () => {} }) => (
  <View style={styles.container}>
    <Text style={styles.heading}>All Your Recordings</Text>
    <View style={styles.searchContainer}>
      <MaterialIcons
        name="search"
        size={24}
        color="gray"
        style={styles.searchIcon}
        accessibilityLabel="Search Icon"
      />
      <TextInput
        style={styles.searchInput}
        placeholder="Search for your recordings..."
        placeholderTextColor="#555"
        value={searchQuery}
        onChangeText={onSearch}
        accessibilityLabel="Search Input"
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1A1A1A',
    padding: 15,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#CCA65F',
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#000',
    fontSize: 16,
    height: '100%',
  },
});

export default Header;
