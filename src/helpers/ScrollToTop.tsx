import { useEffect } from "react"
import { useLocation, useSearchParams } from "react-router-dom"

export default function ScrollToTop() {
	const { pathname } = useLocation()
	const [searchParams] = useSearchParams()

	console.log(useLocation())

	console.log("pathname ", pathname, "searchParams", searchParams)

	useEffect(() => {
		console.log("ScrollToTop")
		window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
	}, [pathname])

	return null
}
