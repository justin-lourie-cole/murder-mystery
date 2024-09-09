import type React from "react";
import {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
} from "react";
import { io, type Socket } from "socket.io-client";
import type {
	ServerToClientEvents,
	ClientToServerEvents,
	GameState,
	Player,
	ChatMessage,
} from "@/types";
import { useToast } from "@/hooks/use-toast";

const SOCKET_SERVER_URL = "http://localhost:3001";

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

const GameContext = createContext<GameContextType | undefined>(undefined);

export function useGame() {
	const context = useContext(GameContext);
	if (context === undefined) {
		throw new Error("useGame must be used within a GameProvider");
	}
	return context;
}

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

	const { toast } = useToast();

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
	}, [socket, toast]);

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
		isGameMaster,
		votingOpen,
		winners,
		murderer,
		showEndGameDialog,
		joinGame,
		joinAsGameMaster,
		revealClue,
		openVoting,
		vote,
		endGame,
		resetGame,
		setShowEndGameDialog,
		fetchGameState,
		sendChatMessage,
		chatMessages,
	};

	return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
