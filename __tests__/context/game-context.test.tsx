import React from "react";
import { render, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { GameProvider } from "../../src/providers/game-provider";
import { useGame } from "../../src/hooks/use-game";
import { io } from "socket.io-client";
import type { GameState, Player } from "../../src/types";

// Mock socket.io-client
vi.mock("socket.io-client");

// Test component to access context
const TestComponent = () => {
	const game = useGame();
	return <div data-testid="test-component">{JSON.stringify(game)}</div>;
};

describe("GameProvider", () => {
	let mockSocket: any;

	beforeEach(() => {
		// Reset mocks before each test
		mockSocket = {
			on: vi.fn(),
			emit: vi.fn(),
			off: vi.fn(),
			disconnect: vi.fn(),
		};
		(io as any).mockReturnValue(mockSocket);
		vi.clearAllMocks();
	});

	it("initializes with default values", () => {
		const { getByTestId } = render(
			<GameProvider>
				<TestComponent />
			</GameProvider>,
		);

		const component = getByTestId("test-component");
		const contextValue = JSON.parse(component.textContent || "");

		// Ensure the default values match those in your GameProvider
		expect(contextValue.gameState).toBeNull();
		expect(contextValue.players).toEqual([]);
		expect(contextValue.isJoined).toBe(false);
		expect(contextValue.votingOpen).toBe(false);
	});

	it("updates game state when receiving gameState event", async () => {
		const { getByTestId } = render(
			<GameProvider>
				<TestComponent />
			</GameProvider>,
		);

		const newGameState: GameState = {
			characters: [],
			currentRound: 0,
			revealedClues: [],
			votes: {},
		};

		await act(async () => {
			// Trigger the gameState event
			const gameStateCallback = mockSocket.on.mock.calls.find(
				(call: any[]) => call[0] === "gameState",
			)[1];
			gameStateCallback(newGameState);
		});

		const component = getByTestId("test-component");
		const contextValue = JSON.parse(component.textContent || "");

		expect(contextValue.gameState).toEqual(newGameState);
	});

	it("updates players when receiving playerList event", async () => {
		const { getByTestId } = render(
			<GameProvider>
				<TestComponent />
			</GameProvider>,
		);

		const newPlayers: Player[] = [
			{ id: "1", name: "Player 1", hasVoted: false },
			{ id: "2", name: "Player 2", hasVoted: false },
		];

		await act(async () => {
			// Trigger the playerList event
			const playerListCallback = mockSocket.on.mock.calls.find(
				(call: any[]) => call[0] === "playerList",
			)[1];
			playerListCallback(newPlayers);
		});

		const component = getByTestId("test-component");
		const contextValue = JSON.parse(component.textContent || "");

		expect(contextValue.players).toEqual(newPlayers);
	});

	it("calls socket.emit when joining a game", async () => {
		const { getByTestId } = render(
			<GameProvider>
				<TestComponent />
			</GameProvider>,
		);

		const component = getByTestId("test-component");
		const contextValue = JSON.parse(component.textContent || "");

		await act(async () => {
			contextValue.joinGame("TestPlayer");
		});

		expect(mockSocket.emit).toHaveBeenCalledWith("joinGame", "TestPlayer");
	});
});
