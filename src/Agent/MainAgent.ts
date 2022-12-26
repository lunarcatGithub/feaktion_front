import { asyncStorageUtil, MethodEnum } from '~/Utils/asyncStorageUtil'

type NovelsType = {
  take: number
  feaktion_id: number
  mutate: any
}

export const getNovelsAgent = async ({
  take,
  feaktion_id,
  mutate,
}: NovelsType) => {
  const loginResult = await mutate?.mutateAsync({
    url: '/feaktion/novels',
    params: { take },
  })

  console.log('loginResult  ', loginResult)
  const statusResult = loginResult.status

  switch (statusResult) {
    case 200 || 201:
      break
    case 400 || 401:
      break

    case 404:
      break

    case 500 || 501 || 502:
      '서버에 문제가 발생했습니다. 잠시 후 다시 로그인해주세요'
      break

    default:
      break
  }
  return
}
