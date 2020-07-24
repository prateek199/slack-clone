import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

var firebaseConfig = {
  apiKey: 'AIzaSyByjKHpbuA44q5LPBctKfFJQDxaZqOz6YA',
  authDomain: 'chatfire27.firebaseapp.com',
  databaseURL: 'https://chatfire27.firebaseio.com',
  projectId: 'chatfire27',
  storageBucket: 'chatfire27.appspot.com',
  messagingSenderId: '1012018234894',
  appId: '1:1012018234894:web:da451a52613e6beb075e5f',
  measurementId: 'G-22P1VS66D6',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
