import { useEffect, useRef } from "react"

export default function Home() {
	const refTextContainer = useRef<HTMLDivElement>(null)

	const text = "Hello world! I'm a typewriter!"

	function typeWriter(text: string, i: number) {
		if (!refTextContainer.current) return

		if (i === text.length) {
			setTimeout(() => {
				refTextContainer!.current!.textContent = ""
				typeWriter(text, 0)
			}, 2000)
		}
		if (i < text.length) {
			refTextContainer!.current!.textContent += text[i]
			i++

			setTimeout(() => typeWriter(text, i), 300)
		}
	}

	useEffect(() => {
		typeWriter(text, 0)
	}, [])

	return (
		<>
			home page
			<div
				className="w-[50px] bg-blue"
				style={{ width: "50px" }}
			>
				<div
					className="relative after:content-['|'] after:animate-show-hide"
					ref={refTextContainer}
				></div>
			</div>
		</>
	)
}
