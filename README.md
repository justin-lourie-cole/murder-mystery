## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/murder-mystery-game.git
   ```

2. Navigate to the project directory:

   ```bash
   cd murder-mystery-game
   ```

3. Install the root dependencies:

   ```bash
   npm install
   ```

4. Navigate to the frontend directory and install dependencies:

   ```bash
   cd frontend
   npm install
   ```

5. Navigate to the server directory and install dependencies:

   ```bash
   cd ../server
   npm install
   ```

6. Create a `.env` file in the `server` directory and add necessary environment variables if required.

7. Return to the root directory and start the development servers:

   ```bash
   cd ..
   npm run dev
   ```

8. Open your browser and go to `http://localhost:5173` to access the game.

9. For the Game Master interface, go to `http://localhost:5173/gamemaster` and use the password specified in `GameMasterApp.tsx`.