import { characters as charactersData } from "./../../src/game/characters";
import { clues as cluesData } from "./../../src/game/clues";
import { GameManager } from "../../src/game/game-manager";
import type { Character } from "../../src/types";
import { describe, expect, beforeEach, test } from "vitest";

describe("GameManager", () => {
	let gameManager: GameManager;
	const characters: Character[] = charactersData;
	const clues: string[] = cluesData;

	beforeEach(() => {
		gameManager = new GameManager(characters, clues);
	});

	test("initializes with the correct murderer", () => {
		expect(gameManager.getMurderer()).toBe("Shalini");
	});

	test("resetGame sets the murderer to Shalini", () => {
		// Optionally modify game state before reset if needed
		gameManager.resetGame(characters, clues);
		expect(gameManager.getMurderer()).toBe("Shalini");
	});

	test("addPlayer correctly adds a player", () => {
		const player = gameManager.addPlayer("1", "Su");
		expect(player).toEqual({ id: "1", name: "Su", hasVoted: false });
		expect(gameManager.getPlayers()).toContainEqual(player);
	});

	test("removePlayer correctly removes a player", () => {
		gameManager.addPlayer("1", "Su");
		gameManager.removePlayer("1");
		expect(gameManager.getPlayers()).toHaveLength(0);
	});

	test("revealNextClue reveals clues in order", () => {
		expect(gameManager.revealNextClue()).toBe(
			"A coffee-stained whiteboard was found near the crime scene.",
		);
		expect(gameManager.revealNextClue()).toBe(
			"The victim was last seen entering the Creative Corner.",
		);
		expect(gameManager.revealNextClue()).toBe(
			"Traces of erasable marker ink were found on the victim's clothes.",
		);
		expect(gameManager.revealNextClue()).toBe(
			"An overheard argument about 'ruining a masterpiece' occurred just before the murder.",
		);
		expect(gameManager.revealNextClue()).toBe(
			"The murder weapon appears to be a common office supply item.",
		);
		expect(gameManager.revealNextClue()).toBeNull();
	});

	test("castVote allows a player to vote for Shalini", () => {
		gameManager.addPlayer("1", "Su");
		gameManager.openVoting();
		const voteResult = gameManager.castVote("1", "Shalini");
		expect(voteResult).toBe(true);
		expect(gameManager.getGameState().votes["1"]).toBe("Shalini");
		expect(gameManager.getPlayers()[0].hasVoted).toBe(true);
	});

	test("castVote allows a player to vote for a non-murderer but does not affect winners", () => {
		gameManager.addPlayer("1", "Su");
		gameManager.openVoting();
		const voteResult = gameManager.castVote("1", "Gordon");
		expect(voteResult).toBe(true);
		expect(gameManager.getGameState().votes["1"]).toBe("Gordon");
		expect(gameManager.getPlayers()[0].hasVoted).toBe(true);

		const winners = gameManager.getWinners();
		expect(winners).toHaveLength(0);
	});

	test("castVote rejects a vote if voting is closed", () => {
		gameManager.addPlayer("1", "Su");
		const voteResult = gameManager.castVote("1", "Shalini");
		expect(voteResult).toBe(false);
		expect(gameManager.getGameState().votes["1"]).toBeUndefined();
	});

	test("castVote rejects a vote if player has already voted", () => {
		gameManager.addPlayer("1", "Su");
		gameManager.openVoting();
		const firstVote = gameManager.castVote("1", "Shalini");
		const secondVote = gameManager.castVote("1", "Gordon");
		expect(firstVote).toBe(true);
		expect(secondVote).toBe(false);
		expect(gameManager.getGameState().votes["1"]).toBe("Shalini");
	});

	test("getWinners correctly identifies players who voted for Shalini", () => {
		gameManager.addPlayer("1", "Su");
		gameManager.addPlayer("2", "Mike");
		gameManager.openVoting();
		gameManager.castVote("1", "Shalini");
		gameManager.castVote("2", "Justin");
		const winners = gameManager.getWinners();
		expect(winners).toHaveLength(1);
		expect(winners[0].name).toBe("Su");
	});

	test("allPlayersVoted returns true when all players have voted", () => {
		gameManager.addPlayer("1", "Su");
		gameManager.addPlayer("2", "Mike");
		gameManager.openVoting();
		gameManager.castVote("1", "Shalini");
		gameManager.castVote("2", "Shalini");
		expect(gameManager.allPlayersVoted()).toBe(true);
	});

	test("allPlayersVoted returns false when not all players have voted", () => {
		gameManager.addPlayer("1", "Su");
		gameManager.addPlayer("2", "Mike");
		gameManager.openVoting();
		gameManager.castVote("1", "Shalini");
		expect(gameManager.allPlayersVoted()).toBe(false);
	});

	test("allCluesRevealed returns true when all clues are revealed", () => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		for (const _ of clues) {
			gameManager.revealNextClue();
		}
		expect(gameManager.allCluesRevealed()).toBe(true);
	});

	test("allCluesRevealed returns false when not all clues are revealed", () => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		for (const _ of clues.slice(0, 3)) {
			gameManager.revealNextClue();
		}
		expect(gameManager.allCluesRevealed()).toBe(false);
	});

	test("getGameState returns the current game state", () => {
		expect(gameManager.getGameState()).toEqual({
			characters,
			currentRound: 0,
			revealedClues: [],
			votes: {},
		});
	});

	test("getPlayers returns all current players", () => {
		gameManager.addPlayer("1", "Su");
		gameManager.addPlayer("2", "Mike");
		const players = gameManager.getPlayers();
		expect(players).toHaveLength(2);
		expect(players).toEqual(
			expect.arrayContaining([
				{ id: "1", name: "Su", hasVoted: false },
				{ id: "2", name: "Mike", hasVoted: false },
			]),
		);
	});

	test("removePlayer also removes their vote", () => {
		gameManager.addPlayer("1", "Su");
		gameManager.addPlayer("2", "Mike");
		gameManager.openVoting();
		gameManager.castVote("1", "Shalini");
		gameManager.castVote("2", "Gordon");
		gameManager.removePlayer("1");
		expect(gameManager.getPlayers()).toHaveLength(1);
		expect(gameManager.getGameState().votes["1"]).toBeUndefined();
		expect(gameManager.getGameState().votes["2"]).toBe("Gordon");
	});

	// ========== Additional Tests Start Here ==========

	test("addPlayer with an existing ID updates the player", () => {
		gameManager.addPlayer("1", "Alice");
		const updatedPlayer = gameManager.addPlayer("1", "Alicia");

		expect(updatedPlayer).toEqual({ id: "1", name: "Alicia", hasVoted: false });
		expect(gameManager.getPlayers()).toHaveLength(1);
		expect(gameManager.getPlayers()[0].name).toBe("Alicia");
	});

	test("castVote allows a player to vote for a non-existent character", () => {
		gameManager.addPlayer("1", "Alice");
		gameManager.openVoting();
		const voteResult = gameManager.castVote("1", "NonExistentCharacter");

		// Depending on implementation, adjust the expected behavior
		// Here, assuming it still allows the vote but doesn't affect winners
		expect(voteResult).toBe(true);
		expect(gameManager.getGameState().votes["1"]).toBe("NonExistentCharacter");
		expect(gameManager.getPlayers()[0].hasVoted).toBe(true);

		const winners = gameManager.getWinners();
		expect(winners).toHaveLength(0);
	});

	test("removePlayer gracefully handles non-existent player", () => {
		expect(() => {
			gameManager.removePlayer("999");
		}).not.toThrow();

		expect(gameManager.getPlayers()).toHaveLength(0);
	});

	test("multiple players can cast votes independently", () => {
		gameManager.addPlayer("1", "Alice");
		gameManager.addPlayer("2", "Bob");
		gameManager.openVoting();

		const voteResult1 = gameManager.castVote("1", "Shalini");
		const voteResult2 = gameManager.castVote("2", "Shalini");

		expect(voteResult1).toBe(true);
		expect(voteResult2).toBe(true);
		expect(gameManager.getGameState().votes["1"]).toBe("Shalini");
		expect(gameManager.getGameState().votes["2"]).toBe("Shalini");
		expect(gameManager.getPlayers()[0].hasVoted).toBe(true);
		expect(gameManager.getPlayers()[1].hasVoted).toBe(true);

		const winners = gameManager.getWinners();
		expect(winners).toHaveLength(2);
		expect(winners).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ name: "Alice" }),
				expect.objectContaining({ name: "Bob" }),
			]),
		);
	});

	test("resetGame clears all game data and sets murderer correctly", () => {
		// Setup initial state
		gameManager.addPlayer("1", "Alice");
		gameManager.addPlayer("2", "Bob");
		gameManager.openVoting();
		gameManager.castVote("1", "Shalini");
		gameManager.castVote("2", "Gordon");
		gameManager.revealNextClue();

		// Reset the game
		gameManager.resetGame(characters, clues);

		// Assertions after reset
		expect(gameManager.getMurderer()).toBe("Shalini");
		expect(gameManager.getPlayers()).toHaveLength(0);
		expect(gameManager.getGameState().votes).toEqual({});
		expect(gameManager.getGameState().revealedClues).toEqual([]);
		expect(gameManager.getGameState().currentRound).toBe(0);
		expect(gameManager.allPlayersVoted()).toBe(false);
		expect(gameManager.allCluesRevealed()).toBe(false);
	});

	test("revealNextClue reveals clues in exact order without skipping", () => {
		const expectedClues = clues;

		for (const clue of expectedClues) {
			expect(gameManager.revealNextClue()).toBe(clue);
		}

		// No more clues should be available
		expect(gameManager.revealNextClue()).toBeNull();
		// Verify that currentRound matches the number of clues
		expect(gameManager.getGameState().currentRound).toBe(expectedClues.length);
	});

	test("prevent adding duplicate players with the same ID", () => {
		gameManager.addPlayer("1", "Alice");

		// Attempt to add another player with the same ID
		gameManager.addPlayer("1", "Alicia");

		// Depending on implementation, it might update or ignore the add
		// Here, assuming it updates the player
		expect(gameManager.getPlayers()).toHaveLength(1);
		expect(gameManager.getPlayers()[0].name).toBe("Alicia");
	});

	test("voting state is correctly handled after game reset", () => {
		// Setup initial voting
		gameManager.addPlayer("1", "Alice");
		gameManager.openVoting();
		gameManager.castVote("1", "Shalini");

		// Reset the game
		gameManager.resetGame(characters, clues);

		// Add a new player after reset
		gameManager.addPlayer("2", "Bob");

		// Attempt to cast a vote without reopening voting
		const voteResult = gameManager.castVote("2", "Shalini");
		expect(voteResult).toBe(false);

		// Ensure no votes are present
		expect(gameManager.getGameState().votes).toEqual({});

		// Open voting again and cast a vote
		gameManager.openVoting();
		const newVoteResult = gameManager.castVote("2", "Shalini");
		expect(newVoteResult).toBe(true);

		// Check that the vote was recorded
		expect(gameManager.getGameState().votes["2"]).toBe("Shalini");
	});
});
