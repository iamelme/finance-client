import Header from "./Header"
import Sidebar from "./Sidebar"

import LayoutRoutes from "../Routes"

export default function Routes() {
	return (
		<div className="flex flex-row min-h-screen">
			<Sidebar />

			<div className="flex-1">
				<Header />
				<LayoutRoutes />
			</div>
		</div>
	)
}
