import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function Button({ title, onPress, variant = 'primary', style }) {
    const isPrimary = variant === 'primary';
    return (
        <TouchableOpacity
            style={[
                styles.button,
                isPrimary ? styles.primary : styles.secondary,
                style,
            ]}
            onPress={onPress}
        >
            <Text style={[styles.text, isPrimary ? styles.primaryText : styles.secondaryText]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginVertical: 10,
        width: '100%',
    },
    primary: {
        backgroundColor: '#0EA5E9', // Sky 500
        shadowColor: '#0EA5E9',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    secondary: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#334155', // Slate 700
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    primaryText: {
        color: 'white',
    },
    secondaryText: {
        color: '#94A3B8', // Slate 400
    },
});
