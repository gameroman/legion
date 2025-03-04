import { h, Component } from 'preact';
import AuthContext from '../contexts/AuthContext';
import { firebaseAuth } from '../services/firebaseService';
import firebase from 'firebase/compat/app';
import AuthUIService from '../services/AuthUIService';
import { successToast, errorToast } from '../components/utils';
import { SignInCallback } from '../contexts/AuthContext';
import { apiFetch } from '../services/apiService';

class AuthProvider extends Component {
    state = {
        user: null,
        isAuthenticated: false,
        isLoading: true,
        utmSource: null,
    };

    unregisterAuthObserver: () => void;
    signInCallbacks: Set<SignInCallback> = new Set();

    componentDidMount() {
        this.unregisterAuthObserver = firebaseAuth.onAuthStateChanged(
            (user) => {
                const isAuthenticated = !!user;
                if (this.state.isAuthenticated !== isAuthenticated || 
                    this.state.isLoading || 
                    this.state.user !== user) {
                    this.setState({
                        user,
                        isAuthenticated,
                        isLoading: false,
                    });
                }
            }
        );
    }

    componentWillUnmount() {
        this.unregisterAuthObserver();
    }

    signInAsGuest = async (): Promise<firebase.User | null> => {
        try {
            if (firebaseAuth.currentUser && firebaseAuth.currentUser.isAnonymous) {
                return firebaseAuth.currentUser;
            }
            const credentials = await firebaseAuth.signInAnonymously();
            
            // Check for UTM source and/or mobile device
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            
            if (credentials.user) {
                const params: any = {};
                
                if (this.state.utmSource) {
                    params.utmSource = this.state.utmSource;
                }
                
                if (isMobile !== undefined) {
                    params.isMobile = isMobile;
                }

                if (document.referrer) {
                    params.referrer = document.referrer;
                }
                                
                if (Object.keys(params).length > 0) {
                    apiFetch('setUserAttributes', {
                        method: 'POST',
                        body: params
                    });
                }
            }
            return credentials.user;
        } catch (error) {
            console.error("Error signing in as guest:", error);
            throw error;
        }
    };

    initFirebaseUI = (container: HTMLElement): void => {
        AuthUIService.initFirebaseUI(container, this.onSignInSuccess);
    };

    onSignInSuccess = async (authResult: any): Promise<void> => {
        if (this.state.utmSource && authResult.user) {
            try {
                apiFetch('setUtmSource', {
                    method: 'POST',
                    body: {
                        utmSource: this.state.utmSource
                    }
                });
            } catch (error) {
                console.error("Error saving UTM source:", error);
            }
        }
        
        successToast("Sign-in successful!");
        this.notifySignInCallbacks();
    };

    resetUI = (): void => {
        AuthUIService.resetUI();
    };

    addSignInCallback = (callback: SignInCallback): void => {
        this.signInCallbacks.add(callback);
    };

    removeSignInCallback = (callback: SignInCallback): void => {
        this.signInCallbacks.delete(callback);
    };

    notifySignInCallbacks = (): void => {
        this.signInCallbacks.forEach(callback => callback());
    };

    logout = () => {
        firebaseAuth.signOut().then(() => {
            AuthUIService.destroyUI();
        }).catch((error) => {
            console.error('Error signing out: ', error);
        });
    }

    setUtmSource = async (utmSource: string): Promise<void> => {
        this.setState({ utmSource });
        
        if (this.state.user) {
            try {
                apiFetch('setUtmSource', {
                    method: 'POST',
                    body: {
                        utmSource
                    }
                });
            } catch (error) {
                console.error("Error saving UTM source:", error);
            }
        }
    };

    render({ children }) {
        if (this.state.isLoading) {
           return null;
        }
        
        return (
            <AuthContext.Provider value={{ 
                ...this.state, 
                firebaseAuth,
                signInAsGuest: this.signInAsGuest,
                initFirebaseUI: this.initFirebaseUI,
                resetUI: this.resetUI,
                addSignInCallback: this.addSignInCallback,
                removeSignInCallback: this.removeSignInCallback,
                logout: this.logout,
                setUtmSource: this.setUtmSource,
            }}>
                {!this.state.isLoading && children}
            </AuthContext.Provider>
        );
    }
}

export default AuthProvider;