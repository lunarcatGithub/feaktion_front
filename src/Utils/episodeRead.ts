import { useEffect } from 'react'
import useAsyncStorage from '~/Hooks/useAsyncStorage'

type readType =
  | { fictionId: number; isRead: { episodeId: number; read: number }[] }
  | undefined

type props = {
  fictionId: number
  isRead: readType
}

export default function episodeRead({ fictionId, isRead }: props) {
  const [asyncHandler, _result] = useAsyncStorage()

  useEffect(() => {
    if (!isRead) return
    asyncHandler('SET', JSON.stringify(fictionId), JSON.stringify(isRead))
  }, [isRead])

  const returnTest = (value: string | number): readType[] | undefined => {
    if (typeof value === 'string') return
    if (!value) return

    const alreadyFilter = isRead?.isRead?.map(
      ({ episodeId }: { episodeId: number }) => episodeId
    )

    if (alreadyFilter?.includes(value)) return
    if (!isRead) {
      return [{ fictionId, isRead: [{ read: 0, episodeId: value }] }]
    } else {
      let test
      isRead?.isRead?.forEach(({ episodeId }: { episodeId: number }) => {
        console.log(episodeId, value)

        if (episodeId !== value) {
          // return
          test = {
            fictionId,
            isRead: [...isRead?.isRead, { read: 0, episodeId: value }],
          }
        } else return
      })

      return test
    }
  }
  return [returnTest]
}
