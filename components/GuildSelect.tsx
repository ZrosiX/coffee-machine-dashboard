import useSWR from 'swr'
import Select from 'react-dropdown-select'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function GuildSelect () {
  const fetcher = (path) => fetch(path, {
    headers: { Authorization: window.localStorage.getItem('token') }
  }).then((res) => res.json())

  const { t } = useTranslation()
  const [guildId, setGuildId] = useState('')
  const [channels, setChannels] = useState([])
  const { data, error } = useSWR('/api/guild', fetcher)

  async function onChange (values) {
    const data = await fetcher(`/api/channels?guild=${values?.[0]?.id!}`)
    setGuildId(values?.[0]?.id!)
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="px-4 py-2 h-full">
      <div className="h-full bg-secondary text-white p-4 rounded">
        <h1 className="text-2xl border-b-2 pb-2">{t('SELECT_GUILD')}</h1>

        <Select
          values={[guildId]}
          onChange={onChange}
          searchable
          options={data?.guild}
          searchBy="name"
          valueField="id"
          labelField="name"
          className="bg-background mt-4"
          color="#2f3136"
          addPlaceholder={t('SELECT_GUILD')}
          />

        <h1 className="text-2xl border-b-2 pb-2">{t('SELECT_GUILD')}</h1>

        <Select
          values={[guildId]}
          onChange={onChange}
          searchable
          options={channels}
          searchBy="name"
          valueField="id"
          labelField="name"
          className="bg-background mt-4"
          color="#2f3136"
          addPlaceholder={t('SELECT_GUILD')}
          />
      </div>
    </div>
  )
}
