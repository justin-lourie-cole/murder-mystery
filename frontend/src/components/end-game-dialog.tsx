import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogDescription,
} from "@/components/ui/dialog";
import { useGame } from "@/hooks/use-game";
import { CharacterCard } from "./player/character-card";

export function EndGameDialog() {
	const { showEndGameDialog, setShowEndGameDialog, winners, murderer } =
		useGame();

	function handleClose() {
		setShowEndGameDialog(false);
		// refresh the page
		window.location.reload();
	}

	return (
		<Dialog open={showEndGameDialog} onOpenChange={setShowEndGameDialog}>
			<DialogContent className="border-2">
				<DialogHeader>
					<DialogTitle className="text-3xl text-primary">
						Game Results
					</DialogTitle>
				</DialogHeader>
				<DialogDescription className="text-primary">
					It was {murderer?.name} the whole time!
				</DialogDescription>
				<div className="text-primary">
					{murderer ? (
						<CharacterCard
							character={murderer}
							votingOpen={false}
							handleVote={() => {}}
							playerHasVoted={false}
							isDraggable={false}
						/>
					) : (
						<p className="text-xl mt-4">No murderer found</p>
					)}
					{winners.length > 0 ? (
						<>
							<p className="text-xl mt-4">The winners are:</p>
							<ul className="list-disc list-inside">
								{winners.map((winner) => (
									<li key={winner.id}>{winner.name}</li>
								))}
							</ul>
						</>
					) : (
						<p className="text-xl mt-4">No one guessed correctly!</p>
					)}
				</div>
				<DialogFooter>
					<Button onClick={handleClose}>Close</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
