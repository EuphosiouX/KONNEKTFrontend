// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth"
import { getStorage } from 'firebase/storage' 

// Your web app's Firebase configuration

const app = initializeApp({
    apiKey: 'AIzaSyBOFASqygf_1fdGQv91AraUmO3ZjAVmuEA',

    authDomain: 'konnekt-development.firebaseapp.com',

    projectId: 'konnekt-development',

    storageBucket: 'konnekt-development.appspot.com',

    messagingSenderId: '890430400299',

    appId: '1:890430400299:web:69fe105a69f995f9e9076e',
})


// Initialize Firebase

export default app
export const auth = getAuth(app)
export const storage = getStorage(app)
