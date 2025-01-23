import { DailyLootAllAPIData, DailyLootAllDBData, PlayerInventory } from "./interfaces";
import { ChestColor, StatusEffect } from "./enums";

function specialRound(num: number): number {
    if (num >= 0) {
        return Math.round(num);
    } else {
        return -Math.round(-num);
    }
}

export function serializeCoords(x: number, y: number): string {
    return `${x},${y}`;
}  

export function lineOfSight(startX: number, startY: number, endX: number, endY: number, isFree: Function): boolean {
    // Get the distance between the start and end points
    let distance = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);

    // Calculate the number of steps to check, based on the distance
    let steps = Math.ceil(distance);

    // console.log(`Line of sight from (${startX}, ${startY}) to (${endX}, ${endY})`);
    for (let i = 1; i < steps; i++) {
        // Calculate the current position along the line
        const xInc = specialRound(i / steps * (endX - startX));
        const yInc = specialRound(i / steps * (endY - startY));
        let currentX = Math.round(startX + xInc);
        let currentY = Math.round(startY + yInc);
        if (currentX == startX && currentY == startY) continue;

        // Check if this position is occupied
        if (!isFree(currentX, currentY)) {
            // console.log(`Line of sight blocked at (${currentX}, ${currentY})`);
            // If the position is occupied, return false
            return false;
        }
    }

    // If no occupied positions were found, return true
    return true;
}

export function listCellsOnTheWay(startX: number, startY: number, endX: number, endY: number): Set<string> {
    // Get the distance between the start and end points
    let distance = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);

    // Calculate the number of steps to check, based on the distance
    let steps = Math.ceil(distance);

    const cells = new Set<string>();
    cells.add(serializeCoords(startX, startY));
    for (let i = 1; i < steps; i++) {
        // Calculate the current position along the line
        const xInc = specialRound(i / steps * (endX - startX));
        const yInc = specialRound(i / steps * (endY - startY));
        let currentX = Math.round(startX + xInc);
        let currentY = Math.round(startY + yInc);
        if (currentX == startX && currentY == startY) continue;

        // Add this position to the list
        cells.add(serializeCoords(currentX, currentY));
    }
    cells.add(serializeCoords(endX, endY));

    return cells;
}

export function inventorySize(inventory: PlayerInventory): number {
    return Object.values(inventory)
    .filter(Array.isArray)
    .map(arr => arr.length)
    .reduce((acc, curr) => acc + curr, 0);
}

export async function sendMessageToAdmin(client: any, message: string) {
    const adminUser = await client.users.fetch('272906141728505867');
    adminUser.send(message);
}

export const paralyzingStatuses = [StatusEffect.FREEZE, StatusEffect.PARALYZE, StatusEffect.SLEEP];

export const transformDailyLoot = (dailyloot: DailyLootAllDBData): DailyLootAllAPIData => {
    const now = Date.now() / 1000;
    const transformedChests: DailyLootAllAPIData = {
      [ChestColor.BRONZE]: { hasKey: false, countdown: 0 },
      [ChestColor.SILVER]: { hasKey: false, countdown: 0 },
      [ChestColor.GOLD]: { hasKey: false, countdown: 0 },
    };
    for (const color of Object.values(ChestColor)) {
      const chest = dailyloot[color];
      const timeLeft = chest.time - now;
      transformedChests[color] = {
        hasKey: chest.hasKey,
        countdown: timeLeft > 0 ? timeLeft : 0,
      };
    }
    return transformedChests;
  };