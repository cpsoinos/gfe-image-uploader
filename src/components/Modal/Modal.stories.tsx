import { useRef } from 'react'
import { Button } from '../Button/Button'
import { Modal } from './Modal'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
} satisfies Meta<typeof Modal>

export default meta

type Story = StoryObj<typeof Modal>

export const Primary: Story = {
  render: () => {
    const ref = useRef<HTMLDialogElement>(null)

    const openModal = () => ref.current?.showModal()

    return (
      <>
        <Button onClick={openModal}>Open modal</Button>
        <Modal ref={ref} title="Upload image(s)" description="You may upload up to 5 images">
          <p>Modal content goes here.</p>
        </Modal>
      </>
    )
  },
}
