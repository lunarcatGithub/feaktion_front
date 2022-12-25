import React, { useState, createContext, Dispatch, SetStateAction } from 'react'

type getUserType = {
  user_interest: {
    id: number
    user_id: number
    interest: string
  }[]
}
type Arr = { index: number; value: string; title: string }[]
type animationType = {
  value: number
  type: string
  bool: boolean
  loading: boolean
}
type userProfiletype = {
  user_id: number
  id: string
  email: string
  password: string
  nickname: string
  sex: string
  profile: string
  intro: string
  regdate: Date
  user_interest: never[]
}

type toastType = {
  type: string
  modalType: string
  data: { index: number; desc: string; value: string }[]
  onPress: () => void
}

export type appType = {
  pickGender: string
  setPickGender: Dispatch<SetStateAction<string>>
  headerName: string
  setHeaderName: (name: string) => void
  genreMaleArr: Arr
  genreFemaleArr: Arr
  userPickGenre: genreList
  setUserPickGenre: Dispatch<SetStateAction<genreList>>
  uploadGenre: string[]
  setUploadGenre: Dispatch<SetStateAction<never[]>>
  thirdPickGenre: genreList
  setThirdPickGenre: Dispatch<SetStateAction<never[]>>
  oneMorePickGenre: genreList
  setOneMorePickGenre: Dispatch<SetStateAction<genreList>>
  isDropdownModal: boolean
  setIsDropdownModal: Dispatch<SetStateAction<boolean>>
  animationMove: animationType
  setAnimationMove: Dispatch<SetStateAction<animationType>>
  userProfile: userProfiletype
  setUserProfile: Dispatch<SetStateAction<userProfiletype>>
  toastPopup: toastType
  setToastPopup: Dispatch<SetStateAction<toastType>>
  isToastPopup: boolean
  setIsToastPopup: Dispatch<SetStateAction<boolean>>
  headerScroll: number
  setHeaderScroll: Dispatch<SetStateAction<number>>
  getUser: getUserType | null
  setGetUser: Dispatch<SetStateAction<getUserType | null>>
  putImageUrl: string
  setPutImageUrl: Dispatch<SetStateAction<string>>
  getImageUrl: string
  setGetImageUrl: Dispatch<SetStateAction<string>>
  initBright: number
  setInitBright: Dispatch<SetStateAction<number>>
}

type genreList = {
  id?: number
  index: number
  value: string
  title: string
}[]

export const AppContext = createContext<appType | null>(null)

export default function AppStore({ children }: any): JSX.Element {
  const [pickGender, setPickGender] = useState<string>('Female')

  // header ctrl
  const [headerName, setHeaderName] = useState<string>('')

  // upload cover genre
  const [userPickGenre, setUserPickGenre] = useState<genreList>([])
  const [uploadGenre, setUploadGenre] = useState([])

  const [thirdPickGenre, setThirdPickGenre] = useState<never[]>([])
  const [oneMorePickGenre, setOneMorePickGenre] = useState<genreList>([])

  // dropdown popup ctrl
  const [isDropdownModal, setIsDropdownModal] = useState(false)

  // get iamge url
  const [putImageUrl, setPutImageUrl] = useState('')
  const [getImageUrl, setGetImageUrl] = useState('')

  // toast popup ctrl
  const [toastPopup, setToastPopup] = useState({
    type: '',
    modalType: '',
    data: [{ index: 0, desc: '', value: '' }],
    onPress: () => console.log(''),
  })
  const [isToastPopup, setIsToastPopup] = useState(false)

  // animation toast
  const [animationMove, setAnimationMove] = useState({
    value: -20,
    bool: false,
    type: '',
    loading: false,
  })

  // user profile
  const [userProfile, setUserProfile] = useState({
    user_id: 0,
    id: '',
    email: '',
    password: '',
    nickname: '',
    sex: '',
    profile: '',
    intro: '',
    regdate: new Date(),
    user_interest: [],
  })

  const [getUser, setGetUser] = useState<getUserType | null>(null)

  // scroll ctrl
  const [headerScroll, setHeaderScroll] = useState(0)

  // init bright
  const [initBright, setInitBright] = useState(0)

  const genreMaleArr = [
    { index: 0, value: 'TraditionalFantasy', title: '정통 판타지' },
    { index: 1, value: 'SF', title: 'SF' },
    { index: 2, value: 'FusionFantasy', title: '퓨전 판타지' },
    { index: 3, value: 'ModernFantasy', title: '현대 판타지' },
    { index: 4, value: 'Martial', title: '무협' },
    { index: 5, value: 'War', title: '전쟁' },
    { index: 6, value: 'GameFantasy', title: '게임 판타지' },
    { index: 7, value: 'Politics', title: '정치' },
    { index: 8, value: 'AlternativeHistory', title: '대체역사' },
    { index: 9, value: 'Regression', title: '회귀' },
    { index: 10, value: 'TS', title: 'TS' },
    { index: 11, value: 'Horror', title: '호러' },
    { index: 12, value: 'Thriller', title: '스릴러' },
    { index: 13, value: 'Daily', title: '일상' },
    { index: 14, value: 'Academy', title: '학원' },
    { index: 15, value: 'Military', title: '밀리터리' },
    { index: 16, value: 'Fanfic', title: '팬픽' },
    { index: 17, value: 'ETC', title: '기타' },
  ]

  const genreFemaleArr = [
    { index: 18, value: 'RomanceFantasy', title: '로맨스 판타지' },
    { index: 19, value: 'ModernRomance', title: '현대 로맨스' },
    { index: 20, value: 'TraditionalRomance', title: '정통 로맨스' },
    { index: 21, value: 'HistoricalRomance', title: '사극 로맨스' },
    { index: 22, value: 'BL', title: 'BL' },
    { index: 23, value: 'GL', title: 'GL' },
  ]

  return (
    <AppContext.Provider
      value={{
        //genre
        thirdPickGenre,
        setThirdPickGenre,
        oneMorePickGenre,
        setOneMorePickGenre,
        pickGender,
        setPickGender,
        headerName,
        setHeaderName,
        // data
        genreMaleArr,
        genreFemaleArr,
        // upload cover
        userPickGenre,
        setUserPickGenre,
        uploadGenre,
        setUploadGenre,
        // dropdown
        isDropdownModal,
        setIsDropdownModal,
        // animation
        animationMove,
        setAnimationMove,
        // userProfile
        userProfile,
        setUserProfile,
        getUser,
        setGetUser,
        // toast popup ctrl
        toastPopup,
        setToastPopup,
        isToastPopup,
        setIsToastPopup,
        // scroll
        headerScroll,
        setHeaderScroll,
        // iamge url
        putImageUrl,
        setPutImageUrl,
        getImageUrl,
        setGetImageUrl,
        // device brihgt
        initBright,
        setInitBright,
      }}>
      {children}
    </AppContext.Provider>
  )
}
