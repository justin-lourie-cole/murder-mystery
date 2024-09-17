import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { useGame } from "@/hooks/use-game";

export function EndGameDialog() {
	const { showEndGameDialog, setShowEndGameDialog, winners, murderer } =
		useGame();

	return (
		<Dialog open={showEndGameDialog} onOpenChange={setShowEndGameDialog}>
			<DialogContent className="bg-dark-green border-2 border-gold">
				<DialogHeader>
					<DialogTitle className="text-3xl text-gold">Game Results</DialogTitle>
				</DialogHeader>
				<div className="text-light-gold">
					<p className="text-xl">The murderer was: {murderer}</p>
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
					<Button
						onClick={() => setShowEndGameDialog(false)}
						className="bg-gold text-dark-green hover:bg-light-gold"
					>
						Close
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
