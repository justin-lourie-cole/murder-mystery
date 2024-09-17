import React from "react";
import { useGame } from "@/hooks/use-game";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ShimmeringText } from "./shimmering-text";

export function JoinGame() {
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
			<Card className="w-[350px] border-2">
				<CardHeader>
					<ShimmeringText tag="h3" className="mb-0">
						Join game
					</ShimmeringText>
				</CardHeader>
				<CardContent>
					<Input
						type="text"
						placeholder="Enter your name"
						value={playerName}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setPlayerName(e.target.value)
						}
						className="mb-4 text-lg"
					/>
					<Button onClick={handleJoinGame} className="w-full text-lg">
						Submit
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
