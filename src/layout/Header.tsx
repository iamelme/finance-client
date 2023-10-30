import { useContext } from "react"
import { NavLink } from "react-router-dom"
import { AppContext } from "../AppContext"

export default function Header() {
	const context = useContext(AppContext)
	const { user } = context || {}

	// console.log("header user context", user)

	const isAdmin =
		user?.roles?.includes("admin") || user?.roles?.includes("super-admin")

	return (
		<header className="sticky top-0 flex justify-between sm:px-2 md:px-14 py-4 bg-white shadow">
			<h1>Header</h1>
			<nav>
				{isAdmin && (
					<NavLink
						to="/dashboard"
						className={(isActive) => (isActive ? "mr-2 text-bold" : "mr-2")}
					>
						Dashboard
					</NavLink>
				)}
				<NavLink
					to="/"
					className={(isActive) => (isActive ? "mr-2 text-bold" : "mr-2")}
				>
					Home
				</NavLink>
				<NavLink
					to="/dashboard/account"
					className={(isActive) => (isActive ? "mr-2 text-bold" : "mr-2")}
				>
					Account
				</NavLink>
				<NavLink
					to="/dashboard/journal"
					className={(isActive) => (isActive ? "mr-2 text-bold" : "mr-2")}
				>
					Journal
				</NavLink>
				{user?.id && `${user?.firstName} ${user?.lastName}`}
			</nav>
		</header>
	)
}
