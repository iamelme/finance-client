export function Card({
	children,
	className = "",
	...rest
}: React.HtmlHTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) {
	return (
		<div
			{...rest}
			className={`bg-accent rounded-md border border-theme-border ${className}`}
		>
			{children}
		</div>
	)
}

export function CardBody({
	children,
	className = "",
	...rest
}: React.HtmlHTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) {
	return (
		<div
			{...rest}
			className={`px-4 py-6 ${className}`}
		>
			{children}
		</div>
	)
}
