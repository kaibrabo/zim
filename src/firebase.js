import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "messaging-app-39c45.firebaseapp.com",
  projectId: "messaging-app-39c45",
  storageBucket: "messaging-app-39c45.appspot.com",
  messagingSenderId: process.env.REACT_APP_MESSAGE_SENDER_ID,
  appId: process.env.REACT_APP_ID
};

firebase.initializeApp(firebaseConfig);

export default firebase;