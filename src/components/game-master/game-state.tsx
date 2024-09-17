import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ShimmeringText } from "@/components/shimmering-text";
import { useGame } from "@/hooks/use-game";

export function GameState() {
	const { gameState, votingOpen } = useGame();

	if (!gameState) return null;

	return (
		<Card>
			<CardHeader>
				<ShimmeringText tag="h3" className="mb-0">
					Game State
				</ShimmeringText>
			</CardHeader>
			<CardContent className="text-white">
				<p>Current Round: {gameState.currentRound}</p>
				<p>Voting Open: {votingOpen ? "Yes" : "No"}</p>
				<p>Revealed Clues: {gameState.revealedClues.length} / 5</p>
			</CardContent>
		</Card>
	);
}
