import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as functions from "firebase-functions";
import admin, {corsMiddleware, getUID} from "./APIsetup";

export const playerData = onRequest((request, response) => {
  logger.info("Fetching playerData");
  const db = admin.firestore();

  corsMiddleware(request, response, async () => {
    try {
      const uid = await getUID(request);
      const docSnap = await db.collection("players").doc(uid).get();

      if (docSnap.exists) {
        const playerData = docSnap.data();
        if (!playerData) {
          throw new Error("playerData is null");
        }

        response.send({
          gold: playerData.gold,
          elo: playerData.elo,
          lvl: playerData.lvl,
          name: playerData.name,
        });
      } else {
        response.status(404).send("Not Found: Invalid player ID");
      }
    } catch (error) {
      console.error("playerData error:", error);
      response.status(401).send("Unauthorized");
    }
  });
});
