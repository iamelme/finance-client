import { Loader } from "react-feather"
import { trimmer } from "../helpers"

const classes = {
	disabled: "opacity-50 cursor-not-allowed",
	size: {
		base: "py-1 px-2 text-sm font-medium",
		lg: "py-2 px-4 text-base font-medium",
		xl: "px-6 py-5 text-lg font-medium",
	},
	variant: {
		base: "rounded-md border",
		pill: "rounded-full",
		outline: "rounded-md border border-current bg-transparent",
		outlinepill: "rounded-full border border-current bg-transparent ",
		ghost:
			"border-0 !bg-transparent hover:bg-transparent hover:border-0 text-current",
	},
	textColor: {
		primary: "text-blue-500 hover:text-blue-600",
		secondary: "text-slate-400 hover:text-slate-600",
	},
	color: {
		primary: "bg-blue-500 border-blue-500 hover:bg-blue-600 text-white",
		secondary: "bg-slate-500 border-slate-100 hover:bg-slate-600 text-white",
	},
}

type Size = keyof typeof classes.size
type TextColor = keyof typeof classes.textColor
type Color = keyof typeof classes.color
type Variant = keyof typeof classes.variant

type ButtonType = {
	children: React.ReactNode
	className?: string
	type?: "button" | "submit" | "reset"
	variant?: Variant
	color?: Color
	textColor?: TextColor
	size?: Size
	isDisabled?: boolean
	isLoading?: boolean
} & React.HTMLAttributes<HTMLButtonElement>

export default function Button({
	children,
	className = "",
	type = "button",
	variant = "base",
	color = "primary",
	size = "base",
	isDisabled = false,
	isLoading = false,
	...rest
}: ButtonType) {
	const baseClass =
		"inline-flex items-center justify-center focus:outline-none transition ease-in-out duration-150"
	const isOutline = variant.includes("outline")
	const isGhost = variant.includes("ghost")

	const colorClassName = isOutline || isGhost ? "" : classes.color[color]
	const textColorClassName =
		isOutline || isGhost ? classes.textColor[color] : ""
	return (
		<button
			{...rest}
			type={type}
			disabled={isDisabled || isLoading}
			className={trimmer(
				`${baseClass} ${
					isDisabled || isLoading ? classes.disabled : ""
				} ${colorClassName} ${classes.variant[variant]} ${
					classes.size[size]
				} ${textColorClassName} ${className}`
			)}
		>
			{isLoading ? (
				<>
					<Loader
						size={12}
						className="animate-spin mr-1 mb-1"
					/>
					Processing...
				</>
			) : (
				children
			)}
		</button>
	)
}
