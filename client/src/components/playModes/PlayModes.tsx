import './PlayModes.style.css'
import { h, Component } from 'preact';
import PlayModeButton from '../playModeButton/playModeButton';
import { PlayMode } from '@legion/shared/enums';

enum MiddleBtns {
  PRACTICE = 'practice',
  CASUAL = 'casual',
  RANKED = 'ranked'
}

class PlayModes extends Component {
  render() {
    return (
      <div className="barContainer">
        <PlayModeButton label={MiddleBtns.PRACTICE} mode={PlayMode.PRACTICE}/>
        <PlayModeButton label={MiddleBtns.CASUAL} players={15} mode={PlayMode.CASUAL}/>
        <PlayModeButton label={MiddleBtns.RANKED} players={8} mode={PlayMode.RANKED}/>
      </div>
    );
  }
}

export default PlayModes;