import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useGame } from "@/lib/game-context";

export default function GameControls() {
	const { openVoting, endGame, resetGame, votingOpen, gameState } = useGame();
	const { toast } = useToast();

	const handleOpenVoting = () => {
		if (gameState && gameState.revealedClues.length > 0) {
			openVoting();
		} else {
			toast({
				title: "Error",
				description: "Reveal at least one clue before opening voting.",
				variant: "destructive",
			});
		}
	};

	return (
		<div className="flex justify-between">
			<Button onClick={handleOpenVoting} disabled={votingOpen}>
				Open Voting
			</Button>
			<Button onClick={endGame} variant="secondary">
				End Game
			</Button>
			<Button onClick={resetGame} variant="destructive">
				Reset Game
			</Button>
		</div>
	);
}
