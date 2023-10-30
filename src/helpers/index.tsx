import { useContext } from "react"
import clm from "country-locale-map"
import countryList from "country-list"

import { AppContext } from "../AppContext"

export function parseJwt(token: string) {
	try {
		return JSON.parse(atob(token.split(".")[1]))
	} catch (e) {
		return null
	}
}

// todo add context for each formatter

export function DateFormatter({ value }: { value: string | null }) {
	const context = useContext(AppContext)

	const { user } = context || {}

	if (!value) return

	return <> {new Intl.DateTimeFormat(user?.locale).format(new Date(value))}</>
}

export function CurrencyFormatter({ value }: { value: number }) {
	const context = useContext(AppContext)

	const { user } = context || {}

	console.log("user", user)
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
