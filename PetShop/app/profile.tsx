import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import BottomNav from './components/BottomNav';

export default function ProfileScreen() {
  const handleChangePassword = () => {
    Alert.alert(
      'Change Password',
      'This will go to the change password flow (UI only for now).'
    );
  };

  const handleSignOut = () => {
    router.replace('/login');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This is only a UI prototype – no real delete happens yet.'
    );
  };

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.email}>Email: user@example.com</Text>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleChangePassword}
          >
            <Text style={styles.primaryText}>Change Password</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleSignOut}
          >
            <Text style={styles.primaryText}>Sign Out</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dangerButton}
            onPress={handleDeleteAccount}
          >
            <Text style={styles.dangerText}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </View>

      <BottomNav active="profile" />
    </View>
  );
}

const BG = '#001F22';
const TEAL = '#00756F';
const RED = '#C62828';

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
  email: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 24,
  },
  buttonGroup: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: TEAL,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  dangerButton: {
    backgroundColor: RED,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dangerText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
