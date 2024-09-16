import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGame } from "@/hooks/use-game";
import type { Character } from "@/types";

export function CharacterList() {
	const { gameState, votingOpen, vote } = useGame();

	if (!gameState) return null;

	const handleVote = (characterName: string) => {
		vote(characterName);
	};

	return (
		<Card className="border-2 border-gold bg-dark-green">
			<CardHeader>
				<CardTitle className="text-2xl text-gold font-serif">
					Characters
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{gameState.characters.map((character: Character) => (
						<Card
							key={character.name}
							className="border-2 border-gold bg-dark-green"
						>
							<CardHeader>
								<CardTitle className="text-xl text-gold font-serif">
									{character.name}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-light-gold">
									<strong className="text-gold">Backstory:</strong>{" "}
									{character.backstory}
								</p>
								{votingOpen && (
									<Button
										onClick={() => handleVote(character.name)}
										className="mt-2 w-full bg-gold text-dark-green hover:bg-light-gold font-serif"
									>
										Vote for {character.name}
									</Button>
								)}
							</CardContent>
						</Card>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
