import type { Meta, StoryObj } from '@storybook/react'
import { ProfileCard } from './ProfileCard'

const meta = {
  title: 'Components/ProfileCard',
  component: ProfileCard,
  tags: ['autodocs'],
  args: {
    name: 'Jack Smith',
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

export const Primary: Story = {}