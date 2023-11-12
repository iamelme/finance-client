import {
	BrowserRouter,
	// createBrowserRouter,
	// RouterProvider,
} from "react-router-dom"

import AppProvider from "./context/AppContext"
// import Header from "./layout/Header"
// import ProtectedWrapper from "./components/ProtectedWrapper"
// import Container from "./layout/Content"
// import Login from "./components/Login"
// import Root from "./components/"
// import Journal from "./components/journal"
// import JournalForm from "./components/journal/Form"
// import AccountItemForm from "./components/account/Form"
// import AccountItem from "./components/account"
// import Register from "./components/Register"
// import Report from "./components/report"

import Layout from "./layout"

export default function App() {
	return (
		<AppProvider>
			<BrowserRouter>
				<Layout />
			</BrowserRouter>
		</AppProvider>
	)
}
