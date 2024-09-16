import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGame } from "@/hooks/use-game";
import type { Character } from "@/types";

export default function CharacterList() {
	const { gameState, votingOpen, vote } = useGame();

	if (!gameState) return null;

	const handleVote = (characterName: string) => {
		vote(characterName);
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Characters</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{gameState.characters.map((character: Character) => (
						<Card key={character.name}>
							<CardHeader>
								<CardTitle>{character.name}</CardTitle>
							</CardHeader>
							<CardContent>
								<p>
									<strong>Backstory:</strong> {character.backstory}
								</p>
								{votingOpen && (
									<Button
										onClick={() => handleVote(character.name)}
										className="mt-2 w-full"
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
