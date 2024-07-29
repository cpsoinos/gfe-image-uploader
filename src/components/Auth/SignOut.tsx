import { signOut } from '@/auth'
import { Button } from '../Button/Button'

export const SignOut = () => {
  return (
    <form
      className="fixed right-0 top-0 p-2 md:p-4"
      action={async () => {
        'use server'
        await signOut()
      }}
    >
      <Button variant="secondary" className="self-end" type="submit">
        Sign Out
      </Button>
    </form>
  )
}
