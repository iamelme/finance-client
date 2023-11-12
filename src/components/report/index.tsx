import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import useAxios from "../../hooks/useAxios"

// import { Button, DatePickerWrapper, Dropdown, Select } from "../../ui"
// import ReactDatePicker from "react-datepicker"
// import {
// 	startOfMonth,
// 	endOfMonth,
// 	startOfQuarter,
// 	endOfQuarter,
// 	endOfYear,
// 	startOfYear,
// 	isSameDay,
// } from "date-fns"
// import { DateFormatter } from "../../helpers"
// import { Calendar } from "react-feather"
import Filter, { FilterType } from "./Filter"
import { CurrencyFormatter } from "../../helpers"
import { Card, CardBody } from "../../ui"

const highestAmount = (groupReport) =>
	Object.keys(groupReport)?.reduce((acc, key) => {
		const month = groupReport[key]?.reduce((innerAcc, innerCur) => {
			if (innerAcc < +innerCur.monthly_total) {
				innerAcc = +innerCur.monthly_total
			}

			return innerAcc
		}, 0)

		if (acc < month) {
			acc = month
		}

		return acc
	}, 0)
const monthOptions = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
]

const margin = { top: 30, right: 20, bottom: 30, left: 50 },
	width = 600 - margin.right,
	height = 500 - margin.top - margin.bottom

