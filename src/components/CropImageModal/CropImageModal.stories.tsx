import { fn } from '@storybook/test'
import { useEffect, useRef } from 'react'
import { useProfileImages } from '@/contexts/ProfileImagesContext'
import { Button } from '../Button/Button'
import { CropImageModal } from './CropImageModal'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Components/CropImageModal',
  component: CropImageModal,
  tags: ['autodocs'],
  args: {
    onClose: fn(),
  },
} satisfies Meta<typeof CropImageModal>

export default meta

type Story = StoryObj<typeof CropImageModal>

export const Default: Story = {
  render: (args) => {
    const { state, dispatch } = useProfileImages()
    const ref = useRef<HTMLDialogElement>(null)

    const openModal = () => {
      dispatch({ type: 'openCropImageModal', payload: { index: 0 } })
      ref.current?.showModal()
    }

    useEffect(() => {
      if (state.profileImages.length) return
      dispatch({ type: 'addFile', payload: new File([''], 'image.jpg', { type: 'image/jpeg' }) })
      dispatch({
        type: 'completeUpload',
        payload: { index: 0 },
      })
    }, [dispatch, state.profileImages.length])

    return (
      <>
        <Button onClick={openModal}>Open modal</Button>
        <CropImageModal ref={ref} {...args} />
      </>
    )
  },
}
