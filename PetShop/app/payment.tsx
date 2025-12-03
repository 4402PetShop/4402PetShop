import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import BottomNav from "./components/BottomNav";
import { router } from "expo-router"; 

export default function PaymentScreen() {
  const [cardNumber, setCardNumber] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [billingAddress, setBillingAddress] = useState("");

  const handleCheckout = () => {
    router.push("/confirmation"); 
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scroll}>
            <Text style={styles.header}>Payment</Text>

            <Text style={styles.label}>Card Number</Text>
            <TextInput
              style={styles.input}
              value={cardNumber}
              onChangeText={setCardNumber}
              placeholder="1234 5678 9012 3456"
              placeholderTextColor="#7AAFA9"
              keyboardType="numeric"
            />

            <Text style={styles.label}>Card Expiration</Text>
            <View style={styles.expirationRow}>
              <View style={styles.half}>
                <Text style={styles.smallLabel}>Month</Text>
                <TextInput
                  style={styles.input}
                  value={expMonth}
                  onChangeText={setExpMonth}
                  placeholder="MM"
                  placeholderTextColor="#7AAFA9"
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.half}>
                <Text style={styles.smallLabel}>Year</Text>
                <TextInput
                  style={styles.input}
                  value={expYear}
                  onChangeText={setExpYear}
                  placeholder="YY"
                  placeholderTextColor="#7AAFA9"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <Text style={styles.label}>CVV</Text>
            <TextInput
              style={styles.input}
              value={cvv}
              onChangeText={setCvv}
              placeholder="123"
              placeholderTextColor="#7AAFA9"
              secureTextEntry
              keyboardType="numeric"
            />

            <Text style={styles.label}>Cardholder First Name</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="John"
              placeholderTextColor="#7AAFA9"
            />

            <Text style={styles.label}>Cardholder Last Name</Text>
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Doe"
              placeholderTextColor="#7AAFA9"
            />

            <Text style={styles.label}>Billing Address</Text>
            <TextInput
              style={styles.input}
              value={billingAddress}
              onChangeText={setBillingAddress}
              placeholder="123 Main St"
              placeholderTextColor="#7AAFA9"
            />

            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={handleCheckout}
            >
              <Text style={styles.checkoutText}>Checkout</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>

      <BottomNav active="cart" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#002D2D",
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 120,
    paddingTop: 20,
  },
  header: {
    fontSize: 32,
    color: "white",
    fontWeight: "bold",
    marginBottom: 25,
    marginTop: 15,
  },
  label: {
    color: "white",
    fontSize: 16,
    marginBottom: 6,
    marginTop: 10,
  },
  smallLabel: {
    color: "white",
    fontSize: 14,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#054749",
    padding: 12,
    borderRadius: 10,
    color: "white",
    fontSize: 16,
  },
  expirationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  half: {
    width: "48%",
  },
  checkoutButton: {
    backgroundColor: "#0E7A75",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 25,
    marginBottom: 40,
  },
  checkoutText: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
  },
});