export default function Report() {
	// const [startDate, setStartDate] = useState<Date | null>(null)
	// const [endDate, setEndDate] = useState<Date | null>(null)

	const refSvg = useRef<SVGSVGElement | null>(null)
	const refReportJournal = useRef<SVGSVGElement | null>(null)

	const refGroup = useRef<SVGAElement | null>(null)

	const [filter, setFilter] = useState<FilterType>({
		startDate: null,
		endDate: null,
		selectedRevenueAccount: null,
		selectedExpenseAccount: null,
	})

	const { startDate, endDate, selectedExpenseAccount, selectedRevenueAccount } =
		filter

	const [report, setReport] = useState([])
	const [groupReport, setGroupReport] = useState([])
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [errorMessage, setErrorMessage] = useState("")

	const ax = useAxios()

	const loadReport = async ({
		accountRevenueId,
		accountExpenseId,
	}: {
		accountRevenueId?: string
		accountExpenseId?: string
	}) => {
		try {
			const res = await ax.get("/report/journal", {
				params: {
					startDate,
					endDate,
					accountRevenueId,
					accountExpenseId,
				},
			})

			console.log("report res", res.data)
			setReport(res.data?.map((d, idx) => ({ ...d, id: idx + 1 })))

			// const group = res?.data?.reduce((acc, cur, idx: number) => {
			// 	if (!acc[cur.year]) {
			// 		acc[cur.year] = [{ ...cur, id: idx }]
			// 	} else {
			// 		acc[cur.year].push({
			// 			...cur,
			// 			id: idx,
			// 		})
			// 	}

			// 	return acc
			// }, {})
			// setGroupReport(group)
		} catch (e) {
			console.error(e)
		}
	}

	// console.log({ groupReport })

	const group = d3.select(refGroup.current)

	useEffect(() => {
		const svg = d3
			.select(refSvg.current)
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.attr("background", "#ccc")
			.append("g")
			.attr("transform", `translate(${margin.left}, ${margin.bottom})`)

		// xAxis
		const x = d3.scaleBand().range([0, width]).padding(0.2)
		const xAxis = svg
			.append("g")
			.attr("transform", `translate(${0}, ${height})`)

		// yAxis
		const y = d3.scaleLinear().range([height - margin.bottom, 0])
		const yAxis = svg
			.append("g")
			.attr("transform", `translate(${0}, ${margin.bottom})`)

		refReportJournal.current = { svg, x, xAxis, y, yAxis }
	}, [])

	useEffect(() => {
		if (report.length && refReportJournal.current) {
			const {
				svg,
				x,
				xAxis,
				y,
				yAxis,
			}: { svg: unknown; x: any; xAxis: any; y: any; yAxis: any } =
				refReportJournal.current

			x.domain(report.map((d) => d.year))
			xAxis.transition().duration(1000).call(d3.axisBottom(x))

			y.domain([0, d3.max(report, (d) => +d.monthly_total)])
			yAxis.transition().duration(1000).call(d3.axisLeft(y))

			const xSubGroup = d3
				.scaleBand()
				.range([0, x.bandwidth()])
				.domain(report.map((d) => d.id))
				.padding(0.1)

			const update = group.selectAll("g").data(report)

			const enter = update
				.enter()
				.append("g")
				.attr("transform", (d) => {
					console.log("grouper ", d)
					return `translate(${0}, ${margin.bottom})`
				})

			enter.append("rect")
			enter.append("text")

			const bars = update.merge(enter)

			bars
				.select("rect")
				.attr("x", (d) => margin.left + x(d.year) + xSubGroup(d.id))
				.attr("y", (d) => y(+d.monthly_total))

				.attr("width", (d) => xSubGroup.bandwidth())
				.attr("height", (d) => height - margin.bottom - y(+d.monthly_total))
				.attr("transform", `translate(${0}, ${margin.bottom})`)
				.attr("fill", (d) => (d.type === "Revenue" ? "#bbf7d0" : "#fecaca"))

			bars
				.select("text")
				.text((d) => {
					console.log("data text ", d)
					return monthOptions[d.month - 1]
				})
				.attr("x", (d) => x(d.year) + xSubGroup(d.id))
				.attr("y", height + (report.length > 10 ? 15 : 10))
				.attr(
					"transform",
					(d) =>
						`rotate(45, ${margin.left - 30 + x(d.year) + xSubGroup(d.id)}, ${
							height + margin.bottom + margin.left
						})`
				)
				.attr("fill", (d) => (d.type === "Revenue" ? "#166534" : "#991b1b"))
				.style("font-size", (d) => (report?.length > 10 ? 10 : 12))

			update.exit().remove()

			// const bar = svg.selectAll("g.top-g").data(report)

			// const enter = bar.enter().append("g").attr("class", "bars-container")

			// enter
			// 	.append("rect")
			// 	.attr("x", (d) => x(d.year) + xSubGroup(d.id))
			// 	.attr("y", (d) => y(+d.monthly_total))

			// 	.attr("width", (d) => xSubGroup.bandwidth())
			// 	.attr("height", (d) => height - margin.bottom - y(+d.monthly_total))
			// 	.attr("transform", `translate(${0}, ${margin.bottom})`)
			// 	.attr("fill", (d) => (d.type === "Revenue" ? "#bbf7d0" : "#fecaca"))

			// enter
			// 	.append("text")
			// 	.text((d) => {
			// 		console.log("data text ", d)
			// 		return monthOptions[d.month - 1]
			// 	})
			// 	.attr("x", (d) => x(d.year) + xSubGroup(d.id))
			// 	.attr("y", height + margin.bottom)
			// 	.attr(
			// 		"transform",
			// 		(d) =>
			// 			`rotate(45, ${x(d.year) + xSubGroup(d.id)}, ${
			// 				height + margin.bottom
			// 			})`
			// 	)
			// 	.attr("fill", (d) => (d.type === "Revenue" ? "#166534" : "#991b1b"))

			// // bar.selectAll("g.bars-container").exit().remove()
			// bar.exit().remove()
			// bar.exit().remove()

			// const x1 = d3
			// 	.scaleBand()
			// 	.range([0, x.bandwidth()])
			// 	.domain(report.map((d) => d.month))
			// 	.padding(0.1)
			// svg
			// 	.append("g")
			// 	.selectAll("text")
			// 	.data(report)
			// 	.join("text")
			// 	.text((d) => monthOptions[d.month - 1])
			// 	.attr("x", (d) => x(d.year) + x1(d.month))
			// 	.attr("y", (d) => height)
			// 	// .attr("transform", `translate(${0}, ${height + margin.bottom})`)
			// 	.transition()
			// 	.duration(1000)
		}
	}, [report])

	// useEffect(() => {
	// 	if (report.length && refReportJournal.current) {
	// 		const {
	// 			svg,
	// 			x,
	// 			xAxis,
	// 			y,
	// 			yAxis,
	// 		}: { svg: unknown; x: any; xAxis: any; y: any; yAxis: any } =
	// 			refReportJournal.current

	// 		x.domain(report?.map((d) => d.year))
	// 		// x.domain(report?.map((d) => monthOptions[d.month - 1]))
	// 		xAxis.transition().duration(1000).call(d3.axisBottom(x).tickSizeOuter(0))

	// 		y.domain([0, d3.max(report, (d) => +d.monthly_total)])
	// 		yAxis
	// 			.transition()
	// 			.duration(1000)
	// 			.call(
	// 				d3
	// 					.axisLeft(y)
	// 					.tickFormat((d) => `$${d}`)
	// 					.tickSizeOuter(0)
	// 			)
	// 		const bars = svg.selectAll("rect").data(report)

	// 		bars
	// 			.join("rect")
	// 			.attr("x", (d) => x(d.year))
	// 			// .attr("x", (d) => x(monthOptions[d.month - 1]))
	// 			.attr("y", (d) => y(+d.monthly_total))
	// 			.attr("width", x.bandwidth())
	// 			.attr("height", (d) =>
	// 				d.monthly_total <= 0 ? 0 : height - margin.bottom - y(d.monthly_total)
	// 			)
	// 			// .transition()
	// 			// .duration(1000)
	// 			.attr("transform", `translate(${0}, ${margin.bottom})`)
	// 			.attr("fill", (d) => (d.type === "Expense" ? "red" : "green"))
	// 		bars.exit().remove()
	// 	}
	// }, [report])

	useEffect(() => {
		if (startDate && endDate) {
			loadReport({
				accountRevenueId: selectedRevenueAccount?.value,
				accountExpenseId: selectedExpenseAccount?.value,
			})
		}
	}, [startDate, endDate, selectedRevenueAccount, selectedExpenseAccount])

	return (
		<>
			<header className="flex justify-between">
				<h2>Report</h2>
				<Filter
					filter={filter}
					onChange={(newFilter) => setFilter({ ...filter, ...newFilter })}
				/>
			</header>
			<Card className="my-4">
				<CardBody>
					<svg ref={refSvg}>
						<g ref={refGroup} />
					</svg>
				</CardBody>
			</Card>

			<div className="flex">
				<div className="flex-1">
					{report?.map((report, idx) => {
						if (report.type === "Revenue")
							return (
								<div key={idx}>
									<div>
										{monthOptions[report.month - 1]} {report.year} -
										<CurrencyFormatter value={report.monthly_total} />
									</div>
									<div></div>
								</div>
							)
					})}
				</div>
				<div className="flex-1">
					{report?.map((report, idx) => {
						if (report.type === "Expense")
							return (
								<div key={idx}>
									<div>
										{monthOptions[report.month - 1]} {report.year} -
										<CurrencyFormatter value={report.monthly_total} />
									</div>
								</div>
							)
					})}
				</div>
			</div>
		</>
	)
}
