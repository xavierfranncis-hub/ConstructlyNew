import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function BuilderCard({ builder }) {
    const router = useRouter();
    // Use a placeholder image or builder specific unique seed
    const imageUri = `https://ui-avatars.com/api/?name=${builder.name}&background=0EA5E9&color=fff`;

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Image source={{ uri: imageUri }} style={styles.avatar} />
                <View style={styles.info}>
                    <Text style={styles.name}>{builder.name}</Text>
                    <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={16} color="#FBBF24" />
                        <Text style={styles.rating}>{builder.rating}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.tags}>
                {builder.expertise.map((skill, index) => (
                    <View key={index} style={styles.tag}>
                        <Text style={styles.tagText}>{skill}</Text>
                    </View>
                ))}
            </View>

            <Text style={styles.location}>
                <Ionicons name="location-outline" size={14} color="#94A3B8" /> {builder.location}
            </Text>

            <TouchableOpacity
                style={styles.quoteButton}
                onPress={() => router.push({
                    pathname: '/request-quote',
                    params: { builderId: builder.id, builderName: builder.name }
                })}
            >
                <Text style={styles.quoteButtonText}>Request Quote</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#1E293B',
        borderRadius: 16,
        padding: 16,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: '#334155',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#F8FAFC',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    rating: {
        color: '#F8FAFC',
        marginLeft: 4,
    },
    tags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 12,
    },
    tag: {
        backgroundColor: '#334155',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        marginRight: 8,
        marginTop: 4,
    },
    tagText: {
        color: '#cbd5e1',
        fontSize: 12,
    },
    location: {
        color: '#94A3B8',
        fontSize: 14,
        marginBottom: 12,
    },
    quoteButton: {
        backgroundColor: '#0EA5E9',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    quoteButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
});
