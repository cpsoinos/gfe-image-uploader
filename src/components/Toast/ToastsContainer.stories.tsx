import { useEffect } from 'react'
import { useToasts } from '@/contexts/ToastsContext'
import { Button } from '../Button/Button'
import { ToastsContainer } from './ToastsContainer'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Components/ToastsContainer',
  component: ToastsContainer,
  tags: ['autodocs'],
} satisfies Meta<typeof ToastsContainer>

export default meta

type Story = StoryObj<typeof ToastsContainer>

export const Default: Story = {
  render: () => {
    const { addToast } = useToasts()

    useEffect(() => {
      addToast({
        type: 'success',
        message: 'Changes saved successfully',
      })
    }, [addToast])

    return (
      <>
        <div className="flex items-center gap-4 pt-40">
          <Button
            onClick={() => addToast({ type: 'success', message: 'Changes saved successfully' })}
          >
            Success toast
          </Button>
          <Button
            onClick={() =>
              addToast({
                type: 'error',
                message: 'Upload failed. Please retry or contact us if you believe this is a bug.',
              })
            }
          >
            Error toast
          </Button>
        </div>
        <ToastsContainer />
      </>
    )
  },
}
