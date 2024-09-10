import { createContext } from 'preact';
import firebase from 'firebase/compat/app';
import firebaseConfig from '@legion/shared/firebaseConfig';
import 'firebase/compat/auth';
import { firebaseAuth } from '../services/firebaseService'; 
import { SingleEntryPlugin } from 'webpack';

// Initialize Firebase only once
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const AuthContext = createContext({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    firebaseAuth,
    signInAsGuest: async () => null,
});

export default AuthContext;
