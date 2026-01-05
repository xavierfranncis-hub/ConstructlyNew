import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Input from '../components/Input';
import Button from '../components/Button';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { API_BASE_URL } from '../config';

export default function RegisterBuilderScreen() {
    const router = useRouter();
    const [businessName, setBusinessName] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [location, setLocation] = useState('');
    const [expertise, setExpertise] = useState('');
    const [loading, setLoading] = useState(false);
    const [document, setDocument] = useState(null);

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*',
                copyToCacheDirectory: true,
            });

            if (!result.canceled) {
                setDocument(result.assets[0]);
                Alert.alert('Success', `Selected: ${result.assets[0].name}`);
            }
        } catch (err) {
            Alert.alert('Error', 'Failed to pick document');
        }
    };

    const handleRegister = async () => {
        if (!businessName || !ownerName || !location || !expertise) {
            Alert.alert('Missing Fields', 'Please fill in all details.');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/builders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    businessName,
                    ownerName,
                    location,
                    expertise
                })
            });

            if (response.ok) {
                Alert.alert(
                    'Registration Submitted',
                    'Thank you! Your profile has been created successfully.',
                    [{ text: 'OK', onPress: () => router.replace('/login') }]
                );
            } else {
                Alert.alert('Error', 'Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Registration Error:', error);
            Alert.alert('Error', 'Could not connect to server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>

            <Text style={styles.header}>Partner with Constructly</Text>
            <Text style={styles.subheader}>Grow your construction business in Hyderabad.</Text>

            <View style={styles.form}>
                <Input
                    label="Business Name"
                    placeholder="e.g. Hyderabad Homes"
                    value={businessName}
                    onChangeText={setBusinessName}
                />
                <Input
                    label="Owner Name"
                    placeholder="Your Full Name"
                    value={ownerName}
                    onChangeText={setOwnerName}
                />
                <Input
                    label="Location (South Hyd)"
                    placeholder="e.g. Shamshabad, Attapur"
                    value={location}
                    onChangeText={setLocation}
                />
                <Input
                    label="Expertise (Comma separated)"
                    placeholder="e.g. Masonry, Plumbing, Tiles"
                    value={expertise}
                    onChangeText={setExpertise}
                />

                <View style={styles.uploadSection}>
                    <Text style={styles.uploadLabel}>Documents (GST / Aadhar / ID)</Text>
                    <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
                        <Ionicons
                            name={document ? "checkmark-circle" : "cloud-upload-outline"}
                            size={20}
                            color={document ? "#22C55E" : "#0EA5E9"}
                        />
                        <Text style={[styles.uploadText, document && { color: "#22C55E" }]}>
                            {document ? document.name : "Upload Documents"}
                        </Text>
                    </TouchableOpacity>
                </View>

                <Button
                    title={loading ? "Submitting..." : "Register Business"}
                    onPress={handleRegister}
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
        paddingTop: 50,
    },
    backButton: {
        marginBottom: 20,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#F8FAFC',
        marginBottom: 10,
    },
    subheader: {
        fontSize: 16,
        color: '#94A3B8',
        marginBottom: 30,
    },
    form: {
        marginBottom: 20,
    },
    uploadSection: {
        marginBottom: 20,
    },
    uploadLabel: {
        color: '#94A3B8',
        marginBottom: 10,
        fontSize: 14,
        fontWeight: '500',
    },
    uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1E293B',
        borderWidth: 1,
        borderColor: '#334155',
        borderStyle: 'dashed',
        borderRadius: 12,
        padding: 20,
        gap: 10,
    },
    uploadText: {
        color: '#0EA5E9',
        fontWeight: '600',
    },
});
