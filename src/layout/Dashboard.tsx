import { Outlet } from "react-router-dom"
import Header from "./Header"
import Sidebar from "./Sidebar"

export default function Dashboard() {
	return (
		<div className="flex flex-row min-h-screen">
			<Sidebar />

			<div className="flex-1 content">
				<Header />
				<Outlet />
			</div>
		</div>
	)
}
