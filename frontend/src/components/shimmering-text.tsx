import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const shimmeringTextVariants = cva(
	"text-center mb-8 font-monoton tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 animate-shimmer",
	{
		variants: {
			tag: {
				h1: "text-6xl",
				h2: "text-5xl",
				h3: "text-4xl",
				h4: "text-3xl",
				h5: "text-2xl",
				h6: "text-xl",
				p: "text-base",
				span: "text-base",
			},
		},
		defaultVariants: {
			tag: "h1",
		},
	},
);

interface ShimmeringTextProps
	extends VariantProps<typeof shimmeringTextVariants> {
	children: React.ReactNode;
	className?: string;
}

export function ShimmeringText({
	children,
	tag = "h1",
	className,
}: ShimmeringTextProps) {
	const Tag = tag as keyof JSX.IntrinsicElements;

	return (
		<Tag className={cn(shimmeringTextVariants({ tag }), className)}>
			{children}
		</Tag>
	);
}
