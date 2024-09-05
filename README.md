# Murder Mystery Game

A real-time multiplayer murder mystery game built with React, Socket.IO, and Node.js.

## Features

- Real-time multiplayer gameplay
- Role-based access (Players and Game Master)
- Dynamic clue revelation
- Voting system
- End-game results display

## Prerequisites

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

## Installation

1. Clone the repository:

   ```bash
   git clone [https://github.com/yourusername/murder-mystery-game.git](https://github.com/yourusername/murder-mystery-game.git)

   ```

2. Navigate to the project directory:

   ```bash
   cd murder-mystery-game
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory and add:

   ```bash
   npm run dev
   ```

5. Start the Socket.IO server:

   ```bash
   npm run server
   ```

6. Open your browser and go to `http://localhost:5173` to access the game.

7. For the Game Master interface, go to `http://localhost:5173/gamemaster` and use the password specified in `GameMasterApp.tsx`.

## Game Rules

1. The Game Master reveals clues one by one.
2. Players discuss and try to deduce the murderer based on the clues.
3. When voting opens, each player can cast a vote for the suspected murderer.
4. The game ends when all players have voted or when the Game Master ends the game.
5. Winners are the players who correctly identified the murderer.

## Project Structure

```css
murder-mystery-game/
│
├── src/
│   ├── components/
│   │   ├── player-app.tsx
│   │   ├── game-master-app.tsx
│   │   └── ... (other components)
│   │
│   ├── context/
│   │   └── game-context.tsx
│   │
│   ├── types/
│   │   └── index.ts
│   │
│   ├── game/
│   │   ├── characters.ts
│   │   ├── clues.ts
│   │   ├── game-manager.ts
│   │   └── index.ts
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── server/
│   └── index.ts
│
├── .gitignore
├── package.json
├── README.md
└── vite.config.ts
```

## Technologies Used

- React
- TypeScript
- Vite
- Socket.IO
- Node.js
- Express

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch: `git checkout -b feature-branch-name`
3. Make your changes and commit them: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-branch-name`
5. Create a pull request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
