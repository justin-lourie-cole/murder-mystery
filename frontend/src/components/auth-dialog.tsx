import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
	password: z.string().min(1, "Password is required"),
});

interface AuthDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onAuthenticate: (password: string) => void;
}

export function AuthDialog({
	isOpen,
	onClose,
	onAuthenticate,
}: AuthDialogProps) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			password: "",
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		onAuthenticate(values.password);
	}

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader className="text-primary">
					<DialogTitle>Game Master Authentication</DialogTitle>
					<DialogDescription className="text-primary">
						Please enter the Game Master password to access the Game Master App.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-primary">Password</FormLabel>
									<FormControl>
										<Input type="password" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit">Authenticate</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
