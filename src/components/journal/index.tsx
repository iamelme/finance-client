import { useState, useEffect, useContext } from "react"
import { Outlet, useNavigate, useSearchParams } from "react-router-dom"
import { ChevronDown, Edit } from "react-feather"

import useAxios from "../../hooks/useAxios"
import {
	DateFormatter,
	CurrencyFormatter,
	getDateFnsLocale,
} from "../../helpers"
import { JournalType } from "../../types"
import { Button, Card, CardBody, Pagination } from "../../ui"
import { registerLocale } from "react-datepicker"
import { AppContext } from "../../context/AppContext"
import Filter from "./Filter"

export function bgType(type: string) {
	if (type === "Revenue") return "bg-emerald-100 text-emerald-500"

	return "bg-rose-200 text-rose-500"
}

const initialFilter = {
	searchText: "",
	startDate: null,
	endDate: null,
	sort: "DESC",
	sortBy: "date",
	type: ["Revenue", "Expense"],
	limit: 25,
	totalItems: 0,
	offset: 0,
}
export type FilterDataType = Omit<
	typeof initialFilter,
	"startDate" | "endDate"
> & { startDate: Date | null; endDate: Date | null }

export default function List() {
	const context = useContext(AppContext)
	const { user } = context || {}
	const [journals, setJournals] = useState<JournalType[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [selected, setSelected] = useState<Record<string, boolean>>({})

	const [filter, setFilter] = useState<FilterDataType>(initialFilter)
	const navigate = useNavigate()

	const searchQuery = new URLSearchParams(window.location.search)
	const pageQuery = searchQuery.get("page")

	const [, setSearchParams] = useSearchParams()

	// const [startDate, setStartDate] = useState<Date | null>(null)
	// const [endDate, setEndDate] = useState<Date | null>(null)

	const ax = useAxios()
	const fetchJournals = async () => {
		try {
			const res = await ax.get("/journal", {
				params: {
					searchText: filter.searchText || undefined,
					startDate: filter.startDate,
					endDate: filter.endDate,
					sort: filter.sort,
					sortBy: filter.sortBy,
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

	useEffect(() => {
		registerLocale(user?.locale as string, getDateFnsLocale(user?.locale))
	}, [])

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

	const handleSort = (value: string) => {
		setIsLoading(true)
		setFilter({
			...filter,
			sortBy: value,
			sort: filter.sort === "DESC" ? "ASC" : "DESC",
		})
	}

	console.log("filter", filter)
	// console.log("selected", selected)

	const someAreSelected = Object.values(selected).some((v) => v)
	const areAllSelected =
		Object.values(selected).every((v) => v) &&
		Object.values(selected)?.length === journals.length

	// const offset =
	// 	Number(pageQuery) > 0 ? (Number(pageQuery) - 1) * filter.limit : 0

	const sortClass = (value: string) =>
		value === "DESC" ? "rotate-0" : "rotate-180"
	return (
		<>
			<header className="flex justify-between my-5">
				<h2 className="text-xl">Journal</h2>

				<input
					className="w-[20rem] px-4 py-1 bg-accent border border-theme-border rounded text-sm"
					name="searchText"
					placeholder="Search"
					onChange={(e) => {
						setFilter({ ...filter, [e.target.name]: e.target.value })
						setSearchParams({
							page: "1",
						})
						setIsLoading(true)
					}}
				/>
				<Filter
					locale={user?.locale as string}
					filter={filter}
					onChange={setFilter}
					onIsLoading={setIsLoading}
				/>
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
								<th
									className="p-2 text-sm uppercase cursor-pointer"
									onClick={() => handleSort("date")}
								>
									<span className="flex items-center">
										<span>Date</span>
										{filter.sortBy === "date" && (
											<ChevronDown
												size={11}
												className={`ml-1 ease-in-out duration-300 transform ${sortClass(
													filter.sort
												)}`}
											/>
										)}
									</span>
								</th>
								<th className="p-2 text-sm uppercase">Account</th>
								<th
									className="p-2 text-sm uppercase text-right cursor-pointer"
									onClick={() => handleSort("amount")}
								>
									<span className="flex items-center">
										<span>Amount</span>
										{filter.sortBy === "amount" && (
											<ChevronDown
												size={11}
												className={`ml-1 ease-in-out duration-300 transform ${sortClass(
													filter.sort
												)}`}
											/>
										)}
									</span>
								</th>
								<th className="p-2 text-sm uppercase w-[35%]">Note</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{journals.map((journal: JournalType) => (
								<tr key={journal.id}>
									<td className="p-2 border-t border-theme-border">
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
									<td className="p-2  border-t border-theme-border">
										<DateFormatter value={journal?.date ?? null} />
									</td>
									<td className={`p-2  border-t border-theme-border  `}>
										<div
											className={`inline-block py-1 px-2 rounded-md ${bgType(
												journal.account_type
											)}`}
										>
											{journal.account_name}
										</div>
									</td>
									<td className="p-2  border-t border-theme-border text-right ">
										<span className="font-bold">
											<CurrencyFormatter value={journal.amount} />
										</span>
									</td>
									<td className="p-2  border-t border-theme-border text-gray-600">
										{journal.note}
									</td>
									<td className="p-2  border-t border-theme-border text-right">
										<Button
											variant="ghost"
											color="secondary"
											aria-label="Edit"
											onClick={() => navigate(`/journal/${journal.id}`)}
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
