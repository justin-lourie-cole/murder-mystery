import { describe, test, beforeAll, afterAll, expect, vi } from "vitest";
import { createServer, type Server as HTTPServer } from "node:http";
import { Server as IOServer, type Socket as ServerSocket } from "socket.io";
import { io as Client, type Socket as ClientSocket } from "socket.io-client";
import request from "supertest";
import express from "express";
import cors from "cors";
import type {
	ClientToServerEvents,
	InterServerEvents,
	ServerToClientEvents,
	SocketData,
} from "../../src/types";

const PORT = 3001;

// Setup a mock for GameManager
vi.mock("./src/game/game-manager", () => ({
	GameManager: vi.fn(() => ({
		addPlayer: vi.fn(),
		getPlayers: vi.fn(() => []),
		getGameState: vi.fn(() => ({ players: [], votes: {} })),
		revealNextClue: vi.fn(() => "Clue1"),
		openVoting: vi.fn(),
		castVote: vi.fn(() => true),
		closeVoting: vi.fn(),
		getWinners: vi.fn(() => ["Player1"]),
		getMurderer: vi.fn(() => "Murderer"),
		resetGame: vi.fn(),
		removePlayer: vi.fn(),
		allPlayersVoted: vi.fn(() => false),
		allCluesRevealed: vi.fn(() => false),
	})),
	characters: [],
	clues: [],
}));

let httpServer: HTTPServer;
let ioServer: IOServer;
let clientSocket: ClientSocket;

beforeAll(() => {
	const app = express();
	app.use(cors());

	httpServer = createServer(app);
	ioServer = new IOServer<
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

	httpServer.listen(PORT, () => {
		clientSocket = Client(`http://localhost:${PORT}`);
	});

	ioServer.on("connection", (socket: ServerSocket) => {
		socket.on("joinGame", () => {
			ioServer.emit("playerList", []);
		});

		socket.on("revealClue", () => {
			ioServer.emit("clueRevealed", "Clue1");
		});

		socket.on("vote", () => {
			ioServer.emit("votesUpdated", {});
		});

		socket.on("endGame", () => {
			ioServer.emit("gameEnded", {
				winners: ["Player1"],
				murderer: "Murderer",
			});
		});
	});
});

afterAll(() => {
	ioServer.close();
	clientSocket.close();
	httpServer.close();
});

describe("Server WebSocket tests", () => {
	test("should connect to the server", async () => {
		await new Promise<void>((resolve) => {
			clientSocket.on("connect", () => {
				expect(clientSocket.connected).toBe(true);
				resolve();
			});
		});
	});

	test("should join a game and receive player list", async () => {
		await new Promise<void>((resolve) => {
			clientSocket.emit("joinGame", "Player1");
			clientSocket.on("playerList", (players) => {
				expect(players).toEqual([]);
				resolve();
			});
		});
	});

	test("should reveal a clue", async () => {
		await new Promise<void>((resolve) => {
			clientSocket.emit("revealClue");
			clientSocket.on("clueRevealed", (clue) => {
				expect(clue).toBe("Clue1");
				resolve();
			});
		});
	});

	test("should cast a vote and receive updated votes", async () => {
		await new Promise<void>((resolve) => {
			clientSocket.emit("vote", "Character1");
			clientSocket.on("votesUpdated", (votes) => {
				expect(votes).toEqual({});
				resolve();
			});
		});
	});

	test("should end the game and receive game results", async () => {
		await new Promise<void>((resolve) => {
			clientSocket.emit("endGame");
			clientSocket.on("gameEnded", (data) => {
				expect(data).toEqual({ winners: ["Player1"], murderer: "Murderer" });
				resolve();
			});
		});
	});
});

describe("Server HTTP tests", () => {
	test("should respond with 404 on non-existing routes", async () => {
		const res = await request(httpServer).get("/non-existent");
		expect(res.status).toBe(404);
	});
});
