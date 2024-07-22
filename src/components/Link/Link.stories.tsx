import { Link } from './Link'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Components/Link',
  component: Link,
  tags: ['autodocs'],
  args: { href: '/', onClick: (e) => e.preventDefault(), children: 'Link' },
} satisfies Meta<typeof Link>

export default meta

type Story = StoryObj<typeof Link>

export const Primary: Story = {
  args: {
    children: 'Link',
  },
}
