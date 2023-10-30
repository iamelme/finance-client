import { ErrorMessage } from "@hookform/error-message"
import React from "react"

import {
	type UseControllerProps,
	type FieldValues,
	useController,
	useFormContext,
} from "react-hook-form"

export default function FormControl(
	props: UseControllerProps<FieldValues> & {
		label: string
		name: string
		children: React.ReactNode
	}
) {
	const { label, name, children } = props
	const { field, fieldState, formState } = useController(props)

	const { methods } = useFormContext()

	console.log("fieldState", formState.errors)
	return (
		<div className="mb-3">
			{label && (
				<label
					htmlFor={name}
					className="font-medium text-gray-600"
				>
					{label}
				</label>
			)}
			{children}
			{/* <ErrorMessage
				errors={methods.formState.errors}
				name={name}
				render={({ message }) => (
					<p className="mt-1 text-sm text-red-500">{message}</p>
				)}
			/> */}
		</div>
	)
}
