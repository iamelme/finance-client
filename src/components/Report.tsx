import {} from "date-fns"
import { useEffect, useState } from "react"
import useAxios from "../hooks/useAxios"
import { DatePickerWrapper, Select } from "../ui"
import ReactDatePicker from "react-datepicker"

export default function Report() {
	const [startDate, setStartDate] = useState<Date | null>(null)
	const [endDate, setEndDate] = useState<Date | null>(null)

	const [accounts, setAccounts] = useState<Record<string, string>[]>([])
	const [selectedRevenueAccount, setSelectedRevenueAccount] =
		useState<Record>(null)
	const [selectedExpenseAccount, setSelectedExpenseAccount] = useState(null)

	const [selectedAccount, setSelectedAccount] = useState(null)
	const [report, setReport] = useState(null)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [errorMessage, setErrorMessage] = useState("")

	const ax = useAxios()

	const expenseAccounts = accounts.filter(
		(account) => account.type === "Expense"
	)
	const revenueAccounts = accounts.filter(
		(account) => account.type === "Revenue"
	)

	const loadReport = async (accountId: string) => {
		try {
			const res = await ax.get("/report/journal", {
				params: {
					startDate,
					endDate,
					accountId,
				},
			})

			console.log("report res", res.data)
			setReport(res.data)
		} catch (e) {
			console.error(e)
		}
	}

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

	useEffect(() => {
		if (startDate && endDate) {
			if (selectedRevenueAccount) {
				loadReport(selectedRevenueAccount.value)
			}
			if (selectedExpenseAccount) {
				loadReport(selectedExpenseAccount.value)
			}
		}
	}, [startDate, endDate, selectedRevenueAccount, selectedExpenseAccount])

	console.log({ expenseAccounts, revenueAccounts })

	return (
		<>
			<h2>Report</h2>

			<div className="flex">
				<div className="min-w-[12rem]">
					<Select
						options={revenueAccounts}
						value={selectedRevenueAccount}
						size="sm"
						onChange={(e) => setSelectedRevenueAccount(e)}
					/>
				</div>
				<div className="min-w-[12rem]">
					<Select
						options={expenseAccounts}
						value={selectedExpenseAccount}
						size="sm"
						onChange={(e) => setSelectedExpenseAccount(e)}
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
								setStartDate(date)
								// setFilter({ ...filter, startDate: date as Date })
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
								setEndDate(date)
								// setFilter({ ...filter, endDate: date as Date })
								// setIsLoading(true)
							}}
							customInput={
								<input className="w-full px-4 py-1 bg-white border border-slate-300 rounded text-sm" />
							}
						/>
					)}
				/>
			</div>
		</>
	)
}
