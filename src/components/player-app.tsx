import { useGame } from "@/hooks/use-game";
import { JoinGame } from "./join-game";
import { PlayerList } from "./player-list";
import { CluesList } from "./clue-list";
import { Separator } from "./ui/separator";
import { CharacterList } from "./character-list";
import { EndGameDialog } from "./end-game-dialog";
import { MessagePanel } from "./message-panel";

export function PlayerApp() {
	const { gameState, isJoined } = useGame();

	if (!isJoined) {
		return <JoinGame />;
	}

	if (!gameState) {
		return (
			<div className="text-center text-gold font-monoton">
				Loading game state...
			</div>
		);
	}

	return (
		<div className="container mx-auto p-4 space-y-8 bg-dark-green min-h-screen">
			<h1
				className="text-6xl text-center mb-8 font-monoton tracking-wide
        bg-clip-text text-transparent bg-gradient-to-r 
        from-yellow-400 via-yellow-200 to-yellow-400
        animate-shimmer"
				style={{
					backgroundSize: "200% 100%",
					animation: "shimmer 2s ease-in-out infinite",
				}}
			>
				Only Meetings in the Office
			</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				<div className="space-y-8 col-span-1">
					{/* <PlayerList /> */}
					{/* <CluesList /> */}
					<CharacterList />
				</div>
				<div className="col-span-1">
					<MessagePanel />
				</div>
			</div>
			<Separator className="bg-gold" />
			<EndGameDialog />
		</div>
	);
}
