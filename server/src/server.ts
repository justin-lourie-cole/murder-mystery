import express from "express";
import { createServer } from "node:http";
import { Server, type Socket } from "socket.io";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import type {
	ServerToClientEvents,
	ClientToServerEvents,
	InterServerEvents,
	SocketData,
	ChatMessage,
} from "../../shared/types";
import { characters, clues, GameManager } from "./game";

const PORT = process.env.PORT || 3001;

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
let gameMasterId: string | null = null;

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

	socket.on("joinAsGameMaster", () => {
		if (gameMasterId) {
			socket.emit("error", "Game Master already exists");
			return;
		}
		gameMasterId = socket.id;
		socket.emit("gameMasterConfirmation");
		socket.emit("gameState", gameManager.getGameState());
		io.emit("playerList", gameManager.getPlayers());
		console.log("Game Master joined");
	});

	socket.on("joinGame", (playerName) => {
		if (socket.id === gameMasterId) {
			socket.emit("error", "Game Master cannot join as a player");
			return;
		}
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
		if (socket.id !== gameMasterId) {
			socket.emit("error", "Only the Game Master can reveal clues");
			return;
		}
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
		if (socket.id !== gameMasterId) {
			socket.emit("error", "Only the Game Master can open voting");
			return;
		}
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

	socket.on("sendChatMessage", (content: string) => {
		try {
			const player = gameManager.getPlayerById(socket.id);
			if (!player) {
				socket.emit("error", "Player not found");
				return;
			}
			const chatMessage: ChatMessage = {
				id: uuidv4(),
				sender: player.name,
				content,
				timestamp: Date.now(),
			};

			io.emit("chatMessage", chatMessage);
		} catch (error) {
			console.error("Error sending chat message:", error);
			socket.emit("error", "Failed to send chat message");
		}
	});

	socket.on("disconnect", () => {
		console.log("User disconnected");
		if (socket.id === gameMasterId) {
			gameMasterId = null;
			console.log("Game Master disconnected");
		} else {
			try {
				gameManager.removePlayer(socket.id);
				io.emit("playerList", gameManager.getPlayers());
			} catch (error) {
				console.error("Error removing player:", error);
			}
		}
	});
});

httpServer.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
