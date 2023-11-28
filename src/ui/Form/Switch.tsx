type SwitchProps = {
	label?: string
	isChecked?: boolean
}

export default function Switch(
	props: SwitchProps & React.HTMLProps<HTMLInputElement>
) {
	const { label, isChecked } = props

	return (
		<label className="relative inline-flex items-center cursor-pointer">
			<input
				type="checkbox"
				checked={isChecked}
				{...props}
				className="peer hidden"
			/>
			<div className="w-7 h-4 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
			<span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
				{label}
			</span>
		</label>
	)
}
