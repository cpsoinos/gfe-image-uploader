import { auth } from '@/auth'
import { ProfileCard } from '@/components/ProfileCard/ProfileCard'
import { ToastsContainer } from '@/components/Toast/ToastsContainer'
import { ProfileImagesProvider } from '@/contexts/ProfileImagesContext'
import { ToastsProvider } from '@/contexts/ToastsContext'

export const runtime = 'edge'

export default async function Home() {
  const session = await auth()

  const user = {
    name: session?.user?.name ?? 'Jack Smith',
    handle: session?.user?.handle ?? '@kingjack',
    workplace: session?.user?.workplace ?? {
      title: 'Senior Product Designer',
      companyName: 'Webflow',
    },
    location: session?.user?.location ?? {
      city: 'Vancouver',
      countryCode: 'CA',
    },
    pronouns: session?.user?.pronouns ?? 'He/Him',
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
