import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import { API_BASE_URL } from '../config';

export default function RequestQuoteScreen() {
    const router = useRouter();
    const { builderId, builderName } = useLocalSearchParams();

    const [projectType, setProjectType] = useState('');
    const [size, setSize] = useState('');
    const [details, setDetails] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRequest = async () => {
        if (!projectType || !size) {
            Alert.alert('Missing Details', 'Please fill in the project type and approximate size.');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/projects`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: `${projectType} - ${builderName}`,
                    builder: builderName,
                    status: 'Quote Requested',
                    progress: 0.05
                })
            });

            if (response.ok) {
                Alert.alert(
                    'Quote Requested',
                    `Your request has been sent to ${builderName}. check your dashboard for updates.`,
                    [{ text: 'Go to Dashboard', onPress: () => router.push('/(tabs)/dashboard') }]
                );
            } else {
                Alert.alert('Error', 'Failed to send request.');
            }
        } catch (error) {
            Alert.alert('Error', 'Could not connect to server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Request Quote</Text>
            <Text style={styles.subHeader}>from {builderName}</Text>

            <View style={styles.form}>
                <Input
                    label="Project Type"
                    placeholder="e.g. Full Home, Kitchen Renovation"
                    value={projectType}
                    onChangeText={setProjectType}
                />
                <Input
                    label="Approx. Size (sq. ft)"
                    placeholder="e.g. 1200"
                    keyboardType="numeric"
                    value={size}
                    onChangeText={setSize}
                />
                <Input
                    label="Additional Details"
                    placeholder="Describe your requirements..."
                    multiline
                    numberOfLines={4}
                    value={details}
                    onChangeText={setDetails}
                />

                <Button
                    title={loading ? "Sending..." : "Send Request"}
                    onPress={handleRequest}
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
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 5,
    },
    subHeader: {
        fontSize: 18,
        color: '#0EA5E9',
        marginBottom: 30,
    },
    form: {
        gap: 20
    }
});
