import { fn } from '@storybook/test'
import { useRef } from 'react'
import { Button } from '../Button/Button'
import { UploadImagesModal } from './UploadImagesModal'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Components/UploadImagesModal',
  component: UploadImagesModal,
  tags: ['autodocs'],
  args: {
    onCropClick: fn(),
    onClose: fn(),
  },
} satisfies Meta<typeof UploadImagesModal>

export default meta

type Story = StoryObj<typeof UploadImagesModal>

export const Default: Story = {
  render: (args) => {
    const ref = useRef<HTMLDialogElement>(null)

    const openModal = () => ref.current?.showModal()

    return (
      <>
        <Button onClick={openModal}>Open modal</Button>
        <UploadImagesModal ref={ref} {...args} />
      </>
    )
  },
}
