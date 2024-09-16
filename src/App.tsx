import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { PlayerApp } from "./components/player-app";
import { ProtectedRoute } from "./components/protected-route";
import { GameMasterApp } from "./components/game-master-app";
import { GameProvider } from "./providers/game-provider";

function App() {
	const isGameMaster = true;

	return (
		<GameProvider>
			<Router>
				<Routes>
					<Route path="/" element={<PlayerApp />} />
					<Route
						path="/gamemaster"
						element={
							<ProtectedRoute isAuthenticated={isGameMaster}>
								<GameMasterApp />
							</ProtectedRoute>
						}
					/>
				</Routes>
			</Router>
		</GameProvider>
	);
}

export default App;
