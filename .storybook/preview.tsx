import type { Preview } from '@storybook/react'
import '../src/app/globals.css'
import { INITIAL_VIEWPORTS, MINIMAL_VIEWPORTS } from '@storybook/addon-viewport'
import React, { useState, useMemo } from 'react'
import { ProfileImagesContext } from '../src/contexts/ProfileImagesContext'

const preview: Preview = {
  decorators: [
    (Story) => {
      const [files, setFiles] = useState<File[]>([])
      const [selectedIndex, setSelectedIndex] = useState<number>(-1)
      const contextValue = useMemo(
        () => ({ files, setFiles, selectedIndex, setSelectedIndex }),
        [files, selectedIndex],
      )

      return (
        <ProfileImagesContext.Provider value={contextValue}>
          <Story />
        </ProfileImagesContext.Provider>
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
