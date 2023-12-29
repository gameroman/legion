import {Class} from "@legion/shared/types";
import {warriorSprites, whiteMageSprites, blackMageSprites, thiefSprites}
  from "@legion/shared/sprites";
import {uniqueNamesGenerator, adjectives, colors, animals}
  from "unique-names-generator";

interface CharacterData {
    name: string;
    portrait: string;
    class: Class;
    level: number;
    xp: number;
    hp: number;
    mp: number;
    atk: number;
    def: number;
    spatk: number;
    spdef: number;
    carrying_capacity: number;
    skill_slots: number;
    inventory: number[];
    skills: number[];
}

export class NewCharacter {
  characterClass: Class;

  constructor() {
    this.characterClass = Math.floor(Math.random() * 3) as Class;
  }

  getSkillSlots(): number {
    switch (this.characterClass) {
    case Class.WARRIOR:
      return 0;
    case Class.WHITE_MAGE:
      return 3;
    case Class.BLACK_MAGE:
      return 3;
    case Class.THIEF:
      return 1;
    }
  }

  getFrame(): string {
    switch (this.characterClass) {
    case Class.WARRIOR:
      return warriorSprites[Math.floor(Math.random() * warriorSprites.length)];
    case Class.WHITE_MAGE:
      return whiteMageSprites[
        Math.floor(Math.random() * whiteMageSprites.length)
      ];
    case Class.BLACK_MAGE:
      return blackMageSprites[
        Math.floor(Math.random() * blackMageSprites.length)
      ];
    case Class.THIEF:
      return thiefSprites[Math.floor(Math.random() * thiefSprites.length)];
    }
  }

  getHP(): number {
    switch (this.characterClass) {
    case Class.WARRIOR:
      return 100;
    case Class.WHITE_MAGE:
      return 80;
    case Class.BLACK_MAGE:
      return 80;
    case Class.THIEF:
      return 90;
    }
  }

  getMP(): number {
    switch (this.characterClass) {
    case Class.WARRIOR:
      return 20;
    case Class.WHITE_MAGE:
      return 30;
    case Class.BLACK_MAGE:
      return 40;
    case Class.THIEF:
      return 20;
    }
  }

  getRandom(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getAtk(): number {
    switch (this.characterClass) {
    case Class.WARRIOR:
      return this.getRandom(8, 12);
    case Class.WHITE_MAGE:
      return this.getRandom(5, 8);
    case Class.BLACK_MAGE:
      return this.getRandom(5, 8);
    case Class.THIEF:
      return this.getRandom(5, 10);
    }
  }

  getDef(): number {
    switch (this.characterClass) {
    case Class.WARRIOR:
      return this.getRandom(8, 12);
    case Class.WHITE_MAGE:
      return this.getRandom(5, 8);
    case Class.BLACK_MAGE:
      return this.getRandom(5, 8);
    case Class.THIEF:
      return this.getRandom(5, 10);
    }
  }

  getSpatk(): number {
    switch (this.characterClass) {
    case Class.WARRIOR:
      return this.getRandom(5, 8);
    case Class.WHITE_MAGE:
      return this.getRandom(8, 12);
    case Class.BLACK_MAGE:
      return this.getRandom(8, 12);
    case Class.THIEF:
      return this.getRandom(5, 8);
    }
  }

  getSpdef(): number {
    switch (this.characterClass) {
    case Class.WARRIOR:
      return this.getRandom(5, 8);
    case Class.WHITE_MAGE:
      return this.getRandom(8, 12);
    case Class.BLACK_MAGE:
      return this.getRandom(8, 12);
    case Class.THIEF:
      return this.getRandom(5, 8);
    }
  }

  getSkills(): number[] {
    switch (this.characterClass) {
    case Class.WARRIOR:
      return [];
    case Class.WHITE_MAGE:
      return [1];
    case Class.BLACK_MAGE:
      return [0, 2, 3];
    case Class.THIEF:
      return [];
    }
  }

  generateCharacterData(): CharacterData {
    return {
      name: uniqueNamesGenerator({
        dictionaries: [adjectives, colors, animals],
        length: 2,
      }),
      portrait: this.getFrame(),
      class: this.characterClass,
      level: 1,
      xp: 0,
      hp: this.getHP(),
      mp: this.getMP(),
      atk: this.getAtk(),
      def: this.getDef(),
      spatk: this.getSpatk(),
      spdef: this.getSpdef(),
      carrying_capacity: 3,
      skill_slots: this.getSkillSlots(),
      inventory: [],
      skills: this.getSkills(),
    };
  }
}

