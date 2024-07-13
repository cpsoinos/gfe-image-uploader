import type { Meta, StoryObj } from '@storybook/react'
import { ProfileCard } from './ProfileCard'

const meta = {
  title: 'Components/ProfileCard',
  component: ProfileCard,
  tags: ['autodocs'],
  args: {
    name: 'Jack Smith',
    handle: '@kingjack',
    jobTitle: 'Senior Product Designer',
    companyName: 'Webflow',
    companyLogo: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    pronouns: 'He/Him',
    location: {
      city: 'Vancouver',
      country: 'Canada',
    },
  },
} satisfies Meta<typeof ProfileCard>

export default meta

type Story = StoryObj<typeof ProfileCard>

export const Primary: Story = {}
