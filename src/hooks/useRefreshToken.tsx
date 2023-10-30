import axios from "../api"

export default function useRefreshToken() {
	const handleRefreshToken = async () => {
		try {
			const res = await axios.get("/refresh", {
				withCredentials: true,
			})

			const { data } = res || {}

			return data
		} catch (err) {
			console.error(err)
		}
	}

	return handleRefreshToken
}
