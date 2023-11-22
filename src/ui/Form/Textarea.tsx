import type { FieldValues, UseFormRegister } from "react-hook-form"

export default function Textarea({
	register,
	name,
	className,
	label,
	...rest
}: React.InputHTMLAttributes<HTMLTextAreaElement> & {
	register: UseFormRegister<FieldValues>
	name: string
	label?: string
}) {
	const { onChange, onBlur, ref } = register(name)
	return (
		<div className="mb-3">
			{label && (
				<label
					htmlFor={name}
					className="inline-block font-medium text-gray-400 mb-1"
				>
					{label}
				</label>
			)}
			<textarea
				{...rest}
				ref={ref}
				name={name}
				onChange={onChange}
				onBlur={onBlur}
				className={`w-full px-4 py-2 bg-theme border border-theme-border rounded focus:outline-none ${className}`}
			></textarea>
		</div>
	)
}
