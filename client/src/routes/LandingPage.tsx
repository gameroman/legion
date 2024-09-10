import { h, Component } from 'preact';
import { route } from 'preact-router';
import AuthContext from '../contexts/AuthContext';
import firebase from 'firebase/compat/app';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';
import 'firebase/compat/auth';

// Import image assets
import logoBig from '@assets/logobig.png';

interface LandingPageState {
  showLoginOptions: boolean;
}

class LandingPage extends Component<{}, LandingPageState> {
  static contextType = AuthContext;

  state: LandingPageState = {
    showLoginOptions: false,
  };

  private firebaseUIContainer: HTMLDivElement | null = null;
  private firebaseUI: firebaseui.auth.AuthUI | null = null;

  showLoginOptions = (): void => {
    this.setState({ showLoginOptions: true }, this.initFirebaseUI);
  };

  initFirebaseUI = (): void => {
    const uiConfig: firebaseui.auth.Config = {
      signInFlow: 'popup',
      signInSuccessUrl: '/play',
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
      ],
      callbacks: {
        signInSuccessWithAuthResult: this.onSignInSuccess
      }
    };

    if (this.firebaseUIContainer) {
      try {
        this.firebaseUI = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth());
        this.firebaseUI.start(this.firebaseUIContainer, uiConfig);
      } catch (error) {
        console.error('Error initializing Firebase UI: ', error);
      }
    }
  };

  onSignInSuccess = (authResult: any): boolean => {
    const user = firebase.auth().currentUser;
    if (user?.isAnonymous) {
      // The user was previously signed in anonymously
      const credential = authResult.credential;
      
      user.linkWithCredential(credential)
        .then((usercred) => {
          const user = usercred.user;
          console.log("Anonymous account successfully upgraded", user);
          // You might want to update the user's data in your database here
        }).catch((error) => {
          console.error("Error upgrading anonymous account", error);
        });
    }
    
    // Navigate to the play page
    route('/play');
    return false;  // Prevent FirebaseUI from redirecting
  };

  clearFirebaseUI = (): void => {
    if (this.firebaseUI) {
      this.firebaseUI.reset();
    }
    this.setState({ showLoginOptions: false });
  };

  renderInitialView = (): h.JSX.Element => (
    <div>
      <div className="login-header">
        <br/><br/><br/>
        <p>Assemble your team and become the strongest of the arena!</p>
      </div>
      <div className="login-buttons">
        <button className="get-started" onClick={() => route('/game/tutorial')}>Get Started</button>
        <button className="already-account" onClick={this.showLoginOptions}>Already have an account?</button>
      </div>
    </div>
  );

  renderLoginOptions = (): h.JSX.Element => (
    <div>
      <div className="login-header">
        <br/><br/><br/>
        <p>Choose your sign in/up method</p>
      </div>
      <div ref={(ref) => this.firebaseUIContainer = ref} id="firebaseui-auth-container"></div>
      <button className="back-button" onClick={this.clearFirebaseUI}>Back</button>
    </div>
  );

  render(): h.JSX.Element {
    const { showLoginOptions } = this.state;

    return (
      <div className="landingPage">
        <div className="login-dialog">
          <img src={logoBig} alt="Logo" className="logo" />
          {showLoginOptions ? this.renderLoginOptions() : this.renderInitialView()}
        </div>
      </div>
    );
  }
}

export default LandingPage;