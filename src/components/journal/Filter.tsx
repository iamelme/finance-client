import { Filter as FilterIcon, Plus } from "react-feather"
import { Button, Dropdown, Switch } from "../../ui"
import ReactDatePicker from "react-datepicker"
import { addYears, subDays, subYears } from "date-fns"
import { useNavigate } from "react-router-dom"
import type { FilterDataType } from "./index"

type FilterType = {
	locale: string
	filter: FilterDataType
	onChange: (filter: FilterDataType) => void
	onIsLoading: (isLoading: boolean) => void
}

export default function Filter(props: FilterType) {
	const { locale, filter, onChange, onIsLoading } = props

	const navigate = useNavigate()

	return (
		<div className="flex ">
			<Dropdown
				direction="end"
				// onClickOutside={(e) => console.log("e outside", e)}
				trigger={(props) => {
					const { isOpen } = props
					// console.log("trigger props", props)
					return (
						<Button
							variant="outline"
							color="secondary"
							className={`${isOpen ? "bg-slate-200" : ""}`}
						>
							<FilterIcon
								size={11}
								className="mr-1"
							/>{" "}
							Filter
						</Button>
					)
				}}
				className="mr-2"
				size="auto"
			>
				<div className="p-3 w-[15rem]">
					Type
					<div>
						<Switch
							type="checkbox"
							name="type"
							label="Revenue"
							id="revenue"
							value="Revenue"
							checked={filter.type.includes("Revenue")}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
								e.stopPropagation()
								const { checked, value } = e.target
								onChange({
									...filter,
									type: checked
										? [...filter.type, value]
										: filter.type.filter((type) => type !== value),
								})
								onIsLoading(true)
							}}
						/>
					</div>
					<div className="mb-2">
						<Switch
							label="Expense"
							id="expense"
							value="Expense"
							isChecked={filter.type.includes("Expense")}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
								const { checked, value } = e.target
								onChange({
									...filter,
									type: checked
										? [...filter.type, value]
										: filter.type.filter((type) => type !== value),
								})
								onIsLoading(true)
							}}
						/>
					</div>
					<div className="mb-3">
						<ReactDatePicker
							selected={filter.startDate}
							placeholderText="From Date"
							minDate={subYears(new Date(), 1)}
							maxDate={filter.endDate}
							showTimeSelect
							locale={locale as string}
							dateFormat="Pp"
							wrapperClassName="w-full"
							onChange={(date) => {
								// setStartDate(date)
								onChange({ ...filter, startDate: date as Date })
								onIsLoading(true)
							}}
							customInput={
								<input className="w-full px-4 py-1 bg-accent border border-slate-300 rounded text-sm" />
							}
						/>
					</div>
					<div className="">
						<ReactDatePicker
							selected={filter.endDate}
							placeholderText="To Date"
							minDate={filter.startDate}
							maxDate={addYears(subDays(filter.startDate || new Date(), 1), 1)}
							showTimeSelect
							locale={locale as string}
							dateFormat="Pp"
							wrapperClassName="w-full"
							onChange={(date) => {
								// setEndDate(date)
								onChange({ ...filter, endDate: date as Date })
								onIsLoading(true)
							}}
							customInput={
								<input className="w-full px-4 py-1 bg-accent border border-slate-300 rounded text-sm" />
							}
						/>
					</div>
				</div>
			</Dropdown>
			<div className="inline-block">
				<Button onClick={() => navigate("/journal/add")}>
					<Plus
						className="mr-1 leading-3	"
						size={11}
						strokeWidth={3}
					/>
					Add new
				</Button>
			</div>
		</div>
	)
}
