import { LinkProps, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type ButtonProps = {
  title: string;
  href: LinkProps['href'];
  variant?: 'primary' | 'danger';
};

export default function Button({title, href, variant}: ButtonProps) {
  const router = useRouter();

  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity onPress={() => router.replace(href)} style={[styles.requestButton, variant === 'danger' && { backgroundColor: '#F3383B' }]}>
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