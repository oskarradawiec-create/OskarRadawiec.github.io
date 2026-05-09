const firebaseConfig = {
    apiKey: "AIzaSyCyznzJZ-qeKApY0vyzbomYWJJWdJJRpt4",
    authDomain: "kyshow-ec111.firebaseapp.com",
    databaseURL: "https://kyshow-ec111-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "kyshow-ec111",
    storageBucket: "kyshow-ec111.appspot.com",
    messagingSenderId: "580856401686",
    appId: "1:580856401686:web:fb3e19da7dacec829a0a37",
    measurementId: "G-67PTFB2GZV"
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database();
