import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../config';

export default function JobRequests() {
    const router = useRouter();
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            // In real app, expertise would come from user profile
            const expertise = "Architect, Masonry, Plumbing";
            const city = "Hyderabad";

            const response = await fetch(`${API_BASE_URL}/api/builder/requests?expertise=${expertise}&city=${city}`);
            const data = await response.json();
            setJobs(data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderJob = ({ item }) => (
        <TouchableOpacity
            style={styles.jobCard}
            onPress={() => router.push({
                pathname: '/builder/send-quote',
                params: { projectId: item._id, title: item.title, category: item.category, location: item.location }
            })}
        >
            <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{item.category || 'Construction'}</Text>
            </View>
            <Text style={styles.jobTitle}>{item.title}</Text>
            <View style={styles.detailRow}>
                <Ionicons name="location-outline" size={14} color="#94A3B8" />
                <Text style={styles.detailText}>{item.location}</Text>
            </View>
            <View style={styles.footer}>
                <View style={styles.budgetRow}>
                    <Text style={styles.budgetLabel}>Est. Budget</Text>
                    <Text style={styles.budgetValue}>₹50K - 2L</Text>
                </View>
                <View style={styles.sendQuoteBtn}>
                    <Text style={styles.quoteBtnText}>Send Quote</Text>
                    <Ionicons name="arrow-forward" size={14} color="white" />
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#F8FAFC" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Job Requests</Text>
                <TouchableOpacity onPress={fetchJobs}>
                    <Ionicons name="refresh" size={24} color="#0EA5E9" />
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#0EA5E9" style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={jobs}
                    renderItem={renderJob}
                    keyExtractor={item => item._id}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <View style={styles.emptyBox}>
                            <Ionicons name="documents-outline" size={60} color="#334155" />
                            <Text style={styles.emptyText}>No job requests matching your profile yet.</Text>
                        </View>
                    }
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
    jobCard: {
        backgroundColor: '#1E293B',
        borderRadius: 24,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#334155',
    },
    categoryBadge: {
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
    categoryText: {
        color: '#0EA5E9',
        fontSize: 11,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    jobTitle: {
        color: '#F8FAFC',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        marginBottom: 15,
    },
    detailText: {
        color: '#94A3B8',
        fontSize: 13,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 5,
        borderTopWidth: 1,
        borderTopColor: '#334155',
        paddingTop: 15,
    },
    budgetRow: {
        flexDirection: 'column',
    },
    budgetLabel: {
        color: '#64748B',
        fontSize: 11,
    },
    budgetValue: {
        color: '#22C55E',
        fontSize: 14,
        fontWeight: 'bold',
    },
    sendQuoteBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0EA5E9',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 12,
        gap: 5,
    },
    quoteBtnText: {
        color: 'white',
        fontSize: 13,
        fontWeight: 'bold',
    },
    emptyBox: {
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        color: '#64748B',
        textAlign: 'center',
        marginTop: 20,
        paddingHorizontal: 40,
    }
});
