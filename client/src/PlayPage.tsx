// PlayPage.tsx
import { h, Component } from 'preact';
import Roster from './Roster';
import Button from './Button';


class PlayPage extends Component {
  render() {
    // This is just a placeholder. Replace this with the actual data.
    const team = [
      { name: 'Character 1', class: 'Class 1', level: 1, image: 'assets/sprites/1_1.png' },
      { name: 'Character 2', class: 'Class 2', level: 2, image: 'assets/sprites/1_2.png' },
    ];

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