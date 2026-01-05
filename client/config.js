// Replace with your Laptop's IP Address for local testing
const LOCAL_API_URL = 'http://192.168.0.101:5001';
const PRODUCTION_API_URL = 'https://constructlynew-1.onrender.com';

// 💡 TIP: Set USE_LOCAL to 'false' to test the Cloud (Render) version on your phone!
const USE_LOCAL = false;

export const API_BASE_URL = USE_LOCAL ? LOCAL_API_URL : PRODUCTION_API_URL;

// Note: Using a manual toggle allows you to test Cloud even in development mode.
