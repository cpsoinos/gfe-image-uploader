import { ProfileCard } from '@/components/ProfileCard/ProfileCard'
import { ToastsContainer } from '@/components/Toast/ToastsContainer'
import { ProfileImagesProvider } from '@/contexts/ProfileImagesContext'
import { ToastsProvider } from '@/contexts/ToastsContext'

export const runtime = 'edge'

export default function Home() {
  const user = {
    name: 'Jack Smith',
    handle: '@kingjack',
    workplace: {
      title: 'Senior Product Designer',
      companyName: 'Webflow',
    },
    location: {
      city: 'Vancouver',
      countryCode: 'CA',
    },
    pronouns: 'He/Him',
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ToastsProvider>
        <ProfileImagesProvider>
          <ToastsContainer />
          <ProfileCard {...user} />
        </ProfileImagesProvider>
      </ToastsProvider>
    </main>
  )
}
