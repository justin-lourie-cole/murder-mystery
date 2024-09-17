import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ShimmeringText } from "@/components/shimmering-text";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGame } from "@/hooks/use-game";

export function RevealedClues() {
	const { gameState } = useGame();

	if (!gameState) return null;

	return (
		<Card className="border-2">
			<CardHeader>
				<ShimmeringText tag="h3" className="mb-0">
					Revealed Clues
				</ShimmeringText>
			</CardHeader>
			<CardContent>
				<ScrollArea className="h-[200px]">
					{gameState.revealedClues.length > 0 ? (
						<ul className="space-y-2">
							{gameState.revealedClues.map((clue, index) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								<li key={`clue-${index}`} className="text-sm text-white">
									{clue}
								</li>
							))}
						</ul>
					) : (
						<p className="text-sm text-white">No clues revealed yet.</p>
					)}
				</ScrollArea>
			</CardContent>
		</Card>
	);
}
