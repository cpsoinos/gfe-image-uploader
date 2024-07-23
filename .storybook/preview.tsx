import '../src/app/globals.css'
import type { Preview } from '@storybook/react'
import { INITIAL_VIEWPORTS, MINIMAL_VIEWPORTS } from '@storybook/addon-viewport'
import React from 'react'
import { ProfileImagesProvider } from '../src/contexts/ProfileImagesContext'
import { ToastsProvider } from '../src/contexts/ToastsContext'
import { ToastsContainer } from '../src/components/Toast/ToastsContainer'
import { initialize, mswLoader } from 'msw-storybook-addon'
import { http, HttpResponse } from 'msw'

// Initialize MSW
initialize()

const preview: Preview = {
  decorators: [
    (Story) => {
      return (
        <ToastsProvider>
          <ProfileImagesProvider>
            <ToastsContainer />
            <Story />
          </ProfileImagesProvider>
        </ToastsProvider>
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
    msw: {
      handlers: [
        [
          http.all('/api*', ({ request }) => {
            const url = new URL(request.url)
            return new Response(null, {
              status: 302,
              headers: {
                Location: `http://localhost:3000${url.pathname}${url.search}`,
              },
            })
          }),
        ],
      ],
    },
  },
  // Provide the MSW addon loader globally
  loaders: [mswLoader],
}

export default preview
