import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import BuilderCard from '../../components/BuilderCard';
import Input from '../../components/Input';
import { API_BASE_URL } from '../../config';

export default function SearchScreen() {
    const [builders, setBuilders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchBuilders();
    }, []);

    const fetchBuilders = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/builders`);
            const data = await response.json();
            setBuilders(data);
        } catch (error) {
            console.error('Error fetching builders:', error);
            // Fallback mock data if server fails
            setBuilders([
                { id: 1, name: 'Shamshabad Constructions', rating: 4.8, expertise: ['Full Home', 'Masonry'], location: 'Shamshabad, So. Hyd' },
                { id: 2, name: 'Rajendranagar Electricals', rating: 4.5, expertise: ['Electrical', 'Wiring'], location: 'Rajendranagar, So. Hyd' },
                { id: 3, name: 'Attapur Granites & Marbles', rating: 4.9, expertise: ['Granite', 'Tiles', 'Marbles'], location: 'Attapur, So. Hyd' },
                { id: 4, name: 'Classic Interiors', rating: 4.7, expertise: ['Interior', 'Painting'], location: 'Aramghar, So. Hyd' },
                { id: 5, name: 'SMR Building Materials', rating: 4.6, expertise: ['Cement', 'Sand', 'Steel'], location: 'Saroornagar, So. Hyd' },
                { id: 6, name: 'Falaknuma Masons', rating: 4.4, expertise: ['Masonry', 'Renovation'], location: 'Falaknuma, So. Hyd' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const filteredBuilders = builders.filter(builder =>
        builder.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        builder.expertise.some(e => e.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Find Professionals</Text>

            <View style={styles.searchContainer}>
                <Input
                    placeholder="Search by name or expertise..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#0EA5E9" />
            ) : (
                <FlatList
                    data={filteredBuilders}
                    keyExtractor={item => (item.id || item._id || Math.random()).toString()}
                    renderItem={({ item }) => <BuilderCard builder={item} />}
                    contentContainerStyle={styles.list}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F172A',
        padding: 20,
        paddingTop: 60,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#F8FAFC',
        marginBottom: 20,
    },
    searchContainer: {
        marginBottom: 10,
    },
    list: {
        paddingBottom: 20,
    },
});
