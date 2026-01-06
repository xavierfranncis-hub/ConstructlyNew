import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Input from '../components/Input';
import Button from '../components/Button';
import { API_BASE_URL } from '../config';

export default function PostPropertyScreen() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [location, setLocation] = useState('');
    const [type, setType] = useState('New');
    const [sellerPhone, setSellerPhone] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);

    const pickImages = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 0.8,
        });

        if (!result.canceled) {
            setImages([...images, ...result.assets.map(a => a.uri)]);
        }
    };

    const handlePost = async () => {
        if (!title || !price || !location || !sellerPhone) {
            Alert.alert('Missing Fields', 'Please fill in all mandatory fields.');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/houses`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    price: parseFloat(price),
                    location,
                    type,
                    sellerPhone,
                    description,
                    images, // In a real app, upload to S3/Cloudinary first
                })
            });

            if (response.ok) {
                Alert.alert('Success 🎉', 'Property posted successfully!', [
                    { text: 'View Listings', onPress: () => router.replace('/real-estate') }
                ]);
            } else {
                throw new Error('Failed to post');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to connect to server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="close" size={28} color="#F8FAFC" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>List Your Property</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scroll}>
                <View style={styles.formCard}>
                    <Text style={styles.sectionHeader}>Property Photos</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
                        {images.map((uri, idx) => (
                            <View key={idx} style={styles.imageWrapper}>
                                <Image source={{ uri }} style={styles.pickedImage} />
                                <TouchableOpacity
                                    style={styles.removeBtn}
                                    onPress={() => setImages(images.filter((_, i) => i !== idx))}
                                >
                                    <Ionicons name="close-circle" size={20} color="white" />
                                </TouchableOpacity>
                            </View>
                        ))}
                        <TouchableOpacity style={styles.addBtn} onPress={pickImages}>
                            <Ionicons name="camera" size={30} color="#0EA5E9" />
                            <Text style={styles.addText}>Add Photos</Text>
                        </TouchableOpacity>
                    </ScrollView>

                    <Input label="Property Title" placeholder="e.g. Modern 3BHK Apartment" value={title} onChangeText={setTitle} />
                    <Input label="Price (₹)" placeholder="e.g. 7500000" keyboardType="numeric" value={price} onChangeText={setPrice} />
                    <Input label="Location" placeholder="e.g. Madhapur, Hyderabad" value={location} onChangeText={setLocation} />
                    <Input label="Seller Mobile" placeholder="e.g. 9876543210" keyboardType="phone-pad" value={sellerPhone} onChangeText={setSellerPhone} />

                    <Text style={styles.label}>House Type</Text>
                    <View style={styles.typeRow}>
                        {['New', 'Old'].map(t => (
                            <TouchableOpacity
                                key={t}
                                style={[styles.typeOption, type === t && styles.typeSelected]}
                                onPress={() => setType(t)}
                            >
                                <Text style={[styles.typeLabel, type === t && styles.typeLabelSelected]}>{t} House</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Input label="Description (Optional)" placeholder="Tell us about your home..." multiline numberOfLines={4} value={description} onChangeText={setDescription} />

                    <Button
                        title={loading ? "Posting..." : "List Property Now"}
                        onPress={handlePost}
                        style={styles.submitBtn}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
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
    formCard: {
        backgroundColor: '#1E293B',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: '#334155',
    },
    sectionHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#F8FAFC',
        marginBottom: 15,
    },
    imageScroll: {
        marginBottom: 20,
    },
    imageWrapper: {
        marginRight: 10,
    },
    pickedImage: {
        width: 100,
        height: 100,
        borderRadius: 12,
    },
    removeBtn: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 10,
    },
    addBtn: {
        width: 100,
        height: 100,
        borderRadius: 12,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#0EA5E9',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(14, 165, 233, 0.05)',
    },
    addText: {
        color: '#0EA5E9',
        fontSize: 12,
        marginTop: 5,
    },
    label: {
        color: '#94A3B8',
        fontSize: 14,
        marginBottom: 8,
        marginTop: 15,
    },
    typeRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 15,
    },
    typeOption: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#334155',
        alignItems: 'center',
    },
    typeSelected: {
        backgroundColor: '#0EA5E9',
        borderColor: '#0EA5E9',
    },
    typeLabel: {
        color: '#94A3B8',
        fontWeight: 'bold',
    },
    typeLabelSelected: {
        color: 'white',
    },
    submitBtn: {
        marginTop: 30,
    }
});
