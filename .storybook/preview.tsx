import type { Preview } from '@storybook/react'
import '../src/app/globals.css'
import { INITIAL_VIEWPORTS, MINIMAL_VIEWPORTS } from '@storybook/addon-viewport'
import React from 'react'
import { ProfileImagesProvider } from '../src/contexts/ProfileImagesContext'

const preview: Preview = {
  decorators: [
    (Story) => {
      return (
        <ProfileImagesProvider>
          <Story />
        </ProfileImagesProvider>
      )
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewport: {
      viewports: {
        ...INITIAL_VIEWPORTS,
        ...MINIMAL_VIEWPORTS,
      },
    },
  },
}

export default preview
