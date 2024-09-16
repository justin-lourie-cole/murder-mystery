import { createContext } from "react";
import type { GameState, Player } from "@/types";

interface GameContextType {
	gameState: GameState | null;
	players: Player[];
	isJoined: boolean;
	isGameMaster: boolean;
	votingOpen: boolean;
	winners: Player[];
	murderer: string | null;
	showEndGameDialog: boolean;
	joinGame: (playerName: string) => void;
	joinAsGameMaster: () => void;
	revealClue: () => void;
	openVoting: () => void;
	vote: (characterName: string) => void;
	endGame: () => void;
	resetGame: () => void;
	setShowEndGameDialog: (show: boolean) => void;
	fetchGameState: () => void;
	sendChatMessage: (content: string) => void;
	chatMessages: ChatMessage[];
}

export const GameContext = createContext<GameContextType | undefined>(
	undefined,
);
