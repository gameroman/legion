// GamePage.tsx
import { h, Component } from 'preact';
import { GameHUD } from '../components/game/HUD/GameHUD';
import { startGame } from '../components/game/game';
import Phaser from 'phaser';

class GamePage extends Component {
  componentDidMount() {
    startGame();
  }

  render() {
    return <GameHUD />;
  }
  // private game: Phaser.Game | null = null;

  // componentDidMount() {
  //   const config: Phaser.Types.Core.GameConfig = {
  //     type: Phaser.AUTO,
  //     parent: 'game-container', // This should match the div id below
  //     width: 800,
  //     height: 600,
  //     scene: {
  //       preload: this.preload,
  //       create: this.create,
  //       update: this.update
  //     }
  //   };

  //   // Initialize the Phaser game
  //   this.game = new Phaser.Game(config);
  // }

  // componentWillUnmount() {
  //   if (this.game) {
  //     this.game.destroy(true);
  //   }
  // }

  // // Phaser game lifecycle methods
  // preload(this: Phaser.Scene) {
  //   // Load assets
  //   this.load.image('sky', 'assets/sky.png');
  //   // ... load other assets
  // }

  // create(this: Phaser.Scene) {
  //   // Add assets to the game
  //   this.add.image(400, 300, 'sky');
  //   // ... setup the game, display sprites, etc.
  // }

  // update(this: Phaser.Scene) {
  //   // Game loop
  //   // ... update game state
  // }

  // render() {
  //   // The id here should match the parent property in the Phaser game config
  //   return <div id="game-container" />;
  // }
}

export default GamePage;