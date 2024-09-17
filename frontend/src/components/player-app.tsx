import { useGame } from "@/hooks/use-game";
import { JoinGame } from "./join-game";
// import { PlayerList } from "./player-list";
// import { CluesList } from "./clue-list";
import { Separator } from "./ui/separator";
import { CharacterList } from "./character-list";
import { EndGameDialog } from "./end-game-dialog";
import { MessagePanel } from "./message-panel";
import { ShimmeringText } from "./shimmering-text";

export function PlayerApp() {
	const { gameState, isJoined } = useGame();

	if (!isJoined) {
		return <JoinGame />;
	}

	if (!gameState) {
		return (
			<div className="text-center  font-heading">Loading game state...</div>
		);
	}

	return (
		<div className="container mx-auto p-4 space-y-8 min-h-screen">
			<ShimmeringText tag="h1">Only Meetings in the Office</ShimmeringText>
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
			<Separator />
			<EndGameDialog />
		</div>
	);
}
