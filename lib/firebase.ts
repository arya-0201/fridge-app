// lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app'

const firebaseConfig = {
    apiKey: "AIzaSyCNLuazytO2jgLc6gKUKE0oORNeL6OHKd0",
    authDomain: "my-fridge-app-ebbb0.firebaseapp.com",
    projectId: "my-fridge-app-ebbb0",
    storageBucket: "my-fridge-app-ebbb0.firebasestorage.app",
    messagingSenderId: "1019279680674",
    appId: "1:1019279680674:web:0aa2279c22dbba807163fb",
    measurementId: "G-H2E3BC4D6H"
  };

// 이미 앱이 초기화되어 있지 않으면 초기화
export const firebaseApp = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp()
