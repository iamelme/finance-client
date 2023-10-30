import { useState, useContext } from "react"

import axios from "../api"
import { AppContext } from "../AppContext"
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom"
// import { useNavigate } from "react-router-dom"

export default function Login() {
	const context = useContext(AppContext)

	const { updateState } = context || {}
	const location = useLocation()
	const navigate = useNavigate()
	const to = location?.state?.from?.pathname || "/"

	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")

	console.log({ context })

	if (context?.user?.id) {
		return (
			<Navigate
				to="/dashboard"
				replace
			/>
		)
	}

	const handleLogin = async () => {
		try {
			const res = await axios.post(
				"/login",
				{
					user_name: username,
					password,
				},
				{
					headers: { "Content-Type": "application/json" },
					// withCredentials: true,
				}
			)

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
		} catch (err) {
			console.error(err)
		}
	}

	console.log({ username, password })

	return (
		<div>
			<div>
				<input
					type="text"
					placeholder="username"
					onChange={(e) => setUsername(e.target.value)}
				/>
			</div>
			<div>
				<input
					type="password"
					placeholder="password"
					onChange={(e) => setPassword(e.target.value)}
				/>
			</div>
			<button onClick={handleLogin}>Login</button>

			<br />
			<Link to="/register">Register</Link>
			<br />
			<Link to="/dashboard">Dashboard</Link>
		</div>
	)
}
