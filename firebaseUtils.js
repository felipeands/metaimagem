
import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyAvPBz7n4Je5o2H43q25C42eutpxqDtTig",
  authDomain: "meta-imagem.firebaseapp.com",
  databaseURL: "https://meta-imagem.firebaseio.com",
  projectId: "meta-imagem",
  storageBucket: "meta-imagem.appspot.com",
  messagingSenderId: "1035540942791",
  appId: "1:1035540942791:web:988a978fc6c562410c13e2",
  measurementId: "G-3NT69MR4VG"
};

export const firebaseImpl = firebase.initializeApp(firebaseConfig);
export const firebaseDatabase = firebase.database();

