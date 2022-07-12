require('dotenv').config();

const { getStorage } = require('firebase/storage');
const { initializeApp } = require('firebase/app');

const { FIREBASE_STORAGE_URL, FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN, FIREBASE_PROJECT_ID, FIREBASE_STORAGE_BUCKET, FIREBASE_MESSAGING_SENDER_ID, FIREBASE_APP_ID, FIREBASE_MEASUREMENT_ID } = process.env;

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID,
};

// Creates and initializes a Firebase app instance. Pass options as param
const app = initializeApp(firebaseConfig);
// const storage = getStorage(app, FIREBASE_STORAGE_URL);
const storage = getStorage(app);

module.exports = storage;
