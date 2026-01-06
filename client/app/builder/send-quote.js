import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { API_BASE_URL } from '../../config';
import { useAuth } from '../../context/AuthContext';

export default function SendQuoteScreen() {
    const router = useRouter();
    const { projectId, title, location, category } = useLocalSearchParams();
    const { user } = useAuth();

    const [cost, setCost] = useState('');
    const [timeline, setTimeline] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!cost || !timeline) {
            Alert.alert('Error', 'Please provide estimated cost and timeline.');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/quotations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    projectId,
                    builderId: user?._id || "6598765432109876543210ab", // Fallback for mock testing
                    estimatedCost: parseFloat(cost),
                    timeline,
                    notes,
                    status: 'Sent'
                })
            });

            if (response.ok) {
                Alert.alert('Quote Sent! 🚀', 'Your quotation has been submitted. The customer will be notified.', [
                    { text: 'Back to Requests', onPress: () => router.replace('/builder/job-requests') }
                ]);
            } else {
                throw new Error('Failed to send quote');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to submit quotation. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="close" size={28} color="#F8FAFC" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Send Quotation</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scroll}>
                <View style={styles.projectSummary}>
                    <Text style={styles.summaryLabel}>Project</Text>
                    <Text style={styles.summaryTitle}>{title}</Text>
                    <View style={styles.summaryDetails}>
                        <View style={styles.detailItem}>
                            <Ionicons name="location" size={14} color="#0EA5E9" />
                            <Text style={styles.detailText}>{location}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Ionicons name="hammer" size={14} color="#0EA5E9" />
                            <Text style={styles.detailText}>{category}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.formCard}>
                    <Input
                        label="Estimated Cost (₹)"
                        placeholder="e.g. 150000"
                        keyboardType="numeric"
                        value={cost}
                        onChangeText={setCost}
                    />
                    <Input
                        label="Expected Timeline"
                        placeholder="e.g. 4 Weeks"
                        value={timeline}
                        onChangeText={setTimeline}
                    />
                    <Input
                        label="Notes (Optional)"
                        placeholder="Include scope of work or specific terms..."
                        multiline
                        numberOfLines={4}
                        value={notes}
                        onChangeText={setNotes}
                    />

                    <Button
                        title={loading ? "Submitting..." : "Send Quotation Now"}
                        onPress={handleSubmit}
                        style={styles.submitBtn}
                    />
                </View>
            </ScrollView>
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
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#F8FAFC',
    },
    scroll: {
        padding: 20,
    },
    projectSummary: {
        backgroundColor: '#1E293B',
        borderRadius: 20,
        padding: 20,
        marginBottom: 25,
        borderWidth: 1,
        borderColor: '#334155',
    },
    summaryLabel: {
        color: '#64748B',
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: 5,
    },
    summaryTitle: {
        color: '#F8FAFC',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    summaryDetails: {
        flexDirection: 'row',
        gap: 15,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    detailText: {
        color: '#94A3B8',
        fontSize: 13,
    },
    formCard: {
        backgroundColor: '#1E293B',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: '#334155',
    },
    submitBtn: {
        marginTop: 30,
    }
});
