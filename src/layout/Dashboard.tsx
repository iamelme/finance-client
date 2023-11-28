import { Outlet } from "react-router-dom"
import Header from "./Header"
import Sidebar from "./Sidebar"

export default function Dashboard() {
	return (
		<div className="flex  flex-row min-h-screen">
			<Sidebar />

			<div className="md:ml-[290px] flex-1 content">
				<Header />
				<main>
					<Outlet />
				</main>
			</div>
		</div>
	)
}
