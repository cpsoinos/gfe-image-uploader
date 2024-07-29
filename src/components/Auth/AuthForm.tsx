import Image from 'next/image'
import { type FC } from 'react'
import { signIn, providerMap } from '@/auth'
import AnderAppsLogo from '@/icons/anderapps-logo.svg'
import { Button } from '../Button/Button'

export const AuthForm: FC = () => {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <AnderAppsLogo className="mx-auto h-16 w-auto" />
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
          <div>
            <div className="flex flex-col gap-4">
              {Object.values(providerMap).map((provider) => (
                <form
                  key={provider.id}
                  action={async () => {
                    'use server'
                    await signIn(provider.id)
                  }}
                >
                  <Button variant="secondary" type="submit" className="w-full gap-4">
                    <Image
                      src={`https://authjs.dev/img/providers/${provider.id}.svg`}
                      height={24}
                      width={24}
                      alt=""
                      role="presentation"
                    />
                    Continue with {provider.name}
                  </Button>
                </form>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
