import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import admin, {checkAPIKey, corsMiddleware} from "./APIsetup";
import {EndGameData, GameReplayMessage} from "@legion/shared/interfaces";
import {GameStatus} from "@legion/shared/enums";
import {logPlayerAction} from "./dashboardAPI";


export const createGame = onRequest({ 
  secrets: ["API_KEY"],
  memory: '512MiB'
}, (request, response) => {
  logger.info("Creating game");
  const db = admin.firestore();

  corsMiddleware(request, response, async () => {
    try {
      if (!checkAPIKey(request)) {
        response.status(401).send('Unauthorized');
        return;
      }
      const gameId = request.body.gameId;
      const players = request.body.players;
      const mode = request.body.mode;
      const league = request.body.league;
      const stake = request.body.stake;

      const gameData = {
        date: new Date(),
        gameId,
        players,
        mode,
        league,
        status: GameStatus.ONGOING,
        stake,
      };

      await db.collection("games").add(gameData);

      for (const player of players) {
        logPlayerAction(player, "gameStart", {
          gameId,
          league: gameData.league,
          mode: gameData.mode,
          stake: gameData.stake,
        });
      }

      response.status(200).send({status: 0});
    } catch (error) {
      console.error("createGame error:", error);
      response.status(401).send("Unauthorized");
    }
  });
});

export const gameData = onRequest({ 
  secrets: ["API_KEY"],
  memory: '512MiB'
}, (request, response) => {
  logger.info("Fetching gameData");
  const db = admin.firestore();

  corsMiddleware(request, response, async () => {
    try {
      if (!checkAPIKey(request)) {
        response.status(401).send('Unauthorized');
        return;
      }
      const gameId = request.query.id;
      if (!gameId) {
        response.status(400).send("Bad Request: Missing game ID");
        return;
      }
      const querySnapshot = await db.collection("games")
        .where("gameId", "==", gameId.toString()).get();

      if (!querySnapshot.empty) {
        const docData = querySnapshot.docs[0].data();
        response.send(docData);
      } else {
        response.status(404).send("Game ID not found");
      }
    } catch (error) {
      console.error("gameData error:", error);
      response.status(500).send("Error fetching game data");
    }
  });
});


export const completeGame = onRequest({ 
  memory: '512MiB'
}, (request, response) => {
  const db = admin.firestore();

  corsMiddleware(request, response, async () => {
    try {
      const gameId = request.body.gameId;
      const winnerUID = request.body.winnerUID || -1; // -1 for AI
      const rawResults: EndGameData = request.body.results;
      console.log(`[completeGame] Game ${gameId} completed, results: ${JSON.stringify(rawResults)}`);
      // Filter out the results object to remove keys that are empty strings or undefined
      const results = Object.fromEntries(
        Object.entries(rawResults).filter(([key, value]) => key !== '' && value !== undefined)
      );
      console.log(`[completeGame] Filtered results: ${JSON.stringify(results)}`);

      const gameRef = await db.collection("games").where("gameId", "==", gameId).limit(1).get();
      if (gameRef.empty) { // Most likely a tutorial ending
        // throw new Error("Invalid game ID");
        response.status(200).send({status: 0});
        return; // Exit the function early
      }

      const gameDoc = gameRef.docs[0];
      const gameData = gameDoc.data();
      if (!gameData) {
        throw new Error("gameData is null");
      }

      for (const player of gameData.players) {
        if (player) { // Add a check to ensure player is not undefined or empty string
          logPlayerAction(player, "gameComplete", {
            gameId,
            winner: winnerUID == player,
            results: results[player as keyof EndGameData],
            league: gameData.league,
            mode: gameData.mode,
          });
        }
      }

      const newGameData = {
        status: GameStatus.COMPLETED,
        winner: winnerUID,
        results,
        end: new Date(),
      };

      // Only add results to newGameData if it's not empty
      if (Object.keys(results).length > 0) {
        newGameData['results'] = results;
      }

      await gameDoc.ref.update(newGameData);
      response.status(200).send({status: 0});
    } catch (error) {
      console.error("[completeGame] Error:", error);
      response.status(500).send("Error");
    }
  });
});

export const getRemoteConfig = onRequest({ 
  secrets: ["API_KEY"],
  memory: '512MiB'
}, (request, response) => {
  const remoteConfig = admin.remoteConfig();

  corsMiddleware(request, response, async () => {
    try {
      if (!checkAPIKey(request)) {
        response.status(401).send('Unauthorized');
        return;
      }
       // Fetch the Remote Config template
      const template = await remoteConfig.getTemplate();

      // Extract parameter values from the template
      const configValues: { [key: string]: any } = {};
      for (const [key, parameter] of Object.entries(template.parameters)) {
        console.log(`Parameter ${key}: ${JSON.stringify(parameter)}`);
        // @ts-ignore
        let value = parameter.defaultValue?.value;
        if (value == "true") value = true;
        if (value == "false") value = false;
        configValues[key] = value;
      }

      // Send the config values as the response
      response.status(200).json(configValues);
    } catch (error) {
      console.error("getRemoteConfig error:", error);
      response.status(500).send("Error fetching remote config");
    }
  });
});

