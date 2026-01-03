import { View, Text, StyleSheet, TextInput, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { API_BASE_URL } from '../../config';

// Replace with your machine's IP if testing on device, 'localhost' for web
const SOCKET_URL = API_BASE_URL;

export default function ChatScreen() {
    const { id } = useLocalSearchParams();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const socketRef = useRef(null);

    useEffect(() => {
        // Initialize Socket
        socketRef.current = io(SOCKET_URL);

        // Join Room
        socketRef.current.emit('join_room', id);

        // Load History
        socketRef.current.on('load_history', (history) => {
            setMessages(history);
        });

        // Listen for messages
        socketRef.current.on('receive_message', (data) => {
            setMessages((prev) => {
                // Avoid duplicates if history loaded includes this
                if (prev.some(m => m.id === data.id)) return prev;
                return [...prev, data];
            });
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, [id]);

    const sendMessage = () => {
        if (message.trim()) {
            const msgData = {
                id: Date.now().toString(),
                roomId: id,
                text: message,
                sender: 'me', // In a real app, this would be user ID
                time: new Date().toLocaleTimeString(),
            };

            // Emit to server
            socketRef.current.emit('send_message', msgData);

            // Clear input
            setMessage('');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Real-time Chat (Project #{id})</Text>
            </View>

            <FlatList
                data={messages}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={[styles.bubble, item.sender === 'me' ? styles.me : styles.them]}>
                        <Text style={styles.bubbleText}>{item.text}</Text>
                        {item.time && <Text style={styles.timeText}>{item.time}</Text>}
                    </View>
                )}
                contentContainerStyle={styles.list}
            />

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type a message..."
                    placeholderTextColor="#94A3B8"
                    value={message}
                    onChangeText={setMessage}
                    onSubmitEditing={sendMessage} // Allow submitting with Enter key
                />
                <Ionicons name="send" size={24} color="#0EA5E9" onPress={sendMessage} />
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F172A',
    },
    header: {
        padding: 20,
        paddingTop: 50,
        borderBottomWidth: 1,
        borderBottomColor: '#334155',
    },
    headerTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    list: {
        padding: 20,
    },
    bubble: {
        padding: 12,
        borderRadius: 16,
        marginBottom: 10,
        maxWidth: '80%',
    },
    me: {
        backgroundColor: '#0EA5E9',
        alignSelf: 'flex-end',
        borderBottomRightRadius: 4,
    },
    them: {
        backgroundColor: '#334155',
        alignSelf: 'flex-start',
        borderBottomLeftRadius: 4,
    },
    bubbleText: {
        color: 'white',
        fontSize: 16,
    },
    timeText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 10,
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#334155',
        backgroundColor: '#1E293B',
    },
    input: {
        flex: 1,
        color: 'white',
        marginRight: 10,
        fontSize: 16,
    },
});
