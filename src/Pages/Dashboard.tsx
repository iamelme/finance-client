import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import instAxios from "../api"
import { AppContext } from "../context/AppContext"
import useAxios from "../hooks/useAxios"
import { UserType } from "../types"

export default function Dashboard() {
	const context = useContext(AppContext)

	const { accessToken } = context || {}

	// add indicator if this month revenue and expense is positive or negative
	return <>Dashboard page</>
}
