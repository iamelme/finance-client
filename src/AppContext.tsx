import { createContext, useState } from "react"

const initState = {
	user: {
		firstName: "",
		lastName: "",
		email: "",
		id: "",
		roles: [],
		countryCode: "US",
		locale: "en-US",
		currency: "USD",
	},
	accessToken: "",
}
type UserType = (typeof initState)["user"]

export type AppContextType = {
	user: UserType & { roles: string[] }
	accessToken: string | null
	updateState: ({
		user,
		accessToken,
	}: {
		user?: AppContextType["user"]
		accessToken?: AppContextType["accessToken"]
	}) => void
	logout: () => void
}

export const AppContext = createContext<AppContextType | null>(null)

export default function AppProvider({
	children,
}: {
	children: JSX.Element | JSX.Element[]
}) {
	const [state, setState] = useState<{
		user?: AppContextType["user"]
		accessToken?: AppContextType["accessToken"]
	}>(initState)

	const handleLogout = async () => {
		try {
			console.log("")

			setState(initState)
		} catch (err) {
			console.error(err)
		}
	}
	return (
		<AppContext.Provider
			value={{
				user: state.user?.id ? state.user : initState.user,
				accessToken: state.accessToken || initState.accessToken,
				updateState: ({
					user,
					accessToken,
				}: {
					user?: AppContextType["user"]
					accessToken?: AppContextType["accessToken"]
				}) => {
					console.log({ user, accessToken })
					return setState({
						user: user || state.user,
						accessToken: accessToken || state.accessToken,
					})
				},
				logout: () => {
					handleLogout()
					setState(initState)
				},
			}}
		>
			{children}
		</AppContext.Provider>
	)
}
