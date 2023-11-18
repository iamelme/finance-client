import {
	Link,
	Routes as Router,
	Route,
	// createBrowserRouter,
	// RouterProvider,
} from "react-router-dom"

import ProtectedWrapper from "./components/ProtectedWrapper"
import Container from "./layout/Content"
import Login from "./Pages/Login"
import Root from "./components/"
import Journal from "./components/journal"
import JournalForm from "./components/journal/Form"
import AccountItemForm from "./components/account/Form"
import AccountItem from "./components/account"
import Register from "./Pages/Register"
import Report from "./components/report"
import DashboardLayout from "./layout/Dashboard"
import Dashboard from "./Pages/Dashboard"

export default function Routes() {
	return (
		<Router>
			<Route
				path="/home"
				element={
					<div>
						Hello world! <Link to="/login">Login</Link>{" "}
						<p>
							<Link to="/dashboard">Dashboard</Link>
						</p>
					</div>
				}
			/>
			<Route
				path="login"
				element={<Login />}
			/>
			<Route
				path="register"
				element={<Register />}
			/>
			<Route element={<ProtectedWrapper />}>
				<Route
					path="/"
					element={<DashboardLayout />}
				>
					<Route element={<Container />}>
						<Route
							path=""
							element={<Dashboard />}
						/>
						<Route
							path="report"
							element={<Report />}
						/>
						<Route
							path="journal"
							element={<Root />}
						>
							<Route
								path=""
								element={<Journal />}
							/>
							<Route
								path="add"
								element={<JournalForm />}
							/>
							<Route
								path=":id"
								element={<JournalForm />}
							/>
						</Route>
						<Route
							path="account"
							element={<Root />}
						>
							<Route
								path=""
								element={<AccountItem />}
							/>
							<Route
								path="add"
								element={<AccountItemForm />}
							/>
							<Route
								path=":id"
								element={<AccountItemForm />}
							/>
						</Route>
					</Route>
				</Route>
			</Route>
		</Router>
	)
}
