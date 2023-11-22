import { Loader } from "react-feather"
import { trimmer } from "../helpers"

const classes = {
	disabled: "opacity-50 cursor-not-allowed",
	size: {
		base: "py-1 px-2 text-sm font-medium",
		lg: "py-2 px-4 text-base font-medium",
		xl: "px-6 py-3 text-lg font-medium",
		full: "py-1 px-2 text-sm font-medium w-full",
		"full-lg": "py-2 px-4 text-base font-medium w-full",
		"full-xl": "px-6 py-3 text-lg font-medium w-full",
	},
	variant: {
		base: "rounded-md border",
		pill: "rounded-full",
		outline: "rounded-md border border-current bg-transparent",
		"outline-pill": "rounded-full border border-current bg-transparent ",
		ghost:
			"border-0 !bg-transparent hover:bg-transparent hover:border-0 text-current",
	},
	outline: {
		primary: "text-blue-500 hover:text-blue-600",
		secondary:
			"text-slate-600 hover:text-slate-700 border-slate-200 hover:border-slate-400",
		danger: "text-red-500 hover:text-red-600",
	},
	color: {
		primary: "bg-blue-500 border-blue-500 hover:bg-blue-600 text-white",
		secondary: "bg-slate-500 border-slate-100 hover:bg-slate-600 text-white",
		danger: "bg-slate-500 border-slate-100 hover:bg-slate-600 text-red-500",
	},
}

type Size = keyof typeof classes.size
// type TextColor = keyof typeof classes.textColor
type Color = keyof typeof classes.color
type Variant = keyof typeof classes.variant

type ButtonType = {
	ref?: React.Ref<HTMLButtonElement>
	children: React.ReactNode
	className?: string
	type?: "button" | "submit" | "reset"
	variant?: Variant
	color?: Color
	// textColor?: TextColor
	size?: Size
	isDisabled?: boolean
	isLoading?: boolean
	label?: string
} & React.HTMLAttributes<HTMLButtonElement>

export default function Button({
	ref,
	children,
	className = "",
	type = "button",
	variant = "base",
	color = "primary",
	size = "base",
	isDisabled = false,
	isLoading = false,
	label = "",
	...rest
}: ButtonType) {
	const baseClass =
		"inline-flex items-center justify-center focus:outline-none transition ease-in-out duration-150"
	const isOutline = variant.includes("outline")
	const isGhost = variant.includes("ghost")

	// console.log({
	// 	isOutline,
	// 	isGhost,
	// 	variant,
	// 	color,
	// 	textColor: classes.textColor[color],
	// })

	const colorClassName = isOutline || isGhost ? "" : classes.color[color]
	const textColorClassName = isOutline || isGhost ? classes.outline[color] : ""
	return (
		<button
			ref={ref}
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
				label || children
			)}
		</button>
	)
}
