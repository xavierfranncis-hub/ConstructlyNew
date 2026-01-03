import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
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

    return (
        <View style={styles.container}>
            <Text style={styles.header}>My Projects</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#0EA5E9" />
            ) : (
                <FlatList
                    data={projects}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => <ProjectCard project={item} />}
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
    list: {
        paddingBottom: 20,
    },
});
