import { asyncStorageUtil, MethodEnum } from '~/Utils/asyncStorageUtil'

type loginType = {
  userId: string
  password: string
  mutate: any
}

export type signupType = {
  signupSecondInput: { userId: string; nickname: string }
  signUpValue: { email: string; password: string | number }
  pickGender: string
  termCheck: boolean
  serviceCheck: boolean
  mutate: any
}

export const loginAgent = async ({ userId, password, mutate }: loginType) => {
  const boolValue = JSON.stringify(true)
  const userIdValue = JSON.stringify({ id: userId })

  const loginResult = await mutate?.mutateAsync({
    url: '/user/signin',
    data: { email: userId, password },
  })

  console.log('loginResult  ', loginResult)
  const statusResult = loginResult.status
  const typeAndText = {
    type: '',
    text: '',
  }

  switch (statusResult) {
    case 200 || 201:
      asyncStorageUtil({
        method: MethodEnum.SET,
        key: 'token',
        value: loginResult.data.token,
      })
      asyncStorageUtil({
        method: MethodEnum.SET,
        key: 'profile',
        value: userIdValue,
      })
      break
    case 400 || 401:
      typeAndText.type = 'userId'
      typeAndText.text = '로그인 입력 정보를 다시 확인해 주세요'
      break

    case 404:
      typeAndText.type = 'userId'
      typeAndText.text = '탈퇴했거나 존재하지 않는 아이디입니다'
      break

    case 500 || 501 || 502:
      typeAndText.type = 'userId'
      typeAndText.text =
        '서버에 문제가 발생했습니다. 잠시 후 다시 로그인해주세요'
      break

    default:
      break
  }
  return typeAndText
}

export const signupAgent = async ({
  signupSecondInput,
  signUpValue,
  pickGender,
  termCheck,
  serviceCheck,
  mutate,
}: signupType): Promise<{ type: string; text: string }> => {
  const signupResult = await mutate?.mutateAsync({
    url: '/user/signup',
    data: {
      email: signUpValue?.email,
      id: signupSecondInput?.userId,
      password: signUpValue?.password,
      nickname: signupSecondInput?.nickname,
      sex: pickGender,
      agree_info: termCheck,
      agree_service: serviceCheck,
    },
  })

  const statusResult = signupResult.status
  const typeAndText = {
    type: '',
    text: '',
  }

  switch (statusResult) {
    case 200 || 201:
      typeAndText.type = ''
      break
    case 400:
      typeAndText.type = 'nickname'
      typeAndText.text = '회원 입력 정보를 다시 확인해 주세요'
      break

    case 500 || 501:
      typeAndText.type = 'nickname'
      typeAndText.text =
        '서버에 문제가 발생했습니다. 잠시 후 다시 회원가입 해주세요'
      break

    default:
      break
  }
  return typeAndText
}

export const signupValidateChecktAgent = async ({
  email,
  mutate,
}: {
  email: string
  mutate: any
}): Promise<{ type: string; text: string }> => {
  const validateChecktResult = await mutate.mutateAsync({
    url: '/user/idexistcheck',
    data: { email },
  })
  const statusResult = validateChecktResult.status

  const typeAndText = {
    type: '',
    text: '',
  }

  switch (statusResult) {
    case 200 || 201:
      typeAndText.type = 'SignUpSecond'
      break

    case 400 || 401 || 404:
      typeAndText.type = 'email'
      typeAndText.text = '이미 존재하거나 탈퇴한 회원입니다'
      break

    default:
      break
  }
  return typeAndText
}
