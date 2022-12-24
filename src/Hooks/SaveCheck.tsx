import { useEffect } from 'react'
import useAsyncStorage from '~/Hooks/useAsyncStorage'

type Props = {
  uploadFictionId: number | string | null
  fictionData: {}
  currentType: string
  newFictionCover: { title: string }
}
export default function SaveCheck(): [(props: Props) => void] {
  const [asyncHandler, result] = useAsyncStorage()
  const [savedAsyncHandler, resultSaved] = useAsyncStorage()

  const saveFictionHandler = ({
    uploadFictionId,
    fictionData,
    currentType,
    newFictionCover,
  }: Props) => {
    savedAsyncHandler('GET', '@SaveFiction')
    if (!resultSaved?.result) return
    const resultSaveData = JSON.parse(JSON.parse(resultSaved?.result))

    const filtering = resultSaveData?.filter(item => {
      const { title } = item?.newFictionCover
      return newFictionCover?.title !== title
    })

    const lastArr = [
      ...filtering,
      { uploadFictionId, fictionData, currentType, newFictionCover },
    ]
    console.log('lastArrlastArr', lastArr)
    // mergeData({ uploadFictionId, fictionData, currentType, newFictionCover });
    // mergeData();
  }

  const mergeData = (props: Props) => {
    asyncHandler('SET', `@SaveFiction`, JSON.stringify(props))
  }

  useEffect(() => {
    // asyncHandler("SET", `@SaveFiction`, JSON.stringify([]));
    // savedAsyncHandler("GET", "@SaveFiction");
  }, [])

  return [saveFictionHandler]
}
