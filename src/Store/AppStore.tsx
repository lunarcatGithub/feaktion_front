import React, { useState, createContext, Dispatch, SetStateAction } from 'react'

type getUserType = {
  data: {
    user_id: number
    user_interest: {
      id: number
      user_id: number
      interest: string
    }[]
  }
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
    { index: 0, value: 'TraditionalFantasy', title: '?????? ?????????' },
    { index: 1, value: 'SF', title: 'SF' },
    { index: 2, value: 'FusionFantasy', title: '?????? ?????????' },
    { index: 3, value: 'ModernFantasy', title: '?????? ?????????' },
    { index: 4, value: 'Martial', title: '??????' },
    { index: 5, value: 'War', title: '??????' },
    { index: 6, value: 'GameFantasy', title: '?????? ?????????' },
    { index: 7, value: 'Politics', title: '??????' },
    { index: 8, value: 'AlternativeHistory', title: '????????????' },
    { index: 9, value: 'Regression', title: '??????' },
    { index: 10, value: 'TS', title: 'TS' },
    { index: 11, value: 'Horror', title: '??????' },
    { index: 12, value: 'Thriller', title: '?????????' },
    { index: 13, value: 'Daily', title: '??????' },
    { index: 14, value: 'Academy', title: '??????' },
    { index: 15, value: 'Military', title: '????????????' },
    { index: 16, value: 'Fanfic', title: '??????' },
    { index: 17, value: 'ETC', title: '??????' },
  ]

  const genreFemaleArr = [
    { index: 18, value: 'RomanceFantasy', title: '????????? ?????????' },
    { index: 19, value: 'ModernRomance', title: '?????? ?????????' },
    { index: 20, value: 'TraditionalRomance', title: '?????? ?????????' },
    { index: 21, value: 'HistoricalRomance', title: '?????? ?????????' },
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
