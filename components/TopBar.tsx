import Link from 'next/link'
import Image from 'next/image'
import Container from './Container'
import { useTranslation } from 'react-i18next'

export default function TopBar () {
  const { t } = useTranslation()

  return (
    <nav className="bg-secondary sticky">
      <Container>
        <div className="flex justify-between items-center text-white">
          <div className="flex gap-2">
            <Link href="/" passHref>
              <div className="flex gap-2 items-center cursor-pointer hover:bg-background py-3 px-2 border-b-2 hover:border-yellow-800">
                <Image src="/logo.svg" width="30" height="30" alt="logo" />
                <p className="font-bold">{t('TITLE')}</p>
              </div>
            </Link>
            <Link href="https://lofi.pmh.codes" passHref>
              <div className="hidden sm:flex gap-2 items-center cursor-pointer hover:bg-background py-3 px-2 border-b-2 border-transparent hover:border-purple-400">
                <p className="text-xs">{t('BY_LWD')}</p>
              </div>
            </Link>
          </div>
          <Link href="/api/invite" passHref>
            <div className="bg-primary mx-2 px-4 py-2 rounded cursor-pointer">
              {t('INVITE')}
            </div>
          </Link>
        </div>
      </Container>
    </nav>
  )
}
