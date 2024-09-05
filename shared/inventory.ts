import { APICharacterData, DBCharacterData, DBPlayerData, PlayerContextData, Equipment } from './interfaces';
import { EquipmentSlot, equipmentFields } from "./enums";
import { getSpellById } from "./Spells";
import { getEquipmentById } from "./Equipments";

export function numericalSort(a: number, b: number): number {
    return a - b;
}

export function canEquipConsumable(characterData: DBCharacterData | APICharacterData): boolean {
  return characterData.inventory.length <
    characterData.carrying_capacity + (characterData.carrying_capacity_bonus || 0);
}

export function canLearnSpell(characterData: DBCharacterData | APICharacterData, spellId: number): boolean {
  const spell = getSpellById(spellId);
  if (!spell) {
    console.error("Invalid spell ID");
    return false;
  }
  return (
    spell.minLevel <= characterData.level &&
    (!spell.classes.length || spell.classes.includes(characterData.class)) &&
    characterData.skills.length < characterData.skill_slots
  );
}

export function canEquipEquipment(characterData: DBCharacterData | APICharacterData, equipmentId: number): boolean {
  const equipment = getEquipmentById(equipmentId);
  if (!equipment) {
    console.error("Invalid equipment ID");
    return false;
  }
  console.log(`[canEquipEquipment] equipmentId: ${equipmentId}, equipment: ${equipment.name}`);

  return (
    equipment.minLevel <= characterData.level &&
    (!equipment.classes.length || equipment.classes.includes(characterData.class))
  );
}

export function equipConsumable(playerData: PlayerContextData | DBPlayerData, characterData: DBCharacterData | APICharacterData, index: number) {
  const playerInventory = playerData.inventory;
  const consumables = playerInventory.consumables.sort(numericalSort);
  const inventory = characterData.inventory as number[];

  if (index < 0 || index >= consumables.length) {
    return null;
  }

  const item = consumables[index];
  consumables.splice(index, 1);
  inventory.push(item);

  playerInventory.consumables = consumables;
  return {
    playerUpdate: { inventory: playerInventory },
    characterUpdate: { inventory },
  };
}

export function unequipConsumable(playerData: PlayerContextData | DBPlayerData, characterData: DBCharacterData | APICharacterData, index: number) {
  const playerInventory = playerData.inventory;
  const consumables = playerInventory.consumables.sort(numericalSort);
  const inventory = characterData.inventory as number[];

  if (index < 0 || index >= inventory.length) {
    return null;
  }

  const item = inventory[index];
  inventory.splice(index, 1);
  consumables.push(item);

  playerInventory.consumables = consumables;
  return {
    playerUpdate: { inventory: playerInventory },
    characterUpdate: { inventory },
  };
}

export function learnSpell(playerData: PlayerContextData | DBPlayerData, characterData: DBCharacterData | APICharacterData, index: number) {
  const playerInventory = playerData.inventory;
  const spells = playerInventory.spells.sort(numericalSort);
  const skills = characterData.skills as number[];

  if (index < 0 || index >= spells.length) {
    return null;
  }

  const item = spells[index];
  if (skills.includes(item)) {
    return null;
  }

  spells.splice(index, 1);
  skills.push(item);

  playerInventory.spells = spells;
  return {
    playerUpdate: { inventory: playerInventory },
    characterUpdate: { skills },
  };
}

export function equipEquipment(playerData: PlayerContextData | DBPlayerData, characterData: DBCharacterData | APICharacterData, index: number) {
  const playerInventory = playerData.inventory;
  console.log(`[equipEquipment] player inventory: ${playerInventory.equipment}`);
  const equipment = playerInventory.equipment.sort(numericalSort);
  console.log(`[equipEquipment] equipment inventory: ${equipment}, index: ${index}`);
  const equipped = characterData.equipment as Equipment;

  if (index < 0 || index >= equipment.length) {
    return null;
  }

  const item = equipment[index];
  equipment.splice(index, 1);

  const data = getEquipmentById(item);
  if (!data) {
    console.error("Invalid equipment ID");
    return null;
  }
  console.log(`[equipEquipment] equipment ID: ${item}, equipment: ${data.name}`);

  let slotNumber: number = data.slot;
  if (slotNumber == EquipmentSlot.LEFT_RING) {
    if (equipped.left_ring !== -1) {
      slotNumber = EquipmentSlot.RIGHT_RING;
    }
  }

  const field = equipmentFields[slotNumber];
  const currentlyEquipped = equipped[field as keyof Equipment];
  if (currentlyEquipped != -1) {
    equipment.push(currentlyEquipped);
  }
  equipped[field as keyof Equipment] = item;

  playerInventory.equipment = equipment.sort(numericalSort);
  return {
    playerUpdate: { inventory: playerInventory },
    characterUpdate: {
      equipment: equipped,
      equipment_bonuses: applyEquipmentBonuses(equipped),
    },
  };
}

export function unequipEquipment(playerData: PlayerContextData | DBPlayerData, characterData: DBCharacterData | APICharacterData, index: number) {
  const playerInventory = playerData.inventory;
  const equipment = playerInventory.equipment.sort(numericalSort);
  const equipped = characterData.equipment as Equipment;

  if (index < 0 || index >= equipmentFields.length) {
    return null;
  }

  const slotNumber: number = index;
  const field = equipmentFields[slotNumber];
  const item = equipped[field as keyof Equipment];

  if (item != -1) {
    equipped[field as keyof Equipment] = -1;
    equipment.push(item);
    playerInventory.equipment = equipment;
  }

  return {
    playerUpdate: { inventory: playerInventory },
    characterUpdate: {
      equipment: equipped,
      equipment_bonuses: applyEquipmentBonuses(equipped),
    },
  };
}

function applyEquipmentBonuses(equipped: Equipment) {
  const bonuses = {
    hp: 0,
    mp: 0,
    atk: 0,
    def: 0,
    spatk: 0,
    spdef: 0,
  };
  for (const field of equipmentFields) {
    const item = equipped[field as keyof Equipment];
    if (item !== -1) {
      const data = getEquipmentById(item);
      if (!data) {
        console.error("Invalid equipment ID");
        return bonuses;
      }
      data.effects.forEach((effect) => {
        switch (effect.stat) {
          case 0: bonuses.hp += effect.value; break;
          case 1: bonuses.mp += effect.value; break;
          case 2: bonuses.atk += effect.value; break;
          case 3: bonuses.def += effect.value; break;
          case 4: bonuses.spatk += effect.value; break;
          case 5: bonuses.spdef += effect.value; break;
        }
      });
    }
  }
  return bonuses;
}