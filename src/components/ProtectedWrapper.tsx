import { useContext } from "react"
import { Navigate, Outlet, useLocation } from "react-router-dom"

import { AppContext } from "../context/AppContext"
// import axios from "../api"

export default function ProtectedWrapper() {
	const context = useContext(AppContext)
	const { user, accessToken } = context || {}

	const location = useLocation()

	// console.log({ location })

	if (!user?.id || !accessToken) {
		return (
			<Navigate
				to="/login"
				state={{ from: location }}
				replace
			/>
		)
	}
	return <Outlet />
}
