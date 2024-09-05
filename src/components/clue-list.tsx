import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGame } from "@/context/game-context";

export default function CluesList() {
	const { gameState } = useGame();

	if (!gameState) return null;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Clues</CardTitle>
			</CardHeader>
			<CardContent>
				<ScrollArea className="h-[200px] w-full rounded-md border p-4">
					{gameState.revealedClues.length > 0 ? (
						<ul className="space-y-2">
							{gameState.revealedClues.map((clue, index) => (
								<li
									key={`clue-${
										// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
										index
									}`}
									className="text-sm"
								>
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
