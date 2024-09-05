import React from "react";
import { useGame } from "@/context/game-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function JoinGame() {
	const { joinGame } = useGame();
	const { toast } = useToast();
	const [playerName, setPlayerName] = React.useState("");

	const handleJoinGame = () => {
		if (playerName.trim()) {
			joinGame(playerName);
		} else {
			toast({
				title: "Error",
				description: "Please enter a valid name.",
				variant: "destructive",
			});
		}
	};

	return (
		<div className="flex items-center justify-center h-screen">
			<Card className="w-[350px]">
				<CardHeader>
					<CardTitle>Join Murder Mystery Game</CardTitle>
				</CardHeader>
				<CardContent>
					<Input
						type="text"
						placeholder="Enter your name"
						value={playerName}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setPlayerName(e.target.value)
						}
						className="mb-4"
					/>
					<Button onClick={handleJoinGame} className="w-full">
						Join Game
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
