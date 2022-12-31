type Props = {
  userSelectData: { value: string }[]
  fetchedData: { id?: number; title: string; index: number; value: string }[]
  type?: 'COVER' | 'SETTING'
}

export type GenreReturnType = {
  genres: (string | undefined)[]
  removed_genres: (number | undefined)[]
}

export default function genreFilterUtil({
  userSelectData,
  fetchedData,
  type = 'SETTING',
}: Props): GenreReturnType {
  // 유저가 직접 선택한 장르의 value값만 배열로 생성
  const userPickValueArr = userSelectData.map(
    ({ value }: { value: string }) => value
  )
  // 외부에서 fetching된 데이터 장르의 value값만 배열로 생성 (새로 선택했는지 비교)
  const originValueArr = fetchedData.map(
    (item: { genre?: string; value?: string }) => {
      // 향후 속성명 변경 필요(genre로 통일)
      if (item?.genre) {
        return item?.genre
      } else {
        return item.value
      }
    }
  )

  const duplicateGenreHandle = userSelectData
    ?.map(({ value }) => {
      if (!originValueArr.includes(value)) return value
    })
    .filter(data => data)

  const newGenreArr = userSelectData?.map(({ value }) => value)

  const params = {
    // 신규 추가 되는 장르(중복해서 보내면 안됨)
    genres: type === 'COVER' ? newGenreArr : duplicateGenreHandle,
    // 제거하고 싶은 장르(id만 추출해서 보내기)
    removed_genres: fetchedData
      .map(({ id, value }) => {
        if (!userPickValueArr.includes(value)) return id
      })
      .filter(data => data),
  }

  return params
}
