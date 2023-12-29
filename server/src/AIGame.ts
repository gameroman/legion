import { Socket, Server } from 'socket.io';

import { Game } from './Game';
import { ServerPlayer } from './ServerPlayer';
import { AIServerPlayer } from './AIServerPlayer';
import { items } from '@legion/shared/Items';
import { spells } from '@legion/shared/Spells';
import { Item } from './Item';
import { Spell, convertBaseToSpell } from './Spell';
import {apiFetch} from './API';

const TICK = 100;
const AI_VS_AI = false;
const FREEZE = true;

export class AIGame extends Game {
    constructor(io: Server, sockets: Socket[]) {
        super(io, sockets);

        this.tickTimer = setInterval(this.AItick.bind(this), TICK);
    }

    async populateTeams() {
        const playerTeam = this.teams.get(1);
        const aiTeam = this.teams.get(2);

        if (AI_VS_AI) {
            playerTeam?.addMember(new AIServerPlayer(1, '1_1', 18, 4));
            playerTeam?.addMember(new AIServerPlayer(2, '1_5', 18, 2));
            playerTeam?.addMember(new AIServerPlayer(3, '1_2', 18, 6));
            playerTeam?.addMember(new AIServerPlayer(4, '1_3', 16, 5));
            playerTeam?.addMember(new AIServerPlayer(5, '1_4', 16, 3));
        } else {
            const teamData = await apiFetch('rosterData', playerTeam.getFirebaseToken());
            teamData.characters.forEach((character: any, index) => {
                const position = this.getPosition(index, false);
                const newPlayer = new ServerPlayer(index, character.portrait, position.x, position.y);
                newPlayer.setTeam(playerTeam!);
                newPlayer.setHP(character.hp);
                newPlayer.setMP(character.mp);
                newPlayer.setCooldown(character.cooldown);
                newPlayer.setInventory(character.carrying_capacity, character.inventory);
                newPlayer.setSpells(character.skill_slots, character.skills);
                playerTeam?.addMember(newPlayer);
            });
        }

        aiTeam?.addMember(new AIServerPlayer(1, '2_1', 1, 4));
        aiTeam?.addMember(new AIServerPlayer(2, '1_6', 1, 2));
        aiTeam?.addMember(new AIServerPlayer(3, '2_2', 1, 6));
        aiTeam?.addMember(new AIServerPlayer(4, '2_6', 3, 3));
        aiTeam?.addMember(new AIServerPlayer(5, '2_7', 3, 5));
    }

    getPosition(index, flip) {
        const positions = [
            {x: 16, y: 3},
            {x: 16, y: 5},
            {x: 18, y: 4},
            {x: 18, y: 2},
            {x: 18, y: 6},
        ]
        const position = positions[index];
        if (flip) {
            position.x = 19 - position.x;
        }
        return position;
    }

    AItick() {
        if (this.gameOver) {
            clearInterval(this.tickTimer!);
            return;
        }

        const AIteams = AI_VS_AI ? [1, 2] : [2];

        AIteams.forEach(teamNum => {
            (this.teams.get(teamNum)?.getMembers() as AIServerPlayer[]).forEach(player => {
                if (!FREEZE) player.takeAction();
            }, this);
        });
    }
}