import { http, HttpResponse } from 'msw'
import { useEffect } from 'react'
import { useProfileImages } from '@/contexts/ProfileImagesContext'
import { ProfileCard } from './ProfileCard'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Components/ProfileCard',
  component: ProfileCard,
  tags: ['autodocs'],
  parameters: {
    msw: {
      handlers: [
        [
          http.put(`/api/images/:key`, () => {
            return HttpResponse.text('/mock-direct-upload')
          }),
          http.put('/mock-direct-upload', () => {
            return new HttpResponse()
          }),
          http.delete(`/api/images/:key`, () => {
            return new HttpResponse()
          }),
        ],
      ],
    },
  },
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

export const Default: Story = {
  render: (...[args]) => {
    const { dispatch } = useProfileImages()

    useEffect(() => {
      dispatch({ type: 'addFile', payload: new File([''], 'avatar.jpg', { type: 'image/jpeg' }) })
      dispatch({
        type: 'uploadComplete',
        payload: { index: 0 },
      })
      dispatch({ type: 'selectImage', payload: 0 })
    }, [dispatch])

    return <ProfileCard {...args} />
  },
}

export const EmptyAvatar: Story = {}
