import { useSearchParams } from "react-router-dom"
import { Button } from "."

export default function Pagination({
	data: { limit, totalItems, offset },
}: // onChange,
{
	data: Record<string, number>
}) {
	const [searchParams, setSearchParams] = useSearchParams()

	const numberOfItems = 3

	const pageQuery = searchParams.get("page")

	const page = Number(pageQuery) || 1
	console.log({ limit, totalItems, offset })
	const numberOfPages = Math.ceil(totalItems / limit)

	if (numberOfPages === 1) return null

	// const currentPage = Math.ceil(offset / limit) + 1

	// console.log("numberOfPages", numberOfPages, "currentPage", currentPage)
	const firstButton = (
		<Button
			variant="outline"
			color="secondary"
			onClick={() => {
				setSearchParams({
					page: "1",
				})
				// onChange(0)
			}}
		>
			First
		</Button>
	)
	const lastButton = (
		<Button
			variant="outline"
			color="secondary"
			onClick={() => {
				// const page = limit * numberOfPages - limit
				setSearchParams({
					page: `${numberOfPages}`,
				})
				// onChange(page)
			}}
		>
			Last
		</Button>
	)

	const prevButton = (
		<Button
			variant="outline"
			color="secondary"
			onClick={() => {
				// const page = offset - limit
				// onChange(page)
				setSearchParams({
					page: `${page - 1}`,
				})
			}}
			className="mx-1"
		>
			Previous
		</Button>
	)
	const nextButton = (
		<Button
			variant="outline"
			color="secondary"
			onClick={() => {
				// const page = offset + limit
				// onChange(page)

				setSearchParams({ page: `${page + 1}` })
			}}
			className="mx-1"
		>
			Next
		</Button>
	)

	const buttons = new Array(numberOfItems).fill(null).reduce((acc, _, idx) => {
		const mid = Math.ceil(numberOfItems / 2)

		const midIndex = mid - 1

		// const pastMid = page > mid && idx > midIndex
		const pageIndex = page > mid ? page - (midIndex - idx) : idx + 1

		// if (pastMid) {
		console.log("here pastmid", page)
		console.log("pageIndex ", pageIndex, "page idx", page + idx)
		if (pageIndex <= numberOfPages) {
			acc.push(
				<Button
					key={idx}
					variant="outline"
					color="secondary"
					// isDisabled={page === pageIndex}
					isDisabled={page === pageIndex}
					onClick={() => {
						setSearchParams({
							page: `${pageIndex}`,
							// page: `${pageIndex}`,
						})
					}}
					className={`mx-1 ${page === pageIndex ? "font-bold" : ""} ${page} - 
        midIndex ${midIndex}  idx ${idx}`}
				>
					{/* {page - (midIndex - idx)} */}
					{pageIndex}
				</Button>
			)
		}
		console.log("midIndex", midIndex)
		// } else {
		// 	console.log("pageIndex ", pageIndex)
		// 	acc.push(
		// 		<Button
		// 			key={idx}
		// 			variant="outline"
		// 			color="secondary"
		// 			// isDisabled={page === pageIndex}
		// 			isDisabled={page === pageIndex}
		// 			onClick={() => {
		// 				setSearchParams({
		// 					page: `${pageIndex}`,
		// 					// page: `${pageIndex}`,
		// 				})
		// 			}}
		// 			className={`mx-1 ${page === pageIndex ? "font-bold" : ""} ${page} -
		//     midIndex ${midIndex}  idx ${idx}`}
		// 		>
		// 			{/* {page - (midIndex - idx)} */}
		// 			{pageIndex}
		// 		</Button>
		// 	)
		// }

		return acc
	}, [])
	// const buttons = new Array(5).fill(null).map((_, idx, arr) => {
	// 	console.log("page", page)

	// 	// check current page isn't greater than numberOfPages e.g 9(currentPage) % 5 if === 0
	// 	// then proceed to position to middle

	// 	const middle = Math.ceil(numberOfPages / 2)
	// 	console.log("arr", arr.length)

	// 	// get the middle position Math.ceil(numberOfPages / 2)

	// 	const pageIndex = page + idx

	// 	if (page + idx <= numberOfPages)
	// 		return (
	// 			<Fragment key={idx}>
	// 				{/* <span>index {idx}</span> */}
	// 				<Button
	// 					variant="outline"
	// 					color="secondary"
	// 					isDisabled={page === pageIndex}
	// 					onClick={() => {
	// 						// const page =
	// 						// 	limit *
	// 						// 	(pageIndex == numberOfPages ? pageIndex - 1 : pageIndex)
	// 						// onChange(page)
	// 						setSearchParams({
	// 							page: `${pageIndex}`,
	// 						})
	// 					}}
	// 					className={`mx-1 ${page === pageIndex ? "font-bold" : ""}`}
	// 				>
	// 					{pageIndex}
	// 				</Button>
	// 			</Fragment>
	// 		)
	// })
	// const buttons = new Array(numberOfPages).fill(null).map((_, idx) => (
	// 	<button
	// 		onClick={() => currentPage !== idx + 1 && onChange(limit * idx)}
	// 		className="mx-2"
	// 	>
	// 		{idx + 1}
	// 	</button>
	// ))

	return (
		<div>
			{page > 1 && (
				<>
					{firstButton}
					{prevButton}
				</>
			)}
			{buttons}
			{page < numberOfPages && (
				<>
					{nextButton} {lastButton}
				</>
			)}
		</div>
	)
}
