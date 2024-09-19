import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useEffect, useRef } from "react";
import { useGame } from "@/hooks/use-game";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendIcon } from "lucide-react";
import type { ChatMessage } from "@shared/types";
import { ShimmeringText } from "@/components/shimmering-text";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";

export function MessagePanel() {
	const { chatMessages, sendChatMessage } = useGame();
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

	const formSchema = z.object({
		message: z.string().min(1, "Message is required"),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			message: "",
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		sendChatMessage(values.message);
		form.reset();
		form.clearErrors();
	}

	return (
		<Card className="border-2 flex flex-col h-[600px]">
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
								<p className="text-xs mt-1 text-right text-secondary">
									{new Date(msg.timestamp).toLocaleTimeString()}
								</p>
							</div>
						))}
					</div>
				</ScrollArea>
				<div className="flex items-center mt-4">
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="flex space-x-2 w-full"
						>
							<FormField
								control={form.control}
								name="message"
								render={({ field }) => (
									<FormItem className="flex-grow">
										<FormControl>
											<Input
												{...field}
												type="text"
												placeholder="Type your message here..."
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type="submit" className="p-2">
								<SendIcon className="h-5 w-5" />
								<span className="sr-only">Send message</span>
							</Button>
						</form>
					</Form>
				</div>
			</CardContent>
		</Card>
	);
}
