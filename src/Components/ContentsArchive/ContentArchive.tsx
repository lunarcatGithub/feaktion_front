import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import { Platform } from 'react-native'

// components
import VerticalScroll from '~/Components/VerticalScroll/VerticalScroll'

import { useAppContext } from '~/Hooks/useContextHook'
import { isNotMedropdownList } from '~/Data/dropdownData'
import Dropdown from '../Popup/Dropdown'
import { useQueryClient } from 'react-query'
import { reportFictionList } from '~/Data/reportData'
import { NavigationScreenType } from '~/Router/types/NavigationType'
import HideLayout from '../Common/HideLayout'
import useToggleFetchHook from '~/Hooks/useToggleFetchHook'
import RefreshingScrollView from '../VerticalScroll/RefreshingScrollView'

// type
type props = {
  navigation: any
  type: 'Continue' | 'Preferred'
  data: any
  route: any
}

export default function ContentArchive({
  navigation,
  type,
  data,
  route,
}: props): JSX.Element {
  // fetch
  const queryClient = useQueryClient()
  // store
  const { toastPopup, setToastPopup, isToastPopup, setIsToastPopup } =
    useAppContext()

  // data
  const [contentsPreferData, setContentsPreferData] = useState(data?.data?.data)

  // popup
  const [isModal, setIsModal] = useState(false)
  const [modalType, setModalType] = useState({
    data: [{ index: 0, desc: '', value: '' }],
    position: 0,
    type: '',
    modalType: '',
  })
  // fetch

  useEffect(() => {
    if (!data) return
    if ([200, 201].includes(data?.status)) {
      const fetchData = data?.data?.data
      setContentsPreferData(fetchData)
    }
  }, [data])

  const notiHandler = ({
    data,
    position,
  }: {
    data: { feaktion_id: number | null }
    position: number
  }): void => {
    if (type === 'Continue') {
      setIsModal(true)
      setModalType({
        data: isNotMedropdownList,
        position,
        type: 'smallDropdownPan',
        modalType: 'general',
      })
    }
    //
    else if (type === 'Preferred') {
      if (!data?.feaktion_id) return
      console.log('data', data)
    }
  }

  const naviPressHandler = ({
    id,
    contentType,
  }: {
    id: number
    contentType?: string
  }) => {
    if (contentType === 'user') {
      navigation.navigate(NavigationScreenType.SIDESTACK, {
        screen: NavigationScreenType.USERBOARD,
        params: { userId: id, type: 'otherUser' },
      })
    } else if (contentType === 'short') {
      navigation.navigate(NavigationScreenType.SIDESTACK, {
        screen: NavigationScreenType.VIEWER,
        params: { currentType: 'Short', fictionId: id },
      })
    } else {
      navigation.navigate(NavigationScreenType.SIDESTACK, {
        screen: NavigationScreenType.FICTIONINDEX,
        params: { currentType: 'Story', fictionId: id },
      })
    }
  }

  const modalhandler = (type: string) => {
    if (type === 'report') {
      setToastPopup({
        ...toastPopup,
        type: 'ContentArchive',
        modalType: 'ToastPopup',
        data: reportFictionList,
      })
      setIsToastPopup(true)
    }
    setIsModal(false)
  }

  const refreshHandler = () => {
    setContentsPreferData([])
    queryClient.invalidateQueries([
      type === 'Preferred' ? 'favorite' : 'readed',
    ])
  }

  const noContentHandler = () => {
    switch (type) {
      case 'Preferred':
        return '선호작으로 표시한 작품이 없습니다'

      case 'Continue':
        return '감상한 작품이 없습니다'

      default:
        return ''
        break
    }
  }

  useEffect(() => {
    setIsModal(false)
  }, [route?.name, type])

  return (
    <>
      <Layout>
        {/* <----------- 더보기 버튼 컨트롤 ------------> */}
        {type === 'Continue' && (
          <HideLayout isHide={isModal} onPress={setIsModal} />
        )}
        {contentsPreferData?.length === 0 ? (
          <RefreshingScrollView
            onRefresh={refreshHandler}
            first={noContentHandler()}
          />
        ) : (
          <VerticalLayout>
            <VerticalScroll
              size="Small"
              navi={'ContentsArchive'}
              items={contentsPreferData}
              buttonPress={notiHandler}
              naviPress={naviPressHandler}
              reFresh={refreshHandler}
              type={type}
            />
          </VerticalLayout>
        )}
      </Layout>
      <Dropdown
        data={modalType?.data}
        visible={isModal}
        onClose={() => setIsModal(false)}
        onPress={modalhandler}
        type={modalType?.type}
        position={modalType?.position - (Platform.OS === 'ios' ? 120 : 90)}
        modalType={modalType?.modalType}
      />
    </>
  )
}

const Layout = styled.View`
  flex: 1;
  background: ${({ theme }) => theme.color.gray12};
`

// list render
const VerticalLayout = styled.View`
  display: flex;
  width: 100%;
  height: 100%;
`
