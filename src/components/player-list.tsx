import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGame } from "@/lib/game-context";

export default function PlayerList() {
	const { players } = useGame();

	return (
		<Card>
			<CardHeader>
				<CardTitle>Players</CardTitle>
			</CardHeader>
			<CardContent>
				<ul className="space-y-2">
					{players.map((player) => (
						<li key={player.id} className="text-sm">
							{player.name} {player.hasVoted && "(Voted)"}
						</li>
					))}
				</ul>
			</CardContent>
		</Card>
	);
}
