export function Card({
	children,
	className = "",
	...rest
}: React.HtmlHTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) {
	return (
		<div
			{...rest}
			className={`bg-white rounded-md border border-slate-300 ${className}`}
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
