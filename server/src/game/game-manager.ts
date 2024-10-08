import type { GameState, Character, Player } from "@your-org/shared/types";
import { characters } from "./characters";

export class GameManager {
	private gameState: GameState;
	private players: Map<string, Player>;
	private revealedClueCount: number;
	private votingOpen: boolean;
	private murderer: Character;
	private clues: string[];

	constructor(characters: Character[], clues: string[]) {
		this.clues = clues;
		this.gameState = {
			characters,
			currentRound: 0,
			revealedClues: [],
			votes: {},
		};
		this.players = new Map<string, Player>();
		this.revealedClueCount = 0;
		this.votingOpen = false;
		this.murderer = this.selectMurderer();
	}

	resetGame(characters: Character[], clues: string[]) {
		this.clues = clues;
		this.gameState = {
			characters,
			currentRound: 0,
			revealedClues: [],
			votes: {},
		};
		this.players = new Map<string, Player>(); // Reinitialize as a new Map
		this.revealedClueCount = 0;
		this.votingOpen = false;
		this.murderer = this.selectMurderer();
	}

	private selectMurderer(): Character {
		const murderer = characters.find(
			(character) => character.name === "Shalini",
		);
		if (!murderer) {
			throw new Error("Murderer not found");
		}
		return murderer;
	}

	addPlayer(playerId: string, name: string): Player {
		const player: Player = { id: playerId, name, hasVoted: false };
		this.players.set(playerId, player);
		return player;
	}

	removePlayer(playerId: string) {
		this.players.delete(playerId);
		delete this.gameState.votes[playerId];
	}

	revealNextClue(): string | null {
		if (this.revealedClueCount < this.clues.length) {
			const newClue = this.clues[this.revealedClueCount];
			this.gameState.revealedClues.push(newClue);
			this.revealedClueCount++;
			this.gameState.currentRound++;
			return newClue;
		}
		return null;
	}

	openVoting() {
		this.votingOpen = true;
	}

	closeVoting() {
		this.votingOpen = false;
	}

	castVote(playerId: string, characterName: string): boolean {
		if (
			this.votingOpen &&
			this.players.has(playerId) &&
			!this.players.get(playerId)?.hasVoted
		) {
			this.gameState.votes[playerId] = characterName;
			const player = this.players.get(playerId);
			if (player) {
				player.hasVoted = true;
				this.players.set(playerId, player);
			}
			return true;
		}
		return false;
	}

	getWinners(): Player[] {
		const winners: Player[] = [];
		for (const [playerId, characterName] of Object.entries(
			this.gameState.votes,
		)) {
			if (characterName === this.murderer.name) {
				const player = this.players.get(playerId);
				if (player) {
					winners.push(player);
				}
			}
		}
		return winners;
	}

	getGameState(): GameState {
		return this.gameState;
	}

	getPlayers(): Player[] {
		return Array.from(this.players.values());
	}

	getMurderer(): Character {
		return this.murderer;
	}

	allPlayersVoted(): boolean {
		const players = this.getPlayers();
		return players.length > 0 && players.every((player) => player.hasVoted);
	}

	allCluesRevealed(): boolean {
		return this.gameState.revealedClues.length === this.clues.length;
	}

	getPlayerById(playerId: string): Player | undefined {
		return this.players.get(playerId);
	}
}
