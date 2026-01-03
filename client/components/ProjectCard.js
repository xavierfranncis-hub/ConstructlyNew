import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Button from './Button';

export default function ProjectCard({ project }) {
    const router = useRouter();

    const handleChat = () => {
        router.push(`/chat/${project.id}`);
    };

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.title}>{project.title}</Text>
                <Text style={styles.status}>{project.status}</Text>
            </View>

            <Text style={styles.builder}>Builder: {project.builder}</Text>

            <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${project.progress * 100}%` }]} />
                </View>
                <Text style={styles.progressText}>{Math.round(project.progress * 100)}%</Text>
            </View>

            <View style={styles.footer}>
                <Text style={styles.update}><Ionicons name="time-outline" size={14} /> {project.lastUpdate}</Text>
                <View style={styles.actions}>
                    <Button title="Pay" variant="secondary" style={styles.smallButton} onPress={() => router.push('/payment')} />
                    <Button title="Chat" style={styles.smallButton} onPress={handleChat} />
                </View>
            </View>
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
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#F8FAFC',
    },
    status: {
        color: '#0EA5E9',
        fontWeight: '600',
    },
    builder: {
        color: '#94A3B8',
        marginBottom: 12,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    progressBar: {
        flex: 1,
        height: 8,
        backgroundColor: '#334155',
        borderRadius: 4,
        marginRight: 10,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#0EA5E9',
    },
    progressText: {
        color: '#F8FAFC',
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    update: {
        color: '#64748B',
        fontSize: 12,
    },
    actions: {
        flexDirection: 'row',
        gap: 8,
    },
    smallButton: {
        width: 'auto',
        paddingHorizontal: 20,
        paddingVertical: 8,
        marginVertical: 0,
    },
});
