import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useGame } from "@/hooks/use-game";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ShimmeringText } from "@/components/shimmering-text";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

export function JoinGame() {
	const { joinGame } = useGame();

	const formSchema = z.object({
		playerName: z.string().min(1, "Player name is required"),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			playerName: "",
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		joinGame(values.playerName);
	}

	return (
		<div className="flex items-center justify-center h-screen">
			<Card className="w-[350px] border-2">
				<CardHeader>
					<ShimmeringText tag="h3" className="mb-0">
						Join game
					</ShimmeringText>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<FormField
								control={form.control}
								name="playerName"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-white">Player Name</FormLabel>
										<FormControl>
											<Input
												type="text"
												{...field}
												placeholder="Enter your name"
												className="mb-4 text-lg"
											/>
										</FormControl>
										<Button type="submit" className="w-full text-lg">
											Submit
										</Button>
										<FormMessage />
									</FormItem>
								)}
							/>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
