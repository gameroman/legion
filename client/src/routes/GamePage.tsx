import { h, Component, Fragment } from 'preact';
import { GameHUD, events } from '../components/HUD/GameHUD';
import { startGame } from '../game/game';
import './GamePage.style.css';

interface GamePageProps {
  matches: {
    id?: string;
  };
}

interface GamePageState {
  mainDivClass: string;
  loading: boolean;
  progress: number;
  isPortraitMode: boolean;
}

class GamePage extends Component<GamePageProps, GamePageState> {
  constructor(props: GamePageProps) {
    super(props);
    this.state = {
      mainDivClass: 'normalCursor',
      progress: 0,
      loading: true,
      isPortraitMode: false, // Initialize the isPortraitMode state
    };
  }

  componentDidMount() {
    startGame();

    events.on('progressUpdate', (progress: number) => {
      this.updateProgress(progress);
    });

    // Check initial orientation
    this.checkOrientation();

    // Add event listeners for orientation changes
    window.addEventListener('resize', this.checkOrientation);
    window.addEventListener('orientationchange', this.checkOrientation);
  }

  componentWillUnmount() {
    // Remove event listeners to prevent memory leaks
    window.removeEventListener('resize', this.checkOrientation);
    window.removeEventListener('orientationchange', this.checkOrientation);
  }

  // Method to check the device orientation
  checkOrientation = () => {
    if (window.matchMedia('(orientation: portrait)').matches) {
      this.setState({ isPortraitMode: true });
    } else {
      this.setState({ isPortraitMode: false });
    }
  };

  changeMainDivClass = (newClass: string) => {
    this.setState({ mainDivClass: newClass });
  };

  updateProgress = (progress: number) => {
    this.setState({ progress });
    if (progress === 100) {
      this.setState({ loading: false });
    }
  };

  render() {
    return (
      <Fragment>
        <div className={this.state.mainDivClass}>
          <GameHUD changeMainDivClass={this.changeMainDivClass} />
          <div id="scene" />
          {this.state.loading && (
            <div className="loading-div">
              <div className="loading-game-spinner">
                <div className="spinner"></div>
                <div className="loading-text">{this.state.progress}%</div>
              </div>
            </div>
          )}
        </div>
        {this.state.isPortraitMode && <OrientationOverlay />}
      </Fragment>
    );
  }
}

// Overlay Component
function OrientationOverlay() {
  return (
    <div className="orientation-overlay">
      <p className="orientation-overlay__text">Please rotate your device to landscape mode</p>
    </div>
  );
}

export default GamePage;
