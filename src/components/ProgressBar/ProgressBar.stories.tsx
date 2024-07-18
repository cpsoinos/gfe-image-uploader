import { ProgressBar } from './ProgressBar'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Components/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
} satisfies Meta<typeof ProgressBar>

export default meta

type Story = StoryObj<typeof ProgressBar>

export const Unstarted: Story = {
  args: {
    progress: 0,
  },
}

export const InProgress: Story = {
  args: {
    progress: 33,
  },
}

export const Complete: Story = {
  args: {
    progress: 100,
  },
}