export const getNews = onRequest({ 
  memory: '512MiB' 
},(request, response) => {
  const db = admin.firestore();

  corsMiddleware(request, response, async () => {
    try {
      const limit = parseInt(request.query.limit as string) || 3;
      const newsCollection = db.collection("news");
      
      // Get all news
      const allNewsSnapshot = await newsCollection.get();
      const allNews = allNewsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Separate pinned and unpinned news
      const pinnedNews = allNews.filter((news: any) => news.pinned);
      const unpinnedNews = allNews.filter((news: any) => !news.pinned);
      
      // Sort both arrays by date (most recent first)
      const sortByDate = (a: any, b: any) => {
        const dateA = a.date || '0000-00-00';
        const dateB = b.date || '0000-00-00';
        return dateA.localeCompare(dateB);
      };
      
      pinnedNews.sort(sortByDate);
      unpinnedNews.sort(sortByDate);
      
      // Take only what we need to reach the limit
      const result = [
        ...pinnedNews,
        ...unpinnedNews.slice(0, Math.max(0, limit - pinnedNews.length))
      ];
      
      response.status(200).json(result.slice(0, limit));
    } catch (error) {
      console.error("getNews error:", error);
      response.status(500).send("Error fetching news");
    }
  });
});

export const addNews = onRequest({
  secrets: ["API_KEY"],
  memory: '512MiB'
}, (request, response) => {
  const db = admin.firestore();

  corsMiddleware(request, response, async () => {
    try {
      if (!checkAPIKey(request)) {
        response.status(401).send('Unauthorized');
        return;
      }

      const { title, text, date, link,pinned = false } = request.body;

      // Validate required fields
      if (!title || !text || !date) {
        response.status(400).send("Bad Request: Missing required fields (title, content, date)");
        return;
      }

      const newsData = {
        title,
        text,
        date,
        pinned,
        link,
        createdAt: new Date()
      };

      const docRef = await db.collection("news").add(newsData);
      response.status(200).json({ 
        status: "success", 
        message: "News added successfully",
        id: docRef.id 
      });
    } catch (error) {
      console.error("addNews error:", error);
      response.status(500).send("Error adding news");
    }
  });
});

export const saveReplay = onRequest({ 
  secrets: ["API_KEY"],
  memory: '512MiB'
}, (request, response) => {
  const db = admin.firestore();

  corsMiddleware(request, response, async () => {
    try {
      if (!checkAPIKey(request)) {
        response.status(401).send('Unauthorized');
        return;
      }

      const { gameId, messages, duration, mode } = request.body;

      // Validate required fields
      if (!gameId || !messages || !Array.isArray(messages)) {
        response.status(400).send("Bad Request: Missing or invalid required fields");
        return;
      }

      // Create replay data object
      const replayData = {
        messages: messages as GameReplayMessage[],
        duration,
        mode,
        savedAt: new Date(),
      };

      // Find the game document and update it with replay data
      const gameRef = await db.collection("games")
        .where("gameId", "==", gameId)
        .limit(1)
        .get();

      if (gameRef.empty) {
        response.status(404).send("Game not found");
        return;
      }

      await gameRef.docs[0].ref.update({ replay: replayData });

      response.status(200).send({status: 0});
    } catch (error) {
      console.error("saveReplay error:", error);
      response.status(500).send("Error saving replay");
    }
  });
});

export const getReplay = onRequest({
  memory: '512MiB'
}, (request, response) => {
  const db = admin.firestore();

  corsMiddleware(request, response, async () => {
    try {
      const gameId = request.query.id;
      if (!gameId) {
        response.status(400).send("Bad Request: Missing game ID");
        return;
      }

      const gameRef = await db.collection("games")
        .where("gameId", "==", gameId.toString())
        .limit(1)
        .get();

      if (gameRef.empty) {
        response.status(404).send("Game not found");
        return;
      }

      const gameData = gameRef.docs[0].data();
      if (!gameData.replay) {
        response.status(404).send("Replay not found");
        return;
      }

      response.status(200).json(gameData.replay);
    } catch (error) {
      console.error("getReplay error:", error);
      response.status(500).send("Error fetching replay");
    }
  });
});
