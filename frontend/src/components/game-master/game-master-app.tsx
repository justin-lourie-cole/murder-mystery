import { Separator } from "@/components/ui/separator";
import { useGame } from "@/hooks/use-game";
import { useEffect } from "react";
import { ShimmeringText } from "@/components/shimmering-text";
// import { GameState } from "@/components/game-master/game-state";
import { PlayerList } from "@/components/game-master/player-list";
import { RevealedClues } from "@/components/game-master/revealed-clues";
import { Controls } from "@/components/game-master/controls";
// import { Votes } from "@/components/game-master/votes";
import { EndGameDialog } from "@/components/end-game-dialog";
import { MessagePanel } from "@/components/message-panel";

export function GameMasterApp() {
	const { fetchGameState, joinAsGameMaster } = useGame();

	useEffect(() => {
		console.log("Joining as gameMaster");
		joinAsGameMaster();
	}, [joinAsGameMaster]);

	useEffect(() => {
		fetchGameState();
	}, [fetchGameState]);

	return (
		<div className="container mx-auto p-4 space-y-8 min-h-screen">
			<ShimmeringText tag="h1">Control Panel</ShimmeringText>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				<div className="space-y-8 col-span-1">
					{/* <GameState /> */}
					<PlayerList />
					<RevealedClues />
					<Separator />
					<Controls />
					{/* {votingOpen && <Votes />} */}
				</div>
				<div className="space-y-8 col-span-1">
					<MessagePanel />
				</div>
			</div>
			<EndGameDialog />
		</div>
	);
}
