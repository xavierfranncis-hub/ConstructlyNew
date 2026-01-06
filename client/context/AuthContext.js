import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState('Customer'); // 'Customer' or 'Builder'
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const savedUser = await AsyncStorage.getItem('user');
            const savedRole = await AsyncStorage.getItem('role');
            if (savedUser) setUser(JSON.parse(savedUser));
            if (savedRole) setRole(savedRole);
        } catch (e) {
            console.error('Failed to load user data');
        } finally {
            setLoading(false);
        }
    };

    const login = async (userData, userRole) => {
        setUser(userData);
        setRole(userRole);
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        await AsyncStorage.setItem('role', userRole);
    };

    const logout = async () => {
        setUser(null);
        setRole('Customer');
        await AsyncStorage.clear();
    };

    return (
        <AuthContext.Provider value={{ user, role, login, logout, setRole, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
