import { h, Component } from 'preact';
import '../../styles/components/TutorialDialogue.css';

interface TutorialDialogueProps {
  message: string;
  isVisible: boolean;
  avatarSrc?: string;
}

class TutorialDialogue extends Component<TutorialDialogueProps> {
  render() {
    const { message, isVisible, avatarSrc = 'avatars/default.png' } = this.props;

    if (!isVisible) {
      return null;
    }

    return (
      <div className="tutorial-dialogue">
        <img src={avatarSrc} alt="Character Avatar" className="tutorial-dialogue-avatar" />
        <div className="tutorial-dialogue-content">
          <p>{message}</p>
        </div>
      </div>
    );
  }
}

export default TutorialDialogue;
