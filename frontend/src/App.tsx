import { useState, useEffect } from "react";
import {
	BrowserRouter as Router,
	Route,
	Routes,
	Navigate,
	useNavigate,
	useLocation,
} from "react-router-dom";
import { PlayerApp } from "@/components/player/player-app";
import { ProtectedRoute } from "@/components/protected-route";
import { GameMasterApp } from "@/components/game-master/game-master-app";
import { GameProvider } from "@/providers/game-provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthDialog } from "@/components/auth-dialog";
import { toast } from "@/hooks/use-toast";

function AppContent() {
	const [isGameMaster, setIsGameMaster] = useState(false);
	const [showAuthDialog, setShowAuthDialog] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		if (location.pathname === "/gamemaster" && !isGameMaster) {
			setShowAuthDialog(true);
		}
	}, [location.pathname, isGameMaster]);

	const handleAuthenticate = (password: string) => {
		// Replace this with your actual authentication logic
		if (password === "secret") {
			setIsGameMaster(true);
			setShowAuthDialog(false);
			toast({
				title: "Authentication Successful",
				description: "You are now logged in as Game Master.",
				variant: "destructive",
			});
			navigate("/gamemaster");
		} else {
			toast({
				title: "Authentication Failed",
				description: "Incorrect password. Please try again.",
				variant: "destructive",
			});
		}
	};

	return (
		<>
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
				<Route path="*" element={<Navigate to="/" />} />
			</Routes>
			<AuthDialog
				isOpen={showAuthDialog}
				onClose={() => {
					setShowAuthDialog(false);
					if (!isGameMaster) {
						navigate("/");
					}
				}}
				onAuthenticate={handleAuthenticate}
			/>
			<Toaster />
		</>
	);
}

function App() {
	return (
		<GameProvider>
			<Router>
				<AppContent />
			</Router>
		</GameProvider>
	);
}

export default App;
