import type { Meta, StoryObj } from '@storybook/react'
import { Dropzone } from './Dropzone'
import { fn } from '@storybook/test'

const meta = {
  title: 'Components/Dropzone',
  component: Dropzone,
  tags: ['autodocs'],
  args: {
    accept: 'image/png,image/jpeg',
    onFilesSelected: fn,
  },
} satisfies Meta<typeof Dropzone>

export default meta

type Story = StoryObj<typeof Dropzone>

export const Default: Story = {
  args: {
    helperText: 'PNG, or JPG (Max 5MB)',
  },
}

export const ErrorState: Story = {
  args: {
    error: "You've reached the image limit",
    helperText: 'Remove one or more to upload more images.',
  },
}
