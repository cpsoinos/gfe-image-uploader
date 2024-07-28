import { fn } from '@storybook/test'
import { useCallback, useEffect, useRef } from 'react'
import { useProfileImages } from '@/contexts/ProfileImagesContext'
import { Button } from '../Button/Button'
import { CropImageModal } from './CropImageModal'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Components/CropImageModal',
  component: CropImageModal,
  args: {
    onClose: fn(),
  },
} satisfies Meta<typeof CropImageModal>

export default meta

type Story = StoryObj<typeof CropImageModal>

export const Default: Story = {
  render: (...[args]) => {
    const { dispatch } = useProfileImages()
    const ref = useRef<HTMLDialogElement>(null)

    const openModal = useCallback(() => {
      dispatch({ type: 'openCropImageModal', payload: { id: 'abc123' } })
      ref.current?.showModal()
    }, [dispatch])

    useEffect(() => {
      openModal()
      dispatch({ type: 'addFile', payload: new File([''], 'image.jpg', { type: 'image/jpeg' }) })
      dispatch({
        type: 'uploadSuccess',
        payload: { index: 0 },
      })
      dispatch({ type: 'setId', payload: { index: 0, id: 'abc123' } })
      dispatch({ type: 'uploadComplete', payload: { index: 0 } })
    }, [dispatch, openModal])

    return (
      <>
        <Button onClick={openModal}>Open modal</Button>
        <CropImageModal ref={ref} {...args} />
      </>
    )
  },
}
