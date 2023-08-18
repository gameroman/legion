import { Socket, Server } from 'socket.io';

import { Game } from './Game';
import { ServerPlayer } from './ServerPlayer';
import { AIServerPlayer } from './AIServerPlayer';
import { items } from './Items';
import { spells } from './Spells';

const TICK = 100;
export class AIGame extends Game {
    constructor(io: Server, sockets: Socket[]) {
        super(io, sockets);

        this.tickTimer = setInterval(this.AItick.bind(this), TICK);
    }

    populateTeams() {
        this.teams.get(1)?.addMember(new ServerPlayer(1, 'warrior_1', 18, 4));
        this.teams.get(1)?.addMember(new ServerPlayer(2, 'mage_1', 18, 2));
        this.teams.get(1)?.addMember(new ServerPlayer(3, 'warrior_2', 18, 6));
        this.teams.get(2)?.addMember(new AIServerPlayer(1, 'warrior_3', 17, 4));
        this.teams.get(2)?.addMember(new AIServerPlayer(2, 'mage_2', 1, 2));
        this.teams.get(2)?.addMember(new AIServerPlayer(3, 'warrior_4', 1, 6));

        const fireball = spells[0];

        // Iterate over teams
        this.teams.forEach(team => {
            // Iterate over members
            team.getMembers().forEach(player => {
                // Iterate from 0 to 5
                for (let i = 0; i < 6; i++) {
                    // Set quantity to random between 0 and 2
                    let qty = Math.floor(Math.random() * 3);
                    if (qty) player.addItem(items[i], qty);
                }

                player.addSpell(fireball);
            }, this);
        }, this);
    }

    AItick() {
        (this.teams.get(2)?.getMembers() as AIServerPlayer[]).forEach(player => {
            player.takeAction();
        }, this);
    }
}