import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { Ionicons } from '@expo/vector-icons';

export default function EstimatorScreen() {
    const [plotSize, setPlotSize] = useState('');
    const [quality, setQuality] = useState('Standard'); // Standard, Premium, Luxury
    const [estimate, setEstimate] = useState(null);

    const calculateCost = () => {
        const size = parseFloat(plotSize);
        if (!size) return;

        let rate = 1600; // Standard base rate for Hyd
        if (quality === 'Premium') rate = 2200;
        if (quality === 'Luxury') rate = 3200;

        // AI Logic: Fixed rates based on quality
        // Removed random fluctuation for consistency as requested
        const total = size * rate;

        setEstimate(total);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>AI Cost Estimator 🤖</Text>
            <Text style={styles.subheader}>Get an instant estimate for your dream home in Hyderabad.</Text>

            <View style={styles.form}>
                <Input
                    label="Plot Area (in sq. ft)"
                    placeholder="e.g 1200"
                    value={plotSize}
                    onChangeText={setPlotSize}
                />

                <Text style={styles.label}>Construction Quality</Text>
                <View style={styles.qualityContainer}>
                    {['Standard', 'Premium', 'Luxury'].map((q) => (
                        <TouchableOpacity
                            key={q}
                            style={[styles.qualityOption, quality === q && styles.qualitySelected]}
                            onPress={() => setQuality(q)}
                        >
                            <Text style={[styles.qualityText, quality === q && styles.qualityTextSelected]}>{q}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Button title="Calculate Estimate" onPress={calculateCost} />
            </View>

            {estimate !== null && (
                <View style={styles.resultContainer}>
                    <Text style={styles.resultLabel}>Estimated Cost</Text>
                    <Text style={styles.resultValue}>₹{estimate.toLocaleString('en-IN')}</Text>
                    <Text style={styles.disclaimer}>*Approximate cost based on Hyderabad market rates.</Text>

                    <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="chatbubbles-outline" size={20} color="white" />
                        <Text style={styles.actionButtonText}>Talk to an Expert</Text>
                    </TouchableOpacity>
                </View>
            )}
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
        fontSize: 28,
        fontWeight: 'bold',
        color: '#F8FAFC',
        marginBottom: 5,
    },
    subheader: {
        color: '#94A3B8',
        marginBottom: 30,
        fontSize: 16,
    },
    form: {
        marginBottom: 30,
    },
    label: {
        color: '#94A3B8', // Slate 400
        marginBottom: 8,
        fontSize: 14,
        fontWeight: '500',
    },
    qualityContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        gap: 10,
    },
    qualityOption: {
        flex: 1,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#334155',
        borderRadius: 8,
        alignItems: 'center',
    },
    qualitySelected: {
        borderColor: '#0EA5E9',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
    },
    qualityText: {
        color: '#94A3B8',
        fontWeight: '600',
    },
    qualityTextSelected: {
        color: '#0EA5E9',
    },
    resultContainer: {
        backgroundColor: '#1E293B',
        padding: 24,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#0EA5E9',
    },
    resultLabel: {
        color: '#94A3B8',
        fontSize: 16,
        marginBottom: 5,
    },
    resultValue: {
        color: '#F8FAFC',
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    disclaimer: {
        color: '#64748B',
        fontSize: 12,
        marginBottom: 20,
    },
    actionButton: {
        flexDirection: 'row',
        backgroundColor: '#0EA5E9',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 30,
        alignItems: 'center',
        gap: 8,
    },
    actionButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
