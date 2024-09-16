import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useGame } from "@/hooks/use-game";
import { useEffect } from "react";

export function GameMasterApp() {
	const {
		gameState,
		players,
		revealClue,
		openVoting,
		endGame,
		resetGame,
		votingOpen,
		fetchGameState,
	} = useGame();
	const { toast } = useToast();

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

	useEffect(() => {
		fetchGameState();
	}, [fetchGameState]);

	if (!gameState) {
		return <div>Loading...</div>;
	}

	return (
		<div className="container mx-auto p-4 space-y-8">
			<h1 className="text-4xl font-bold text-center mb-8">
				Game Master Control Panel
			</h1>

			<Card>
				<CardHeader>
					<CardTitle>Game State</CardTitle>
				</CardHeader>
				<CardContent>
					<p>Current Round: {gameState.currentRound}</p>
					<p>Voting Open: {votingOpen ? "Yes" : "No"}</p>
					<p>Revealed Clues: {gameState.revealedClues.length} / 5</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Players</CardTitle>
				</CardHeader>
				<CardContent>
					<ScrollArea className="h-[200px]">
						<ul className="space-y-2">
							{players.map((player) => (
								<li key={player.id} className="text-sm">
									{player.name} {player.hasVoted && "(Voted)"}
								</li>
							))}
						</ul>
					</ScrollArea>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Revealed Clues</CardTitle>
				</CardHeader>
				<CardContent>
					<ScrollArea className="h-[200px]">
						{gameState.revealedClues.length > 0 ? (
							<ul className="space-y-2">
								{gameState.revealedClues.map((clue, index) => (
									// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
									<li key={index} className="text-sm">
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

			<Separator />

			<div className="flex justify-between">
				<Button
					onClick={handleRevealClue}
					disabled={gameState.revealedClues.length >= 5}
				>
					Reveal Next Clue
				</Button>
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

			{votingOpen && (
				<Card>
					<CardHeader>
						<CardTitle>Votes</CardTitle>
					</CardHeader>
					<CardContent>
						<ul>
							{Object.entries(gameState.votes).map(
								([playerId, characterName]) => (
									<li key={playerId}>
										{players.find((p) => p.id === playerId)?.name} voted for{" "}
										{characterName}
									</li>
								),
							)}
						</ul>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
