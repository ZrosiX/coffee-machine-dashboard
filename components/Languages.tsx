import Link from 'next/link'
import { i18n } from '../next-i18next.config'
import 'flag-icon-css/css/flag-icon.min.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGlobe } from '@fortawesome/free-solid-svg-icons'
import { motion } from 'framer-motion'

export default function Languages () {
  return (
    <div className="p-3 flex gap-2 items-center">
      <FontAwesomeIcon icon={faGlobe} color="gray"/>
      {i18n.locales.map((locale) => (
        <Link key={locale} href="/" locale={locale} passHref>
          <motion.button whileHover={{ fontSize: '30px' }} className="text-2xl">
            <span className={`flag-icon rounded flag-icon-${locale.split('-')[1].toLowerCase()}`}></span>
          </motion.button>
        </Link>
      ))}
    </div>
  )
}
