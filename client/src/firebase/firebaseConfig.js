// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDb-ne49wrDijEZPDThLCC6k5XNl8h2WR0",
  authDomain: "roomify-db0df.firebaseapp.com",
  projectId: "roomify-db0df",
  storageBucket: "roomify-db0df.firebasestorage.app",
  messagingSenderId: "591522471454",
  appId: "1:591522471454:web:aa32f4ad7da09760b5980f",
  measurementId: "G-2S7DSCZV3C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;