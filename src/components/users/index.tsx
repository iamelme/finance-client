import { useEffect, useState } from "react"
import useAxios from "../../hooks/useAxios"
import { Button, Card, CardBody } from "../../ui"
import { ChevronDown, Edit } from "react-feather"
import { DateFormatter } from "../../helpers"
import { UserType } from "../../types"
import { useNavigate } from "react-router-dom"

export default function Home() {
	const navigate = useNavigate()
	const ax = useAxios()

	const [users, setUsers] = useState<UserType[]>([])

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

	return (
		<>
			<Card className="mb-3">
				<CardBody>
					<table className="table-auto w-full ">
						<thead className="text-left text-slate-400">
							<tr>
								{/* <th className="p-2 w-10">
									<input
										type="checkbox"
										checked={areAllSelected}
										onChange={handleToggleAll}
									/>
								</th> */}
								<th
									className="p-2 text-sm uppercase cursor-pointer"
									// onClick={() => handleSort("date")}
								>
									<span className="flex items-center">
										<span>Date</span>
										{/* {filter.sortBy === "date" && (
											<ChevronDown
												size={11}
												className={`ml-1 ease-in-out duration-300 transform ${sortClass(
													filter.sort
												)}`}
											/>
										)} */}
									</span>
								</th>
								<th className="p-2 text-sm uppercase">UserName</th>
								<th className="p-2 text-sm uppercase w-[35%]">First Name</th>
								<th className="p-2 text-sm uppercase w-[35%]">Last Name</th>
								<th className="p-2 text-sm uppercase w-[35%]">Email</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{users.map((user) => (
								<tr key={user.id}>
									{/* <td className="p-2 border-t border-theme-border">
										<input
											type="checkbox"
											checked={selected[user.id] || false}
											onChange={(e) =>
												setSelected({
													...selected,
													[user.id]: e.target.checked,
												})
											}
										/>
									</td> */}
									<td className="p-2  border-t border-theme-border">
										<DateFormatter value={user?.created_at ?? null} />
									</td>
									<td className="p-2  border-t border-theme-border text-gray-600">
										{user?.user_name ?? ""}
									</td>
									<td className="p-2  border-t border-theme-border text-gray-600">
										{user?.first_name ?? ""}
									</td>
									<td className="p-2  border-t border-theme-border text-gray-600">
										{user?.last_name ?? ""}
									</td>
									<td className="p-2  border-t border-theme-border text-gray-600">
										{user?.email ?? ""}
									</td>
									<td className="p-2  border-t border-theme-border text-right">
										<Button
											variant="ghost"
											color="secondary"
											aria-label="Edit"
											onClick={() => navigate(`/user/${user.id}`)}
										>
											<Edit
												size={11}
												strokeWidth={3}
											/>
										</Button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</CardBody>
			</Card>
		</>
	)
}
