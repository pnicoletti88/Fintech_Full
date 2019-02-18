// JavaScript source code

import firebase from 'firebase'
const config = {
    apiKey: "AIzaSyDQt8p6FFBxIGrQjYVRVagXEQS78-J_mwc",
    authDomain: "user-auth-test-83e25.firebaseapp.com",
    databaseURL: "https://user-auth-test-83e25.firebaseio.com",
    projectId: "user-auth-test-83e25",
    storageBucket: "user-auth-test-83e25.appspot.com",
    messagingSenderId: "710771467285"
};

firebase.initializeApp(config);
export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export const database = firebase.database();
export default firebase;