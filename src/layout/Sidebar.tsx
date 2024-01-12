import { useContext } from "react"
import { NavLink } from "react-router-dom"
import { AppContext } from "../context/AppContext"

export default function Sidebar() {
	const context = useContext(AppContext)

	console.log("context  sidebar", context)

	const { user } = context || {}

	return (
		<aside className="fixed top-0 left-0 min-h-[100vh] md:w-[290px] bg-accent border-r border-r-theme-border p-3">
			<nav>
				<h1>Logo</h1>
				<NavLink
					to="/"
					className={({ isActive }) =>
						(isActive ? "bg-theme font-bold" : "block").concat(
							" block py-2 px-4 rounded-md"
						)
					}
				>
					Home
				</NavLink>
				<NavLink
					to="/account"
					className={({ isActive }) =>
						(isActive ? "bg-theme font-bold" : "block").concat(
							" block py-2 px-4 rounded-md"
						)
					}
				>
					Account
				</NavLink>
				<NavLink
					to="/report"
					className={({ isActive }) =>
						(isActive ? "bg-theme font-bold" : "block").concat(
							" block py-2 px-4 rounded-md"
						)
					}
				>
					Report
				</NavLink>
				<NavLink
					to="/journal"
					className={({ isActive }) =>
						(isActive ? "bg-theme font-bold" : "block").concat(
							" block py-2 px-4 rounded-md"
						)
					}
				>
					Journal
				</NavLink>
				{user?.roles?.includes("super-admin") && (
					<NavLink
						to="/user"
						className={({ isActive }) =>
							(isActive ? "bg-theme font-bold" : "block").concat(
								" block py-2 px-4 rounded-md"
							)
						}
					>
						Users
					</NavLink>
				)}
			</nav>
		</aside>
	)
}
