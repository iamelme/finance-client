import { useContext, useState } from "react"
import { NavLink } from "react-router-dom"
import { AppContext } from "../AppContext"
import { Button } from "../ui"
import Dropdown from "../ui/Dropdown"
import { ChevronDown } from "react-feather"

export default function Header() {
	const context = useContext(AppContext)
	const { user } = context || {}

	const [isOpen, setIsOpen] = useState(false)

	// console.log("header user context", user)

	const isAdmin =
		user?.roles?.includes("admin") || user?.roles?.includes("super-admin")

	return (
		<header className="sticky top-0 z-10 flex justify-between sm:px-2 md:px-14 py-4 bg-white shadow">
			<h1>Header</h1>
			<nav className="font-bold">
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
				<Dropdown
					direction="end"
					onClickOutside={(e) => console.log("e outside", e)}
					trigger={(props) => {
						console.log("trigger props", props)
						return (
							<div className="cursor-pointer">
								{user?.id && `${user?.firstName} ${user?.lastName}`}
							</div>
						)
					}}
				>
					<div>
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
				</Dropdown>
				<Button
					variant="ghost"
					className="relative !font-bold"
					onClick={() => setIsOpen(!isOpen)}
				>
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
