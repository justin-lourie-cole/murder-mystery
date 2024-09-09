import { GameProvider, useGame } from "@/context/game-context";
import { JoinGame } from "./join-game";
import { PlayerList } from "./player-list";
import { CluesList } from "./clue-list";
import { Separator } from "./ui/separator";
import { CharacterList } from "./character-list";
import { EndGameDialog } from "./end-game-dialog";
import { MessagePanel } from "./message-panel";

function PlayerContent() {
	const { gameState, isJoined } = useGame();

	if (!isJoined) {
		return <JoinGame />;
	}

	if (!gameState) {
		return <div className="text-center text-gold">Loading game state...</div>;
	}

	return (
		<div className="container mx-auto p-4 space-y-8 bg-dark-green min-h-screen">
			<h1 className="text-6xl font-bold text-center mb-8 text-gold font-serif tracking-wide">
				Murder Mystery Game
			</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				<div className="space-y-8">
					<PlayerList />
					<CluesList />
					<CharacterList />
				</div>
				<div>
					<MessagePanel />
				</div>
			</div>
			<Separator className="border-gold" />
			<EndGameDialog />
		</div>
	);
}

export function PlayerApp() {
	return (
		<GameProvider>
			<PlayerContent />
		</GameProvider>
	);
}
