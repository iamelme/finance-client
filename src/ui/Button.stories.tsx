import type { Meta, StoryObj } from "@storybook/react"

import Button from "./Button"

const meta: Meta<typeof Button> = {
	title: "UI/Button",
	component: Button,
	// ...
}

export default meta

type Story = StoryObj<typeof Button>

export const Primary: Story = {
	args: {
		variant: "base",
		color: "primary",
		type: "button",
		size: "base",
		children: "Submit",
	},
}

export const Secondary: Story = {
	args: {
		variant: "base",
		color: "secondary",
		type: "button",
		size: "base",
		children: "Submit",
	},
}

export const Ghost: Story = {
	args: {
		variant: "ghost",
		color: "primary",
		type: "button",
		size: "base",
		children: "Submit",
	},
}
