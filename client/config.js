// Replace with your Laptop's IP Address for local testing
const LOCAL_API_URL = 'http://192.168.0.101:5001';
const PRODUCTION_API_URL = 'https://your-render-app-name.onrender.com'; // Update this after Render deployment

export const API_BASE_URL = __DEV__ ? LOCAL_API_URL : PRODUCTION_API_URL;

// Note: Using __DEV__ allows Expo to automatically switch URLs.
