import Image from 'next/image'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import Container from './Container'

export interface Session {
  tag?: string,
  avatar?: string
}

export default function SessionBar ({ session }: { session: Session | null }) {
  const router = useRouter()
  const { t } = useTranslation()

  function onLogout () {
    window.localStorage.removeItem('token')
    router.push('/')
  }

  if (!session) {
    return (
      <Container>
        <div className="p-4 text-white">
          <div className="p-4 bg-secondary rounded flex sm:inline-flex gap-4 items-center">
            <Image src="https://cdn.discordapp.com/embed/avatars/0.png" width="30" height="30" className="rounded-full" alt="avatar" />
            <p>{t('EXTRA_LOADING')}</p>
          </div>
        </div>
      </Container>
    )
  }

  if (session && !session.tag) {
    router.push('/api/redirect')
    return <></>
  }

  return (
    <Container>
      <div className="p-4 text-white">
        <div className="p-4 bg-secondary rounded flex sm:inline-flex gap-4 items-center">
          <Image src={session?.avatar ? 'https://cdn.discordapp.com' + session?.avatar : 'https://cdn.discordapp.com/embed/avatars/0.png'} width="30" height="30" className="rounded-full" alt="avatar" />
          <p>{session?.tag}</p>
          <button onClick={onLogout} className="rounded bg-background px-3 py-2 transform transition-transform hover:shadow-lg hover:-translate-y-0.5">{t('SESSIONBAR_LOGOUT')}</button>
        </div>
      </div>
    </Container>
  )
}
