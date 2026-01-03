import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Constructly Home</Text>
            <Text style={styles.subtext}>Find your builder today.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F172A',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: '#F8FAFC',
        fontSize: 24,
        fontWeight: 'bold',
    },
    subtext: {
        color: '#94A3B8',
        marginTop: 10,
    },
});
