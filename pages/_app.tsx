import '../styles/globals.css'
import 'tailwindcss/tailwind.css'
import '@fortawesome/fontawesome-svg-core/styles.css'

import Head from 'next/head'
import { appWithTranslation } from 'next-i18next'
import { AnimateSharedLayout } from 'framer-motion'

function MyApp ({ Component, pageProps }) {
  return (
    <AnimateSharedLayout>
      <Head>
        <title>Coffee Machine</title>
        <link rel="shortcut icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <meta name="description" content="Play YouTube videos without commands" />
        <meta name="oc:image" content="/favicon.png" />
        <link rel="manifest" href="manifest.json" />
      </Head>
      <Component {...pageProps} />
    </AnimateSharedLayout>
  )
}

export default appWithTranslation(MyApp)
