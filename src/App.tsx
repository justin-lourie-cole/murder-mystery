import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { PlayerApp } from "./components/player-app";
import { ProtectedRoute } from "./components/protected-route";
import { GameMasterApp } from "./components/game-master-app";

function App() {
	// This should be determined by your authentication logic
	const isGameMaster = true;

	return (
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
	);
}

export default App;
