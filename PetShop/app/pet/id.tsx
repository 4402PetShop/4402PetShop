// app/pet/[id].tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function PetDetailsScreen() {
  const params = useLocalSearchParams<{
    id: string;
    name?: string;
    species?: string;
    price?: string;
    imageUrl?: string;
    breed?: string;
    fixed?: string; // "true" / "false" later if you want
  }>();

  const name = params.name ?? 'Animal Name';
  const species = params.species ?? 'Unknown Species';
  const price = params.price ? Number(params.price) : undefined;
  const imageUrl =
    params.imageUrl ??
    'https://images.pexels.com/photos/257540/pexels-photo-257540.jpeg?auto=compress&cs=tinysrgb&w=800';

  // For now these can be placeholders; schema people can wire real values later
  const breed = params.breed ?? 'Mixed Breed';
  const ageText = '2 years'; // placeholder
  const genderText = 'Female'; // placeholder
  const fixedText =
    params.fixed === 'true'
      ? 'Yes (spayed / neutered)'
      : 'No';

  return (
    <View style={styles.screen}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pet Details</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* IMAGE CARD */}
        <View style={styles.imageCard}>
          <Image source={{ uri: imageUrl }} style={styles.image} />
        </View>

        {/* NAME + SPECIES + PRICE */}
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.species}>{species}</Text>
          </View>
          {price !== undefined && (
            <Text style={styles.price}>${price.toFixed(2)}</Text>
          )}
        </View>

        {/* DETAILS SECTION: this covers your schema fields */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Breed</Text>
            <Text style={styles.detailValue}>{breed}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Age</Text>
            <Text style={styles.detailValue}>{ageText}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Gender</Text>
            <Text style={styles.detailValue}>{genderText}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Fixed</Text>
            <Text style={styles.detailValue}>{fixedText}</Text>
          </View>
        </View>

        {/* DESCRIPTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.sectionText}>
            {name} is a friendly {species.toLowerCase()} looking for a loving
            home.
          </Text>
        </View>

        {/* HEALTH INFO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Info</Text>
          <Text style={styles.sectionText}>
            Vaccinations up to date.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const BG = '#001F22';
const CARD = '#00343A';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG,
  },
  headerRow: {
    paddingTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  imageCard: {
    backgroundColor: CARD,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    padding: 8,
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 12,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  species: {
    fontSize: 14,
    color: '#A7D6D3',
    marginTop: 2,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  section: {
    marginBottom: 16,
    backgroundColor: CARD,
    borderRadius: 12,
    padding: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  sectionText: {
    fontSize: 14,
    color: '#E0F4F3',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: '#A7D6D3',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
