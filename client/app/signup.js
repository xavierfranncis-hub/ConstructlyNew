import { View, Text, StyleSheet } from 'react-native';
import { useRouter, Link } from 'expo-router';
import Input from '../components/Input';
import Button from '../components/Button';
import { useState } from 'react';

export default function SignupScreen() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = () => {
        // Navigate to tabs mainly for demo
        router.replace('/(tabs)/home');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Create Account</Text>
            <Text style={styles.subheader}>Join Constructly</Text>

            <View style={styles.form}>
                <Input
                    label="Full Name"
                    placeholder="John Doe"
                    value={name}
                    onChangeText={setName}
                />
                <Input
                    label="Phone Number"
                    placeholder="+91 XXXXX XXXXX"
                    keyboardType="phone-pad"
                    value={email}
                    onChangeText={setEmail}
                />
                <Input
                    label="Password"
                    placeholder="Create a password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                <Button title="Sign Up" onPress={handleSignup} />
            </View>

            <Link href="/login" asChild>
                <Text style={styles.link}>Already have an account? <Text style={styles.linkHighlight}>Login</Text></Text>
            </Link>
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
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
    },
    subheader: {
        fontSize: 16,
        color: '#94A3B8',
        marginBottom: 40,
    },
    form: {
        marginBottom: 20,
    },
    link: {
        color: '#94A3B8',
        textAlign: 'center',
        marginTop: 20,
    },
    linkHighlight: {
        color: '#0EA5E9',
        fontWeight: 'bold',
    },
});
