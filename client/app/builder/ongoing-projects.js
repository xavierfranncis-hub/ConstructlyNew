import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL } from '../../config';
import { useAuth } from '../../context/AuthContext';

export default function OngoingProjects() {
    const router = useRouter();
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            // In real app, fetch projects where builderId = user._id
            const response = await fetch(`${API_BASE_URL}/api/projects`);
            const data = await response.json();
            // Filter only hired projects (Mock logic for local testing)
            setProjects(data.filter(p => p.isHired));
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderProject = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => router.push({
                pathname: '/builder/project-detail',
                params: { projectId: item._id, title: item.title }
            })}
        >
            <View style={styles.cardHeader}>
                <Text style={styles.title}>{item.title}</Text>
                <View style={[styles.statusBadge, { backgroundColor: 'rgba(34, 197, 94, 0.1)' }]}>
                    <Text style={styles.statusText}>Ongoing</Text>
                </View>
            </View>

            <View style={styles.progressSection}>
                <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>Completion Progress</Text>
                    <Text style={styles.progressValue}>{Math.round(item.progress * 100)}%</Text>
                </View>
                <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${item.progress * 100}%` }]} />
                </View>
            </View>

            <View style={styles.footer}>
                <View style={styles.infoBox}>
                    <Ionicons name="calendar-outline" size={14} color="#94A3B8" />
                    <Text style={styles.infoText}>Due: Mar 25</Text>
                </View>
                <View style={styles.actionBtn}>
                    <Ionicons name="camera" size={16} color="white" />
                    <Text style={styles.actionText}>Post Update</Text>
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
                <Text style={styles.headerTitle}>Ongoing Projects</Text>
                <View style={{ width: 24 }} />
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#0EA5E9" style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={projects}
                    renderItem={renderProject}
                    keyExtractor={item => item._id}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <View style={styles.emptyBox}>
                            <Ionicons name="construct-outline" size={60} color="#334155" />
                            <Text style={styles.emptyText}>You don't have any active hired projects yet.</Text>
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
    card: {
        backgroundColor: '#1E293B',
        borderRadius: 24,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#334155',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        color: '#F8FAFC',
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
        marginRight: 10,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: {
        color: '#22C55E',
        fontSize: 11,
        fontWeight: 'bold',
    },
    progressSection: {
        marginBottom: 20,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    progressLabel: {
        color: '#94A3B8',
        fontSize: 12,
    },
    progressValue: {
        color: '#0EA5E9',
        fontSize: 12,
        fontWeight: 'bold',
    },
    progressBarBg: {
        height: 8,
        backgroundColor: '#0F172A',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#0EA5E9',
        borderRadius: 4,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#334155',
    },
    infoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    infoText: {
        color: '#64748B',
        fontSize: 12,
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#334155',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        gap: 5,
    },
    actionText: {
        color: 'white',
        fontSize: 12,
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
