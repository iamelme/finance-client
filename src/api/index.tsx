import axios from "axios"

const baseURL = "http://localhost:4000/api"

const instAxios = axios.create({
	withCredentials: true,
	baseURL,
})

instAxios.defaults.headers.post["Content-Type"] = "application/json"
instAxios.defaults.withCredentials = true

export default instAxios
