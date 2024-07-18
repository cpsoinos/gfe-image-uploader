import { useRef } from 'react'
import { Button } from '../Button/Button'
import { UploadImagesModal } from './UploadImagesModal'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Components/UploadImagesModal',
  component: UploadImagesModal,
  tags: ['autodocs'],
} satisfies Meta<typeof UploadImagesModal>

export default meta

type Story = StoryObj<typeof UploadImagesModal>

export const Default: Story = {
  render: () => {
    const ref = useRef<HTMLDialogElement>(null)

    const openModal = () => ref.current?.showModal()

    return (
      <>
        <Button onClick={openModal}>Open modal</Button>
        <UploadImagesModal ref={ref} />
      </>
    )
  },
}
