"use client";

import { useState, useEffect, useRef } from "react";
import { useGame } from "@/hooks/use-game";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendIcon } from "lucide-react";
import type { ChatMessage } from "@shared/types";
import { ShimmeringText } from "@/components/shimmering-text";

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
		<Card className="border-2 flex flex-col min-h-[600px]">
			<CardHeader className="border-b py-2">
				<ShimmeringText tag="h3" className="mb-0">
					Messages
				</ShimmeringText>
			</CardHeader>
			<CardContent className="flex-grow flex flex-col p-4 overflow-hidden">
				<ScrollArea className="flex-grow pr-4" ref={scrollAreaRef}>
					<div className="space-y-4">
						{chatMessages?.map((msg: ChatMessage) => (
							<div key={msg.id}>
								<p className="text-primary font-inter">{msg.sender}</p>
								<div className="bg-secondary/20 p-2 rounded-lg mt-1">
									<p className="text-secondary">{msg.content}</p>
								</div>
								<p className="text-xs mt-1 text-right">
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
						className="flex-grow mr-2"
						onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
					/>
					<Button onClick={handleSendMessage} className="p-2">
						<SendIcon className="h-5 w-5" />
						<span className="sr-only">Send message</span>
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
