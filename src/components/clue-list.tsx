import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGame } from "@/hooks/use-game";

export function CluesList() {
	const { gameState } = useGame();

	if (!gameState) return null;

	return (
		<Card className="border-2 border-gold bg-dark-green">
			<CardHeader>
				<CardTitle className="text-2xl text-gold font-serif">Clues</CardTitle>
			</CardHeader>
			<CardContent>
				<ScrollArea className="h-[200px] w-full rounded-md border border-gold p-4">
					{gameState.revealedClues.length > 0 ? (
						<ul className="space-y-2">
							{gameState.revealedClues.map((clue, index) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								<li key={`clue-${index}`} className="text-sm text-light-gold">
									{clue}
								</li>
							))}
						</ul>
					) : (
						<p className="text-sm text-muted-foreground">
							No clues revealed yet.
						</p>
					)}
				</ScrollArea>
			</CardContent>
		</Card>
	);
}
