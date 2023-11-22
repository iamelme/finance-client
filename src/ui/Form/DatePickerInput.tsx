import {
	ErrorMessage,
	FieldValuesFromFieldErrors,
} from "@hookform/error-message"
import { LegacyRef, forwardRef } from "react"
import { DeepMap, FieldError, FieldName } from "react-hook-form"
import { ErrorType } from "../../types"

const DatePicker = forwardRef(function DatePickerInput(
	props: React.InputHTMLAttributes<HTMLInputElement> & {
		label?: string
		errors?: ErrorType
		// | Partial<DeepMap<Record<string, unknown>, FieldError>>
		// | FieldErrors<never>
	},
	ref: LegacyRef<HTMLInputElement> | undefined
) {
	const { label, name, id, errors } = props
	return (
		<div className="mb-3">
			{label && (
				<label
					htmlFor={id}
					className="inline-block font-medium text-gray-400 mb-1"
				>
					{label}
				</label>
			)}
			<input
				{...props}
				name={id}
				ref={ref}
				className="w-full px-4 py-2 bg-theme border border-theme-border rounded focus:outline-none "
			/>
			{errors && (
				<ErrorMessage
					errors={errors}
					name={
						id ||
						(name as FieldName<
							FieldValuesFromFieldErrors<
								Partial<DeepMap<Record<string, unknown>, FieldError>>
							>
						>)
					}
					render={({ message }) => (
						<p className="mt-1 text-sm text-red-500">{message}</p>
					)}
				/>
			)}
		</div>
	)
})

export default DatePicker
