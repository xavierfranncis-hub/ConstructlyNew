import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../config';

const { width } = Dimensions.get('window');

export default function BuilderDashboard() {
    const router = useRouter();
    const { user, logout } = useAuth();
    const [builderData, setBuilderData] = useState(null);

    // Mock builder data if not logged in
    const mockBuilder = {
        name: 'Hitech Constructions',
        ownerName: 'Xavier Francis',
        location: 'Madhapur, Hyderabad',
        expertise: ['Full Home', 'Masonry'],
        rating: 4.9,
        teamSize: 12,
        verified: true
    };

    const data = builderData || mockBuilder;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.welcome}>Welcome back,</Text>
                    <Text style={styles.businessName}>{data.name}</Text>
                </View>
                <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
                    <Ionicons name="log-out-outline" size={24} color="#94A3B8" />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                {/* Stats Row */}
                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>Rating</Text>
                        <View style={styles.ratingRow}>
                            <Text style={styles.statValue}>{data.rating}</Text>
                            <Ionicons name="star" size={16} color="#EAB308" />
                        </View>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>Team Size</Text>
                        <Text style={styles.statValue}>{data.teamSize}</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>Verified</Text>
                        <Ionicons name="checkmark-circle" size={20} color="#0EA5E9" />
                    </View>
                </View>

                {/* Main Actions */}
                <View style={styles.menuGrid}>
                    <TouchableOpacity
                        style={styles.menuCard}
                        onPress={() => router.push('/builder/job-requests')}
                    >
                        <View style={[styles.iconBox, { backgroundColor: 'rgba(14, 165, 233, 0.1)' }]}>
                            <Ionicons name="mail" size={28} color="#0EA5E9" />
                        </View>
                        <Text style={styles.menuTitle}>Job Requests</Text>
                        <Text style={styles.menuSub}>See new leads</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuCard}
                        onPress={() => router.push('/builder/quotations')}
                    >
                        <View style={[styles.iconBox, { backgroundColor: 'rgba(168, 85, 247, 0.1)' }]}>
                            <Ionicons name="receipt" size={28} color="#A855F7" />
                        </View>
                        <Text style={styles.menuTitle}>My Quotations</Text>
                        <Text style={styles.menuSub}>Track your bids</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuCard}
                        onPress={() => router.push('/builder/ongoing-projects')}
                    >
                        <View style={[styles.iconBox, { backgroundColor: 'rgba(34, 197, 94, 0.1)' }]}>
                            <Ionicons name="construct" size={28} color="#22C55E" />
                        </View>
                        <Text style={styles.menuTitle}>Ongoing Projects</Text>
                        <Text style={styles.menuSub}>Update progress</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuCard}
                        onPress={() => router.push('/builder/earnings')}
                    >
                        <View style={[styles.iconBox, { backgroundColor: 'rgba(234, 179, 8, 0.1)' }]}>
                            <Ionicons name="wallet" size={28} color="#EAB308" />
                        </View>
                        <Text style={styles.menuTitle}>Earnings</Text>
                        <Text style={styles.menuSub}>Track payments</Text>
                    </TouchableOpacity>
                </View>

                {/* Profile Card */}
                <View style={styles.profileSection}>
                    <Text style={styles.sectionTitle}>Business Details</Text>
                    <View style={styles.profileCard}>
                        <DetailRow icon="person" label="Owner" value={data.ownerName} />
                        <DetailRow icon="location" label="City" value={data.location} />
                        <DetailRow icon="hammer" label="Services" value={data.expertise.join(', ')} />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

function DetailRow({ icon, label, value }) {
    return (
        <View style={styles.detailRow}>
            <View style={styles.detailLeft}>
                <Ionicons name={icon} size={18} color="#94A3B8" />
                <Text style={styles.detailLabel}>{label}</Text>
            </View>
            <Text style={styles.detailValue}>{value}</Text>
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 25,
        backgroundColor: '#1E293B',
    },
    welcome: {
        color: '#94A3B8',
        fontSize: 14,
    },
    businessName: {
        color: '#F8FAFC',
        fontSize: 20,
        fontWeight: '900',
    },
    logoutBtn: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#334155',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scroll: {
        padding: 20,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    statCard: {
        width: (width - 60) / 3,
        backgroundColor: '#1E293B',
        borderRadius: 20,
        padding: 15,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#334155',
    },
    statLabel: {
        color: '#64748B',
        fontSize: 11,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: 5,
    },
    statValue: {
        color: '#F8FAFC',
        fontSize: 18,
        fontWeight: 'bold',
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    menuGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    menuCard: {
        width: (width - 55) / 2,
        backgroundColor: '#1E293B',
        borderRadius: 24,
        padding: 20,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#334155',
    },
    iconBox: {
        width: 50,
        height: 50,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    menuTitle: {
        color: '#F8FAFC',
        fontSize: 14,
        fontWeight: 'bold',
    },
    menuSub: {
        color: '#64748B',
        fontSize: 11,
        marginTop: 2,
    },
    profileSection: {
        marginTop: 10,
    },
    sectionTitle: {
        color: '#F8FAFC',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    profileCard: {
        backgroundColor: '#1E293B',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: '#334155',
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    detailLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    detailLabel: {
        color: '#64748B',
        fontSize: 14,
    },
    detailValue: {
        color: '#CBD5E1',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'right',
        flex: 1,
        marginLeft: 20,
    }
});
