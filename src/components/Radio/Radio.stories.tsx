import type { Meta, StoryObj } from '@storybook/react'
import { Radio } from './Radio'

const meta = {
  title: 'Components/Radio',
  component: Radio,
  tags: ['autodocs'],
} satisfies Meta<typeof Radio>

export default meta

type Story = StoryObj<typeof Radio>

export const Primary: Story = {}
