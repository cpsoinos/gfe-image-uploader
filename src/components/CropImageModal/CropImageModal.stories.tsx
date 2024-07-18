import { useRef } from 'react'
import { Button } from '../Button/Button'
import { CropImageModal } from './CropImageModal'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Components/CropImageModal',
  component: CropImageModal,
  tags: ['autodocs'],
  args: {
    imageIndex: 0,
    src: '/image.jpg',
  },
} satisfies Meta<typeof CropImageModal>

export default meta

type Story = StoryObj<typeof CropImageModal>

export const Default: Story = {
  render: (args) => {
    const ref = useRef<HTMLDialogElement>(null)

    const openModal = () => ref.current?.showModal()

    return (
      <>
        <Button onClick={openModal}>Open modal</Button>
        <CropImageModal ref={ref} {...args} />
      </>
    )
  },
}
