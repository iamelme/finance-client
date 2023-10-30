import { useState, useEffect } from "react"
import useAxios from "../../hooks/useAxios"
import { useNavigate } from "react-router-dom"
import type { AccountType } from "../../types"
import { Button, Card, CardBody } from "../../ui"
import { Edit, Plus } from "react-feather"
import { bgType } from "../../helpers"

export default function AccountItem() {
	const [isLoading, setIsLoading] = useState(true)
	const [accounts, setAccounts] = useState<AccountType[]>([])
	const [selected, setSelected] = useState<Record<string, boolean>>({})

	const navigate = useNavigate()
	const ax = useAxios()

	useEffect(() => {
		const loadAccountItems = async () => {
			try {
				const res = await ax.get("/account")
				console.log("account items res", res.data)
				setAccounts(res.data)
			} catch (e) {
				console.error(e)
			}
			setIsLoading(false)
		}
		if (isLoading) loadAccountItems()
	}, [isLoading])

	const handleDelete = async () => {
		try {
			const promises = Object.keys(selected).map(async (key) =>
				selected[key] ? await ax.delete(`/account/${key}`) : false
			)
			console.log("promises", promises)

			await Promise.allSettled(promises)

			setIsLoading(true)
			setSelected({})
		} catch (e) {
			console.error(e)
		}
	}
	const handleToggleAll = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { checked } = e.target

		if (checked) {
			const obj = accounts?.reduce((acc, cur) => {
				acc[cur.id] = true

				return acc
			}, {} as Record<string, boolean>)

			setSelected(obj)

			return
		}
		setSelected({})
	}

	console.log("isLoading", isLoading)
	console.log("selected", selected)

	const someAreSelected = Object.values(selected).some((v) => v)
	const areAllSelected =
		Object.values(selected).every((v) => v) &&
		Object.values(selected)?.length === accounts.length

	return (
		<>
			<header className="flex justify-between my-5">
				<h2 className="text-xl">Account</h2>

				<div>
					<Button onClick={() => navigate("/dashboard/account/add")}>
						<Plus
							className="mr-1 leading-3	"
							size={12}
							strokeWidth={3}
						/>
						Add
					</Button>
				</div>
			</header>
			<Card className="mb-3">
				<CardBody>
					<table className="table-auto w-full ">
						<thead className="text-left text-slate-400">
							<tr>
								<th className="p-2 text-sm uppercase w-10">
									<input
										type="checkbox"
										checked={areAllSelected}
										onChange={handleToggleAll}
									/>
								</th>
								<th className="p-2 text-sm uppercase">Name</th>
								<th className="p-2 text-sm uppercase ">Type</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{accounts?.map((item: AccountType) => (
								<tr key={item.id}>
									<td className="p-2  border-t border-t-slate-200">
										<input
											type="checkbox"
											onChange={(e) =>
												setSelected({
													...selected,
													[item.id]: e.target.checked,
												})
											}
										/>
									</td>
									<td className="p-2  border-t border-t-slate-200">
										{item.name}
									</td>
									<td className="p-2  border-t border-t-slate-200">
										<div
											className={`inline-block py-1 px-2 rounded-md ${bgType(
												item.type
											)}`}
										>
											{item.type}
										</div>
									</td>
									<td className="p-2  border-t border-t-slate-200 text-right">
										<Button
											variant="ghost"
											color="secondary"
											onClick={() => navigate(`/dashboard/account/${item.id}`)}
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

			{someAreSelected && <Button onClick={handleDelete}>Delete</Button>}
		</>
	)
}
