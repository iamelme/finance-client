import React, { useEffect, useRef, useState } from "react"

const classes = {
	size: {
		base: "w-48",
		auto: "auto",
	},
}

type Size = keyof typeof classes.size

type DropdownProps = {
	className?: string
	size?: Size
	direction?: "start" | "end"
	trigger: (v: any) => React.ReactNode
	content?: (v: any) => React.ReactNode | React.ReactNode
	children?: React.ReactNode
	onClickOutside?: (v: any) => void
}

export default function Dropdown({
	className = "",
	size = "base",
	direction = "start",
	onClickOutside,
	content,
	children,
	trigger,
}: DropdownProps) {
	const ref = useRef<HTMLDivElement>(null)
	const dropdownRef = useRef<HTMLDivElement>(null)

	const [isOpen, setIsOpen] = useState(false)
	// console.log("direction", direction)

	const [xPos, setXPos] = useState("")

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside)
		// window.addEventListener("click", (e) => {
		// 	if (!ref.current?.contains(e.target as Node)) {
		// 		console.log("outside")
		// 		// setIsOpen(false)
		// 	} else {
		// 		console.log("inside")
		// 	}
		// })
		if (isOpen) {
			const windowWidth = window.innerWidth
			// console.log("windowWidth", windowWidth)
			const isDropdownOverlap =
				(dropdownRef?.current?.getBoundingClientRect()?.right ?? 0) >=
				windowWidth
			// console.log("unsa man jd", isDropdownOverlap)
			if (isDropdownOverlap) {
				// console.log("yess ======= end")
				setXPos("end")
			} else {
				setXPos("start")
			}
		}
		return () => {
			document.removeEventListener("mousedown", handleClickOutside)
			// window.removeEventListener("click", () => {
			// 	console.log("remove")
			// })
		}
	}, [isOpen])

	const handleClickOutside = (e: MouseEvent) => {
		if (ref.current && !ref.current.contains(e.target as Node)) {
			console.log("ref", ref.current)
			setIsOpen(false)
			onClickOutside?.("test")
		} else {
			setIsOpen(true)

			// console.log("inside")
		}
	}

	// console.log("isOpen", isOpen, "xPos", xPos)

	const renderTrigger = trigger({ isOpen, setIsOpen })

	return (
		<div
			ref={ref}
			className={`relative inline-block ${size} ${className}`}
		>
			{renderTrigger}
			{/* {trigger && ) => trigger({ isOpen, setIsOpen })} */}
			{isOpen && (
				<div
					ref={dropdownRef}
					style={{
						insetInlineEnd:
							xPos === "end" || direction === "end" ? "0" : "auto",
					}}
					className={`absolute ${
						xPos || direction
					}-0 flex flex-col bg-accent  border border-theme-border rounded-md shadow-md z-10 mt-1 p-2 ${
						classes.size[size]
					}`}
				>
					{children ? children : content?.({ isOpen, setIsOpen })}
				</div>
			)}
		</div>
	)
}
