import { useContext, useEffect, useState } from "react"
import { Link, Outlet } from "react-router-dom"
import instAxios from "../api"
import { AppContext } from "../context/AppContext"
import useAxios from "../hooks/useAxios"
import { UserType } from "../types"

export default function Dashboard() {
	const context = useContext(AppContext)

	const { accessToken } = context || {}

	const ax = useAxios()

	const [users, setUsers] = useState([])

	useEffect(() => {
		const loadUsers = async () => {
			try {
				const res = await ax.get("/users")
				console.log("users res", res)

				setUsers(res?.data)
			} catch (err) {
				console.error(err)
			}
		}

		loadUsers()
	}, [])

	const handleRefreshToken = async () => {
		try {
			const res = await instAxios.get("/refresh", {
				withCredentials: true,
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			})

			console.log("refresh res", res)
		} catch (err) {
			console.error(err)
		}
	}

	return (
		<>
			<div>
				<Link to="/dashboard/journal">journal</Link>
			</div>
			Dashboard <Link to="/">Home</Link>
			<div>
				{users?.map((user: UserType) => (
					<div
						key={user?.id}
						className="mb-3"
					>
						{user?.user_name} {user?.email}
					</div>
				))}
				<button
					type="button"
					className="rounded-sm	px-2 py-1 bg-blue-500 text-white"
					onClick={handleRefreshToken}
				>
					Refresh
				</button>
			</div>
			<Outlet />
		</>
	)
}
