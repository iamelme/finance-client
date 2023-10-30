import { useState, useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { Plus, Edit } from "react-feather"

import useAxios from "../../hooks/useAxios"
import { bgType, DateFormatter, CurrencyFormatter } from "../../helpers"
import { JournalType } from "../../types"
import { Button, Card, CardBody } from "../../ui"

export default function List() {
	const [journals, setJournals] = useState<JournalType[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [selected, setSelected] = useState<Record<string, boolean>>({})

	const [filter, setFilter] = useState({ limit: 25, offset: 0 })
	const navigate = useNavigate()

	const ax = useAxios()

	useEffect(() => {
		const fetchJournals = async () => {
			try {
				const res = await ax.get("/journal", {
					params: filter,
				})

				console.log("journals res", res)

				setJournals(res?.data)
			} catch (err) {
				console.error(err)
			}
			setIsLoading(false)
		}

		if (isLoading) fetchJournals()
	}, [isLoading])

	const handleDelete = async () => {
		try {
			const promises = Object.keys(selected).map(async (key) =>
				selected[key] ? await ax.delete(`/journal/${key}`) : false
			)

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
			const obj = journals?.reduce((acc, cur) => {
				acc[cur.id] = true

				return acc
			}, {} as Record<string, boolean>)

			setSelected(obj)

			return
		}
		setSelected({})
	}

	console.log("selected", selected)

	const someAreSelected = Object.values(selected).some((v) => v)
	const areAllSelected =
		Object.values(selected).every((v) => v) &&
		Object.values(selected)?.length === journals.length
	return (
		<>
			<header className="flex justify-between my-5">
				<h2 className="text-xl">Journal</h2>

				<div>
					<Button onClick={() => navigate("/dashboard/journal/add")}>
						<Plus
							className="mr-1 leading-3	"
							size={11}
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
								<th className="p-2 w-10">
									<input
										type="checkbox"
										checked={areAllSelected}
										onChange={handleToggleAll}
									/>
								</th>
								<th className="p-2 text-sm uppercase">Date</th>
								<th className="p-2 text-sm uppercase">Account</th>
								<th className="p-2 text-sm uppercase text-right">Amount</th>
								<th className="p-2 text-sm uppercase">Note</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{journals.map((journal: JournalType) => (
								<tr key={journal.id}>
									<td className="p-2 border-t border-t-slate-200">
										<input
											type="checkbox"
											checked={selected[journal.id]}
											onChange={(e) =>
												setSelected({
													...selected,
													[journal.id]: e.target.checked,
												})
											}
										/>
									</td>
									<td className="p-2  border-t border-t-slate-200">
										<DateFormatter value={journal?.date ?? null} />
									</td>
									<td className={`p-2  border-t border-t-slate-200  `}>
										<div
											className={`inline-block py-1 px-2 rounded-md ${bgType(
												journal.account_type
											)}`}
										>
											{journal.account_name}
										</div>
									</td>
									<td className="p-2  border-t border-t-slate-200 text-right ">
										<span className="font-bold">
											<CurrencyFormatter value={journal.amount} />
										</span>
									</td>
									<td className="p-2  border-t border-t-slate-200 text-gray-600">
										{journal.note}
									</td>
									<td className="p-2  border-t border-t-slate-200 text-right">
										<Button
											variant="ghost"
											color="secondary"
											aria-label="Edit"
											onClick={() =>
												navigate(`/dashboard/journal/${journal.id}`)
											}
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
			<Outlet />
		</>
	)
}
