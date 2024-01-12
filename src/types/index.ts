import { FieldErrors } from "react-hook-form"

export type AccountType = {
	id: string
	name: string
	type: string
}

export type JournalType = {
	id: string
	date: string
	account_type: string
	account_name: string
	amount: number
	human_id?: string
	note: string
}

export type UserType = {
	id: string
	created_at: string
	first_name: string
	last_name: string
	email: string
	user_name: string
	roles: string[]
	refresh_token: string
}

// form types

export type ErrorType = FieldErrors<any>
{
	errors: FieldErrors<any>
	// | Partial<DeepMap<Record<string, unknown>, FieldError>>
	// | FieldErrors<any>
}

export type ReportType = {
	type: string
	monthly_total: number
	year: number
	month: number
}
