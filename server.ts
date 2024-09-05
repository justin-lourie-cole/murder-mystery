import express from "express";
import { createServer } from "node:http";
import { Server, type Socket } from "socket.io";
import cors from "cors";
import type {
	ServerToClientEvents,
	ClientToServerEvents,
	InterServerEvents,
	SocketData,
} from "./src/types";
import { characters, clues, GameManager } from "./src/game";

const PORT = 3001;

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server<
	ClientToServerEvents,
	ServerToClientEvents,
	InterServerEvents,
	SocketData
>(httpServer, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
		credentials: true,
	},
});

const gameManager = new GameManager(characters, clues);

function checkGameEnd() {
	if (gameManager.allPlayersVoted() || gameManager.allCluesRevealed()) {
		gameManager.closeVoting();
		const winners = gameManager.getWinners();
		const murderer = gameManager.getMurderer();
		io.emit("gameEnded", { winners, murderer });
	}
}

io.on("connection", (socket: Socket) => {
	console.log("A user connected");

	socket.on("joinGame", (playerName) => {
		try {
			gameManager.addPlayer(socket.id, playerName);
			socket.emit("gameState", gameManager.getGameState());
			io.emit("playerList", gameManager.getPlayers());
			console.log(`${playerName} joined the game`);
		} catch (error) {
			console.error("Error joining game:", error);
			socket.emit("error", "Failed to join the game");
		}
	});

	socket.on("getGameState", (callback) => {
		try {
			const gameState = gameManager.getGameState();
			callback(gameState);
		} catch (error) {
			console.error("Error getting game state:", error);
			socket.emit("error", "Failed to get game state");
		}
	});

	socket.on("revealClue", () => {
		try {
			const newClue = gameManager.revealNextClue();
			if (newClue) {
				io.emit("clueRevealed", newClue);
				io.emit("gameState", gameManager.getGameState());
				checkGameEnd();
			}
		} catch (error) {
			console.error("Error revealing clue:", error);
			socket.emit("error", "Failed to reveal clue");
		}
	});

	socket.on("openVoting", () => {
		try {
			gameManager.openVoting();
			io.emit("votingOpened");
		} catch (error) {
			console.error("Error opening voting:", error);
			socket.emit("error", "Failed to open voting");
		}
	});

	socket.on("vote", (characterName) => {
		try {
			const voteSuccessful = gameManager.castVote(socket.id, characterName);
			if (voteSuccessful) {
				io.emit("votesUpdated", gameManager.getGameState().votes);
				io.emit("playerList", gameManager.getPlayers());
				checkGameEnd();
			}
		} catch (error) {
			console.error("Error casting vote:", error);
			socket.emit("error", "Failed to cast vote");
		}
	});

	socket.on("endGame", () => {
		try {
			gameManager.closeVoting();
			const winners = gameManager.getWinners();
			const murderer = gameManager.getMurderer();
			io.emit("gameEnded", { winners, murderer });
		} catch (error) {
			console.error("Error ending game:", error);
			socket.emit("error", "Failed to end game");
		}
	});

	socket.on("resetGame", () => {
		try {
			gameManager.resetGame(characters, clues);
			io.emit("gameReset", gameManager.getGameState());
			io.emit("playerList", gameManager.getPlayers());
		} catch (error) {
			console.error("Error resetting game:", error);
			socket.emit("error", "Failed to reset game");
		}
	});

	socket.on("disconnect", () => {
		console.log("User disconnected");
		try {
			gameManager.removePlayer(socket.id);
			io.emit("playerList", gameManager.getPlayers());
		} catch (error) {
			console.error("Error removing player:", error);
		}
	});
});

httpServer.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
