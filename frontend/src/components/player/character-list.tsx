import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { useGame } from "@/hooks/use-game";
import type { Character } from "@shared/types";
import {
	motion,
	AnimatePresence,
	type PanInfo,
	MotionConfig,
} from "framer-motion";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ShimmeringText } from "@/components/shimmering-text";
import { CharacterCard } from "@/components/player/character-card";

export function CharacterList() {
	const { gameState, votingOpen, vote } = useGame();
	const [current, setCurrent] = useState(0);
	const [playerHasVoted, setPlayerHasVoted] = useState(false);
	const [isDraggable, setIsDraggable] = useState(true);

	useEffect(() => {
		const mediaQuery = window.matchMedia("(min-width: 768px)");
		const handleMediaQueryChange = (e: MediaQueryListEvent) => {
			setIsDraggable(!e.matches);
		};

		setIsDraggable(!mediaQuery.matches);
		mediaQuery.addListener(handleMediaQueryChange);

		return () => {
			mediaQuery.removeListener(handleMediaQueryChange);
		};
	}, []);

	const handleVote = (characterName: string) => {
		vote(characterName);
		setPlayerHasVoted(true);
	};

	const nextCard = () => {
		if (!gameState?.characters) return;
		if (current === gameState?.characters?.length - 1) return;

		setCurrent(current + 1);
	};

	const previousCard = () => {
		if (!gameState?.characters) return;
		if (current === 0) return;

		setCurrent(current - 1);
	};

	const calculatePosition = (index: number, currentCard: number) => {
		const diff = index - currentCard;
		const x = diff * 200;
		const y = diff * -100;
		return { x, y };
	};

	const calculateRotation = (index: number, currentCard: number) => {
		const diff = index - currentCard;
		return diff * 15;
	};

	const calculateZIndex = (index: number, currentCard: number): number => {
		const distance = Math.abs(index - currentCard);
		return distance === 0 ? 10 : 10 - distance; // Ensure z-index doesn't go below 0
	};

	if (!gameState) return null;

	return (
		<MotionConfig transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}>
			<Card className="border-2 overflow-hidden min-h-[600px] flex flex-col">
				<CardHeader>
					<ShimmeringText
						tag="h3"
						className="mb-0 text-center md:text-left z-20"
					>
						Characters
					</ShimmeringText>
				</CardHeader>
				<CardContent className="relative flex justify-center items-center grow">
					<div className="w-[300px] h-[400px] relative">
						<AnimatePresence>
							{gameState.characters.map(
								(character: Character, index: number) => {
									const { x, y } = calculatePosition(index, current);
									const rotate = calculateRotation(index, current);
									const zIndex = calculateZIndex(index, current);
									const isCurrentDay = index === current;

									return (
										<motion.div
											key={character.name}
											initial={false}
											animate={{ x, y, rotate, zIndex }}
											className="absolute"
											drag={isCurrentDay && isDraggable ? "x" : false}
											dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
											onDragEnd={(_, info: PanInfo) => {
												if (info.offset.x < -40) {
													nextCard();
												} else if (info.offset.x > 40) {
													previousCard();
												}
											}}
										>
											<CharacterCard
												character={character}
												votingOpen={votingOpen}
												handleVote={handleVote}
												playerHasVoted={playerHasVoted}
												isDraggable={isDraggable}
											/>
										</motion.div>
									);
								},
							)}
						</AnimatePresence>
					</div>
				</CardContent>
				<CardFooter className="justify-center md:justify-between">
					<Button
						onClick={previousCard}
						disabled={current === 0}
						size="icon"
						className="z-20 rounded-full transition-all duration-200 hidden md:flex items-center justify-center"
					>
						<ArrowLeftIcon className="h-4 w-4" />
					</Button>
					<div className="flex justify-center space-x-2 z-20 p-2 rounded-full">
						{gameState.characters.map((character, index) => (
							<button
								type="button"
								key={character.name}
								className={cn(
									"w-2 h-2 rounded-full transition-colors",
									current === index ? "bg-primary" : "bg-secondary",
								)}
								onClick={() => setCurrent(index)}
								aria-label={`Go to character ${index + 1}`}
							/>
						))}
					</div>
					<Button
						onClick={nextCard}
						disabled={current === gameState.characters.length - 1}
						size="icon"
						className="z-20 rounded-full transition-all duration-200 border hidden md:flex items-center justify-center"
					>
						<ArrowRightIcon className="h-4 w-4" />
					</Button>
				</CardFooter>
			</Card>
		</MotionConfig>
	);
}
