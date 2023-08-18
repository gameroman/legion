import { Player } from './Player';

export class Team {
    scene: Phaser.Scene;
    id: number;
    members: Player[] = [];
    totalHPMax: number = 0;
    totalHP: number = 0;

    constructor(scene, number: number) {
        this.scene = scene;
        this.id = number;
    }   

    addMember(player: Player) {
        this.members.push(player);
        this.totalHPMax += player.maxHP;
    }

    getMember(num: number) {
        return this.members[num - 1];
    }

    getMembers(): Player[] {
        return this.members;
    }

    updateHP() {
        this.totalHP = 0;
        this.members.forEach(member => {
            this.totalHP += member.hp;
        });

        const ratio = this.totalHP / this.totalHPMax;
        console.log(ratio);
        if (ratio < 0.5) {
            // @ts-ignore
            this.scene.soundManager.playLoop(2);
        }
    }
}