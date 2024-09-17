import { GameContext } from "@/context/game-context";
import { toast } from "@/hooks/use-toast";
import type {
	ChatMessage,
	ClientToServerEvents,
	GameState,
	Player,
	ServerToClientEvents,
} from "@shared/types";
import { useCallback, useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:3001";

export function GameProvider({ children }: { children: React.ReactNode }) {
	const [socket, setSocket] = useState<Socket<
		ServerToClientEvents,
		ClientToServerEvents
	> | null>(null);
	const [gameState, setGameState] = useState<GameState | null>(null);
	const [players, setPlayers] = useState<Player[]>([]);
	const [isJoined, setIsJoined] = useState(false);
	const [isGameMaster, setIsGameMaster] = useState(false);
	const [votingOpen, setVotingOpen] = useState(false);
	const [winners, setWinners] = useState<Player[]>([]);
	const [murderer, setMurderer] = useState<string | null>(null);
	const [showEndGameDialog, setShowEndGameDialog] = useState(false);
	const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

	useEffect(() => {
		const newSocket = io(SOCKET_SERVER_URL, {
			transports: ["websocket", "polling"],
		});
		setSocket(newSocket);

		return () => {
			newSocket.disconnect();
		};
	}, []);

	useEffect(() => {
		if (!socket) return;

		socket.on("gameState", (state: GameState) => {
			console.log("Received game state:", state);
			setGameState(state);
		});

		socket.on("playerList", (updatedPlayers: Player[]) => {
			setPlayers(updatedPlayers);
		});

		socket.on("clueRevealed", (clue: string) => {
			console.log("New clue revealed:", clue);
			setGameState((prevState) =>
				prevState
					? { ...prevState, revealedClues: [...prevState.revealedClues, clue] }
					: null,
			);
		});

		socket.on("votingOpened", () => {
			setVotingOpen(true);
		});

		socket.on("votesUpdated", (votes: Record<string, string>) => {
			console.log("Votes updated:", votes);
			setGameState((prevState) => (prevState ? { ...prevState, votes } : null));
		});

		socket.on("gameEnded", ({ winners, murderer }) => {
			setWinners(winners);
			setMurderer(murderer);
			setShowEndGameDialog(true);
			setVotingOpen(false);
		});

		socket.on("gameReset", (newGameState: GameState) => {
			setGameState(newGameState);
			setVotingOpen(false);
			setWinners([]);
			setMurderer(null);
			setShowEndGameDialog(false);
		});

		socket.on("gameMasterConfirmation", () => {
			setIsGameMaster(true);
			setIsJoined(true);
		});

		socket.on("error", (message: string) => {
			console.error("Socket error:", message);
			toast({
				title: "Error",
				description: message,
				variant: "destructive",
			});
		});

		socket.on("chatMessage", (message: ChatMessage) => {
			setChatMessages((prevMessages) => [...prevMessages, message]);
		});

		return () => {
			socket.off("gameState");
			socket.off("playerList");
			socket.off("clueRevealed");
			socket.off("votingOpened");
			socket.off("votesUpdated");
			socket.off("gameEnded");
			socket.off("gameReset");
			socket.off("gameMasterConfirmation");
			socket.off("chatMessage");
			socket.off("error");
		};
	}, [socket]);

	const fetchGameState = useCallback(() => {
		if (socket) {
			socket.emit("getGameState", (state: GameState) => {
				setGameState(state);
			});
		}
	}, [socket]);

	const joinGame = useCallback(
		(playerName: string) => {
			if (socket && playerName) {
				socket.emit("joinGame", playerName);
				setIsJoined(true);
			}
		},
		[socket],
	);

	const joinAsGameMaster = useCallback(() => {
		if (socket) {
			socket.emit("joinAsGameMaster");
		}
	}, [socket]);

	const revealClue = useCallback(() => {
		if (socket) {
			socket.emit("revealClue");
		}
	}, [socket]);

	const openVoting = useCallback(() => {
		if (socket) {
			socket.emit("openVoting");
		}
	}, [socket]);

	const vote = useCallback(
		(characterName: string) => {
			if (socket) {
				socket.emit("vote", characterName);
			}
		},
		[socket],
	);

	const endGame = useCallback(() => {
		if (socket) {
			socket.emit("endGame");
		}
	}, [socket]);

	const resetGame = useCallback(() => {
		if (socket) {
			socket.emit("resetGame");
		}
	}, [socket]);

	const sendChatMessage = useCallback(
		(content: string) => {
			if (socket) {
				socket.emit("sendChatMessage", content);
			}
		},
		[socket],
	);

	const value = {
		gameState,
		players,
		isJoined,
		votingOpen,
		winners,
		murderer,
		showEndGameDialog,
		joinGame,
		revealClue,
		openVoting,
		vote,
		endGame,
		resetGame,
		setShowEndGameDialog,
		fetchGameState,
		chatMessages,
		sendChatMessage,
		isGameMaster,
		joinAsGameMaster,
	};

	return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
