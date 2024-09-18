import { useGame } from "@/hooks/use-game";
import { JoinGame } from "@/components/player/join-game";
// import { PlayerList } from "@components/player-list";
// import { CluesList } from "@components/clue-list";
import { Separator } from "@/components/ui/separator";
import { CharacterList } from "@/components/player/character-list";
import { EndGameDialog } from "@/components/end-game-dialog";
import { MessagePanel } from "@/components/message-panel";
import { ShimmeringText } from "@/components/shimmering-text";
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";

export function PlayerApp() {
	const { gameState, isJoined, votingOpen } = useGame();

	// trigger toast if voting is open
	useEffect(() => {
		if (votingOpen) {
			toast({
				variant: "destructive",
				title: "Voting is open!",
				description: "You can now vote for your favorite character.",
			});
		}
	}, [votingOpen]);

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
