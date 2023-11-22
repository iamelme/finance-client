import { useContext } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { AppContext } from "../context/AppContext"
import { Button } from "../ui"
import Dropdown from "../ui/Dropdown"
import useAxios from "../hooks/useAxios"
import { ChevronDown, Plus } from "react-feather"

export default function Header() {
	const context = useContext(AppContext)
	const { user, updateState } = context || {}

	const ax = useAxios()

	const navigate = useNavigate()

	// console.log("header user context", user)

	const handleLogout = async () => {
		try {
			const res = await ax.get("/logout")

			console.log("logout res", res)

			updateState?.({
				user: {
					id: "",
					firstName: "",
					lastName: "",
					email: "",
					roles: [],
					currency: "",
					locale: "",
					countryCode: "",
				},
			})

			navigate("/login")
		} catch (e) {
			console.log("e", e)
		}
	}

	const isAdmin =
		user?.roles?.includes("admin") || user?.roles?.includes("super-admin")

	return (
		<header className="sticky top-0 z-10 flex justify-end sm:px-2 md:px-14 py-4 bg-accent border-b border-b-theme-border">
			<nav className="flex items-center font-bold px-5">
				{isAdmin && (
					<NavLink
						to="/"
						className={(isActive) => (isActive ? "mr-2 text-bold" : "mr-2")}
					>
						Dashboard
					</NavLink>
				)}
				<Dropdown
					direction="end"
					// onClickOutside={(e) => console.log("e outside", e)}
					trigger={(props) => {
						console.log("trigger props", props)
						return (
							<Button
								ref={props.ref}
								variant="pill"
								className="h-[2rem] mr-2"
							>
								<Plus size={16} />
							</Button>
						)
					}}
					content={({ setIsOpen }) => (
						<div>
							<ul>
								<li>
									<NavLink
										to="/account/add"
										className={(isActive) =>
											isActive ? "mr-2 text-bold" : "mr-2"
										}
										onClick={() => setIsOpen(false)}
									>
										Add Account
									</NavLink>
								</li>
								<li>
									<NavLink
										to="/journal/add"
										className={(isActive) =>
											isActive ? "mr-2 text-bold" : "mr-2"
										}
										onClick={() => setIsOpen(false)}
									>
										Add Journal
									</NavLink>
								</li>
							</ul>
						</div>
					)}
				/>

				<Dropdown
					direction="end"
					// onClickOutside={(e) => console.log("e outside", e)}
					trigger={(props) => {
						console.log("trigger props", props)
						return (
							<Button
								variant="ghost"
								className="!font-bold"
							>
								{user?.id && `${user?.firstName} ${user?.lastName}`}{" "}
								<ChevronDown size={11} />
							</Button>
						)
					}}
				>
					<div>
						<ul>
							<li>
								<Button
									variant="ghost"
									onClick={handleLogout}
								>
									Logout
								</Button>
							</li>
						</ul>
					</div>
				</Dropdown>
			</nav>
		</header>
	)
}
