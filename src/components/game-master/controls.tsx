import { Button } from "@/components/ui/button";
import { useGame } from "@/hooks/use-game";
import { toast } from "@/hooks/use-toast";

export function Controls() {
	const { gameState, votingOpen, revealClue, openVoting, endGame, resetGame } =
		useGame();

	const handleRevealClue = () => {
		if (gameState && gameState.revealedClues.length < 5) {
			revealClue();
		} else {
			toast({
				title: "Error",
				description: "All clues have been revealed.",
				variant: "destructive",
			});
		}
	};

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

	if (!gameState) return null;

	return (
		<div className="flex flex-wrap justify-between gap-4">
			<Button
				onClick={handleRevealClue}
				disabled={gameState.revealedClues.length >= 5}
				className="bg-gold text-dark-green hover:bg-light-gold"
			>
				Reveal Next Clue
			</Button>
			<Button
				onClick={handleOpenVoting}
				disabled={votingOpen}
				className="bg-gold text-dark-green hover:bg-light-gold"
			>
				Open Voting
			</Button>
			<Button
				onClick={endGame}
				variant="secondary"
				className="bg-light-gold text-dark-green hover:bg-gold"
			>
				End Game
			</Button>
			<Button
				onClick={resetGame}
				variant="destructive"
				className="bg-red-900 text-gold hover:bg-red-800"
			>
				Reset Game
			</Button>
		</div>
	);
}
