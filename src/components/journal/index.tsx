import { useState, useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { Plus, Edit, ChevronDown, Filter } from "react-feather"

import useAxios from "../../hooks/useAxios"
import { DateFormatter, CurrencyFormatter } from "../../helpers"
import { JournalType } from "../../types"
import { Button, Card, CardBody, Dropdown, Pagination } from "../../ui"
import ReactDatePicker from "react-datepicker"

export function bgType(type: string) {
	if (type === "Revenue") return "bg-green-200 text-green-800"

	return "bg-rose-200 text-rose-800"
}
export default function List() {
	const [journals, setJournals] = useState<JournalType[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [selected, setSelected] = useState<Record<string, boolean>>({})

	const [filter, setFilter] = useState<{
		type: string[]
		sort: string
		searchText: string
		limit: number
		totalItems: number
		offset: number
	}>({
		searchText: "",
		sort: "DESC",
		type: ["Revenue", "Expense"],
		limit: 5,
		totalItems: 0,
		offset: 0,
	})
	const navigate = useNavigate()

	const searchQuery = new URLSearchParams(window.location.search)
	const pageQuery = searchQuery.get("page")

	const [startDate, setStartDate] = useState<Date | null>(null)
	const [endDate, setEndDate] = useState<Date | null>(null)

	const ax = useAxios()
	const fetchJournals = async () => {
		try {
			const res = await ax.get("/journal", {
				params: {
					searchText: filter.searchText || undefined,
					startDate: startDate,
					endDate: endDate,
					sort: filter.sort,
					type: filter.type,
					limit: filter.limit,
					offset:
						Number(pageQuery) > 0 ? (Number(pageQuery) - 1) * filter.limit : 0,
				},
			})

			// console.log("journals res", res)

			setJournals(res?.data?.data)
			setFilter({
				...filter,
				totalItems: Number(res?.data?.total_items) || 0,
			})
		} catch (err) {
			console.error(err)
		}
		setIsLoading(false)
	}

	useEffect(() => {
		if (isLoading) fetchJournals()
	}, [isLoading])

	useEffect(() => {
		// console.log("pageQuery", pageQuery)
		fetchJournals()
	}, [pageQuery])

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

	console.log("filter", filter)
	// console.log("selected", selected)

	const someAreSelected = Object.values(selected).some((v) => v)
	const areAllSelected =
		Object.values(selected).every((v) => v) &&
		Object.values(selected)?.length === journals.length

	const offset =
		Number(pageQuery) > 0 ? (Number(pageQuery) - 1) * filter.limit : 0
	return (
		<>
			<input
				className="w-full px-4 py-1 bg-white border border-slate-300 rounded text-sm"
				name="searchText"
				onChange={(e) => {
					setFilter({ ...filter, [e.target.name]: e.target.value })
					setIsLoading(true)
				}}
			/>
			<header className="flex justify-between my-5">
				<h2 className="text-xl">Journal</h2>

				<div className="flex ">
					<div className="mr-2">
						<ReactDatePicker
							selected={startDate}
							placeholderText="From Date"
							maxDate={endDate}
							onChange={(date) => {
								setStartDate(date)
								// setFilter({ ...filter, startDate: date as Date })
								setIsLoading(true)
							}}
							customInput={
								<input className="w-full px-4 py-1 bg-white border border-slate-300 rounded text-sm" />
							}
						/>
					</div>
					<div className="mr-2">
						<ReactDatePicker
							selected={endDate}
							placeholderText="To Date"
							minDate={startDate}
							onChange={(date) => {
								setEndDate(date)
								// setFilter({ ...filter, endDate: date as Date })
								setIsLoading(true)
							}}
							customInput={
								<input className="w-full px-4 py-1 bg-white border border-slate-300 rounded text-sm" />
							}
						/>
					</div>
					<Dropdown
						direction="end"
						onClickOutside={(e) => console.log("e outside", e)}
						trigger={(props) => {
							const { isOpen } = props
							console.log("trigger props", props)
							return (
								<Button
									variant="outline"
									color="secondary"
									className={`${isOpen ? "bg-slate-200" : ""}`}
								>
									<Filter
										size={11}
										className="mr-1"
									/>{" "}
									Filter
								</Button>
							)
						}}
						className="mr-2"
					>
						<div>
							Sort by
							<div>
								<label htmlFor="desc">
									<input
										type="radio"
										name="sort"
										id="desc"
										value="DESC"
										checked={filter.sort === "DESC"}
										onChange={(e) => {
											setFilter({
												...filter,
												sort: e.target.value,
											})
											setIsLoading(true)
										}}
									/>{" "}
									Newest
								</label>
								<label htmlFor="asc">
									<input
										type="radio"
										name="sort"
										id="asc"
										value="ASC"
										checked={filter.sort === "ASC"}
										onChange={(e) => {
											setFilter({
												...filter,
												sort: e.target.value,
											})
											setIsLoading(true)
										}}
									/>{" "}
									Oldest
								</label>
							</div>
							Type
							<div>
								<label htmlFor="revenue">
									<input
										type="checkbox"
										name="type"
										id="revenue"
										value="Revenue"
										checked={filter.type.includes("Revenue")}
										onChange={(e) => {
											setFilter({
												...filter,
												type: e.target.checked
													? [...filter.type, e.target.value]
													: filter.type.filter(
															(type) => type !== e.target.value
													  ),
											})
											setIsLoading(true)
										}}
									/>{" "}
									Revenue
								</label>
							</div>
							<div>
								<label htmlFor="expense">
									<input
										type="checkbox"
										name="type"
										id="expense"
										value="Expense"
										checked={filter.type.includes("Expense")}
										onChange={(e) => {
											setFilter({
												...filter,
												type: e.target.checked
													? [...filter.type, e.target.value]
													: filter.type.filter(
															(type) => type !== e.target.value
													  ),
											})
											setIsLoading(true)
										}}
									/>{" "}
									Expense
								</label>
							</div>
						</div>
					</Dropdown>
					<div className="inline-block">
						<Button onClick={() => navigate("/dashboard/journal/add")}>
							<Plus
								className="mr-1 leading-3	"
								size={11}
								strokeWidth={3}
							/>
							Add
						</Button>
					</div>
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
											checked={selected[journal.id] || false}
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
			<div className="flex justify-between items-center">
				<div>
					{someAreSelected && <Button onClick={handleDelete}>Delete</Button>}
				</div>
				<div>
					<Pagination
						data={{
							limit: filter.limit,
							totalItems: filter.totalItems,
							offset:
								Number(pageQuery) > 0
									? (Number(pageQuery) - 1) * filter.limit
									: 0,
						}}
					/>
				</div>
			</div>
			<Outlet />
		</>
	)
}
