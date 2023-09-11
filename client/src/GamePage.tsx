// GamePage.tsx
import { h, Component } from 'preact';
import { GameHUD } from './game/HUD/GameHUD';
import { startGame } from './game/game';

class GamePage extends Component {
  componentDidMount() {
    startGame();
  }

  render() {
    return <GameHUD />;
  }
}

export default GamePage;