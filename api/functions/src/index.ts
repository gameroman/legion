import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

import {fetchLeaderboard, leaguesUpdate} from "./leaderboardsAPI";
import {inventoryData, purchaseItem, equipItem, unequipItem}
  from "./inventoryAPI";
import {createUserCharacter, rosterData, characterData, rewardsUpdate,
  generateOnSaleCharacters, listOnSaleCharacters,
  deleteOnSaleCharacters, purchaseCharacter} from "./characterAPI";
import {playerData} from "./playerAPI";

export {
  fetchLeaderboard, inventoryData, purchaseItem, equipItem, unequipItem,
  createUserCharacter, rosterData, characterData, rewardsUpdate,
  generateOnSaleCharacters, listOnSaleCharacters, deleteOnSaleCharacters,
  purchaseCharacter, leaguesUpdate, playerData,
};

export const helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!!!");
});
