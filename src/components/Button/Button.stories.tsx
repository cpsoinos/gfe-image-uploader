import { fn } from '@storybook/test'
import CloseIcon from '@/icons/close.svg'
import { Button } from './Button'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  args: { onClick: fn(), children: 'Button' },
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Button',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
}

export const Icon: Story = {
  args: {
    variant: 'icon',
    children: <CloseIcon />,
  },
}
