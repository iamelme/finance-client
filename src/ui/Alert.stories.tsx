import type { Meta, StoryObj } from "@storybook/react"

import Alert from "./Alert"

const meta: Meta<typeof Alert> = {
	title: "UI/Alert",
	component: Alert,
	// ...
}

export default meta

type Story = StoryObj<typeof Alert>

export const DefaultAlert: Story = {
	args: {
		status: "info",
		size: "base",
		children: "Info Alert",
	},
}
