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
	subYears,
	subQuarters,
	subMonths,
	addYears,
	subDays,
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
			<div className="flex">
				<div className="flex">
					<div className="min-w-[12rem] mr-2">
						<Select
							options={revenueAccounts}
							value={selectedRevenueAccount}
							size="sm"
							isClearable
							// placeholder="Revenue Account"
							onChange={(e) =>
								onChange({ ...filter, selectedRevenueAccount: e })
							}
						/>
					</div>
					<div className="min-w-[12rem] mr-2">
						<Select
							options={expenseAccounts}
							value={selectedExpenseAccount}
							size="sm"
							isClearable
							// placeholder="Expense Account"
							onChange={(e) =>
								onChange({ ...filter, selectedExpenseAccount: e })
							}
						/>
					</div>
				</div>
				<div className="mb-3">
					<Dropdown
						direction="end"
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
										{/* <li>This week</li> */}
										<li
											onClick={() => {
												onChange({
													...filter,
													startDate: startOfMonth(new Date()),
													endDate: endOfMonth(new Date()),
												})
												// setStartDate(startOfMonth(new Date()))
												// setEndDate(endOfMonth(new Date()))
												setDateRange("This Month")
												setIsOpen(false)
											}}
											className="flex justify-between"
										>
											<div>This Month</div>
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
												setDateRange("This Quarter")
												setIsOpen(false)
											}}
											className="flex justify-between"
										>
											<div>This Quarter</div>
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
												setDateRange("This Year")
												setIsOpen(false)
											}}
											className="flex justify-between"
										>
											<div>This Year</div>
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
									<hr />
									<ul>
										{/* <li
										onClick={() => {
											onChange({
												...filter,
												startDate: subWeeks(new Date(), 1),
												endDate: new Date(),
											})
											setDateRange("Last Week")
											setIsOpen(false)
										}}
										className="flex justify-between"
									>
										<div>Last Week</div>
										<div>
											{DateFormatter({
												value: `${subWeeks(new Date(), 1).toISOString()}`,
												showTime: false,
											})}
											{` - `}
											{DateFormatter({
												value: `${new Date().toISOString()}`,
												showTime: false,
											})}
										</div>
									</li> */}
										<li
											onClick={() => {
												onChange({
													...filter,
													startDate: subMonths(new Date(), 1),
													endDate: new Date(),
												})
												setDateRange("Last Month")
												setIsOpen(false)
											}}
											className="flex justify-between"
										>
											<div>Last Month</div>
											<div>
												{DateFormatter({
													value: `${subMonths(new Date(), 1).toISOString()}`,
													showTime: false,
												})}
												{` - `}
												{DateFormatter({
													value: `${new Date().toISOString()}`,
													showTime: false,
												})}
											</div>
										</li>
										<li
											onClick={() => {
												onChange({
													...filter,
													startDate: subQuarters(new Date(), 1),
													endDate: new Date(),
												})
												setDateRange("Last Quarter")
												setIsOpen(false)
											}}
											className="flex justify-between"
										>
											<div>Last Quarter</div>
											<div>
												{DateFormatter({
													value: `${subQuarters(new Date(), 1).toISOString()}`,
													showTime: false,
												})}
												{` - `}
												{DateFormatter({
													value: `${new Date().toISOString()}`,
													showTime: false,
												})}
											</div>
										</li>
										<li
											onClick={() => {
												onChange({
													...filter,
													startDate: subYears(new Date(), 1),
													endDate: new Date(),
												})
												setDateRange("Last Year")
												setIsOpen(false)
											}}
											className="flex justify-between"
										>
											<div>Last Year</div>
											<div>
												{DateFormatter({
													value: `${subYears(new Date(), 1).toISOString()}`,
													showTime: false,
												})}
												{` - `}
												{DateFormatter({
													value: `${new Date().toISOString()}`,
													showTime: false,
												})}
											</div>
										</li>
									</ul>
								</div>
							)
						}}
					/>
				</div>
			</div>
			<div className="flex justify-end">
				<div className="mr-2">
					<DatePickerWrapper
						render={({ userLocale }) => (
							<ReactDatePicker
								selected={startDate}
								placeholderText="From Date"
								minDate={subYears(new Date(), 1)}
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
									<input className="w-full px-4 py-1 bg-accent border border-theme-border rounded text-sm" />
								}
							/>
						)}
					/>
				</div>
				<div className="">
					<DatePickerWrapper
						render={({ userLocale }) => (
							<ReactDatePicker
								selected={endDate}
								placeholderText="To Date"
								minDate={startDate}
								maxDate={addYears(subDays(startDate || new Date(), 1), 1)}
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
									<input className="w-full px-4 py-1 bg-accent border border-theme-border rounded text-sm" />
								}
							/>
						)}
					/>
				</div>
			</div>
		</div>
	)
}
