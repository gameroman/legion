// GamePage.tsx
import { h, Component } from 'preact';
import { GameHUD } from '../components/HUD/GameHUD';
import { startGame } from '../game/game';

interface GamePageProps {
  matches: {
    id?: string;
  };
}

class GamePage extends Component<GamePageProps, {}> {
  componentDidMount() {
    startGame();
  }

  render() {
    return (
      <div className="gameCursor">
        <GameHUD />
        <div id="scene" />
      </div>
    )
  }
}

export default GamePage;