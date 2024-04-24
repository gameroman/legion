import { Rarity } from "./enums";

export const averageRewardPerGame = 100; 

export function getPrice(effort: number): number {
    return Math.floor(effort * averageRewardPerGame);
}

export function getRarity(effort: number): Rarity {
    if (effort < 10) return Rarity.COMMON;
    if (effort < 25) return Rarity.RARE;
    if (effort < 50) return Rarity.EPIC;
    return Rarity.LEGENDARY;
}