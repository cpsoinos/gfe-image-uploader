import { ProfileCard } from './ProfileCard'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Components/ProfileCard',
  component: ProfileCard,
  tags: ['autodocs'],
  args: {
    name: 'Jack Smith',
    avatar: '/avatar.jpg',
    handle: '@kingjack',
    workplace: {
      title: 'Senior Product Designer',
      companyName: 'Webflow',
    },
    location: {
      city: 'Vancouver',
      countryCode: 'CA',
    },
    pronouns: 'He/Him',
  },
} satisfies Meta<typeof ProfileCard>

export default meta

type Story = StoryObj<typeof ProfileCard>

export const Default: Story = {}

export const EmptyAvatar: Story = {
  args: {
    avatar: undefined,
  },
}
