import { Radio } from './Radio'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Components/Radio',
  component: Radio,
  tags: ['autodocs'],
} satisfies Meta<typeof Radio>

export default meta

type Story = StoryObj<typeof Radio>

export const Primary: Story = {}
