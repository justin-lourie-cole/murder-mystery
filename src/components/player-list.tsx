import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGame } from "@/hooks/use-game";
import { ScrollArea } from "./ui/scroll-area";

export function PlayerList() {
	const { players } = useGame();

	return (
		<Card className="border-2 border-gold bg-dark-green">
			<CardHeader>
				<CardTitle className="text-2xl text-gold font-serif">Players</CardTitle>
			</CardHeader>
			<CardContent>
				<ScrollArea className="h-[200px]">
					<ul className="space-y-2">
						{players.map((player) => (
							<li key={player.id} className="text-sm text-light-gold">
								{player.name} {player.hasVoted && "(Voted)"}
							</li>
						))}
					</ul>
				</ScrollArea>
			</CardContent>
		</Card>
	);
}
