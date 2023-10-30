// import { forwardRef } from "react"

import {
	ErrorMessage,
	FieldValuesFromFieldErrors,
} from "@hookform/error-message"
import type {
	Path,
	FieldValues,
	UseFormRegister,
	DeepMap,
	FieldError,
	FieldName,
} from "react-hook-form"

// const Input = forwardRef<
// 	HTMLInputElement,
// 	React.InputHTMLAttributes<HTMLInputElement>
// >(function Input(
// 	{ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>,
// 	ref
// ) {
// 	console.log("input props", props)
// 	console.log("input ref", ref?.current)
// 	return (
// 		<input
// 			{...props}
// 			ref={ref}
// className={`px-4 py-2 border border-slate-300 w-full ${className}`}
// 		/>
// 	)
// })

// export default Input

export type FormInputProps<TFormValues extends FieldValues> = {
	name: Path<TFormValues>
	register: UseFormRegister<TFormValues>
	errors?: Partial<DeepMap<TFormValues, FieldError>>
	label?: string
}

export const Input = <TFormValues extends Record<string, unknown>>({
	name,
	register,
	errors,
	className,
	label,
	...rest
}: FormInputProps<TFormValues> &
	React.InputHTMLAttributes<HTMLInputElement>): React.ReactNode => {
	// const { onChange, onBlur, ref } = register(name)
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

			<input
				{...rest}
				{...register(name, {
					valueAsNumber: rest?.type === "number",
				})}
				// name={name}
				// onChange={onChange}
				// onBlur={onBlur}
				className={`w-full px-4 py-2 border border-slate-300 rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${className}`}
			/>
			<ErrorMessage
				errors={errors}
				name={
					`${name}` as FieldName<
						FieldValuesFromFieldErrors<
							Partial<DeepMap<TFormValues, FieldError>>
						>
					>
				}
				render={({ message }) => (
					<p className="mt-1 text-sm text-red-500">{message}</p>
				)}
			/>
		</div>
	)
}

export default Input

// export default function Input({
// 	register,
// 	name,
// 	label,
// 	className,
// 	...rest
// }: // ...rest
// React.InputHTMLAttributes<HTMLInputElement> & {
// 	// register: (name: string) => {
// 	// 	ref: React.MutableRefObject<HTMLInputElement | null>
// 	// 	onChange: () => void
// 	// 	onBlur: () => void
// 	// 	name: string
// 	// }
// 	register: UseFormRegister<FieldValues>
// 	name: string
// 	label?: string
// }) {
// 	const { onChange, onBlur, ref } = register(name)
// 	return (
// 		<div className="mb-3">
// 			{label && (
// 				<label
// 					htmlFor={name}
// 					className="font-medium text-gray-600"
// 				>
// 					{label}
// 				</label>
// 			)}

// 			<input
// 				{...rest}
// 				ref={ref}
// 				name={name}
// 				onChange={onChange}
// 				onBlur={onBlur}
// 				className={`w-full px-4 py-2 border border-slate-300 rounded ${className}`}
// 			/>

// 		</div>
// 	)
// }
