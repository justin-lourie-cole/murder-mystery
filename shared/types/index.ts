import type { Server, Socket } from "socket.io";

export interface Character {
	name: string;
	weapon: string;
	room: string;
	backstory: string;
	motive: string;
	class: string;
	level: number;
	imgSrc: string;
	imgAlt: string;
}

export interface Player {
	id: string;
	name: string;
	hasVoted: boolean;
}

export interface GameState {
	characters: Character[];
	currentRound: number;
	revealedClues: string[];
	votes: Record<string, string>;
}

export interface GameEndResult {
	winners: Player[];
	murderer: Character;
}

export interface ChatMessage {
	id: string;
	sender: string;
	content: string;
	timestamp: number;
}

export interface ServerToClientEvents {
	gameState: (state: GameState) => void;
	playerList: (players: Player[]) => void;
	clueRevealed: (clue: string) => void;
	votingOpened: () => void;
	votesUpdated: (votes: Record<string, string>) => void;
	gameEnded: (result: GameEndResult) => void;
	gameReset: (newGameState: GameState) => void;
	gameMasterConfirmation: () => void;
	error: (message: string) => void;
	chatMessage: (message: ChatMessage) => void;
}

export interface ClientToServerEvents {
	joinGame: (playerName: string) => void;
	revealClue: () => void;
	openVoting: () => void;
	vote: (characterName: string) => void;
	endGame: () => void;
	resetGame: () => void;
	getGameState: (callback: (gameState: GameState) => void) => void;
	joinAsGameMaster: () => void;
	sendChatMessage: (content: string) => void;
}

export interface InterServerEvents {
	ping: () => void;
}

export interface SocketData {
	name: string;
	age: number;
}

export type ServerSocket = Socket<
	ClientToServerEvents,
	ServerToClientEvents,
	InterServerEvents,
	SocketData
>;

export type ServerType = Server<
	ClientToServerEvents,
	ServerToClientEvents,
	InterServerEvents,
	SocketData
>;
