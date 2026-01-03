import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import Button from '../components/Button';
import Input from '../components/Input';
import { useState } from 'react';

export default function PaymentScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handlePayment = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            Alert.alert('Payment Successful', 'Your transaction was completed.', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        }, 2000);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Secure Payment</Text>

            <View style={styles.cardInfo}>
                <Text style={styles.amount}>Total: ₹5,00,000</Text>
                <Text style={styles.detail}>Milestone: Masonry Completion</Text>
            </View>

            <View style={styles.form}>
                <Input placeholder="Card Number" />
                <View style={styles.row}>
                    <View style={{ flex: 1, marginRight: 10 }}>
                        <Input placeholder="MM/YY" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Input placeholder="CVC" />
                    </View>
                </View>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#0EA5E9" style={{ marginTop: 20 }} />
            ) : (
                <Button title="Pay Now" onPress={handlePayment} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F172A',
        padding: 20,
        justifyContent: 'center',
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#F8FAFC',
        marginBottom: 30,
        textAlign: 'center',
    },
    cardInfo: {
        backgroundColor: '#1E293B',
        padding: 20,
        borderRadius: 16,
        marginBottom: 30,
        alignItems: 'center',
    },
    amount: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#0EA5E9',
    },
    detail: {
        color: '#94A3B8',
        marginTop: 5,
    },
    form: {
        marginBottom: 30,
    },
    row: {
        flexDirection: 'row',
    },
});
