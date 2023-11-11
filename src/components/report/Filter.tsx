import { useEffect, useState } from "react"
import { Button, DatePickerWrapper, Dropdown, Select } from "../../ui"
import { Calendar } from "react-feather"
import ReactDatePicker from "react-datepicker"
import {
	startOfMonth,
	endOfMonth,
	startOfQuarter,
	endOfQuarter,
	endOfYear,
	startOfYear,
	isSameDay,
} from "date-fns"
import { DateFormatter } from "../../helpers"
import useAxios from "../../hooks/useAxios"

export type FilterType = {
	startDate: Date | null
	endDate: Date | null
	selectedRevenueAccount: { label: string; value: string } | null
	selectedExpenseAccount: { label: string; value: string } | null
}
type FilterProps = {
	filter: FilterType
	onChange: (filter: FilterType) => void
}

export default function Filter(props: FilterProps) {
	const { filter, onChange } = props

	const [accounts, setAccounts] = useState<
		{ label: string; value: string; type?: string }[]
	>([])
	// const [selectedRevenueAccount, setSelectedRevenueAccount] = useState(null)
	// const [selectedExpenseAccount, setSelectedExpenseAccount] = useState(null)
	const [dateRange, setDateRange] = useState("")

	const { startDate, endDate, selectedExpenseAccount, selectedRevenueAccount } =
		filter

	console.log("filter", filter)

	const ax = useAxios()

	useEffect(() => {
		async function loadAccounts() {
			try {
				const res = await ax.get("/account")

				console.log("account items res", res.data)
				setAccounts(
					res?.data?.data?.map(
						(account: { id: string; name: string; type: string }) => ({
							value: account.id,
							label: account.name,
							type: account.type,
						})
					) ?? []
				)
			} catch (e) {
				console.error(e)
			}
		}

		loadAccounts()
	}, [])

	const expenseAccounts = accounts.filter(
		(account) => account?.type === "Expense"
	)
	const revenueAccounts = accounts.filter(
		(account) => account?.type === "Revenue"
	)

	console.log({ expenseAccounts, revenueAccounts })
	return (
		<div>
			<div className="mb-3">
				<Dropdown
					trigger={() => (
						<Button
							variant="outline"
							color="secondary"
						>
							<Calendar
								size={11}
								className="mr-1"
							/>{" "}
							Date Range
							{dateRange ? (
								<>
									{": "}
									<span className="inline-block ml-1 font-bold">
										{dateRange}
									</span>
								</>
							) : (
								""
							)}
						</Button>
					)}
					size="auto"
					content={({ isOpen, setIsOpen }) => {
						console.log("isOpen children", isOpen)
						return (
							<div className="w-[20rem]">
								<ul>
									<li>This week</li>
									<li
										onClick={() => {
											onChange({
												...filter,
												startDate: startOfMonth(new Date()),
												endDate: endOfMonth(new Date()),
											})
											// setStartDate(startOfMonth(new Date()))
											// setEndDate(endOfMonth(new Date()))
											setDateRange("This month")
											setIsOpen(false)
										}}
										className="flex justify-between"
									>
										<div>This month </div>
										<div>
											{DateFormatter({
												value: `${startOfMonth(new Date()).toISOString()}`,
												showTime: false,
											})}
											{` - `}
											{DateFormatter({
												value: `${endOfMonth(new Date()).toISOString()}`,
												showTime: false,
											})}
										</div>
									</li>
									<li
										onClick={() => {
											onChange({
												...filter,
												startDate: startOfQuarter(new Date()),
												endDate: endOfQuarter(new Date()),
											})
											// setStartDate(startOfQuarter(new Date()))
											// setEndDate(endOfQuarter(new Date()))
											setDateRange("This quarter")
											setIsOpen(false)
										}}
										className="flex justify-between"
									>
										<div>This quarter</div>
										<div>
											{DateFormatter({
												value: `${startOfQuarter(new Date()).toISOString()}`,
												showTime: false,
											})}
											{` - `}
											{DateFormatter({
												value: `${endOfQuarter(new Date()).toISOString()}`,
												showTime: false,
											})}
										</div>
									</li>
									<li
										onClick={() => {
											onChange({
												...filter,
												startDate: startOfYear(new Date()),
												endDate: endOfYear(new Date()),
											})
											// setStartDate(startOfYear(new Date()))
											// setEndDate(endOfYear(new Date()))
											setDateRange("This year")
											setIsOpen(false)
										}}
										className="flex justify-between"
									>
										<div>This year</div>
										<div>
											{DateFormatter({
												value: `${startOfYear(new Date()).toISOString()}`,
												showTime: false,
											})}
											{` - `}
											{DateFormatter({
												value: `${endOfYear(new Date()).toISOString()}`,
												showTime: false,
											})}
										</div>
									</li>
								</ul>
								<ul>
									<li>Last week</li>
									<li>Last month</li>
									<li>Last quarter</li>
									<li onClick={() => setIsOpen(!isOpen)}>Last year</li>
								</ul>
							</div>
						)
					}}
				/>
			</div>

			<div className="flex">
				<div className="min-w-[12rem]">
					<Select
						options={revenueAccounts}
						value={selectedRevenueAccount}
						size="sm"
						isClearable
						onChange={(e) => onChange({ ...filter, selectedRevenueAccount: e })}
					/>
				</div>
				<div className="min-w-[12rem]">
					<Select
						options={expenseAccounts}
						value={selectedExpenseAccount}
						size="sm"
						isClearable
						onChange={(e) => onChange({ ...filter, selectedExpenseAccount: e })}
					/>
				</div>
			</div>

			<div className="mr-2">
				<DatePickerWrapper
					render={({ userLocale }) => (
						<ReactDatePicker
							selected={startDate}
							placeholderText="From Date"
							maxDate={endDate}
							showTimeSelect
							locale={userLocale}
							dateFormat="Pp"
							onChange={(date) => {
								if (date && startDate && !isSameDay(date, startDate)) {
									setDateRange("Custom")
								}
								// setStartDate(date)
								onChange({ ...filter, startDate: date as Date })
								// setIsLoading(true)
							}}
							customInput={
								<input className="w-full px-4 py-1 bg-white border border-slate-300 rounded text-sm" />
							}
						/>
					)}
				/>
			</div>
			<div className="mr-2">
				<DatePickerWrapper
					render={({ userLocale }) => (
						<ReactDatePicker
							selected={endDate}
							placeholderText="To Date"
							minDate={startDate}
							showTimeSelect
							locale={userLocale}
							dateFormat="Pp"
							onChange={(date) => {
								if (date && endDate && !isSameDay(date, endDate)) {
									setDateRange("Custom")
								}
								onChange({ ...filter, endDate: date as Date })
								// setIsLoading(true)
								// setEndDate(date)
							}}
							customInput={
								<input className="w-full px-4 py-1 bg-white border border-slate-300 rounded text-sm" />
							}
						/>
					)}
				/>
			</div>
		</div>
	)
}
