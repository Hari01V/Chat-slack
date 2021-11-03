import firebase from 'firebase/compat/app';
import "firebase/compat/auth";
import "firebase/compat/database";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDu7zjFH2lOpN2mCqtm54TdUqqyJoxWJ3A",
  authDomain: "react-slack-clone-638ba.firebaseapp.com",
  projectId: "react-slack-clone-638ba",
  storageBucket: "react-slack-clone-638ba.appspot.com",
  messagingSenderId: "237516615046",
  appId: "1:237516615046:web:fee734845584b96f43d007",
  measurementId: "G-DE2BECXKSK"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;