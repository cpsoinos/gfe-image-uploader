import { getRequestContext } from '@cloudflare/next-on-pages'
import { drizzle } from 'drizzle-orm/d1'
import { ProfileCard } from '@/components/ProfileCard/ProfileCard'
import { ToastsContainer } from '@/components/Toast/ToastsContainer'
import { ProfileImagesProvider } from '@/contexts/ProfileImagesContext'
import { ToastsProvider } from '@/contexts/ToastsContext'
import * as schema from '@/db/schema'
import { getUserId } from '@/lib/getUserId'

export const runtime = 'edge'

export default async function Home() {
  const userId = getUserId()
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

  const { env } = getRequestContext()
  const db = drizzle(env.DB, { schema })

  const profileImages = await db.query.profileImages.findMany({
    where: (profileImages, { eq }) => eq(profileImages.userId, userId),
  })

  return (
    <main className="flex min-h-full flex-col items-center justify-center">
      <ToastsProvider>
        <ProfileImagesProvider pathPrefix={userId} storedImages={profileImages}>
          <ToastsContainer />
          <ProfileCard {...user} />
        </ProfileImagesProvider>
      </ToastsProvider>
    </main>
  )
}
