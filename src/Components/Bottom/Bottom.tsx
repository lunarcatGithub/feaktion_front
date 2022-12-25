import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components/native'

// data
import { newFiction } from '~/Data/fictionUploadData'

// icons
import Home from '@Icons/home.svg'
import FictionList from '@Icons/fictionlist.svg'
import Archive from '@Icons/archive.svg'
import Myboard from '@Icons/myboard.svg'
import Upload from '@Icons/upload.svg'
import HomeOn from '@Icons/homeOn.svg'
import FictionListOn from '@Icons/fictionlistOn.svg'
import ArchiveOn from '@Icons/archiveOn.svg'
import MyboardOn from '@Icons/myboardOn.svg'

// components
import ModalPopup from '../Popup/Modal'

// hooks
import {
  useAppContext,
  useUploadContext,
  useAsyncContext,
} from '~/Hooks/useContextHook'

// type
import { AsyncCallType } from '~/Context/types/contextType'

import { uploadType } from '~/Store/UploadStore'
import { useQuery } from 'react-query'
import useFetch from '~/Hooks/useAxiosFetch'
import { AuthContext } from '~/App'

export function Bottom({ state, navigation }: any): JSX.Element {
  // context
  const {
    toastPopup,
    setToastPopup,
    isToastPopup,
    setIsToastPopup,
    setGetUser,
    setPutImageUrl,
    setGetImageUrl,
  } = useAppContext()
  const { setUserToken } = useContext(AuthContext)
  const { asyncDispatch } = useAsyncContext()

  const { currentType, setCurrentType: setCurrentType } = useUploadContext()

  const [homeIcon, setHomeIcon] = useState<JSX.Element | null>(null)
  const [fictionListIcon, setFictionListIcon] = useState<JSX.Element | null>(
    null
  )
  const [archiveIcon, setArchiveIcon] = useState<JSX.Element | null>(null)
  const [myboardIcon, setMyboardIcon] = useState<JSX.Element | null>(null)

  // popup
  // const [isModal, setIsModal] = useState(false);

  // fetch
  const userData = useQuery(['myProfile'], () =>
    useFetch({ url: `/user`, method: 'get' })
  )
  const putUrlData = useQuery(['imageUrl'], () =>
    useFetch({ url: `/putImage`, method: 'get' })
  )
  const getUrlData = useQuery(['getImageUrl'], () =>
    useFetch({ url: `/getImage`, method: 'get' })
  )

  // console.log('userData', userData?.data?.data?.data);

  useEffect(() => {
    // 초기 장르 네비게이션 용
    // 향후 전역으로 유저 메일 포함해서 뿌려주기
    if (!userData?.data) {
      asyncDispatch({ type: AsyncCallType.REMOVE, key: 'token' })
      // setUserToken(false)
      return
    }
    setGetUser(userData?.data?.data?.data)
  }, [])

  useEffect(() => {
    // image 삽입을 위한 url
    setPutImageUrl(putUrlData?.data?.data?.data?.url)
  }, [putUrlData])

  useEffect(() => {
    // 이미지를 받기 위한 url 주소 get
    setGetImageUrl(getUrlData?.data?.data?.data?.url)
  }, [getUrlData])

  useEffect(() => {
    // stack 이동마다 팝업 닫아주기
    setIsToastPopup(false)
  }, [state])

  useEffect(() => {
    const currentLo = state?.index // 0:home, 1:FictionList, 2:Upload, 3:Store, 4:UserBoard
    setHomeIcon(
      currentLo === 0 ? (
        <HomeOn width={24} height={24} />
      ) : (
        <Home width={24} height={24} />
      )
    )
    setFictionListIcon(
      currentLo === 1 ? (
        <FictionListOn width={24} height={24} />
      ) : (
        <FictionList width={24} height={24} />
      )
    )
    setArchiveIcon(
      currentLo === 2 ? (
        <ArchiveOn width={24} height={24} />
      ) : (
        <Archive width={24} height={24} />
      )
    )
    setMyboardIcon(
      currentLo === 3 ? (
        <MyboardOn width={24} height={24} />
      ) : (
        <Myboard width={24} height={24} />
      )
    )
  }, [state?.index])

  const bottomList = [
    { id: 0, title: '홈', icon: homeIcon, target: 'Main' },
    { id: 1, title: '내 작품', icon: fictionListIcon, target: 'MyFictionList' },
    {
      id: 2,
      title: '',
      icon: (
        <UploadWrap>
          <Upload width={24} height={24} />
        </UploadWrap>
      ),
      target: 'Upload',
    },
    { id: 3, title: '보관함', icon: archiveIcon, target: 'Store' },
    { id: 4, title: '마이', icon: myboardIcon, target: 'UserBoard' },
  ]

  const naviHandler = (target: string): void => {
    // bottom tab ctrl
    if (target === 'Upload') {
      setToastPopup({
        ...toastPopup,
        type: 'UploadFiction',
        modalType: 'ToastPopup',
        data: newFiction,
      })
      setIsToastPopup(true)
    } else if (target === 'UserBoard') {
      navigation.navigate('Bottom', {
        screen: 'UserBoard',
        params: {
          userId: userData?.data?.data?.data?.user_id,
          type: 'isMe',
        },
      })
    } else {
      navigation.navigate(target)
    }
  }

  const reportHandler = (value?: string) => {
    console.log('report', value)
  }

  const toastPopupHandler = (type: string, value?: string): void => {
    // modal inner data handle
    if (type === 'ToastPopup') {
      // 토스트 팝업일 경우
      if (value === 'newFiction') {
        navigation.navigate('UploadFiction', {
          screen: 'UploadCover',
          params: { title: '작품 추가' },
        })
        setCurrentType(uploadType.FICTION)
      } else if (value === 'inheritFiction') {
        // 기존 연재 이어쓰기
        navigation.navigate('UploadFiction', {
          screen: 'InheritFiction',
          params: { title: '연재 이어쓰기' },
        })
      } else if (value === 'shortFiction') {
        navigation.navigate('UploadFiction', {
          screen: 'UploadCover',
          params: { title: '단편 추가' },
        })
        setCurrentType(uploadType.SHORT)
      } else if (
        value &&
        ['dispute', 'illegality', 'disgust', 'Sensitive', 'ETC'].includes(value)
      ) {
        reportHandler(value)
      } else {
        // 저장한 에피소드
        setCurrentType(uploadType.SAVED)
        navigation.navigate('UploadFiction', { screen: 'SavedWork' })
      }
    } else if (type === 'Popup') {
      return
    } else if (type === 'Popdown') {
      setIsToastPopup(false)
    }
    setIsToastPopup(false)
  }

  useEffect(() => {
    setIsToastPopup(false)
  }, [])

  return (
    <>
      <Layout>
        {bottomList.map(({ id, title, icon, target }) => (
          <TabButtons key={id} onPress={() => naviHandler(target)}>
            {icon}
            {title ? <ButtonTitle>{title}</ButtonTitle> : null}
          </TabButtons>
        ))}
      </Layout>
      <ModalPopup
        data={toastPopup?.data}
        visible={isToastPopup}
        onPress={toastPopupHandler}
        onClose={() => setIsToastPopup(false)}
        type={toastPopup?.type}
        modalType={toastPopup?.modalType}
      />
    </>
  )
}

const Layout = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  height: 60px;
  background: ${({ theme }) => theme.color.gray12};
`

const TabButtons = styled.TouchableOpacity`
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const ButtonTitle = styled.Text`
  color: ${({ theme }) => theme.color.gray1};
  font-size: ${({ theme }) => theme.fontSize.font10};
  font-family: ${({ theme }) => theme.font.notoMedium};
`

const UploadWrap = styled.View`
  padding: 5px;
  border-radius: 50px;
  border: 1px solid ${({ theme }) => theme.color.gray1};
`
