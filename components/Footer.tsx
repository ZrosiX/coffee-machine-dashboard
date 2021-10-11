import Container from './Container'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { motion } from 'framer-motion'

export default function Footer () {
  return (
    <div className="bg-moredark mt-5">
      <Container>
        <div className="py-12 px-5 text-white flex flex-wrap flex-col sm:flex-row justify-between">
          <div className="flex flex-col items-start">
            <Image src="/favicon.png" width="50" height="50" alt="logo"/>
            <h1 className="text-xl font-bold pb-1 pr-5 border-b-2 mb-1 inline-block">Coffee Machine</h1>
            <p className="text-sm">Production by Lofi with Discord</p>
          </div>
          <div className="text-center align-top hidden sm:block">
            <p className="border-b-2 pb-2 px-4 mb-3 border-background">we are making lightweight bots</p>
            <p>donation? click:</p>
            <motion.a
              whileHover={{ fontSize: '50px' }}
              className="text-4xl text-red-300 hover:text-red-500"
              href="https://ko-fi.com/pmh_only" target="_blank"><FontAwesomeIcon icon={faHeart}/></motion.a>
          </div>
          <div className="flex flex-col md:items-end md:text-left">
            <h1 className="text-xl mt-4 md:mt-0 font-bold pb-1 md:pl-5 sm:border-b-2 mb-1 inline-block">Contact</h1>
            <p className="text-sm">Dev. PMH#7086</p>
            <p className="text-sm hover:text-blue-500"><a href="https://discord.gg/WJRtvankkB">discord.gg/WJRtvankkB</a></p>
            <p className="text-sm hover:text-blue-500"><a href="mailto:pmhstudio.pmh@gmail.com">pmhstudio.pmh@gmail.com</a></p>
          </div>
        </div>
      </Container>
    </div>
  )
}
