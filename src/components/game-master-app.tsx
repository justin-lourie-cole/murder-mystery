"use client";

import { Separator } from "@/components/ui/separator";
import { useGame } from "@/hooks/use-game";
import { useEffect } from "react";
import { ShimmeringText } from "./shimmering-text";
import { GameState } from "./game-master/game-state";
import { PlayerList } from "./player-list";
import { RevealedClues } from "./game-master/revealed-clues";
import { Controls } from "./game-master/controls";
import { Votes } from "./game-master/votes";
import { EndGameDialog } from "./end-game-dialog";
import { MessagePanel } from "./message-panel";

export function GameMasterApp() {
	const { votingOpen, fetchGameState, joinAsGameMaster } = useGame();

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
					<GameState />
					<RevealedClues />
					{votingOpen && <Votes />}
				</div>
				<div className="space-y-8 col-span-1">
					<PlayerList />
					<MessagePanel />
				</div>
			</div>
			<Separator className="bg-gold" />
			<Controls />
			<EndGameDialog />
		</div>
	);
}
