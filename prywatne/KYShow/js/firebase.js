const firebaseConfig = {
    apiKey: "TWOJE_API_KEY",
    authDomain: "TWOJ_PROJEKT.firebaseapp.com",
    databaseURL: "https://TWOJ_PROJEKT-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "TWOJ_PROJEKT",
    storageBucket: "TWOJ_PROJEKT.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123"
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database();
