import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL } from '../../config';
import { useAuth } from '../../context/AuthContext';

export default function EarningsScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEarnings();
    }, []);

    const fetchEarnings = async () => {
        try {
            // Mock data for payments if server endpoint is empty
            setPayments([
                { id: 1, project: 'Duplex Villa - Hitech City', amount: 125000, status: 'Paid', date: 'Jan 12, 2026' },
                { id: 2, project: 'Granite Work - Banjara Hills', amount: 45000, status: 'Pending', date: 'Jan 14, 2026' },
            ]);
        } catch (error) {
            console.error('Error fetching earnings:', error);
        } finally {
            setLoading(false);
        }
    };

    const totalEarnings = payments
        .filter(p => p.status === 'Paid')
        .reduce((sum, p) => sum + p.amount, 0);

    const pendingEarnings = payments
        .filter(p => p.status === 'Pending')
        .reduce((sum, p) => sum + p.amount, 0);

    const renderPayment = ({ item }) => (
        <View style={styles.paymentCard}>
            <View style={styles.paymentInfo}>
                <Text style={styles.projectName}>{item.project}</Text>
                <Text style={styles.paymentDate}>{item.date}</Text>
            </View>
            <View style={styles.paymentRight}>
                <Text style={styles.amount}>₹{(item.amount / 1000).toFixed(0)}K</Text>
                <View style={[styles.statusBadge, { backgroundColor: item.status === 'Paid' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(234, 179, 8, 0.1)' }]}>
                    <Text style={[styles.statusText, { color: item.status === 'Paid' ? '#22C55E' : '#EAB308' }]}>{item.status}</Text>
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
                <Text style={styles.headerTitle}>Earnings Dashboard</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.summaryContainer}>
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryLabel}>Total Earned</Text>
                    <Text style={styles.summaryValue}>₹{(totalEarnings / 1000).toFixed(0)}K</Text>
                </View>
                <View style={[styles.summaryCard, { backgroundColor: 'rgba(234, 179, 8, 0.1)', borderColor: '#EAB308' }]}>
                    <Text style={[styles.summaryLabel, { color: '#EAB308' }]}>Pending</Text>
                    <Text style={[styles.summaryValue, { color: '#EAB308' }]}>₹{(pendingEarnings / 1000).toFixed(0)}K</Text>
                </View>
            </View>

            <Text style={styles.sectionTitle}>Transaction History</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#0EA5E9" style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={payments}
                    renderItem={renderPayment}
                    keyExtractor={item => item.id.toString()}
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
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 25,
        backgroundColor: '#1E293B',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#F8FAFC',
    },
    summaryContainer: {
        flexDirection: 'row',
        padding: 20,
        gap: 15,
    },
    summaryCard: {
        flex: 1,
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#0EA5E9',
    },
    summaryLabel: {
        color: '#0EA5E9',
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    summaryValue: {
        color: '#F8FAFC',
        fontSize: 24,
        fontWeight: '900',
        marginTop: 5,
    },
    sectionTitle: {
        paddingHorizontal: 20,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#F8FAFC',
        marginBottom: 15,
        marginTop: 10,
    },
    list: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    paymentCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#1E293B',
        padding: 20,
        borderRadius: 20,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#334155',
    },
    paymentInfo: {
        flex: 1,
    },
    projectName: {
        color: '#F8FAFC',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    paymentDate: {
        color: '#64748B',
        fontSize: 12,
    },
    paymentRight: {
        alignItems: 'flex-end',
    },
    amount: {
        color: '#F8FAFC',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    }
});
