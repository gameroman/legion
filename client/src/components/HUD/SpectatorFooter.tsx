// SpectatorFooter.tsx
import { h, Fragment, Component } from 'preact';
import { PlayMode, Class } from '@legion/shared/enums';
import { TeamOverview } from "@legion/shared/interfaces";
import { getSpritePath } from '../utils';
import './SpectatorFooter.style.css';
import warriorIcon from '@assets/shop/warrior_icon.png';
import mageIcon from '@assets/shop/mage_icon.png';
import hourglassIcon from '@assets/HUD/hourglass.png';

interface SpectatorFooterProps {
  isTutorial: boolean;
  score: number;
  mode: PlayMode;
  queue: {
    num: any;
    team: number;
    position: number;
  }[];
  team1: TeamOverview;
  team2: TeamOverview;
  closeGame: () => void;
  isPlayer: boolean;
}

interface SpectatorFooterState {
  positions: { [key: string]: number };
  timerProgress: number;
  timerInterval?: NodeJS.Timeout;
}

class SpectatorFooter extends Component<SpectatorFooterProps, SpectatorFooterState> {
  state = {
    positions: {},
    timerProgress: 100,
    timerInterval: undefined
  };

  componentDidUpdate(prevProps: SpectatorFooterProps) {
    if (prevProps.queue !== this.props.queue) {
      // Calculate new positions
      const newPositions = {};
      this.props.queue.forEach((item, index) => {
        const key = `${item.team}-${item.num}`;
        newPositions[key] = index;
      });
      
      this.setState({ positions: newPositions });
    }
    // this.resetTimer();
  }

  componentWillUnmount() {
    if (this.state.timerInterval) {
      clearInterval(this.state.timerInterval);
    }
  }

  private resetTimer() {
    if (this.state.timerInterval) {
      clearInterval(this.state.timerInterval);
    }

    this.setState({ timerProgress: 100 });
    this.startTimer(7);
  }

  private startTimer(duration: number = 7) {
    const decrementAmount = 100 / duration;
    const interval = setInterval(() => {
      this.setState(prevState => ({
        timerProgress: Math.max(0, prevState.timerProgress - decrementAmount)
      }));
    }, 1000);

    this.setState({ timerInterval: interval });
    return () => clearInterval(interval);
  }

  render() {
    const { isTutorial, queue, team1, team2, closeGame } = this.props;
    const { positions } = this.state;

    const getCharacterFromQueue = (queueItem: { team: number; num: number }) => {
      const team = queueItem.team === 1 ? team1 : team2;
      return team?.members[queueItem.num - 1];
    };

    // Sort queue by position
    const sortedQueue = [...(queue || [])].sort((a, b) => a.position - b.position);

    // Inside the render method, update the timeline calculations:
    const portraitWidth = 72; // Width of each portrait
    const timelineWidth = Math.max(100, sortedQueue.length * portraitWidth);
    const startOffset = (timelineWidth - sortedQueue.length * portraitWidth) / 2;
    const timerPosition = startOffset - 70; // Position timer just before the first portrait

    const circumference = 2 * Math.PI * 27; // radius of 27 for the circle
    const offset = circumference - (this.state.timerProgress / 100) * circumference;

    return (
      <div className="spectator_footer_wrapper">
        <div className="spectator_footer_container">
          {this.props.isPlayer && (
            <div className="turn_timer" style={{ left: `${timerPosition}px` }}>
              <svg className="turn_timer_circle" width="60" height="60">
                <defs>
                  <linearGradient id="timer-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#8d7648" />
                    <stop offset="100%" stopColor="#d9c380" />
                  </linearGradient>
                </defs>
                <circle
                  className="timer_background"
                  cx="30"
                  cy="30"
                  r="27"
                />
                <circle
                  className="timer_progress"
                  cx="30"
                  cy="30"
                  r="27"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                />
              </svg>
              <img 
                src={hourglassIcon} 
                className="turn_timer_hourglass" 
                alt="Turn timer"
              />
            </div>
          )}
          <div className="turn_timeline_wrapper">
            <div className="turn_order_label">Turn Order</div>
            <div 
              className="turn_timeline"
              style={{ 
                width: `${timelineWidth}px`,
                position: 'relative'
              }}
            >
              {sortedQueue.map((queueItem, index) => {
                const character = getCharacterFromQueue(queueItem);
                if (!character) return null;

                const portraitStyle = {
                  backgroundImage: `url(${getSpritePath(character.texture)})`,
                };

                const characterKey = `${queueItem.team}-${queueItem.num}`;
                const position = positions[characterKey] || index;

                const style = {
                  transform: `translateX(${startOffset + (position * portraitWidth)}px)`,
                  zIndex: sortedQueue.length - position
                };

                return (
                  <div 
                    key={characterKey}
                    className={`timeline_character ${queueItem.team === 1 ? 'timeline_ally' : 'timeline_enemy'}`}
                    style={style}
                  >
                    <div 
                      className={`timeline_portrait_container ${queueItem.team === 1 ? 'ally_portrait' : 'enemy_portrait'}`}
                    >
                      <div 
                        className="timeline_portrait" 
                        style={portraitStyle}
                      />
                      <div className={`timeline_class_indicator ${
                        character.class === Class.WARRIOR 
                          ? 'frame-warrior' 
                          : character.class === Class.BLACK_MAGE 
                          ? 'frame-black-mage'
                          : 'frame-white-mage'
                      }`}>
                        <img 
                          src={character.class === Class.WARRIOR ? warriorIcon : mageIcon}
                          className={`class-icon ${character.class === Class.WARRIOR ? 'warrior' : ''}`}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {isTutorial && (
          <div className="skip_tutorial" onClick={closeGame}>
            <span>Skip Tutorial</span>
          </div>
        )}
      </div>
    );
  }
}

export default SpectatorFooter;
