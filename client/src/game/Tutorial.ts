import { Arena } from './Arena';
import { events, GameHUD } from '../components/HUD/GameHUD';

export class Tutorial {
    private game: Arena;
    private gameHUD: GameHUD;   

    constructor(game: Arena, gameHUD: GameHUD) {
        this.game = game;
        this.gameHUD = gameHUD;
    }

    start() {
        const messages = [
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            "Second message",
        ];
        console.log(`Emitting tutorial messages: ${messages}`);
        events.emit('showTutorialMessage', messages);
    }
}
