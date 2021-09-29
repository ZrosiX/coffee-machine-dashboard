import Image from 'next/image'
import { useTranslation } from 'react-i18next'
import Container from '../components/Container'
import { serverSideTranslations as i18nServer } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Callback () {
  const { t } = useTranslation()
  const router = useRouter()

  useEffect(() => {
    (async () => {
      const url = new URL(window.location.href)
      const code = url.searchParams.get('code')
      const state = url.searchParams.get('state')
      console.log(state)

      if (!code) {
        router.push('/')
        return
      }

      const res = await fetch(`/api/auth?code=${code}`).then((res) => res.json())
      if (!res.success) {
        router.push('/')
        return
      }

      localStorage.setItem('token', res.token)
      router.push(`${state.split(';')[1] ? `/${state.split(';')[1]}` : ''}/dash${state.split(';')[0] ? `?guild=${state.split(';')[0]}` : ''}`)
    })()
  })

  return (
    <Container>
      <div className="overflow-hidden">
        <div className="flex justify-center items-center h-screen flex-col">
          <Image src='/logo.svg' width="192" height="192" alt='logo'/>
          <div className="text-white p-5">{t('LOADING')}</div>
        </div>
      </div>
    </Container>
  )
}

export async function getStaticProps ({ locale }) {
  return {
    props: {
      ...await i18nServer(locale, ['common'])
    }
  }
}
