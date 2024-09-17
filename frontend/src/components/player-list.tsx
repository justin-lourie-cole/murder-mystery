import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useGame } from "@/hooks/use-game";
import { ScrollArea } from "./ui/scroll-area";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock } from "lucide-react";
import { ShimmeringText } from "./shimmering-text";

export function PlayerList() {
	const { players } = useGame();

	return (
		<Card className="border-2">
			<CardHeader>
				<ShimmeringText tag="h3" className="mb-0">
					Players
				</ShimmeringText>
			</CardHeader>
			<CardContent>
				<ScrollArea className="h-[300px]">
					<Table className="text-white">
						<TableHeader>
							<TableRow>
								<TableHead className="text-white">Name</TableHead>
								<TableHead className="text-white text-right">Status</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{players.map((player) => (
								<TableRow key={player.id}>
									<TableCell>{player.name}</TableCell>
									<TableCell className="text-right">
										{player.hasVoted ? (
											<Badge className="bg-green-600 text-white">
												<CheckCircle className="mr-1 h-3 w-3" /> Voted
											</Badge>
										) : (
											<Badge className="bg-yellow-600 text-white">
												<Clock className="mr-1 h-3 w-3" /> Vote Pending
											</Badge>
										)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</ScrollArea>
			</CardContent>
		</Card>
	);
}
