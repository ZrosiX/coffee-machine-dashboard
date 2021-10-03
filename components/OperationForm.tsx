import useSWR from 'swr'
import Select from 'react-dropdown-select'
import { ChangeEvent, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import InviteBtn from './InviteBtn'
import Container from './Container'
import Image from 'next/image'
import ytsr from 'ytsr'
import toast from 'react-hot-toast'

export default function OperationForm () {
  const fetcher = (path, opt?) => fetch(path, {
    headers: { Authorization: window.localStorage.getItem('token') },
    ...opt
  }).then((res) => res.json())

  const router = useRouter()

  const { t } = useTranslation()
  const [guildId, setGuildId] = useState('')
  const [channelId, setChannelId] = useState('')
  const [channels, setChannels] = useState([])
  const [videos, setVideos] = useState<ytsr.Video[]>([])
  const [videoURL, setVideoURL] = useState('')

  const searchRef = useRef<HTMLInputElement>()
  const { data, error } = useSWR('/api/guild', fetcher)

  async function onChange (values) {
    const data = await fetcher(`/api/channels?guild=${values?.[0]?.id || guildId}`)
    const save = await fetcher(`/api/save?guild=${values?.[0]?.id || guildId}`)

    setGuildId(values?.[0]?.id!)
    setChannels(data.channels)
    setChannelId('')

    if (save.channelId) {
      console.log(save.channelId)
      setChannelId(save.channelId)
      setVideoURL(save.videoURL)

      const data = await fetcher(`/api/ytsr?input=${encodeURIComponent(save.videoURL)}`).catch(() => ({ result: [] }))

      setVideos(data.result!)
      searchRef.current.value = save.videoURL
    }
  }

  function onChangeChannel (values) {
    if (!values?.[0]?.id) return
    if (channelId !== values?.[0]?.id) setChannelId(values?.[0]?.id!)
  }

  async function onSearch (event: ChangeEvent<HTMLInputElement>) {
    const data = await fetcher(`/api/ytsr?input=${encodeURIComponent(event.target.value)}`).catch(() => ({ result: [] }))
    setVideos(data.result!)
  }

  async function onSubmit () {
    if (!guildId) return toast.error(t('OPFORM_SUBMIT_MISSING_GUILD'))
    if (!channelId) return toast.error(t('OPFORM_SUBMIT_MISSING_CHANNEL'))
    if (!videoURL) return toast.error(t('OPFORM_SUBMIT_MISSING_VIDEO'))

    toast.promise(
      fetcher('/api/save', { method: 'POST', body: JSON.stringify({ guildId, channelId, videoURL }) }),
      { loading: t('OPFORM_SUBMIT_LOADING'), success: t('OPFORM_SUBMIT_SUCCESS'), error: t('OPFORM_SUBMIT_FAILURE') }
    )
  }

  async function onCancel () {
    if (!guildId) return toast.error(t('OPFORM_SUBMIT_MISSING_GUILD'))

    toast.promise(
      fetcher('/api/save', { method: 'DELETE', body: JSON.stringify({ guildId }) }),
      { loading: t('OPFORM_SUBMIT_LOADING'), success: t('OPFORM_SUBMIT_SUCCESS'), error: t('OPFORM_SUBMIT_FAILURE') }
    )
  }

  if (error) return <div>Error: {error}</div>
  if (data?.success && !guildId && typeof router.query.g === 'string') setGuildId(router.query.g)

  return (
    <Container>
      <div className="block xl:grid grid-cols-3 gap-4 px-4 py-2 h-auto xl:h-full">
        <div className="bg-secondary text-white p-4 rounded-none xl:rounded flex flex-col md:flex-row xl:flex-col gap-10 justify-center xl:justify-between">
          <div>
            <h1 className="text-2xl border-b-2 border-background inline-block py-2 px-1">{t('OPFORM_SELECT_GUILD_TITLE')}</h1>

            <Select
              values={[guildId]}
              onChange={onChange}
              searchable
              options={data?.guild}
              searchBy="name"
              valueField="id"
              labelField="name"
              className="bg-background my-2 w-full transition-transform hover:shadow-lg hover:-translate-y-0.5"
              color="#2f3136"
              addPlaceholder={guildId ? '' : t('OPFORM_SELECT_GUILD_PLACEHOLDER')}
              />

            <p className="text-sm">{t('OPFORM_SELECT_GUILD_SUBTITLE')}</p>
          </div>

          <div>
            <h1 className="text-2xl border-b-2 border-background inline-block py-2 px-1">{t('OPFORM_SELECT_CHANNEL_TITLE')}</h1>
            {(channels || []).length < 1 && guildId
              ? <>
                  <div className="py-3"><InviteBtn /></div>
                  <p className="text-sm">{t('OPFORM_SELECT_CHANNEL_NO_CHANNEL')}</p>
                </>
              : <>
                  <Select
                    values={[channelId]}
                    onChange={onChangeChannel}
                    searchable
                    disabled={!guildId}
                    options={channels}
                    searchBy="name"
                    valueField="id"
                    labelField="name"
                    className="bg-background my-2 w-full transition-transform hover:shadow-lg hover:-translate-y-0.5"
                    color="#2f3136"
                    addPlaceholder={channelId ? '' : t('OPFORM_SELECT_CHANNEL_PLACEHOLDER')}
                    />

                  <p>{t('OPFORM_SELECT_CHANNEL_SUBTITLE')}</p>
                </>}
          </div>
        </div>
        <div className="block xl:hidden h-1" />
        <div className="bg-secondary text-white p-4 rounded-none xl:rounded">
          <h1 className="text-2xl border-b-2 border-background inline-block py-2 px-1">{t('OPFORM_SELECT_VIDEO_TITLE')}</h1>
          <input ref={searchRef} onInput={onSearch} type="text" className="bg-background rounded p-2 px-4 text-sm my-2 w-full outline-none border-2 border-background focus:border-primary transition-transform hover:shadow-lg hover:-translate-y-0.5" placeholder={t('OPFORM_SELECT_VIDEO_PLACEHOLDER')} />

          <div className="h-80 overflow-y-scroll">
            {(videos || []).length > 0
              ? <div className="py-3">
                {videos.filter((v) => v.type === 'video').map((video) => (
                  <div key={video.url} onClick={() => setVideoURL(video.url)} className={`flex items-center border-b cursor-pointer border-background py-2 hover:bg-background ${videoURL === video.url ? 'border-primary bg-background' : ''}`}>
                    <Image width={video.thumbnails[0].width / 3} height={video.thumbnails[0].height / 3} src={video.thumbnails[0].url} className="w-8 h-8 mr-2" alt="youtube video thumbnail" />
                    <div className="flex-1 p-3">
                      <p className="text-sm">{video.title}</p>
                      <p className="text-xs text-gray-400">{video.duration} | {video.author.name}</p>
                    </div>
                  </div>
                ))}
              </div>
              : <p>{t('OPFORM_SELECT_VIDEO_SUBTITLE')}</p>}
          </div>
        </div>
        <div className="block xl:hidden h-1" />
        <div className="bg-secondary text-white p-4 rounded-none xl:rounded">
          <h1 className="text-2xl border-b-2 border-background inline-block py-2 px-1">{t('OPFORM_SUBMIT_TITLE')}</h1>
          <pre className="bg-background p-3 overflow-auto rounded mt-2">{JSON.stringify({ guildId, channelId, videoURL: videoURL.replace('https://www.youtube.com/watch', 'youtube') }, null, 2)}</pre>
          <button onClick={onSubmit}
            className="bg-green-500 px-4 py-2 mt-3 rounded cursor-pointer text-center font-bold transition-transform hover:shadow-lg hover:-translate-y-0.5">
            {t('OPFORM_SUBMIT_LABEL')}
          </button>
          <button onClick={onCancel}
            className="ml-3 border-2 border-red-400 px-4 py-2 mt-3 rounded cursor-pointer text-center font-bold transition-transform hover:shadow-lg hover:-translate-y-0.5">
            {t('OPFORM_SUBMIT_CANCEL')}
          </button>
        </div>
      </div>
    </Container>
  )
}
