import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type ButtonProps = {
  title: string;
  variant?: 'primary' | 'danger';
  style?: {};
  onPress?: () => void;
};

export default function Button({title, variant, style, onPress}: ButtonProps) {
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity onPress={onPress} style={[styles.requestButton, variant === 'danger' && { backgroundColor: '#F3383B' }, style]}>
        <Text style={styles.requestButtonText}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  requestButton: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    width: 330,
    justifyContent: 'center',
    
  },
  requestButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center'
  },
});