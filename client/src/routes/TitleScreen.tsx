import { h, Component } from 'preact';
import AuthContext from '../contexts/AuthContext';
import './TitleScreen.style.css';
import logoBig from '@assets/logo.png';

class TitleScreen extends Component {
  static contextType = AuthContext;

  private firebaseUIContainer: HTMLDivElement | null = null;

  componentDidMount(): void {
    if (this.firebaseUIContainer) {
      this.context.initFirebaseUI(this.firebaseUIContainer, (authResult) => this.context.handleAuthSuccess(authResult), false);
    }
  }

  componentWillUnmount(): void {
    this.context.resetUI();
  }

  render() {
    return (
      <div className="title-screen">
        <div className="title-screen-content">
            <img src={logoBig} alt="Legion" className="logo-big" />
            <div id="firebaseui-auth-container" ref={el => this.firebaseUIContainer = el}></div>
        </div>
      </div>
    );
  }
}

export default TitleScreen;
