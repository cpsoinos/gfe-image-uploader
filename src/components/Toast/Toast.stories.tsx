import { Toast } from './Toast'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Components/Toast',
  component: Toast,
  tags: ['autodocs'],
} satisfies Meta<typeof Toast>

export default meta

type Story = StoryObj<typeof Toast>

export const Success: Story = {
  args: {
    type: 'success',
    message: 'Changes saved successfully',
  },
}

export const Error: Story = {
  args: {
    type: 'error',
    message: 'Upload failed. Please retry or contact us if you believe this is a bug.',
  },
}
