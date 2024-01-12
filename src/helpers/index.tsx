import { useContext } from "react"
import clm from "country-locale-map"
import countryList from "country-list"

import * as Locales from "date-fns/locale"

import { AppContext } from "../context/AppContext"
import { ReportType } from "../types"

export function parseJwt(token: string) {
	try {
		return JSON.parse(atob(token.split(".")[1]))
	} catch (e) {
		return null
	}
}

// todo add context for each formatter

export function getDateFnsLocale(locale?: string) {
	const newLocale = locale?.replace("-", "") as keyof typeof Locales

	const res = Locales[newLocale] ?? Locales.enUS

	return res
}

export function DateFormatter({
	value,
	showTime = true,
}: {
	value: string | null
	showTime?: boolean
}) {
	const context = useContext(AppContext)

	const { user } = context || {}

	if (!value) return

	return (
		<>
			{new Intl.DateTimeFormat(user?.locale, {
				year: "numeric",
				month: "numeric",
				day: "numeric",
			}).format(new Date(value))}
			{showTime && (
				<div className="text-sm text-slate-400">
					{new Intl.DateTimeFormat(user?.locale, {
						hour: "numeric",
						minute: "numeric",
						hourCycle: "h12",
					}).format(new Date(value))}
				</div>
			)}
		</>
	)
}

export function CurrencyFormatter({ value }: { value: number }) {
	const context = useContext(AppContext)

	const { user } = context || {}

	return new Intl.NumberFormat(user?.locale, {
		style: "currency",
		currency: user?.currency,
	}).format(value)
}

export function bgType(type: string) {
	if (type === "Revenue") return "bg-green-200 text-green-800"

	return "bg-red-200 text-red-800"
}

export function trimmer(str: string) {
	return str?.replace(/ +(?= )/g, " ")?.trim()
}

export function listOfCountries() {
	return countryList.getData()?.map((country) => ({
		label: country?.name,
		value: country?.code,
		locale: clm
			?.getCountryByAlpha2(country?.code)
			?.default_locale.replace("_", "-"),
		currency: clm?.getCountryByAlpha2(country?.code)?.currency,
		flag: clm?.getCountryByAlpha2(country?.code)?.emoji,
	}))
}

export function getCountry(code: string) {
	return listOfCountries()?.find((country) => country?.value === code)
}

export function totalAmount(arr: ReportType[], type: string) {
	return arr?.reduce(
		(acc, cur) => (cur.type === type ? (acc += cur.monthly_total) : acc),
		0
	)
}
