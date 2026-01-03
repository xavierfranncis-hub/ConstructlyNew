import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: { backgroundColor: '#1E293B', borderTopWidth: 0 },
                tabBarActiveTintColor: '#0EA5E9',
                tabBarInactiveTintColor: '#64748B',
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: 'Find Builders',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="search" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="dashboard"
                options={{
                    title: 'My Projects',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="briefcase" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="estimator"
                options={{
                    title: 'Estimator',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="calculator" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
