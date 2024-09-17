import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ShimmeringText } from "@/components/shimmering-text";
import { useGame } from "@/hooks/use-game";

export function Votes() {
	const { gameState, players } = useGame();

	if (!gameState) return null;

	return (
		<Card className="border-2 border-gold bg-dark-green">
			<CardHeader>
				<ShimmeringText tag="h3" className="mb-0">
					Votes
				</ShimmeringText>
			</CardHeader>
			<CardContent>
				<ul>
					{Object.entries(gameState.votes).map(([playerId, characterName]) => (
						<li key={`vote-${playerId}`} className="text-light-gold">
							{players.find((p) => p.id === playerId)?.name} voted for{" "}
							{characterName}
						</li>
					))}
				</ul>
			</CardContent>
		</Card>
	);
}
