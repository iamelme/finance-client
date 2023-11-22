import { useState } from "react"
import { Link } from "react-router-dom"
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"

import { z } from "zod"

import { Button, Card, CardBody, Input, Select } from "../ui"
import { Alert } from "../ui"
import { getCountry, listOfCountries } from "../helpers"

const schema = z
	.object({
		firstName: z
			.string({ required_error: "Please enter your first name" })
			.min(2),
		lastName: z
			.string({ required_error: "Please enter your last name" })
			.min(2),
		userName: z.string({ required_error: "Please enter a username" }).min(5),
		email: z.string().email(),
		countryCode: z.string(),
		password: z.string({ required_error: "Please enter a password" }).min(6),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	})

type Schema = z.infer<typeof schema>

export default function RegisterForm() {
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [errorMessage, setErrorMessage] = useState("")
	const [responseMessage, setResponseMessage] = useState("")

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm({
		defaultValues: {
			firstName: "",
			lastName: "",
			userName: "",
			email: "",
			countryCode: "",
			password: "",
			confirmPassword: "",
		},
		resolver: zodResolver(schema),
	})

	const onSubmit = async (data: Schema) => {
		console.log(data)

		setIsSubmitting(true)

		setErrorMessage("")
		setResponseMessage("")

		const payload = {
			first_name: data.firstName.trim(),
			last_name: data.lastName.trim(),
			user_name: data.userName.trim(),
			email: data.email,
			country_code: data.countryCode,
			locale: getCountry(data.countryCode)?.locale,
			currency: getCountry(data.countryCode)?.currency,
			password: data.password.trim(),
		}

		try {
			await axios.post("http://localhost:4000/api/register", payload, {
				headers: { "Content-Type": "application/json" },
			})
			setResponseMessage("Registration successful")
		} catch (e: unknown) {
			console.error("register error ", e?.response?.data)
			setErrorMessage(e?.response?.data ?? "An error occurred")
		}
		setIsSubmitting(false)
	}

	console.log("errors", errors)

	const methods = useForm()

	console.log("list", listOfCountries())

	return (
		<div className="flex flex-col justify-center min-h-[100vh] -mt-[60px]">
			<div className="w-[20rem] mx-auto">
				<h2 className="text-lg mb-3">Registration Form</h2>

				<Card>
					<CardBody>
						<FormProvider {...methods}>
							<form onSubmit={handleSubmit(onSubmit)}>
								<Input
									id="firstName"
									type="text"
									name="firstName"
									label="First Name"
									register={register}
									errors={errors}
								/>
								<Input
									id="lastName"
									name="lastName"
									type="text"
									label="Last Name"
									register={register}
									errors={errors}
								/>
								<Input
									id="userName"
									name="userName"
									type="text"
									label="User Name"
									register={register}
									errors={errors}
								/>
								<Input
									id="email"
									name="email"
									type="text"
									label="Email"
									register={register}
									errors={errors}
								/>
								<Select
									id="countryCode"
									name="countryCode"
									label="Country"
									options={listOfCountries()}
									onChange={(e: { label: string; value: string } | null) =>
										setValue("countryCode", e!.value)
									}
									errors={errors}
								/>
								<Input
									id="password"
									name="password"
									type="password"
									label="Password"
									register={register}
									errors={errors}
								/>
								<Input
									id="confirmPassword"
									name="confirmPassword"
									type="password"
									label="Confirm Password"
									register={register}
									errors={errors}
								/>
								{responseMessage && (
									<Alert
										status="success"
										className="mb-3"
									>
										{responseMessage}. you can now{" "}
										<Link to="/login">
											<span className="font-bold underline">login</span>
										</Link>
									</Alert>
								)}
								{errorMessage && (
									<Alert
										status="danger"
										className="mb-3"
									>
										{errorMessage}
									</Alert>
								)}

								<p className="mb-3">
									Already have an account? <Link to="/login">Login</Link>{" "}
								</p>
								<Button
									type="submit"
									isLoading={isSubmitting}
									className="w-full"
									// variant="outlinepill"
									// color="secondary"
								>
									Register
								</Button>
							</form>
						</FormProvider>
					</CardBody>
				</Card>
			</div>
		</div>
	)
}
