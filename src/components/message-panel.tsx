"use client";

import { useState, useEffect, useRef } from "react";
import { useGame } from "@/hooks/use-game";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendIcon } from "lucide-react";
import type { ChatMessage } from "@/types";

export function MessagePanel() {
	const { chatMessages, sendChatMessage } = useGame();
	const [message, setMessage] = useState("");
	const scrollAreaRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const scrollElement = scrollAreaRef.current?.querySelector(
			"[data-radix-scroll-area-viewport]",
		) as HTMLElement;
		scrollElement?.scrollTo({
			top: scrollElement.scrollHeight,
			behavior: "smooth",
		});
	}, [chatMessages]);

	const handleSendMessage = () => {
		if (message.trim()) {
			sendChatMessage(message.trim());
			setMessage("");
		}
	};

	return (
		<Card className="border-2 border-gold bg-dark-green flex flex-col min-h-[600px]">
			<CardHeader className="border-b border-gold py-2">
				<CardTitle className="text-2xl text-gold font-monoton font-normal text-center">
					Messages
				</CardTitle>
			</CardHeader>
			<CardContent className="flex-grow flex flex-col p-4 overflow-hidden">
				<ScrollArea className="flex-grow pr-4" ref={scrollAreaRef}>
					<div className="space-y-4">
						{chatMessages?.map((msg: ChatMessage) => (
							<div key={msg.id}>
								<p className="text-gold font-inter">{msg.sender}</p>
								<div className="bg-light-gold/20 p-2 rounded-lg mt-1">
									<p className="text-light-gold">{msg.content}</p>
								</div>
								<p className="text-xs text-gold/50 mt-1 text-right">
									{new Date(msg.timestamp).toLocaleTimeString()}
								</p>
							</div>
						))}
					</div>
				</ScrollArea>
				<div className="flex items-center mt-4">
					<Input
						type="text"
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						placeholder="Type your message..."
						className="flex-grow mr-2 bg-light-gold/20 text-light-gold placeholder-light-gold/50 border-gold"
						onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
					/>
					<Button
						onClick={handleSendMessage}
						className="bg-gold text-dark-green hover:bg-light-gold p-2"
					>
						<SendIcon className="h-5 w-5" />
						<span className="sr-only">Send message</span>
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
