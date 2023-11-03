import type { Meta, StoryObj } from "@storybook/react"

import Dropdown from "./Dropdown"

const meta: Meta<typeof Dropdown> = {
	title: "UI/Dropdown",
	component: Dropdown,
	// ...
}

export default meta

type Story = StoryObj<typeof Dropdown>

export const DefaultDropdown: Story = {
	args: {
		size: "base",
		trigger: () => <button>Dropdown</button>,
		children: (
			<>
				Type
				<div>
					<label htmlFor="revenue">
						<input
							type="checkbox"
							name="type"
							id="revenue"
						/>{" "}
						Revenue
					</label>
				</div>
				<div>
					<label htmlFor="expense">
						<input
							type="checkbox"
							name="type"
							id="expense"
						/>{" "}
						Expense
					</label>
				</div>
			</>
		),
	},
}
