import { ImageRow } from './ImageRow'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Components/ImageRow',
  component: ImageRow,
  tags: ['autodocs'],
  args: {
    name: 'image.jpg',
    size: 123456,
    file: new File([''], 'image.jpg'),
    src: '/image.jpg',
    status: 'pending',
    progress: 0,
    selected: false,
    onSelect: () => {},
    onDelete: () => {},
  },
} satisfies Meta<typeof ImageRow>

export default meta

type Story = StoryObj<typeof ImageRow>

export const Pending: Story = {
  args: {
    status: 'pending',
  },
}

export const Uploading: Story = {
  args: {
    status: 'uploading',
    progress: 33,
  },
}

export const Uploaded: Story = {
  args: {
    status: 'uploaded',
  },
}

export const Error: Story = {
  args: {
    status: 'error',
    error: 'This image is larger than 5MB. Please select a smaller image.',
  },
}
