import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { useEffect, useState } from 'react';
import ProjectCard from '../../components/ProjectCard';
import { API_BASE_URL } from '../../config';

export default function DashboardScreen() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/projects`);
            const data = await response.json();
            setProjects(data);
        } catch (error) {
            console.error('Error fetching projects:', error);
            // Fallback
            setProjects([
                { id: 1, title: 'Duplex Villa - Shamshabad', builder: 'Shamshabad Constructions', progress: 0.65, status: 'Masonry Work', lastUpdate: '2 hours ago' },
                { id: 2, title: 'Granite Flooring - Attapur', builder: 'Attapur Granites & Marbles', progress: 0.30, status: 'Material Selection', lastUpdate: '1 day ago' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = () => {
        setLoading(true);
        fetchProjects();
    };

    // Safety check: ensure projects is always an array
    const projectsList = Array.isArray(projects) ? projects : [];
    const hiredProjects = projectsList.filter(p => p && p.isHired);
    const quoteLeads = projectsList.filter(p => p && !p.isHired);

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scroll}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={onRefresh} color="#0EA5E9" />
                }
            >
                {!loading && (
                    <>
                        {hiredProjects.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.sectionHeader}>🏗️ Active Projects</Text>
                                {hiredProjects.map(item => (
                                    <ProjectCard key={item.id || item._id} project={item} />
                                ))}
                            </View>
                        )}

                        <View style={styles.section}>
                            <Text style={styles.sectionHeader}>📝 Recent Quotes / Leads</Text>
                            {quoteLeads.length > 0 ? (
                                quoteLeads.map(item => (
                                    <ProjectCard key={item.id || item._id} project={item} />
                                ))
                            ) : (
                                <Text style={styles.emptyText}>No pending quotes.</Text>
                            )}
                        </View>
                    </>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F172A',
    },
    scroll: {
        padding: 20,
        paddingTop: 60,
    },
    section: {
        marginBottom: 30,
    },
    sectionHeader: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#F8FAFC',
        marginBottom: 15,
    },
    emptyText: {
        color: '#64748B',
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: 10,
    }
});
