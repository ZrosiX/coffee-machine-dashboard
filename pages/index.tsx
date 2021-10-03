import Link from 'next/link'
import Image from 'next/image'
import Container from '../components/Container'
import { useTranslation } from 'react-i18next'
import { motion, Variants } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { serverSideTranslations as i18nServer } from 'next-i18next/serverSideTranslations'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

export default function Home () {
  const { t } = useTranslation()

  const variants: Variants = {
    animate: {
      scale: [1, 1.5, 1],
      rotate: [0, 5, 0],
      color: ['#202225', '#fff', '#fff'],
      filter: ['grayscale(100%)', 'grayscale(0%)', 'grayscale(0%)'],
      transition: {
        delay: 0.5,
        duration: 0.5,
        bounce: 1,
        ease: ['backIn', 'circOut']
      }
    }
  }

  return (
    <Container>
      <div className="overflow-hidden">
        <motion.div animate="animate" variants={variants} className="flex justify-center items-center h-screen flex-col" layoutId="logo">
          <Image src='/logo.svg' width="192" height="192" alt='logo'/>
          <div className="p-3 text-3xl font-bold">{t('INTRO_TITLE')}</div>
          <div>{t('INTRO_SUBTITLE')}</div>
          <div className="underline text-xl pt-3 hover:text-blue-300 cursor-pointer">
            <Link passHref href="/dash">
              <span>
                {t('INTRO_START_BUTTON')}&nbsp;&nbsp;<FontAwesomeIcon icon={faArrowRight}/>
              </span>
            </Link>
          </div>
        </motion.div>
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
