import { useState, useContext } from "react"

import axios from "../api"
import { AppContext } from "../context/AppContext"
import { FormProvider, useForm } from "react-hook-form"

import { z } from "zod"

import { Link, Navigate, useLocation, useNavigate } from "react-router-dom"
import { Alert, Button, Card, CardBody, Input } from "../ui"
import { zodResolver } from "@hookform/resolvers/zod"
// import { useNavigate } from "react-router-dom"

const schema = z.object({
	userName: z
		.string({ required_error: "Please enter a username" })
		.min(5, "Username must be at least 5 characters"),
	password: z
		.string({ required_error: "Please enter a password" })
		.min(6, "Password must be at least 6 characters"),
})

type Schema = z.infer<typeof schema>

export default function Login() {
	const context = useContext(AppContext)

	const { updateState, user } = context || {}
	const location = useLocation()
	const navigate = useNavigate()
	const to = location?.state?.from?.pathname || "/"

	const methods = useForm({
		defaultValues: {
			userName: "",
			password: "",
		},
		resolver: zodResolver(schema),
	})

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = methods

	const [isSubmitting, setIsSubmitting] = useState(false)

	const [responseMessage, setResponseMessage] = useState("")
	const [errorMessage, setErrorMessage] = useState("")

	console.log({ context })

	if (user?.id) {
		return (
			<Navigate
				to="/dashboard"
				replace
			/>
		)
	}

	const handleLogin = async (data: Schema) => {
		setIsSubmitting(true)

		setErrorMessage("")
		setResponseMessage("")

		const payload = {
			user_name: data?.userName,
			password: data?.password,
		}
		try {
			const res = await axios.post("/login", payload, {
				headers: { "Content-Type": "application/json" },
			})

			console.log({ res })

			const { data } = res || {}

			updateState?.({
				user: {
					id: data?.id,
					firstName: data?.firstName,
					lastName: data?.lastName,
					email: data?.email,
					roles: data?.roles,
					countryCode: data?.countryCode ?? "US",
					locale: data?.locale ?? "en-US",
					currency: data?.currency ?? "USD",
				},
				accessToken: data?.accessToken,
			})

			navigate(to, { replace: true })
		} catch (e) {
			console.error(e)
			setErrorMessage(e?.response?.data ?? "An error occurred")
		}
		setIsSubmitting(false)
	}

	return (
		<div className="flex flex-col justify-center min-h-[100vh] -mt-[60px]">
			<div className="w-full max-w-sm mx-auto">
				<h2 className="text-lg mb-3">Login</h2>

				<Card>
					<CardBody>
						<FormProvider {...methods}>
							<form onSubmit={handleSubmit(handleLogin)}>
								<Input
									id="userName"
									name="userName"
									label="User Name"
									register={register}
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
									Want to create an account?{" "}
									<Link to="/register">Click here</Link>
								</p>
								<Button
									type="submit"
									isLoading={isSubmitting}
									className="w-full"
									// variant="outlinepill"
									// color="secondary"
								>
									Login
								</Button>
							</form>
						</FormProvider>
					</CardBody>
				</Card>
			</div>
		</div>
		// <div>
		// 	<div>
		// 		<input
		// 			type="text"
		// 			placeholder="username"
		// 			onChange={(e) => setUsername(e.target.value)}
		// 		/>
		// 	</div>
		// 	<div>
		// 		<input
		// 			type="password"
		// 			placeholder="password"
		// 			onChange={(e) => setPassword(e.target.value)}
		// 		/>
		// 	</div>
		// 	<button onClick={handleLogin}>Login</button>

		// 	<br />
		// 	<Link to="/register">Register</Link>
		// 	<br />
		// 	<Link to="/dashboard">Dashboard</Link>
		// </div>
	)
}
