// src/lib/game-logic.ts

import type { GameState, Character, Player } from "./types";

export const characters: Character[] = [
	{
		name: "Gordon",
		weapon: "The Whiteboard Wipe",
		room: "The Creative Corner",
		backstory:
			"Gordon is the Creative Director who believes he's a modern-day Picasso, but his ideas are more like finger paintings.",
		motive:
			"When the victim accidentally spilled coffee on Gordon's latest 'masterpiece', Gordon panicked and used the Whiteboard Wipe to erase the evidence... and the victim!",
	},
	// Add other characters here...
];

export const clues = [
	"A coffee-stained whiteboard was found near the crime scene.",
	"The victim was last seen entering the Creative Corner.",
	"Traces of erasable marker ink were found on the victim's clothes.",
	"An overheard argument about 'ruining a masterpiece' occurred just before the murder.",
	"The murder weapon appears to be a common office supply item.",
];

export class GameManager {
	private gameState: GameState;
	private players: Map<string, Player>;
	private revealedClueCount: number;
	private votingOpen: boolean;
	private murderer: string;
	private clues: string[];

	constructor(characters: Character[], clues: string[]) {
		this.clues = clues;
		this.gameState = {
			characters,
			currentRound: 0,
			revealedClues: [],
			votes: {},
		};
		this.players = new Map();
		this.revealedClueCount = 0;
		this.votingOpen = false;
		this.murderer = this.selectRandomMurderer();
	}

	resetGame(characters: Character[], clues: string[]) {
		this.clues = clues;
		this.gameState = {
			characters,
			currentRound: 0,
			revealedClues: [],
			votes: {},
		};
		this.players = new Map();
		this.revealedClueCount = 0;
		this.votingOpen = false;
		this.murderer = this.selectRandomMurderer();
	}

	private selectRandomMurderer(): string {
		const randomIndex = Math.floor(
			Math.random() * this.gameState.characters.length,
		);
		return this.gameState.characters[randomIndex].name;
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
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			const player = this.players.get(playerId)!;
			player.hasVoted = true;
			this.players.set(playerId, player);
			return true;
		}
		return false;
	}

	getWinners(): Player[] {
		const winners: Player[] = [];
		for (const [playerId, characterName] of Object.entries(
			this.gameState.votes,
		)) {
			if (characterName === this.murderer) {
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

	getMurderer(): string {
		return this.murderer;
	}

	allPlayersVoted(): boolean {
		return this.getPlayers().every((player) => player.hasVoted);
	}

	allCluesRevealed(): boolean {
		return this.gameState.revealedClues.length === this.clues.length;
	}
}
