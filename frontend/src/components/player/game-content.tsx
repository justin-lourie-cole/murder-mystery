import { useGame } from "@/hooks/use-game";
import { PlayerList } from "@/components/game-master/player-list";
import { CluesList } from "@/components/game-master/clue-list";
import { CharacterList } from "@/components/player/character-list";
import { Separator } from "@/components/ui/separator";
import { Controls } from "@/components/game-master/controls";
import { EndGameDialog } from "@/components/end-game-dialog";

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
			<Controls />
			<EndGameDialog />
		</div>
	);
}
