import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import admin, {corsMiddleware, getUID} from "./APIsetup";

export const createGame = onRequest((request, response) => {
  logger.info("Creating game");
  const db = admin.firestore();

  corsMiddleware(request, response, async () => {
    try {
      const gameId = request.body.gameId;
      const players = request.body.players;

      const gameData = {
        date: new Date(),
        gameId,
        players,
      };

      await db.collection("games").add(gameData);
      response.status(200).send({status: 0});
    } catch (error) {
      console.error("createGame error:", error);
      response.status(401).send("Unauthorized");
    }
  });
});
