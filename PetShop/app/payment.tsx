import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BottomNav from './components/BottomNav';

export default function PaymentScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <Text style={styles.title}>Payment</Text>
        <Text style={styles.text}>
          This is the payment screen placeholder. Your teammates can hook the
          real payment flow here later.
        </Text>
      </View>
      <BottomNav active="cart" />
    </View>
  );
}

const BG = '#001F22';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    color: '#E0F4F3',
  },
});
