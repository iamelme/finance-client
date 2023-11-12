import { useContext, useEffect } from "react"
import instAxios from "../api"
import useRefreshToken from "./useRefreshToken"
import { AppContext } from "../context/AppContext"

export default function useAxios() {
	const context = useContext(AppContext)
	const { accessToken, updateState } = context || {}
	const refresh = useRefreshToken()

	useEffect(() => {
		const requestIntercept = instAxios.interceptors.request.use(
			(config) => {
				if (!config.headers["Authorization"]) {
					config.headers["Authorization"] = `Bearer ${accessToken}`
				}
				return config
			},
			(error) => Promise.reject(error)
		)

		const responseIntercept = instAxios.interceptors.response.use(
			(response) => response,
			async (error) => {
				const status = error.response ? error.response.status : null
				const prevRequest = error?.config

				if (status === 401) {
					prevRequest.sent = true
					// Handle unauthorized access
					// console.log("reponse interceptors 401")

					const res = await refresh()

					// console.log("interceptor res", res)
					updateState?.({
						accessToken: res?.accessToken,
					})
					prevRequest.headers["Authorization"] = `Bearer ${res?.accessToken}`

					// resume the failed request
					return instAxios(prevRequest)
				}
				return Promise.reject(error)
			}
		)

		return () => {
			instAxios.interceptors.request.eject(requestIntercept)
			instAxios.interceptors.response.eject(responseIntercept)
		}
	}, [])

	return instAxios
}
