import { Class, Stat, statFields } from "./enums";
import { CharacterStats, Equipment, DBCharacterData } from "./interfaces";
import { warriorSprites, whiteMageSprites, blackMageSprites, thiefSprites, femaleSprites }
  from "./sprites";
import { male_names, female_names } from "./names";
import { selectStatToLevelUp, increaseStat, getSPIncrement } from "./levelling";
import { getPrice } from "./economy";
import { getStarterConsumables } from "./Items";

import { STARTING_BLACK_MAGE_SPELLS, STARTING_WHITE_MAGE_SPELLS, LOTSA_MP, BASE_CARRYING_CAPACITY } from "@legion/shared/config";
import { getSpellsUpToLevel } from "./Spells";

enum Gender {
  M,
  F
}
export class NewCharacter {
  name: string;
  gender: Gender;
  characterClass: Class;
  xp: number;
  level: number;
  portrait: string;
  stats: CharacterStats;
  equipment_bonuses: CharacterStats;
  sp_bonuses: CharacterStats;
  carrying_capacity: number;
  carrying_capacity_bonus: number;
  skill_slots: number;
  inventory: number[];
  equipment: Equipment;
  skills: number[];

  constructor(characterClass = Class.RANDOM, level = 1, unicornBonus = false, isAI = false) {
    console.log(`[NewCharacter:constructor] Creating new character with class ${characterClass}, level ${level}, unicornBonus ${unicornBonus}, isAI ${isAI}`);
    if (characterClass === Class.RANDOM) {
      const candidates = [Class.WARRIOR, Class.WHITE_MAGE, Class.BLACK_MAGE];
      // Get random value from candidates
      this.characterClass = candidates[
        Math.floor(Math.random() * candidates.length)
      ];
    } else {
      this.characterClass = characterClass;
    }

    this.portrait = this.getFrame();
    this.gender = this.determineGender();
    this.name = this.getName();
    this.xp = 0;
    this.level = level;
    this.carrying_capacity = BASE_CARRYING_CAPACITY;
    this.carrying_capacity_bonus = 0;
    this.skill_slots = this.getSkillSlots();
    this.inventory = [];
    this.equipment = {
      weapon: -1,
      armor: -1,
      helmet: -1,
      belt: -1,
      gloves: -1,
      boots: -1,
      left_ring: -1,
      right_ring: -1,
      necklace: -1,
    };
    this.skills = this.getSpells();
    this.stats = {
      [Stat.HP]: this.getHP() * (unicornBonus && Math.random() < 0.1 ? 2 : 1),
      [Stat.MP]: this.getMP() * (unicornBonus && Math.random() < 0.1 ? 2 : 1),
      [Stat.ATK]: this.getAtk() * (unicornBonus && Math.random() < 0.1 ? 2 : 1),
      [Stat.DEF]: this.getDef() * (unicornBonus && Math.random() < 0.1 ? 2 : 1),
      [Stat.SPATK]: this.getSpatk() * (unicornBonus && Math.random() < 0.1 ? 2 : 1),
      [Stat.SPDEF]: this.getSpdef() * (unicornBonus && Math.random() < 0.1 ? 2 : 1),
    };
    this.equipment_bonuses = {
      [Stat.HP]: 0,
      [Stat.MP]: 0,
      [Stat.ATK]: 0,
      [Stat.DEF]: 0,
      [Stat.SPATK]: 0,
      [Stat.SPDEF]: 0,
    };
    this.sp_bonuses = {
      [Stat.HP]: 0,
      [Stat.MP]: 0,
      [Stat.ATK]: 0,
      [Stat.DEF]: 0,
      [Stat.SPATK]: 0,
      [Stat.SPDEF]: 0,
    };

    for (let i = 1; i < this.level; i++) {
      this.lvlUp();
    }

    if (isAI) {
      this.setUpInventory();
    }
  }

