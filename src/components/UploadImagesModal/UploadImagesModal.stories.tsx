import { fn } from '@storybook/test'
import { useCallback, useEffect, useRef } from 'react'
import { useProfileImages } from '@/contexts/ProfileImagesContext'
import { Button } from '../Button/Button'
import { UploadImagesModal } from './UploadImagesModal'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Components/UploadImagesModal',
  component: UploadImagesModal,
  args: {
    onCropClick: fn(),
    onClose: fn(),
  },
} satisfies Meta<typeof UploadImagesModal>

export default meta

type Story = StoryObj<typeof UploadImagesModal>

export const Default: Story = {
  render: (...[args]) => {
    const ref = useRef<HTMLDialogElement>(null)
    const { dispatch } = useProfileImages()

    const openModal = useCallback(() => {
      ref.current?.showModal()
      dispatch({ type: 'openUploadImagesModal' })
    }, [dispatch])

    useEffect(() => {
      openModal()
    }, [openModal])

    return (
      <>
        <Button onClick={openModal}>Open modal</Button>
        <UploadImagesModal ref={ref} {...args} />
      </>
    )
  },
}
