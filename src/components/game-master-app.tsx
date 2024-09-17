"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useGame } from "@/hooks/use-game";
import { useEffect } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { CheckCircle, Clock } from "lucide-react";

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
		winners,
		murderer,
		showEndGameDialog,
		setShowEndGameDialog,
		joinAsGameMaster,
	} = useGame();
	const { toast } = useToast();

	useEffect(() => {
		console.log("Joining as gameMaster");
		joinAsGameMaster();
	}, [joinAsGameMaster]);

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
		return <div className="text-center p-4 text-gold">Loading...</div>;
	}

	return (
		<div className="container mx-auto p-4 space-y-8 bg-dark-green min-h-screen">
			<h1 className="text-6xl font-bold text-center mb-8 text-gold font-serif tracking-wide">
				Control Panel
			</h1>

			<Card className="border-2 border-gold bg-dark-green">
				<CardHeader>
					<CardTitle className="text-2xl text-gold font-serif">
						Game State
					</CardTitle>
				</CardHeader>
				<CardContent className="text-light-gold">
					<p>Current Round: {gameState.currentRound}</p>
					<p>Voting Open: {votingOpen ? "Yes" : "No"}</p>
					<p>Revealed Clues: {gameState.revealedClues.length} / 5</p>
				</CardContent>
			</Card>

			<Card className="border-2 border-gold bg-dark-green">
				<CardHeader>
					<CardTitle className="text-2xl text-gold font-serif">
						Players
					</CardTitle>
				</CardHeader>
				<CardContent>
					<ScrollArea className="h-[200px]">
						<Table>
							<TableBody>
								{players.map((player) => (
									<TableRow key={player.id}>
										<TableCell className="text-sm text-light-gold py-2">
											{player.name}
										</TableCell>
										<TableCell className="text-right py-2">
											{player.hasVoted ? (
												<Badge
													variant="secondary"
													className="bg-green-600 text-white text-xs"
												>
													<CheckCircle className="mr-1 h-3 w-3" /> Voted
												</Badge>
											) : (
												<Badge
													variant="secondary"
													className="bg-yellow-600 text-white text-xs"
												>
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

			<Card className="border-2 border-gold bg-dark-green">
				<CardHeader>
					<CardTitle className="text-2xl text-gold font-serif">
						Revealed Clues
					</CardTitle>
				</CardHeader>
				<CardContent>
					<ScrollArea className="h-[200px]">
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

			<Separator className="bg-gold" />

			<div className="flex flex-wrap justify-between gap-4">
				<Button
					onClick={handleRevealClue}
					disabled={gameState.revealedClues.length >= 5}
					className="bg-gold text-dark-green hover:bg-light-gold font-serif"
				>
					Reveal Next Clue
				</Button>
				<Button
					onClick={handleOpenVoting}
					disabled={votingOpen}
					className="bg-gold text-dark-green hover:bg-light-gold font-serif"
				>
					Open Voting
				</Button>
				<Button
					onClick={endGame}
					variant="secondary"
					className="bg-light-gold text-dark-green hover:bg-gold font-serif"
				>
					End Game
				</Button>
				<Button
					onClick={resetGame}
					variant="destructive"
					className="bg-red-900 text-gold hover:bg-red-800 font-serif"
				>
					Reset Game
				</Button>
			</div>

			{votingOpen && (
				<Card className="border-2 border-gold bg-dark-green">
					<CardHeader>
						<CardTitle className="text-2xl text-gold font-serif">
							Votes
						</CardTitle>
					</CardHeader>
					<CardContent>
						<ul>
							{Object.entries(gameState.votes).map(
								([playerId, characterName]) => (
									<li key={`vote-${playerId}`} className="text-light-gold">
										{players.find((p) => p.id === playerId)?.name} voted for{" "}
										{characterName}
									</li>
								),
							)}
						</ul>
					</CardContent>
				</Card>
			)}

			<Dialog open={showEndGameDialog} onOpenChange={setShowEndGameDialog}>
				<DialogContent className="bg-dark-green border-2 border-gold">
					<DialogHeader>
						<DialogTitle className="text-3xl text-gold font-serif">
							Game Ended
						</DialogTitle>
						<DialogDescription className="text-light-gold">
							{winners.length > 0 ? (
								<>
									<p className="text-xl">Winners:</p>
									<ul className="list-disc list-inside">
										{winners.map((winner) => (
											<li key={winner.id}>{winner.name}</li>
										))}
									</ul>
								</>
							) : (
								<p className="text-xl">No winners this round.</p>
							)}
							<p className="text-xl mt-4">The murderer was: {murderer}</p>
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							onClick={resetGame}
							className="bg-gold text-dark-green hover:bg-light-gold font-serif"
						>
							Start New Game
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
