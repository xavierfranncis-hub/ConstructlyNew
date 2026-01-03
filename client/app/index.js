import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import Button from '../components/Button';

export default function WelcomeScreen() {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Constructly</Text>
                <Text style={styles.subtitle}>Building Your Vision, Brick by Brick</Text>
            </View>

            <View style={styles.footer}>
                <Link href="/login" asChild>
                    <Button title="Login" />
                </Link>
                <Link href="/signup" asChild>
                    <Button title="Sign Up" variant="secondary" />
                </Link>

                <Link href="/register-builder" asChild>
                    <Text style={styles.builderLink}>Are you a Builder? <Text style={styles.builderLinkHighlight}>Partner with us</Text></Text>
                </Link>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F172A', // Slate 900
        padding: 20,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 48,
        color: '#0EA5E9', // Sky 500
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        color: '#94A3B8', // Slate 400
        marginBottom: 40,
    },
    footer: {
        marginBottom: 40,
        width: '100%',
    },
    builderLink: {
        color: '#94A3B8',
        textAlign: 'center',
        marginTop: 20,
        fontSize: 14,
    },
    builderLinkHighlight: {
        color: '#0EA5E9',
        fontWeight: 'bold',
    },
});
