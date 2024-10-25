import { h, Component } from 'preact';
import '../../styles/components/TutorialDialogue.css';

const DEFAULT_AVATAR_SRC = 'avatars/default.png';
const DEFAULT_SPEAKER_NAME = 'Taskmaster';

interface TutorialDialogueProps {
  messages: string[];
}

interface TutorialDialogueState {
  displayedMessage: string;
  isAvatarLoaded: boolean;
}

class TutorialDialogue extends Component<TutorialDialogueProps, TutorialDialogueState> {
  private typingTimer: number | null = null;
  private typingSpeed: number = 30; // milliseconds per character

  state: TutorialDialogueState = {
    displayedMessage: '',
    isAvatarLoaded: false,
  };

  componentDidMount() {
    if (this.props.messages) {
      this.resetTyping();
    }
  }

  componentDidUpdate(prevProps: TutorialDialogueProps) {
    if (this.props.messages !== prevProps.messages) {
      this.resetTyping();
    }
  }

  componentWillUnmount() {
    this.clearTypingTimer();
  }

  resetTyping() {
    this.clearTypingTimer();
    this.setState({ displayedMessage: '' }, () => {
      this.typeMessage();
    });
  }

  clearTypingTimer() {
    if (this.typingTimer !== null) {
      clearTimeout(this.typingTimer);
      this.typingTimer = null;
    }
  }

  typeMessage() {
    const { messages } = this.props;
    const { displayedMessage } = this.state;

    if (displayedMessage.length < messages[0].length) {
      this.setState(
        { displayedMessage: messages[0].slice(0, displayedMessage.length + 1) },
        () => {
          this.typingTimer = window.setTimeout(() => this.typeMessage(), this.typingSpeed);
        }
      );
    }
  }

  handleAvatarLoad = () => {
    this.setState({ isAvatarLoaded: true });
  }

  render() {
    const { displayedMessage, isAvatarLoaded } = this.state;

    return (
      <div className={`tutorial-dialogue ${isAvatarLoaded ? 'visible' : ''}`}>
        <img 
          src={DEFAULT_AVATAR_SRC} 
          alt="Character Avatar" 
          className="tutorial-dialogue-avatar" 
          onLoad={this.handleAvatarLoad}
        />
        <div className="tutorial-dialogue-content">
          <div className="tutorial-dialogue-speaker">{DEFAULT_SPEAKER_NAME}</div>
          <p>{displayedMessage}</p>
        </div>
        {/* <button className="tutorial-dialogue-next" onClick={onNext} aria-label="Next">
          <div className="tutorial-dialogue-next-arrow"></div>
        </button> */}
      </div>
    );
  }
}

export default TutorialDialogue;
