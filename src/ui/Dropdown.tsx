import React, {
	Dispatch,
	SetStateAction,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react"

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
	trigger: (v: {
		isOpen: boolean
		setIsOpen: Dispatch<SetStateAction<boolean>>
	}) => React.ReactNode | React.ReactNode
	content?: (v: {
		isOpen: boolean
		setIsOpen: Dispatch<SetStateAction<boolean>>
	}) => React.ReactNode | React.ReactNode
	children?: React.ReactNode
	// onClickOutside?: (v: any) => void
}

export default function Dropdown({
	className = "",
	size = "base",
	direction = "start",
	// onClickOutside,
	content,
	children,
	trigger,
}: DropdownProps) {
	const ref = useRef<HTMLDivElement>(null)
	const dropdownRef = useRef<HTMLDivElement>(null)

	const [isOpen, setIsOpen] = useState(false)
	// console.log("direction", direction)

	const [xPos, setXPos] = useState("")

	// function handleClickOutside(e: MouseEvent) {
	const handleClickOutside = (e: MouseEvent) => {
		// console.log("e.target", e.target)
		// // console.log("target === current", e.target === ref.current)
		// console.log(isOpen)
		// console.log("dropdown", dropdownRef.current)
		if (
			dropdownRef.current &&
			dropdownRef.current?.style.display === "block" &&
			ref!.current!.contains(e.target as Node)
		) {
			// console.log(
			// 	"ref.current.contains(e.target as Node)",
			// 	ref!.current!.contains(e.target as Node),
			// 	dropdownRef.current.style.display === "block"
			// )
			setIsOpen(false)
		}

		if (ref.current && !ref.current.contains(e.target as Node)) {
			setIsOpen(false)
			// dropdown!.style.display = "hidden"
			// dropdown!.className = `${dropdown?.className} hidden`
		} else {
			setIsOpen(true)

			console.log("inside")
		}
	}

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside)
		// window.addEventListener("click", (e) => {
		// 	if (!ref.current?.contains(e.target as Node)) {
		// 		console.log("outside")
		// 		setIsOpen(false)
		// 	} else {
		// 		console.log("inside")
		// 	}
		// })
		// if (dropdown) {
		// 	dropdown!.style.display = "hidden"
		// }

		return () => {
			document.removeEventListener("mousedown", handleClickOutside)
			// window.removeEventListener("click", () => {
			// 	console.log("remove")
			// })
		}
	}, [])

	useLayoutEffect(() => {
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
	}, [isOpen])

	// console.log("isOpen", isOpen, "xPos", xPos)

	const renderTrigger = trigger({ isOpen, setIsOpen })

	return (
		<div
			ref={ref}
			className={`relative inline-block ${size} ${className}`}
			// onClick={() => setIsOpen((prev) => !prev)}
			// onBlur={(e) => {
			// 	// e.stopPropagation()
			// 	const currentTarget = e.currentTarget

			// 	console.log("currentTarget", currentTarget)
			// 	console.log("e.relatedTarget", e.relatedTarget)
			// 	console.log("e.taget", e.target)

			// 	// Give browser time to focus the next element
			// 	requestAnimationFrame(() => {
			// 		// if (ref.current && ref.current.contains(e.target as Node)) {
			// 		if (ref.current && ref.current.contains(e.target as Node)) {
			// 			// if (e.currentTarget?.contains(e.relatedTarget)) {
			// 			console.log("focus lost")
			// 			setIsOpen(false)
			// 		} else {
			// 			console.log("else")
			// 		}
			// 	})

			// 	// e.relatedTarget === null && setIsOpen(false)
			// 	// console.log("blur")
			// 	// setIsOpen(false)
			// }}
		>
			{/* {trigger({ isOpen, setIsOpen })} */}

			<div className="trigger">{renderTrigger}</div>
			<div
				ref={dropdownRef}
				style={{
					display: isOpen ? "block" : "none",
					insetInlineEnd: xPos === "end" || direction === "end" ? "0" : "auto",
				}}
				className={`absolute ${
					xPos || direction
				}-0 flex flex-col bg-accent  border border-theme-border rounded-md shadow-md z-10 mt-1 p-2 hidden ${
					classes.size[size]
				}`}
			>
				{children ? children : content?.({ isOpen, setIsOpen })}
			</div>
		</div>
	)
}
