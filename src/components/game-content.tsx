import { useGame } from "@/hooks/use-game";
import { PlayerList } from "./player-list";
import { CluesList } from "./clue-list";
import { CharacterList } from "./character-list";
import { Separator } from "./ui/separator";
import { GameControls } from "./game-contols";
import { EndGameDialog } from "./end-game-dialog";

export default function GameContent() {
	const { gameState } = useGame();

	if (!gameState) {
		return (
			<div className="flex items-center justify-center h-screen">
				Loading...
			</div>
		);
	}

	return (
		<div className="container mx-auto p-4 space-y-8">
			<h1 className="text-4xl font-bold text-center mb-8">
				Murder Mystery Game
			</h1>
			<PlayerList />
			<CluesList />
			<CharacterList />
			<Separator />
			<GameControls />
			<EndGameDialog />
		</div>
	);
}
