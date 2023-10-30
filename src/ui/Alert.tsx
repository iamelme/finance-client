import { LegacyRef, forwardRef } from "react"
import { trimmer } from "../helpers"

// Todo: dark mode
const classes = {
	danger: "bg-red-100 rounded border border-red-400 text-red-700",
	success: "bg-green-100 rounded border border-green-400 text-green-700",
	warning: "bg-yellow-100 rounded border border-yellow-400 text-yellow-700",
	info: "bg-blue-100 rounded border border-blue-400 text-blue-700",
	size: {
		sm: "px-4 py-3 text-sm",
		base: "p-4 text-base",
		lg: "px-6 py-5 text-lg",
	},
}
type Size = keyof typeof classes.size
type AlertType = {
	children: React.ReactNode
	className?: string
	status?: Exclude<keyof typeof classes, "size">
	size?: Size
} & React.HTMLAttributes<HTMLDivElement>

const Alert = forwardRef(function Alert(
	{
		children,
		className = "",
		status = "info",
		size = "base",
		...rest
	}: AlertType,
	ref: LegacyRef<HTMLDivElement>
) {
	return (
		<div
			{...rest}
			ref={ref}
			className={trimmer(
				`${classes.size[size]} ${classes[status]} ${className}`
			)}
		>
			{" "}
			{children}
		</div>
	)
})

export default Alert
