import {
	ClassNamesConfig,
	GroupBase,
	Props,
	default as ReactSelect,
} from "react-select"
import { AsyncProps, default as ReactAsyncSelect } from "react-select/async"
import classNames from "classnames"
import { bgType } from "../../helpers"
import { DeepMap, FieldError, FieldName } from "react-hook-form"
import {
	ErrorMessage,
	FieldValuesFromFieldErrors,
} from "@hookform/error-message"
import { ErrorType } from "../../types"

const t = {
	control: ({
		isDisabled,
		isFocused,
		menuIsOpen,
	}: {
		isDisabled: boolean
		isFocused: boolean
		menuIsOpen: boolean
	}) =>
		classNames(
			!isDisabled && isFocused && "border-slate-300",
			isFocused && menuIsOpen && " rounded-b-none border-b-0",
			isFocused &&
				"hover:border-slate-300 hover:rounded-b-none hover:border-b-0",
			"min-h-0 px-4 border border-slate-300 rounded hover:cursor-pointer"
		),
	option: ({
		isDisabled,
		isFocused,
		isSelected,
		data,
	}: {
		isDisabled: boolean
		isFocused: boolean
		isSelected: boolean
		data: {
			type: string
		}
	}) =>
		classNames(
			isSelected && "bg-gray-50",
			!isSelected && isFocused && "bg-white",
			!isDisabled && isSelected && "active:bg-white",
			!isDisabled && !isSelected && "active:bg-white",
			`px-4 py-2 bg-white border border-t-none border-slate-300 border-b-0 last:border-b last:rounded-b hover:bg-gray-50 hover:cursor-pointer ${bgType(
				data?.type
			)}`
		),

	noOptionsMessage: () =>
		classNames(
			"px-4 py-2 bg-white border border-t-none border-slate-300 border-b-0 last:border-b last:rounded-b "
		),
}

type classNamesType = ClassNamesConfig

export function Select<
	OptionType,
	IsMulti extends boolean = false,
	Group extends GroupBase<OptionType> = GroupBase<OptionType>
>({
	inputId = "react-select",
	label = "",
	errors,
	...props
}: {
	label?: string
	inputId?: string
	errors?: ErrorType
} & Props<OptionType, IsMulti, Group> &
	classNamesType) {
	return (
		<div className="mb-3">
			{label && (
				<label
					htmlFor={inputId}
					className="inline-block font-medium text-gray-400 mb-1"
				>
					{label}
				</label>
			)}
			<ReactSelect
				unstyled={true}
				inputId={inputId}
				placeholder=""
				{...props}
				classNames={t as ClassNamesConfig<OptionType, IsMulti, Group>}
			/>
			<ErrorMessage
				errors={errors}
				name={
					`${name}` as FieldName<
						FieldValuesFromFieldErrors<
							Partial<DeepMap<Record<string, unknown>, FieldError>>
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

export function AsyncSelect<
	OptionType extends { type: string } = { type: string },
	IsMulti extends boolean = false,
	GroupType extends GroupBase<OptionType> = GroupBase<OptionType>
>({
	inputId = "react-select",
	label = "",
	errors,
	...props
}: {
	label?: string
	inputId?: string
	errors?: ErrorType
} & AsyncProps<OptionType, IsMulti, GroupType>) {
	console.log("async errors", errors)
	return (
		<div className="mb-3">
			{label && (
				<label
					htmlFor={inputId}
					className="inline-block font-medium text-gray-400 mb-1"
				>
					{label}
				</label>
			)}
			<ReactAsyncSelect
				inputId={inputId}
				placeholder=""
				{...props}
				classNames={t}
			/>
			<ErrorMessage
				errors={errors}
				name={
					inputId as FieldName<
						FieldValuesFromFieldErrors<
							Partial<DeepMap<Record<string, unknown>, FieldError>>
						>
					>
				}
				render={({ message }) => (
					<p className="mt-1 text-sm text-red-500">
						{message === "Expected object, received null"
							? `${label || inputId} required`
							: message}
					</p>
				)}
			/>
		</div>
	)
}
