import { TextInput, View, Text, StyleSheet } from 'react-native';

export default function Input({ label, placeholder, secureTextEntry, value, onChangeText }) {
    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor="#64748B" // Slate 500
                secureTextEntry={secureTextEntry}
                value={value}
                onChangeText={onChangeText}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 15,
        width: '100%',
    },
    label: {
        color: '#94A3B8', // Slate 400
        marginBottom: 8,
        fontSize: 14,
        fontWeight: '500',
    },
    input: {
        backgroundColor: '#1E293B', // Slate 800
        color: '#F8FAFC', // Slate 50
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#334155', // Slate 700
        fontSize: 16,
    },
});
