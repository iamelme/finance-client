/* eslint-disable no-mixed-spaces-and-tabs */
// import { useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { z } from "zod"

// import Select from "react-select"

import useAxios from "../../hooks/useAxios"
import { useNavigate, useParams } from "react-router-dom"
import { Button, Card, CardBody, Input, Select } from "../../ui"

const schema = z.object({
	name: z.string().nonempty("Please enter a name"),
	type: z.string().nonempty("Please enter a type"),
})

type Option = {
	label: string
	value: string
}

const typeOption = [
	{ label: "Revenue", value: "Revenue", type: "Revenue" },
	{ label: "Expense", value: "Expense", type: "Expense" },
]

type Schema = z.infer<typeof schema>

export default function AccountItemForm() {
	const { id } = useParams<{ id: string }>()
	console.log("id", id)
	const navigate = useNavigate()
	const ax = useAxios()

	const isEdit = !!id

	const methods = useForm({
		defaultValues: isEdit
			? async () => {
					try {
						const res = await ax.get(`/account/${id}`)
						console.log("account item res", res.data)
						return res?.data
					} catch (e) {
						console.error(e)
					}
			  }
			: {
					name: "",
					type: "",
			  },
		resolver: zodResolver(schema),
	})

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors, isDirty },
	} = methods

	const onSubmit = async (data: Schema) => {
		if (!isDirty) return navigate(-1)
		console.log(data)

		const payload = {
			name: data.name,
			type: data.type,
		}
		try {
			isEdit
				? await ax.patch(`/account/${id}`, payload)
				: await ax.post("/account", payload)
			navigate(-1)
		} catch (err) {
			console.error(err)
		}
	}

	const watchType = watch("type")
	// console.log({ errors })

	return (
		<div>
			<h1>{isEdit ? "Edit" : "Add"} Account</h1>

			<Card>
				<CardBody>
					<FormProvider {...methods}>
						<form onSubmit={handleSubmit(onSubmit)}>
							<Input
								id="name"
								type="text"
								name="name"
								label="Name"
								register={register}
								errors={errors}
							/>
							<Select
								unstyled
								inputId="type"
								label="Type"
								options={typeOption}
								value={{ label: watchType, value: watchType }}
								onChange={(e: Option | null) => {
									setValue("type", e?.value || "")
								}}
								errors={errors}
							/>

							<Button type="submit">Submit</Button>
						</form>
					</FormProvider>
				</CardBody>
			</Card>
		</div>
	)
}