  lvlUp(): void {
    const NB_INCREASES = 2;
    for (let i = 0; i < NB_INCREASES; i++) {
      const stat = selectStatToLevelUp(this.characterClass);
      switch (stat) {
        case Stat.HP:
          this.stats[Stat.HP] = increaseStat(stat, this.stats[Stat.HP], this.level, this.characterClass);
          break;
        case Stat.MP:
          this.stats[Stat.MP] = increaseStat(stat, this.stats[Stat.MP], this.level, this.characterClass);
          break;
        case Stat.ATK:
          this.stats[Stat.ATK] = increaseStat(stat, this.stats[Stat.ATK], this.level, this.characterClass);
          break;
        case Stat.DEF:
          this.stats[Stat.DEF] = increaseStat(stat, this.stats[Stat.DEF], this.level, this.characterClass);
          break;
        case Stat.SPATK:
          this.stats[Stat.SPATK] = increaseStat(stat, this.stats[Stat.SPATK], this.level, this.characterClass);
          break;
        case Stat.SPDEF:
          this.stats[Stat.SPDEF] = increaseStat(stat, this.stats[Stat.SPDEF], this.level, this.characterClass);
          break;
      }
    }
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
    return 0;
  }

  determineGender(): Gender {
    if (femaleSprites.includes(this.portrait)) {
      return Gender.F;
    } else {
      return Gender.M;
    }
  }

  getName(): string {
    if (this.gender == Gender.M) {
      // Pick a random element of male_names
      return male_names[Math.floor(Math.random() * male_names.length)];
    } else {
      return female_names[Math.floor(Math.random() * female_names.length)];
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
    return warriorSprites[Math.floor(Math.random() * warriorSprites.length)];
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
    return 100;
  }

  getMP(): number {
    switch (this.characterClass) {
      case Class.WARRIOR:
        return 20;
      case Class.WHITE_MAGE:
        return 30;
      case Class.BLACK_MAGE:
        return LOTSA_MP ? 1000 : 40;
      case Class.THIEF:
        return 20;
    }
    return 20;
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
    return 5;
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
    return 5;
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
    return 5;
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
    return 5;
  }

  getSpells(): number[] {
    switch (this.characterClass) {
      case Class.WARRIOR:
        return [];
      case Class.WHITE_MAGE:
      case Class.BLACK_MAGE:
        return getSpellsUpToLevel(this.characterClass, this.level);
      case Class.THIEF:
        return [];
    }
    return [];
  }

  setUpInventory() {
    const consumables = getStarterConsumables(this.level / 2);
    // console.log(`[NewCharacter:setUpInventory] Consumables for AI ${this.name}: ${consumables}`);
    if (consumables.length === 0) return;
    // For each available slot, add a random consumable or possibly nothing
    for (let i = 0; i < this.carrying_capacity; i++) {
      if (Math.random() < 0.6) {
        // Pick a random consumable
        this.inventory.push(consumables[Math.floor(Math.random() * consumables.length)]);
      }
    }
    // console.log(`[NewCharacter:setUpInventory] Inventory for AI ${this.name}: ${this.inventory} (length: ${this.inventory.length})`);
  }

  getPrice(): number {
    const reference = 135;
    // Returns the sum of all stats
    const sum = Object.values(this.stats).reduce((a, b) => a + b, 0);
    const coefficient = sum / reference;
    const price = Math.floor(getPrice(100) * coefficient);
    // Add +- 10% random variation
    return price + Math.floor(Math.random() * price * 0.2);
  }

  getCharacterData(includePrice = false): DBCharacterData {
    // Convert stats from enum keys to string keys for DB storage
    const dbStats = Object.fromEntries(statFields.map(key => [key, this.stats[Stat[key.toUpperCase()]]]));
    const dbEquipmentBonuses = Object.fromEntries(statFields.map(key => [key, this.equipment_bonuses[Stat[key.toUpperCase()]]]));
    const dbSpBonuses = Object.fromEntries(statFields.map(key => [key, this.sp_bonuses[Stat[key.toUpperCase()]]]));

    const data: DBCharacterData = {
        name: this.name,
        portrait: this.portrait,
        class: this.characterClass,
        level: this.level,
        xp: 0,
        sp: 0,
        allTimeSP: 0,
        stats: dbStats,
        carrying_capacity: this.carrying_capacity,
        carrying_capacity_bonus: this.carrying_capacity_bonus,
        skill_slots: this.skill_slots,
        inventory: this.inventory,
        equipment: this.equipment,
        equipment_bonuses: dbEquipmentBonuses,
        sp_bonuses: dbSpBonuses,
        skills: this.skills
    };
    if (includePrice) {
        data.price = this.getPrice();
    }
    return data;
  }
}

