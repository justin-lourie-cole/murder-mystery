"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useGame } from "@/hooks/use-game";
import type { Character } from "@/types";
import {
	motion,
	AnimatePresence,
	type PanInfo,
	MotionConfig,
} from "framer-motion";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function CharacterList() {
	const { gameState, votingOpen, vote } = useGame();
	const [current, setCurrent] = useState(0);

	const handleVote = (characterName: string) => {
		vote(characterName);
	};

	const nextCard = () => {
		if (!gameState?.characters) return;

		if (current < gameState?.characters?.length - 1) {
			setCurrent(current + 1);
		}
	};

	const previousCard = () => {
		if (!gameState?.characters) return;

		if (current > 0) {
			setCurrent(current - 1);
		}
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
			<Card className="border-2 border-gold bg-dark-green overflow-hidden ">
				<CardHeader>
					<CardTitle className="text-2xl text-gold font-serif z-20">
						Characters
					</CardTitle>
				</CardHeader>
				<CardContent className="relative min-h-[400px] flex justify-center items-center">
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
											drag={isCurrentDay ? "x" : false}
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
											/>
										</motion.div>
									);
								},
							)}
						</AnimatePresence>
					</div>
				</CardContent>
				<CardFooter className="justify-between">
					<Button
						onClick={previousCard}
						disabled={current === 0}
						variant="outline"
						size="icon"
						className="bg-dark-green text-gold hover:bg-gold hover:text-dark-green z-20 rounded-full transition-all duration-200"
					>
						<ArrowLeftIcon className="h-4 w-4" />
					</Button>
					<div className="flex justify-center space-x-2">
						{gameState.characters.map((character, index) => (
							<button
								type="button"
								key={character.name}
								className={cn(
									"w-2 h-2 rounded-full transition-colors",
									current === index ? "bg-gold" : "bg-light-gold",
								)}
								onClick={() => setCurrent(index)}
								aria-label={`Go to character ${index + 1}`}
							/>
						))}
					</div>
					<Button
						onClick={nextCard}
						disabled={current === gameState.characters.length - 1}
						variant="outline"
						size="icon"
						className="bg-dark-green text-gold hover:bg-gold hover:text-dark-green z-20 rounded-full transition-all duration-200"
					>
						<ArrowRightIcon className="h-4 w-4" />
					</Button>
				</CardFooter>
			</Card>
		</MotionConfig>
	);
}

function CharacterCard({
	character,
	votingOpen,
	handleVote,
}: {
	character: Character;
	votingOpen: boolean;
	handleVote: (characterName: string) => void;
}) {
	return (
		<Card className="w-full h-full bg-gradient-to-b to-[#AB7329] from-[#E5AC61] rounded-2xl shadow-xl p-[2px] border-none cursor-pointer">
			<CardHeader className="p-1/2 overflow-hidden rounded-t-2xl">
				<div className="relative w-full h-48 mb-2 overflow-hidden">
					<img
						src={"/placeholder.svg"}
						alt={character.imgAlt || "Placeholder"}
						className="object-cover object-center"
					/>
					<div className="absolute z-10 top-0 left-0 w-full h-full flex flex-row items-start justify-start p-2">
						<div className="bg-[#E5AC61] text-emerald-900 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xl">
							{character.level}
						</div>
					</div>
				</div>
			</CardHeader>
			<CardContent className="px-0">
				<div className="flex flex-col justify-between px-2 mb-4">
					<h3 className="text-lg font-bold">{character.name}</h3>
					<p className="text-sm">{character.class}</p>
				</div>
				<div className="flex flex-col justify-between px-2 space-y-2">
					<p className="text-xs">{character.backstory}</p>
					{votingOpen && (
						<Button
							onClick={() => handleVote(character.name)}
							className="w-full bg-amber-600 text-emerald-900 hover:bg-amber-500 font-bold py-1 rounded-md transition-colors duration-200 text-sm"
						>
							Vote
						</Button>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
