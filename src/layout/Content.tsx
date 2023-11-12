import { Outlet } from "react-router-dom"

export default function Content() {
	return (
		<div className="container mx-auto sm:px-1 lg:px-20">
			<Outlet />
		</div>
	)
}
