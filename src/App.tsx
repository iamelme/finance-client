import {
	Link,
	BrowserRouter,
	Routes,
	Route,
	// createBrowserRouter,
	// RouterProvider,
} from "react-router-dom"

import AppProvider from "./AppContext"
import Header from "./layout/Header"
import ProtectedWrapper from "./components/ProtectedWrapper"
import Container from "./layout/Container"
import Login from "./components/Login"
import Root from "./components/"
import Journal from "./components/journal"
import JournalForm from "./components/journal/Form"
import AccountItemForm from "./components/account/Form"
import AccountItem from "./components/account"
import Register from "./components/Register"
import Report from "./components/report"

// const router = createBrowserRouter([
// 	{
// 		path: "/login",
// 		element: <Login />,
// 	},
// 	{
// 		path: "/",
// 		element: (
// 			<div>
// 				Hello world! <Link to="/login">Login</Link>{" "}
// 				<div>
// 					<Link to="/dashboard">Dashboard</Link>
// 				</div>
// 			</div>
// 		),
// 	},
// 	{
// 		path: "/",
// 		element: <Container />,
// 		children: [
// 			{
// 				element: <ProtectedWrapper />,
// 				// children: [
// 				// 	{
// 				// 		path: "dashboard",
// 				// 		element: <Dashboard />,
// 				// 	},
// 				// 	{
// 				// 		path: "journal",
// 				// 		element: <Journal />,
// 				// 	},
// 				// ],
// 			},
// 		],
// 	},
// ])

export default function App() {
	return (
		<AppProvider>
			<BrowserRouter>
				<Header />
				{/* <RouterProvider router={router} /> */}
				<Routes>
					<Route
						path="/"
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
						path="/login"
						element={<Login />}
					/>
					<Route
						path="/register"
						element={<Register />}
					/>
					<Route element={<Container />}>
						<Route element={<ProtectedWrapper />}>
							<Route
								path="dashboard"
								element={<Root />}
							>
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
				</Routes>
			</BrowserRouter>
		</AppProvider>
	)
}
