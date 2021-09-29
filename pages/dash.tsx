import Image from 'next/image'
import router from 'next/router'
import { decode } from 'jsonwebtoken'
import TopBar from '../components/TopBar'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Container from '../components/Container'
import { motion, Variants } from 'framer-motion'
import GuildSelect from '../components/GuildSelect'
import SessionBar, { Session } from '../components/SessionBar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { serverSideTranslations as i18nServer } from 'next-i18next/serverSideTranslations'

export default function Dash () {
  const { t } = useTranslation()
  const [session, setSession] = useState<Session>()

  const variants: Variants = {
    animate: {
      scale: [1, 0],
      opacity: [1, 0],
      translateY: ['0%', '-50%'],
      transition: {
        delay: 0.3,
        duration: 0.5
      }
    }
  }

  useEffect(() => {
    if (!window.localStorage.getItem('token')) {
      const guild = new URL(window.location.href).searchParams.get('guild')
      window.location.replace(`/api/redirect${guild || router.locale ? `?state=${[guild, router.locale].join(';')}` : ''}`)
    }

    const data = decode(window.localStorage.getItem('token'))
    if (!data || typeof data === 'string') return

    if (data.exp < Date.now()) {
      const guild = new URL(window.location.href).searchParams.get('guild')
      window.location.replace(`/api/redirect${guild || router.locale ? `?state=${[guild, router.locale].join(';')}` : ''}`)
    }

    setSession(data as Session)
  }, [])

  return (
    <>
      <motion.div animate="animate" whileHover="hover" variants={variants}
        className="flex justify-center items-center absolute w-screen h-full flex-col text-white select-none">
        <Image src='/logo.svg' width="192" height="192" alt='logo'/>
        <div className="p-3 text-3xl font-bold">{t('TITLE')}</div>
        <div>{t('SUBTITLE')}</div>
        <div className="underline text-xl pt-3">
          {t('START_BUTTON')}&nbsp;&nbsp;<FontAwesomeIcon icon={faArrowRight}/>
        </div>
      </motion.div>
      <motion.div animate={{ opacity: [0, 1] }} transition={{ delay: 0.7 }} className="opacity-0">
        <TopBar />
        <SessionBar session={session} />
        <Container>
          <div className="flex flex-wrap">
            <GuildSelect />
          </div>
        </Container>
      </motion.div>
    </>
  )
}

export async function getStaticProps ({ locale }) {
  return {
    props: {
      ...await i18nServer(locale, ['common'])
    }
  }
}
