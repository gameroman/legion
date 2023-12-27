// PlayPage.tsx
import { h, Component } from 'preact';
import Roster from './Roster';
import Button from './Button';

/* eslint-disable react/prefer-stateless-function */
class PlayPage extends Component {
  render() {

    return (
        <div>
          <div className="page-header">
            <img src="assets/play.png" className="page-icon" />
            <h1 className="page-title">Play</h1>
          </div>
          <div className="play-content">
            <Roster />
            <div className="section-title">Game Modes</div>
            <Button label="VS AI" to="/game" />
          </div>
        </div>
      );
  }
}

export default PlayPage;