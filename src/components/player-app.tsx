import { useGame } from "@/hooks/use-game";
import JoinGame from "./join-game";
import PlayerList from "./player-list";
import CluesList from "./clue-list";
import { Separator } from "./ui/separator";
import CharacterList from "./character-list";
import EndGameDialog from "./end-game-dialog";

export function PlayerApp() {
	const { gameState, isJoined } = useGame();

	if (!isJoined) {
		return <JoinGame />;
	}

	if (!gameState) {
		return <div className="text-center">Loading game state...</div>;
	}

	return (
		<div className="container mx-auto p-4 space-y-8">
			<h1 className="text-4xl font-bold text-center mb-8">
				Murder Mystery Game
			</h1>
			{/* <GameStatus /> */}
			<PlayerList />
			<CluesList />
			<Separator />
			<CharacterList />
			<EndGameDialog />
		</div>
	);
}
