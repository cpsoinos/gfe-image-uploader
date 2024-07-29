import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { AuthForm } from '@/components/Auth/AuthForm'

export default async function SignInPage() {
  const session = await auth()
  const user = session?.user

  if (user) {
    redirect('/')
  }

  return <AuthForm />
}
