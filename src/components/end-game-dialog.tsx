// EndGameDialog.tsx
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { useGame } from "@/lib/game-context";

export default function EndGameDialog() {
	const { showEndGameDialog, setShowEndGameDialog, winners, murderer } =
		useGame();

	return (
		<Dialog open={showEndGameDialog} onOpenChange={setShowEndGameDialog}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Game Results</DialogTitle>
				</DialogHeader>
				<div>
					<p>The murderer was: {murderer}</p>
					{winners.length > 0 ? (
						<>
							<p>The winners are:</p>
							<ul>
								{winners.map((winner) => (
									<li key={winner.id}>{winner.name}</li>
								))}
							</ul>
						</>
					) : (
						<p>No one guessed correctly!</p>
					)}
				</div>
				<DialogFooter>
					<Button onClick={() => setShowEndGameDialog(false)}>Close</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
