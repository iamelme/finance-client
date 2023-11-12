/* eslint-disable no-mixed-spaces-and-tabs */
import { useContext, useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
// import { ErrorMessage } from "@hookform/error-message"

import { z } from "zod"

// import AsyncSelect from "react-select/async"
import DatePicker from "react-datepicker"

import "react-datepicker/dist/react-datepicker.css"

import useAxios from "../../hooks/useAxios"
import { useNavigate, useParams } from "react-router-dom"
import {
	Card,
	CardBody,
	Input,
	Textarea,
	AsyncSelect,
	DatePickerInput,
	Alert,
	Button,
	DatePickerWrapper,
} from "../../ui"
import { AppContext } from "../../context/AppContext"
// import { AppContext } from "../../AppContext"

const schema = z.object({
	date: z.date().or(z.string()),
	account: z
		.object({
			label: z.string({ required_error: "Please select an account" }),
			value: z.string().nonempty("Please enter an account"),
		})
		.or(z.string().min(1, "Please enter an account")),
	amount: z
		.number()
		.nonnegative()
		.gt(0, "Please enter an amount greater than 0"),
	note: z.string(),
})

type Option = {
	label: string
	value: string
}

type Schema = z.infer<typeof schema>

type SubmitSchema = Omit<Schema, "account"> & { account: string }

export default function JournalForm() {
	const context = useContext(AppContext)

	const { user } = context || {}

	const [accounts, setAccounts] = useState<Option[]>([])
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [errorMessage, setErrorMessage] = useState("")

	const { id } = useParams<{ id: string }>()
	const navigate = useNavigate()
	const ax = useAxios()

	async function loadAccountItemOptions(e: string) {
		console.log("load options search term", e)

		try {
			const res = await ax.get("/account", {
				params: {
					name: e ? e : undefined,
				},
			})

			console.log("account items res", res.data)
			return (
				res?.data?.data?.map((account: Record<string, string>) => ({
					value: account.id,
					label: account.name,
					type: account.type,
				})) ?? []
			)
		} catch (e) {
			console.error(e)
		}
	}

	const isEdit = !!id

	const methods = useForm({
		defaultValues: isEdit
			? async () => {
					try {
						const res = await ax.get(`/journal/${id}`)
						console.log("journal res", res.data)

						return {
							...res?.data,
							date: new Date(res?.data?.date),
							account: {
								label: res?.data?.name,
								value: res?.data?.account_item_id,
							},
						}
					} catch (e) {
						console.error(e)
					}
			  }
			: {
					date: new Date(),
					account: null,
					amount: "0",
					note: "",
			  },
		resolver: zodResolver(schema),
	})

	const {
		register,
		watch,
		handleSubmit,
		setValue,
		formState: { isDirty, errors },
	} = methods

	useEffect(() => {
		const loadAccountItems = async () => {
			try {
				const res = await ax.get("/account")
				console.log("account items res effect", res.data)

				setAccounts(
					res?.data?.data?.map((account: Record<string, string>) => ({
						value: account.id,
						label: account.name,
						type: account.type,
					})) ?? []
				)
			} catch (e) {
				console.error(e)
			}
		}

		loadAccountItems()
	}, [])

	const onSubmit = async (data: Schema | SubmitSchema) => {
		if (!isDirty) return navigate(-1)
		console.log(data)
		setIsSubmitting(true)
		setErrorMessage("")

		const payload = data

		payload.account =
			typeof data.account === "string" ? data.account : data.account.value

		try {
			const res = isEdit
				? await ax.patch(`/journal/${id}`, payload)
				: await ax.post("/journal", payload)
			console.log("journal post res", res)

			navigate(-1)
		} catch (e: unknown) {
			console.log("e", e)
			setErrorMessage(e?.message ?? "An error occurred")
		}
		setIsSubmitting(false)
	}

	const watchDate = watch("date")
	console.log("errors", errors)
	console.log({ isDirty, user })

	return (
		<div>
			<h1>{isEdit ? "Edit" : "Add"} Journal</h1>

			<Card>
				<CardBody>
					<FormProvider {...methods}>
						<form onSubmit={handleSubmit(onSubmit)}>
							<DatePickerWrapper
								render={({ userLocale }) => (
									<DatePicker
										// {...(register("date"), { valueAsDate: true })}
										selected={
											typeof watchDate === "string"
												? new Date(watchDate)
												: watchDate
										}
										onChange={(date: Date) => {
											setValue("date", date, { shouldDirty: true })
										}}
										showTimeSelect
										locale={userLocale}
										dateFormat="Pp"
										wrapperClassName="w-full"
										customInput={
											<DatePickerInput
												id="date"
												label="Date"
												errors={errors}
											/>
										}
									/>
								)}
							/>
							<AsyncSelect
								unstyled
								inputId="account"
								label="Account"
								cacheOptions
								defaultOptions={accounts}
								loadOptions={loadAccountItemOptions}
								// options={accounts}
								onChange={(e: Option | null) => {
									setValue("account", e, { shouldDirty: true })
								}}
								value={watch("account")}
								errors={errors}
							/>
							<Input
								type="number"
								step="any"
								id="amount"
								label="Amount"
								name="amount"
								register={register}
								errors={errors}
								// {...register("amount")}
								// ref={register("amount").ref}
								// onChange={
								// 	(e: React.ChangeEvent<HTMLInputElement>) =>
								// 		setValue("amount", Number(e.target.value))
								// 	// register("amount").onChange(Number(e.target.value))
								// }
							/>
							<Textarea
								id="note"
								name="note"
								label="Note"
								register={register}
								className="h-[10rem]"
							/>
							{errorMessage && (
								<Alert
									status="danger"
									className="mb-3"
								>
									{errorMessage}
								</Alert>
							)}
							<Button
								type="submit"
								isLoading={isSubmitting}
							>
								Submit
							</Button>
						</form>
					</FormProvider>
				</CardBody>
			</Card>
		</div>
	)
}
