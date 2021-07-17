import firebase from 'firebase/app';
import 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAfski7qZzufolnyiY8C_7z2eeo4q0VlcE",
    authDomain: "bethegenius-793b1.firebaseapp.com",
    projectId: "bethegenius-793b1",
    storageBucket: "bethegenius-793b1.appspot.com",
    messagingSenderId: "582356241908",
    appId: "1:582356241908:web:f58ff9dba2dccd6c1ffda1"
  };

  firebase.initializeApp(firebaseConfig);

  export const auth = firebase.auth();
