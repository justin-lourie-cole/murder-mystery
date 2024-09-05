'use client'

import React from "react";
import { GameProvider, useGame } from "./GameContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import type { Character } from "./types";

function JoinGame() {
  const { joinGame } = useGame();
  const [playerName, setPlayerName] = React.useState("");

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Join Murder Mystery Game</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPlayerName(e.target.value)
            }
            className="mb-4"
          />
          <Button onClick={() => joinGame(playerName)} className="w-full">
            Join Game
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function PlayerList() {
  const { players } = useGame();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Players</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {players.map((player) => (
            <li key={player.id} className="text-sm">
              {player.name} {player.hasVoted && "(Voted)"}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function CluesList() {
  const { gameState, revealClue } = useGame();

  if (!gameState) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Clues</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px] w-full rounded-md border p-4">
          {gameState.revealedClues.length > 0 ? (
            <ul className="space-y-2">
              {gameState.revealedClues.map((clue, index) => (
                <li key={`clue-${index}`} className="text-sm">
                  {clue}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              No clues revealed yet.
            </p>
          )}
        </ScrollArea>
        <Button onClick={revealClue} className="mt-4 w-full">
          Reveal Next Clue
        </Button>
      </CardContent>
    </Card>
  );
}

function CharacterList() {
  const { gameState, votingOpen, vote } = useGame();

  if (!gameState) return null;

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
                    onClick={() => vote(character.name)}
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

function GameControls() {
  const { openVoting, endGame, resetGame, votingOpen } = useGame();

  return (
    <div className="flex justify-between">
      <Button onClick={openVoting} disabled={votingOpen}>
        Open Voting
      </Button>
      <Button onClick={endGame} variant="secondary">
        End Game
      </Button>
      <Button onClick={resetGame} variant="destructive">
        Reset Game
      </Button>
    </div>
  );
}

function EndGameDialog() {
  const { showEndGameDialog, setShowEndGameDialog, winners, murderer } = useGame();

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

function GameContent() {
  const { gameState } = useGame();

  if (!gameState) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        Murder Mystery Game
      </h1>
      <PlayerList />
      <CluesList />
      <CharacterList />
      <Separator />
      <GameControls />
      <EndGameDialog />
    </div>
  );
}

export function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}

function AppContent() {
  const { isJoined } = useGame();

  if (!isJoined) {
    return <JoinGame />;
  }

  return <GameContent />;
}