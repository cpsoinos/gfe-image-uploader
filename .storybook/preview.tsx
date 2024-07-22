import type { Preview } from '@storybook/react'
import '../src/app/globals.css'
import { INITIAL_VIEWPORTS, MINIMAL_VIEWPORTS } from '@storybook/addon-viewport'
import React from 'react'
import { ProfileImagesProvider } from '../src/contexts/ProfileImagesContext'
import { initialize, mswLoader } from 'msw-storybook-addon'

// Initialize MSW
initialize()

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
  // Provide the MSW addon loader globally
  loaders: [mswLoader],
}

export default preview
