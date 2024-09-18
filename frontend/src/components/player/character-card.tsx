import type { Character } from "@shared/types";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CharacterCardProps {
	character: Character;
	votingOpen: boolean;
	handleVote: (characterName: string) => void;
	playerHasVoted: boolean;
	isDraggable: boolean;
}

export function CharacterCard({
	character,
	votingOpen,
	handleVote,
	playerHasVoted,
	isDraggable,
}: CharacterCardProps) {
	return (
		<Card
			className={cn(
				"w-full h-full bg-gradient-to-br from-[#AB7329] via-[#E5AC61] to-[#AB7329] rounded-2xl shadow-xl p-[2px] border-none cursor-pointer animate-shimmer",
				isDraggable ? "cursor-grab" : "cursor-default",
			)}
		>
			<CardHeader className="p-1/2 overflow-hidden rounded-t-2xl">
				<div className="relative w-full h-48 mb-2 overflow-hidden">
					<img
						src={character.imgSrc}
						alt={character.imgAlt || "Placeholder"}
						className="object-cover object-center"
					/>
					<div className="absolute z-10 top-0 left-0 w-full h-full flex flex-row items-start justify-start p-2">
						<div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold text-xl">
							{character.level}
						</div>
					</div>
				</div>
			</CardHeader>
			<CardContent className="px-0">
				<div className="flex flex-col justify-between px-2 mb-4">
					<h3 className="text-lg font-bold font-body">{character.name}</h3>
					<p className="text-sm">{character.class}</p>
				</div>
				<div className="flex flex-col justify-between px-2 space-y-2">
					<p className="text-xs">{character.backstory}</p>
					{votingOpen && !playerHasVoted && (
						<Button
							onClick={() => handleVote(character.name)}
							className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-1 rounded-md transition-colors duration-200 text-sm"
						>
							Vote
						</Button>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
