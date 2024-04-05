import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

import {fetchLeaderboard, leaguesUpdate} from "./leaderboardsAPI";
import {inventoryData, purchaseItem, inventoryTransaction, inventorySave}
  from "./inventoryAPI";
import {rosterData, characterData, rewardsUpdate,
  generateOnSaleCharacters, listOnSaleCharacters,
  deleteOnSaleCharacters, purchaseCharacter} from "./characterAPI";
import {createPlayer, playerData, queuingData} from "./playerAPI";
import {createGame, gameData} from "./gameAPI";

export {
  fetchLeaderboard, inventoryData, purchaseItem,
  createPlayer, rosterData, characterData, rewardsUpdate,
  generateOnSaleCharacters, listOnSaleCharacters, deleteOnSaleCharacters,
  purchaseCharacter, leaguesUpdate, playerData, queuingData, createGame,
  gameData, inventorySave, inventoryTransaction,
};

export const helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!!!");
});
