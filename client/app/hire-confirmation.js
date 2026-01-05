import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import { API_BASE_URL } from '../config';

export default function HireConfirmationScreen() {
    const router = useRouter();
    const { projectId, builderName } = useLocalSearchParams();

    const [amount, setAmount] = useState('');
    const [duration, setDuration] = useState('');
    const [loading, setLoading] = useState(false);

    const handleConfirmHire = async () => {
        if (!amount || !duration) {
            Alert.alert('Details Required', 'Please enter the agreed amount and duration.');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/hire`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contractAmount: parseFloat(amount),
                    startDate: new Date(),
                    estimatedEndDate: new Date(Date.now() + (parseInt(duration) * 24 * 60 * 60 * 1000)),
                })
            });

            if (response.ok) {
                Alert.alert(
                    'Success! 🏗️',
                    `You have officially hired ${builderName}. You can now track progress on your dashboard.`,
                    [{ text: 'Go to Dashboard', onPress: () => router.replace('/(tabs)/dashboard') }]
                );
            } else {
                Alert.alert('Error', 'Failed to confirm hire. Please try again.');
            }
        } catch (error) {
            Alert.alert('Error', 'Could not connect to server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Confirm Hire</Text>
            <Text style={styles.subheader}>Finalizing contract with {builderName}</Text>

            <View style={styles.card}>
                <Input
                    label="Agreed Contract Amount (₹)"
                    placeholder="e.g. 50000"
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                />
                <Input
                    label="Estimated Duration (Days)"
                    placeholder="e.g. 15"
                    keyboardType="numeric"
                    value={duration}
                    onChangeText={setDuration}
                />

                <View style={styles.infoBox}>
                    <Text style={styles.infoText}>
                        🟢 By clicking confirm, you are starting an official project.
                    </Text>
                </View>

                <Button
                    title={loading ? "Confirming..." : "Hire Professional Now"}
                    onPress={handleConfirmHire}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#0F172A',
        padding: 20,
        paddingTop: 60,
    },
    header: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#F8FAFC',
        marginBottom: 8,
    },
    subheader: {
        fontSize: 16,
        color: '#94A3B8',
        marginBottom: 30,
    },
    card: {
        backgroundColor: '#1E293B',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#334155',
    },
    infoBox: {
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        padding: 15,
        borderRadius: 12,
        marginBottom: 25,
        marginTop: 10,
    },
    infoText: {
        color: '#0EA5E9',
        fontSize: 14,
        lineHeight: 20,
    }
});
