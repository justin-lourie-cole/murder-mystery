"use client";

import { useState, useEffect, useRef } from "react";
import { useGame } from "@/context/game-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendIcon } from "lucide-react";

export function MessagePanel() {
	const { chatMessages, sendChatMessage } = useGame();
	const [message, setMessage] = useState("");
	const scrollAreaRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (scrollAreaRef.current) {
			scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
		}
	}, [chatMessages]);

	const handleSendMessage = () => {
		if (message.trim()) {
			sendChatMessage(message.trim());
			setMessage("");
		}
	};

	return (
		<Card className="border-2 border-gold bg-dark-green h-[400px] flex flex-col">
			<CardHeader className="border-b border-gold">
				<CardTitle className="text-2xl text-gold font-serif text-center">
					Messages
				</CardTitle>
			</CardHeader>
			<CardContent className="flex-grow flex flex-col p-4">
				<ScrollArea className="flex-grow mb-4 pr-4" ref={scrollAreaRef}>
					{chatMessages.map((msg) => (
						<div key={msg.id} className="mb-4">
							<p className="text-gold font-serif">{msg.sender}</p>
							<div className="bg-light-gold/20 p-2 rounded-lg mt-1">
								<p className="text-light-gold">{msg.content}</p>
							</div>
							<p className="text-xs text-gold/50 mt-1 text-right">
								{new Date(msg.timestamp).toLocaleTimeString()}
							</p>
						</div>
					))}
				</ScrollArea>
				<div className="flex items-center mt-2">
					<Input
						type="text"
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						placeholder="Type your message..."
						className="flex-grow mr-2 bg-light-gold/20 text-light-gold placeholder-light-gold/50 border-gold"
						onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
					/>
					<Button
						onClick={handleSendMessage}
						className="bg-gold text-dark-green hover:bg-light-gold font-serif p-2"
					>
						<SendIcon className="h-5 w-5" />
						<span className="sr-only">Send message</span>
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
