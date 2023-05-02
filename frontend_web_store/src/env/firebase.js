// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBkJz11TzaQ39ejKbD7zku1UYw3xwFDvXA",
  authDomain: "ai-quant-assistant.firebaseapp.com",
  projectId: "ai-quant-assistant",
  storageBucket: "ai-quant-assistant.appspot.com",
  messagingSenderId: "149103058108",
  appId: "1:149103058108:web:b7212519a28b3a134904b9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);
