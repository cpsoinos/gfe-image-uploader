import { getRequestContext } from '@cloudflare/next-on-pages'
import { drizzle } from 'drizzle-orm/d1'
import { auth } from '@/auth'
import { SignOut } from '@/components/Auth/SignOut'
import { ProfileCard } from '@/components/ProfileCard/ProfileCard'
import { ToastsContainer } from '@/components/Toast/ToastsContainer'
import { ProfileImagesProvider } from '@/contexts/ProfileImagesContext'
import { ToastsProvider } from '@/contexts/ToastsContext'
import * as schema from '@/db/schema'

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

  const { env } = getRequestContext()
  const db = drizzle(env.DB, { schema })

  const profileImages = await db.query.profileImages.findMany({
    where: (profileImages, { eq }) => eq(profileImages.userId, session!.user.id),
  })

  return (
    <main className="flex min-h-full flex-col items-center justify-center">
      {session?.user.id && <SignOut />}
      <ToastsProvider>
        <ProfileImagesProvider pathPrefix={session!.user.id} storedImages={profileImages}>
          <ToastsContainer />
          <ProfileCard {...user} />
        </ProfileImagesProvider>
      </ToastsProvider>
    </main>
  )
}
