import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, Dimensions } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { CONSTRUCTION_PHASES, MATERIAL_CATEGORIES } from '../../constants/categories';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
    const router = useRouter();
    const [selectedPhase, setSelectedPhase] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const openPhase = (phase) => {
        setSelectedPhase(phase);
        setModalVisible(true);
    };

    const navigateToSearch = (category) => {
        setModalVisible(false);
        router.push({
            pathname: '/search',
            params: { query: category }
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.logo}>Constructly</Text>
                <TouchableOpacity style={styles.profileButton}>
                    <Ionicons name="person-circle-outline" size={32} color="#94A3B8" />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <Text style={styles.welcomeText}>Build Your Dream Home</Text>
                <Text style={styles.subWelcome}>Step-by-step guidance from planning to housewarming.</Text>

                <View style={styles.phaseGrid}>
                    {CONSTRUCTION_PHASES.map((phase) => (
                        <TouchableOpacity
                            key={phase.id}
                            style={styles.phaseCard}
                            onPress={() => openPhase(phase)}
                        >
                            <Image source={phase.image} style={styles.phaseImage} />
                            <View style={styles.overlay}>
                                <Text style={styles.phaseTitle}>{phase.shortTitle}</Text>
                                <Ionicons name="chevron-forward" size={18} color="white" />
                            </View>
                        </TouchableOpacity>
                    ))}

                    <TouchableOpacity
                        style={[styles.phaseCard, styles.materialsCard]}
                        onPress={() => openPhase({ title: 'Materials', categories: MATERIAL_CATEGORIES.map(m => ({ id: m.id, title: m.title, description: m.description })) })}
                    >
                        <Image source={MATERIAL_CATEGORIES[0].image} style={styles.phaseImage} />
                        <View style={[styles.overlay, { backgroundColor: 'rgba(14, 165, 233, 0.7)' }]}>
                            <Text style={styles.phaseTitle}>Materials</Text>
                            <Ionicons name="apps" size={18} color="white" />
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Category Drill-down Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{selectedPhase?.title}</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Ionicons name="close-circle" size={30} color="#64748B" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {selectedPhase?.categories.map((cat) => (
                                <TouchableOpacity
                                    key={cat.id}
                                    style={styles.categoryRow}
                                    onPress={() => navigateToSearch(cat.title)}
                                >
                                    <View style={styles.catIcon}>
                                        <Ionicons name="construct-outline" size={24} color="#0EA5E9" />
                                    </View>
                                    <View style={styles.catInfo}>
                                        <Text style={styles.catTitle}>{cat.title}</Text>
                                        <Text style={styles.catDesc} numberOfLines={2}>{cat.description}</Text>
                                    </View>
                                    <Ionicons name="search" size={20} color="#334155" />
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
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
        paddingBottom: 20,
    },
    logo: {
        fontSize: 24,
        fontWeight: '900',
        color: '#0EA5E9',
        letterSpacing: -1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#F8FAFC',
    },
    subWelcome: {
        fontSize: 14,
        color: '#94A3B8',
        marginTop: 5,
        marginBottom: 25,
    },
    phaseGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    phaseCard: {
        width: (width - 50) / 2,
        height: 140,
        borderRadius: 16,
        marginBottom: 15,
        overflow: 'hidden',
        backgroundColor: '#1E293B',
    },
    materialsCard: {
        width: '100%',
        height: 100,
    },
    phaseImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(15, 23, 42, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 5,
    },
    phaseTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#0F172A',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        height: '70%',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#334155',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#F8FAFC',
        flex: 1,
    },
    categoryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1E293B',
        padding: 15,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#334155',
    },
    catIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    catInfo: {
        flex: 1,
    },
    catTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#F8FAFC',
    },
    catDesc: {
        fontSize: 12,
        color: '#94A3B8',
        marginTop: 2,
    }
});
