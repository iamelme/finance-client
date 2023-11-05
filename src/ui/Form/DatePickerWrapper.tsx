import { useContext, useEffect } from "react"
import { AppContext } from "../../AppContext"
import { registerLocale } from "react-datepicker"
import { getDateFnsLocale } from "../../helpers"

type IDatePickerWrapperProps = {
	render: ({ userLocale }: { userLocale: string }) => React.ReactNode
}

export default function DatePickerWrapper(props: IDatePickerWrapperProps) {
	const { render } = props
	const context = useContext(AppContext)
	const { user } = context || {}

	// const [userLocale,setUserLocale] = useState(user?.locale)

	useEffect(() => {
		registerLocale(user?.locale as string, getDateFnsLocale(user?.locale))
	}, [])

	return <>{render({ userLocale: user?.locale as string })}</>
}
