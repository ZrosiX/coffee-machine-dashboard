import { useTranslation } from 'react-i18next'

export default function InviteBtn ({ guild }: { guild?: string }) {
  const { t } = useTranslation()

  return (
    <button onClick={() => window.open(`/api/invite${guild ? `?guild=${guild}` : ''}`, '_blank')}
      className="bg-primary px-4 py-2 rounded cursor-pointer text-center font-bold transition-transform hover:shadow-lg hover:-translate-y-0.5">
      {t('EXTRA_INVITE')}
    </button>
  )
}
