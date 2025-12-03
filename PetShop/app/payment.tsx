import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import BottomNav from './components/BottomNav';
import { supabase } from '../lib/supabase';
import { useUser } from './context/userContext';
import { useCart } from './context/cartContext';

const BG = '#001F22';
const TEAL = '#00756F';
const TEXT = '#FFFFFF';

type PaymentInfoRow = {
  paymentid: string;
  customerid: string;
  cardnumber: string;
  cardexpiration: string;
  cvv: string;
  cardholder: string;
  billingaddress: string;
};

export default function PaymentScreen() {
  const { customerId, email } = useUser();
  const { items, clearCart } = useCart();

  const [paymentInfo, setPaymentInfo] = useState<PaymentInfoRow | null>(null);
  const [loading, setLoading] = useState(false);

  const total = useMemo(
    () => items.reduce((sum, p) => sum + p.price, 0),
    [items]
  );

  useEffect(() => {
    const loadPaymentInfo = async () => {
      if (!customerId) {
        console.warn('No customerId in context – redirecting to login');
        Alert.alert('Error', 'Please log in again.', [
          { text: 'OK', onPress: () => router.replace('/login') },
        ]);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('paymentinfo')
          .select(
            'paymentid, customerid, cardnumber, cardexpiration, cvv, cardholder, billingaddress'
          )
          .eq('customerid', customerId)
          .maybeSingle();

        if (error) {
          console.error('Error loading payment info:', error);
          Alert.alert('Error', 'Could not load payment information.');
          return;
        }

        if (!data) {
          Alert.alert(
            'No payment info',
            'No saved payment information was found for this account.'
          );
          return;
        }

        setPaymentInfo(data as PaymentInfoRow);
      } catch (err: any) {
        console.error('Unexpected payment info error:', err);
        Alert.alert('Error', 'Something went wrong loading payment info.');
      } finally {
        setLoading(false);
      }
    };

    loadPaymentInfo();
  }, [customerId]);

  const maskCardNumber = (card: string) => {
    if (!card) return '';
    const last4 = card.replace(/\s+/g, '').slice(-4);
    return `**** **** **** ${last4}`;
  };

  
  const handleConfirm = async () => {
    if (!paymentInfo) {
      Alert.alert('Error', 'No payment information found.');
      return;
    }

    if (!customerId) {
      Alert.alert('Error', 'Not logged in.');
      router.replace('/login');
      return;
    }

    if (items.length === 0) {
      Alert.alert('Cart empty', 'No pets to purchase.');
      return;
    }

    if (total <= 0) {
      Alert.alert('Error', 'Total amount is invalid.');
      return;
    }

    try {
      const rows = items.map(pet => ({
        customerid: customerId,
        employeeid: null, // optional
        paymentid: paymentInfo.paymentid,
        petid: Number(pet.id),
        orderdate: new Date().toISOString().slice(0, 10),
        totalamount: total,
      }));

      const { error } = await supabase.from('orderinfo').insert(rows);
      if (error) {
        console.error('Order insert error:', error);
      }

      const petIds = items.map(pet => Number(pet.id));
      const { error: petError } = await supabase
        .from('pet')
        .update({ adoptionstatus: 'Adopted' }) 
        .in('petid', petIds);

      if (petError) {
        console.error('Error updating pet adoption status:', petError);
      }
    } catch (err) {
      console.error('Unexpected order error:', err);
    }

    clearCart();
    router.replace('/confirmation');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Payment</Text>
          {email && <Text style={styles.subHeader}>Customer: {email}</Text>}
        </View>

        <View style={styles.content}>
          {loading && (
            <ActivityIndicator
              size="large"
              color={TEXT}
              style={{ marginTop: 20 }}
            />
          )}

          {!loading && paymentInfo && (
            <>
              <View style={styles.cardBox}>
                <Text style={styles.label}>Cardholder</Text>
                <Text style={styles.value}>{paymentInfo.cardholder}</Text>

                <Text style={styles.label}>Card Number</Text>
                <Text style={styles.value}>
                  {maskCardNumber(paymentInfo.cardnumber)}
                </Text>

                <Text style={styles.label}>Expiration</Text>
                <Text style={styles.value}>{paymentInfo.cardexpiration}</Text>

                <Text style={styles.label}>Billing Address</Text>
                <Text style={styles.value}>{paymentInfo.billingaddress}</Text>
              </View>

              {/* 💵 total price display */}
              {items.length > 0 && (
                <View style={styles.totalBox}>
                  <Text style={styles.totalLabel}>Total:</Text>
                  <Text style={styles.totalValue}>
                    ${total.toFixed(2)}
                  </Text>
                </View>
              )}
            </>
          )}

          {!loading && !paymentInfo && (
            <Text style={styles.noInfoText}>
              No saved payment info for this account.
            </Text>
          )}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirm}
            disabled={!paymentInfo || items.length === 0}
          >
            <Text style={styles.confirmText}>Confirm Purchase</Text>
          </TouchableOpacity>
        </View>

        <BottomNav active="cart" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG,
  },
  screen: {
    flex: 1,
    backgroundColor: BG,
  },
  header: {
    paddingTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: TEXT,
  },
  subHeader: {
    marginTop: 4,
    color: TEXT,
    fontSize: 14,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  cardBox: {
    backgroundColor: '#00343A',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  label: {
    fontSize: 14,
    color: '#A7D6D3',
    marginTop: 8,
  },
  value: {
    fontSize: 16,
    color: TEXT,
    fontWeight: '600',
  },
  noInfoText: {
    marginTop: 24,
    color: TEXT,
    fontSize: 16,
  },
  totalBox: {
    marginTop: 16,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#003A3A',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    color: '#A7D6D3',
    fontSize: 16,
    fontWeight: '600',
  },
  totalValue: {
    color: TEXT,
    fontSize: 18,
    fontWeight: '700',
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  confirmButton: {
    backgroundColor: TEAL,
     borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  confirmText: {
    color: TEXT,
    fontSize: 18,
    fontWeight: '700',
  },
});
