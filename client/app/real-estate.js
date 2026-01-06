import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL } from '../config';

export default function RealEstateScreen() {
    const router = useRouter();
    const [houses, setHouses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHouses();
    }, []);

    const fetchHouses = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/houses`);
            const data = await response.json();
            setHouses(data);
        } catch (error) {
            console.error('Error fetching houses:', error);
        } finally {
            setLoading(false);
        }
    };

    const contactSeller = (phone) => {
        Linking.openURL(`tel:${phone}`);
    };

    const renderHouse = ({ item }) => (
        <View style={styles.houseCard}>
            <View style={styles.imageContainer}>
                {item.images && item.images.length > 0 ? (
                    <Image source={{ uri: item.images[0] }} style={styles.houseImage} />
                ) : (
                    <View style={styles.imagePlaceholder}>
                        <Ionicons name="home-outline" size={50} color="#334155" />
                        <Text style={styles.placeholderText}>No Photos Available</Text>
                    </View>
                )}
                <View style={styles.typeTag}>
                    <Text style={styles.typeText}>{item.type}</Text>
                </View>
            </View>

            <View style={styles.houseInfo}>
                <Text style={styles.price}>₹{(item.price / 100000).toFixed(2)} Lakhs</Text>
                <Text style={styles.title}>{item.title}</Text>
                <View style={styles.locationRow}>
                    <Ionicons name="location-outline" size={14} color="#94A3B8" />
                    <Text style={styles.location}>{item.location}</Text>
                </View>

                <View style={styles.actionRow}>
                    <TouchableOpacity
                        style={styles.contactBtn}
                        onPress={() => contactSeller(item.sellerPhone)}
                    >
                        <Ionicons name="call" size={18} color="white" />
                        <Text style={styles.contactText}>Contact Seller</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.saveBtn}>
                        <Ionicons name="heart-outline" size={24} color="#0EA5E9" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#F8FAFC" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Real Estate Marketplace</Text>
                <TouchableOpacity onPress={() => router.push('/post-property')}>
                    <Ionicons name="add-circle" size={32} color="#0EA5E9" />
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#0EA5E9" style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={houses}
                    renderItem={renderHouse}
                    keyExtractor={item => item.id || item._id}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={<Text style={styles.emptyText}>No listings found.</Text>}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F172A',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        backgroundColor: '#1E293B',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#F8FAFC',
    },
    list: {
        padding: 20,
    },
    houseCard: {
        backgroundColor: '#1E293B',
        borderRadius: 20,
        marginBottom: 25,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#334155',
    },
    imageContainer: {
        width: '100%',
        height: 200,
        backgroundColor: '#0F172A',
    },
    houseImage: {
        width: '100%',
        height: '100%',
    },
    imagePlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        color: '#64748B',
        marginTop: 10,
    },
    typeTag: {
        position: 'absolute',
        top: 15,
        left: 15,
        backgroundColor: '#0EA5E9',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
    },
    typeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    houseInfo: {
        padding: 20,
    },
    price: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#F8FAFC',
        marginBottom: 5,
    },
    title: {
        fontSize: 16,
        color: '#CBD5E1',
        marginBottom: 10,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        marginBottom: 20,
    },
    location: {
        fontSize: 14,
        color: '#94A3B8',
    },
    actionRow: {
        flexDirection: 'row',
        gap: 15,
        alignItems: 'center',
    },
    contactBtn: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#0EA5E9',
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    contactText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    saveBtn: {
        width: 50,
        height: 50,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#334155',
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        textAlign: 'center',
        color: '#64748B',
        marginTop: 50,
    }
});
