import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import BottomNav from './components/BottomNav';
import { getAnimalPic } from './animalPics';

type Pet = {
  id: string;
  name: string;
  species: string;
  price: number;
};

const INITIAL_PETS: Pet[] = [
  {
    id: '1',
    name: 'Goldie',
    species: 'Fish',
    price: 17.38,
  },
  {
    id: '2',
    name: 'Buddy',
    species: 'Dog',
    price: 67.41,
  },
  {
    id: '3',
    name: 'Luna',
    species: 'Cat',
    price: 45.99,
  },
   {
    id: '4',
    name: 'Sunny',
    species: 'Bird',
    price: 29.99,
  },
];

type SortOption = 'none' | 'priceLowHigh' | 'priceHighLow' | 'name';

export default function HomeScreen() {
  const [pets, setPets] = useState<Pet[]>(INITIAL_PETS);
  const [cartIds, setCartIds] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');
const [filterSpecies, setFilterSpecies] =
  useState<'All' | 'Dog' | 'Cat' | 'Fish' | 'Bird'>('All');
  const [sortOption, setSortOption] = useState<SortOption>('none');
  const [filterVisible, setFilterVisible] = useState(false);
  const [sortVisible, setSortVisible] = useState(false);
  const [page, setPage] = useState(1);

  const handleAddToCart = (id: string) => {
    setCartIds(prev => (prev.includes(id) ? prev : [...prev, id]));
  };

  const isInCart = (id: string) => cartIds.includes(id);

  const handleLoadMore = () => {
    setPets(prev => {
      const nextPage = page + 1;
      const extra = INITIAL_PETS.map(p => ({
        ...p,
        id: `${p.id}-p${nextPage}`,
      }));
      setPage(nextPage);
      return [...prev, ...extra];
    });
  };

  const filteredPets = useMemo(() => {
    let result = [...pets];

    if (searchText.trim().length > 0) {
      const q = searchText.trim().toLowerCase();
      result = result.filter(p => p.species.toLowerCase().includes(q));
    }

    if (filterSpecies !== 'All') {
      result = result.filter(p => p.species === filterSpecies);
    }

    if (sortOption === 'priceLowHigh') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'priceHighLow') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [pets, searchText, filterSpecies, sortOption]);

  const renderPetCard = ({ item }: { item: Pet }) => {
    const added = isInCart(item.id);

    return (
      <TouchableOpacity
        style={styles.cardContainer}
        activeOpacity={0.9}
        onPress={() =>
          router.push({
            pathname: '/pet/id',
            params: {
              id: item.id,
              name: item.name,
              species: item.species,
              price: String(item.price),
            },
          })
        }
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardPrice}>${item.price.toFixed(2)}</Text>
        </View>

        <Image
          source={{ uri: getAnimalPic(item.species) }}
          style={styles.cardImage}
        />

        <TouchableOpacity
          style={[styles.addButton, added && styles.addButtonAdded]}
          disabled={added}
          onPress={() => handleAddToCart(item.id)}
        >
          {added ? (
            <Ionicons name="checkmark" size={16} color="#FFFFFF" />
          ) : (
            <Ionicons name="add" size={16} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <Text style={styles.headerTitle}>Pet Search</Text>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#A7D6D3" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by species..."
            placeholderTextColor="#A7D6D3"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        <View style={styles.row}>
          <TouchableOpacity
            style={styles.chipButton}
            onPress={() => setFilterVisible(true)}
          >
            <Text style={styles.chipText}>Filter By</Text>
            <Ionicons name="chevron-down" size={16} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.chipButton}
            onPress={() => setSortVisible(true)}
          >
            <Text style={styles.chipText}>Sort By</Text>
            <Ionicons name="chevron-down" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={filteredPets}
          keyExtractor={item => item.id}
          renderItem={renderPetCard}
          contentContainerStyle={styles.listContent}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.4}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <BottomNav active="home" />

      {/* Filter Modal */}
      <Modal
        visible={filterVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setFilterVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Filter By Species</Text>

            {(['All', 'Dog', 'Cat', 'Fish', 'Bird'] as const).map(option => (
              <Pressable
                key={option}
                style={[
                  styles.modalOption,
                  filterSpecies === option && styles.modalOptionSelected,
                ]}
                onPress={() => {
                  setFilterSpecies(option);
                  setFilterVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    filterSpecies === option && styles.modalOptionTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </Pressable>
            ))}

            <Pressable
              style={styles.modalClose}
              onPress={() => setFilterVisible(false)}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Sort Modal */}
      <Modal
        visible={sortVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSortVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Sort By</Text>

            <Pressable
              style={[
                styles.modalOption,
                sortOption === 'priceLowHigh' && styles.modalOptionSelected,
              ]}
              onPress={() => {
                setSortOption('priceLowHigh');
                setSortVisible(false);
              }}
            >
              <Text
                style={[
                  styles.modalOptionText,
                  sortOption === 'priceLowHigh' && styles.modalOptionTextSelected,
                ]}
              >
                Price: Low to High
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.modalOption,
                sortOption === 'priceHighLow' && styles.modalOptionSelected,
              ]}
              onPress={() => {
                setSortOption('priceHighLow');
                setSortVisible(false);
              }}
            >
              <Text
                style={[
                  styles.modalOptionText,
                  sortOption === 'priceHighLow' && styles.modalOptionTextSelected,
                ]}
              >
                Price: High to Low
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.modalOption,
                sortOption === 'name' && styles.modalOptionSelected,
              ]}
              onPress={() => {
                setSortOption('name');
                setSortVisible(false);
              }}
            >
              <Text
                style={[
                  styles.modalOptionText,
                  sortOption === 'name' && styles.modalOptionTextSelected,
                ]}
              >
                Name (A–Z)
              </Text>
            </Pressable>

            <Pressable
              style={styles.modalClose}
              onPress={() => setSortVisible(false)}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const BG = '#001F22';
const TEAL = '#00756F';
const CARD = '#00343A';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG,
  },
  content: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 32,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: TEAL,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 8,
    marginBottom: 16,
  },
  chipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: TEAL,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    gap: 4,
  },
  chipText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 140, // room for bottom nav
  },
  cardContainer: {
    backgroundColor: CARD,
    borderRadius: 12,
    marginBottom: 16,
    padding: 10,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cardPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: 26,
  },
  cardImage: {
    width: '100%',
    height: 160,
    borderRadius: 8,
  },
  addButton: {
    position: 'absolute',
    top: 8,
    right: 5,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: TEAL,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonAdded: {
    backgroundColor: '#1DB954',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCard: {
    backgroundColor: CARD,
    borderRadius: 12,
    padding: 16,
    width: '80%',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  modalOption: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 6,
  },
  modalOptionSelected: {
    backgroundColor: TEAL,
  },
  modalOptionText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  modalOptionTextSelected: {
    fontWeight: '700',
  },
  modalClose: {
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  modalCloseText: {
    color: '#FFFFFF',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
