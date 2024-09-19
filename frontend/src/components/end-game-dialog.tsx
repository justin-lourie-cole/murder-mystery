import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { useGame } from "@/hooks/use-game";
import { CharacterCard } from "./player/character-card";

export function EndGameDialog() {
	const { showEndGameDialog, setShowEndGameDialog, winners, murderer } =
		useGame();

	return (
		<Dialog open={showEndGameDialog} onOpenChange={setShowEndGameDialog}>
			<DialogContent className="border-2 text-primary">
				<DialogHeader>
					<DialogTitle className="text-3xl text-center">
						Game Results
					</DialogTitle>
					<DialogDescription className="text-center text-primary">
						It was {murderer?.name} the whole time!
					</DialogDescription>
				</DialogHeader>
				<div className="text-center">
					{murderer ? (
						<div className="flex items-center justify-center">
							<CharacterCard
								character={murderer}
								votingOpen={false}
								handleVote={() => {}}
								playerHasVoted={false}
								isDraggable={false}
							/>
						</div>
					) : (
						<p className="text-xl mt-4">No murderer found</p>
					)}
					{winners.length > 0 ? (
						<div className="text-center">
							<p className="text-xl mt-4">The winners are:</p>
							<ul className="list-disc list-inside">
								{winners.map((winner) => (
									<li key={winner.id}>{winner.name}</li>
								))}
							</ul>
						</div>
					) : (
						<p className="text-xl mt-4 text-center">
							No one guessed correctly!
						</p>
					)}
				</div>
				{/* <DialogFooter>
					<Button onClick={handleClose}>Close</Button>
				</DialogFooter> */}
			</DialogContent>
		</Dialog>
	);
}
