import { useContext, useState } from "react"
import { NavLink } from "react-router-dom"
import { AppContext } from "../AppContext"
import { Button } from "../ui"

export default function Header() {
	const context = useContext(AppContext)
	const { user } = context || {}

	const [isOpen, setIsOpen] = useState(false)

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
				<Button
					variant="ghost"
					className="relative"
					onClick={() => setIsOpen(!isOpen)}
				>
					{user?.id && `${user?.firstName} ${user?.lastName}`}
					{isOpen && (
						<div className="absolute top-full right-0 w-full bg-white shadow">
							<ul>
								<li>
									<NavLink
										to="/dashboard/account"
										className={(isActive) =>
											isActive ? "mr-2 text-bold" : "mr-2"
										}
									>
										Account
									</NavLink>
								</li>
								<li>
									<NavLink
										to="/dashboard/journal"
										className={(isActive) =>
											isActive ? "mr-2 text-bold" : "mr-2"
										}
									>
										Journal
									</NavLink>
								</li>
							</ul>
						</div>
					)}
				</Button>
			</nav>
		</header>
	)
}
