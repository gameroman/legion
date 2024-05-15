import { Rarity, ChestType } from "./enums";

export const AVERAGE_REWARD_PER_GAME = 100; 

export function getPrice(effort: number): number {
    return Math.floor(effort * AVERAGE_REWARD_PER_GAME);
}

export function getRarity(effort: number): Rarity {
    if (effort < 10) return Rarity.COMMON;
    if (effort < 25) return Rarity.RARE;
    if (effort < 50) return Rarity.EPIC;
    return Rarity.LEGENDARY;
}

type RewardType = 'consumable' | 'spell' | 'equipment' | 'character' | 'gold';
type Reward = { type: RewardType, rarity: Rarity, amount?: number };

function getRandomItem(rarityDistribution: { [key in Rarity]?: number[] }, RewardTypes: RewardType[], goldChance: number, goldAmount: number[], allowGold: boolean): Reward {
    const rarityRoll = Math.random() * 100;
    let cumulativeProbability = 0;
    let chosenRarity: Rarity | null = null;

    for (const rarity in rarityDistribution) {
        cumulativeProbability += rarityDistribution[rarity as keyof Rarity].reduce((a, b) => a + b, 0);
        if (rarityRoll < cumulativeProbability) {
            // @ts-ignore
            chosenRarity = rarity as Rarity;
            break;
        }
    }

    if (chosenRarity === null) {
        throw new Error('Failed to determine rarity');
    }

    if (allowGold && Math.random() < goldChance) {
        const goldIndex = Math.floor(Math.random() * goldAmount.length);
        return { type: 'gold', rarity: chosenRarity, amount: goldAmount[goldIndex] };
    }

    const RewardType = RewardTypes[Math.floor(Math.random() * RewardTypes.length)];
    return { type: RewardType, rarity: chosenRarity };
}

export function getChestContent(type: ChestType): Reward[] {
    let allowGold = true;

    switch (type) {
        case ChestType.BRONZE:
            return Array.from({ length: 2 }, () => {
                const item = getRandomItem({
                    [Rarity.COMMON]: [90],
                    [Rarity.RARE]: [10],
                }, ['consumable', 'spell', 'equipment'], 0.1, [AVERAGE_REWARD_PER_GAME], allowGold);
                if (item.type === 'gold') {
                    allowGold = false;
                }
                return item;
            });
        case ChestType.SILVER:
            return Array.from({ length: 4 }, () => {
                const item = getRandomItem({
                    [Rarity.COMMON]: [75],
                    [Rarity.RARE]: [20],
                    [Rarity.EPIC]: [5],
                }, ['consumable', 'spell', 'equipment'], 0.1, [AVERAGE_REWARD_PER_GAME * 3], allowGold);
                if (item.type === 'gold') {
                    allowGold = false;
                }
                return item;
            });
        case ChestType.GOLD:
            return Array.from({ length: 6 }, () => {
                const item = getRandomItem({
                    [Rarity.COMMON]: [44],
                    [Rarity.RARE]: [40],
                    [Rarity.EPIC]: [10],
                    [Rarity.LEGENDARY]: [5],
                }, ['consumable', 'spell', 'equipment', 'character'], 0.1, [AVERAGE_REWARD_PER_GAME * 10], allowGold);
                if (item.type === 'gold') {
                    allowGold = false;
                }
                return item;
            });
        default:
            throw new Error('Invalid ChestType');
    }
}
