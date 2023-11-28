import { CSVLink } from "react-csv"

import { JournalType } from "../../types"
// import { Button } from "../../ui";
import { DownloadCloud } from "react-feather"

type DownloadType = {
	data: JournalType[]
}

function formatData(data: JournalType[]) {
	const header = [
		{ label: "Date", key: "date" },
		{ label: "Account", key: "account" },
		{ label: "Type", key: "type" },
		{ label: "Amount", key: "amount" },
		{ label: "Description", key: "description" },
	]

	const formattedData = data.map((item) => {
		const { date, note, account_name, account_type, amount } = item
		return {
			date: new Date(date).toLocaleString(),
			account: account_name,
			type: account_type,
			amount,
			description: note,
		}
	})
	return {
		header,
		formattedData,
	}
}

export default function Download({ data }: DownloadType) {
	const { header, formattedData } = formatData(data)

	if (!formattedData.length) return

	return (
		<CSVLink
			headers={header}
			data={formattedData}
			filename={`${new Date(
				`${formattedData[0].date}`
			).toLocaleDateString()}-${new Date(
				`${formattedData[formattedData.length - 1].date}`
			).toLocaleDateString()}-journal.csv`}
			className="flex items-center p-2 text-sm text-slate-400 hover:text-slate-500"
			target="_blank"
		>
			<DownloadCloud
				size={11}
				className="mr-2"
			/>{" "}
			Download CSV
		</CSVLink>
	)
}
