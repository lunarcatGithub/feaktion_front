import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import { SideBottomNavigationStackProps } from '~/Router/types/SideBottomStackRouterTypes'

// components
import VerticalScroll from '~/Components/VerticalScroll/VerticalScroll'
import { Header } from '../Header/Header'

// data
import { isMedropdownList, isNotMedropdownList } from '@Data/dropdownData'
import Dropdown from '../Popup/Dropdown'
import { reportFictionList } from '~/Data/reportData'

// types
import { RouterMoveType } from '@Router/types/RouterType'
import HideLayout from '../Common/HideLayout'
import { FictionType } from '../types/FictionType'
import { useAppContext } from '~/Hooks/useContextHook'

// fetch
import { MethodMytateEnum, useMutationHook } from '~/Hooks/useMutationHook'
import { MyFictionNavigationStackProps } from '~/Router/types/MyFictionRouterTypes'
import { getReadFeaktionAgent } from '~/Agent/FeaktionAgent'

// type
type routeType = {
  title: string
  navi: string
}

type modalData = { index: number; desc: string; value: string }[] | null

export default function OtherFictionList({
  navigation,
  route,
}: MyFictionNavigationStackProps): JSX.Element {
  const [currentRouteValue, setCurrentRouteValue] = useState<routeType>({
    title: '',
    navi: '',
  })

  // store
  const { toastPopup, setToastPopup, isToastPopup, setIsToastPopup } =
    useAppContext()

  const [viewFeaktionData, setViewFeaktionData] = useState<
    { feaktion_id: number }[]
  >([])

  const [isModal, setIsModal] = useState<boolean>(false)

  const [layoutXY, setLayoutXY] = useState(0)
  const [isWrite, setIsWrite] = useState(false)
  const [currentFeaktionType, setCurrentFeaktionType] = useState('')

  const [page, setPage] = useState(0)

  // 신고하기
  const [modalType, setModalType] = useState<{
    data: modalData
    type: string
    modalType: string
  }>({
    data: reportFictionList,
    type: 'CommentReport',
    modalType: 'ToastPopup',
  })

  const mutate = useMutationHook(MethodMytateEnum.GET)

  // fetch
  const getFeaktionDataHandler = async () => {
    const { type, id } = route.params
    try {
      switch (type) {
        case RouterMoveType.RECENTVIEW: // 최근 본 작품
          // mutateAsync({
          //   url: `/feaktion/readed`,
          //   params: {},
          // })

          setCurrentRouteValue({
            title: '최근 본 작품',
            navi: 'readed',
          })
          break

        case RouterMoveType.GENREFICTION:
          const data = await getReadFeaktionAgent({
            url: `/feaktion/interestgenre`,
          })
          // mutateAsync({
          //   url: `/feaktion/interestgenre`,
          //   params: {},
          // })

          setCurrentRouteValue({
            title: '장르 추천 작품',
            navi: 'interestgenre',
          })
          break

        case RouterMoveType.RECENTUPLOADED:
          // if (pageNum === 0) return

          // mutateAsync({
          //   url: `/feaktion/novels`,
          //   params: {
          //     take: 6,
          //     feaktion_id:
          //       // viewFeaktionData[viewFeaktionData.length - 1].feaktion_id,
          //       3,
          //   },
          // })

          setCurrentRouteValue({
            title: '최신 작품',
            navi: 'novels',
          })
          break

        case RouterMoveType.SHORTUPLOADED:
          // mutateAsync({
          //   url: `/feaktion/shorts`,
          //   params: {},
          // })

          setCurrentRouteValue({
            title: '단편 작품',
            navi: 'shorts',
          })
          break

        case RouterMoveType.MYFICTION:
          console.log('currentFeaktionType ====>', currentFeaktionType)
          const readedFeaktion = await getReadFeaktionAgent({
            url: `/feaktion/myfeaktions`,
            // url: `/feaktion/myfeaktions`,
            mutate,
            option: { retry: true },
          })

          console.log('data ====>', readedFeaktion)

          setCurrentRouteValue({
            title: '등록 작품',
            navi: 'myfeaktions',
          })
          break

        case RouterMoveType.USERBOARDEPISODE:
          // mutateAsync({
          //   url: `/user/${id}/novels`,
          //   params: {},
          // })

          setCurrentRouteValue({
            title: '연재 작품 더보기',
            navi: 'userboardepisode',
          })
          break

        case RouterMoveType.USERBOARDSHORT:
          // mutateAsync({
          //   url: `/user/${id/shorts`,
          //   params: {},
          // })

          setCurrentRouteValue({
            title: '단편 작품 더보기',
            navi: 'userboardshorts',
          })
          break

        default:
          break
      }
    } catch (e) {
      console.warn('error!', e)
    }
  }

  useEffect(() => {
    setPage(0)
    getFeaktionDataHandler()
  }, [])

  useEffect(() => {
    if (page > 0) return
    setViewFeaktionData(route?.params.fictionData)
  }, [])

  useEffect(() => {
    if (page === 0) {
      setViewFeaktionData(route?.params.fictionData)
      return
    }

    const feaktionData = data?.data
    if (currentRouteValue?.navi === 'readed') {
      const result = feaktionData?.data?.map(
        (itmes: { feaktion: {} }) => itmes?.feaktion
      )
      console.log('result', result)
      if (result?.length > 0) {
        // 초기 렌더링 되면 undefined기 때문에..
        setViewFeaktionData([...viewFeaktionData, ...result])
      }
    } else if (
      ['recent', 'short', 'genre']?.includes(currentRouteValue?.navi || '')
    ) {
      setViewFeaktionData(feaktionData)
    } else {
      setViewFeaktionData(feaktionData?.data)
    }
  }, [page])

  const moreButtonHandler = ({ position }: { position: number }) => {
    // 더보기 버튼 활성화
    setLayoutXY(position)
    setIsModal(true)
  }

  const naviPressHandler = ({
    id,
    contentType,
  }: {
    id: number
    contentType: string
  }) => {
    // contentType : 단편, 시리즈, 유저 화면 전환 표식
    if (contentType === 'novel') {
      navigation.navigate('SideStack', {
        screen: 'FictionIndex',
        params: { currentType: FictionType.SERIES, fictionId: id },
      })
      return
    }
    if (contentType === 'short') {
      navigation.navigate('SideStack', {
        screen: 'Viewer',
        params: { currentType: FictionType.SHORT, fictionId: id },
      })
      return
    }
    if (contentType === 'user') {
      navigation.navigate('SideStack', {
        screen: 'UserBoard',
        params: { userId: id },
      })
      return
    }
  }

  const panModalHandler = () => {
    setIsModal(false)
    setIsToastPopup(true)
    setToastPopup({
      ...toastPopup,
      type: 'ContentArchive',
      modalType: 'ToastPopup',
      data: reportFictionList,
    })
  }

  const headerNaviHandler = (type: string) => {
    if (type === 'goback') navigation.goBack()
  }

  const InfinityDataHandler = () => {
    const pageAdd = page + 1
    getFeaktionDataHandler()
    setPage(() => pageAdd)
  }

  useEffect(() => {
    setIsModal(false)
  }, [route?.params])

  return (
    <>
      <Layout>
        {/* <----------- 더보기 버튼 컨트롤 ------------> */}
        <HideLayout isHide={isModal} onPress={setIsModal} />
        <HeaderWrap>
          <Header
            navigation={navigation}
            route={{
              name: `${'MyFictionList'}`,
              params: { title: currentRouteValue?.title },
            }}
            onPress={headerNaviHandler}
          />
        </HeaderWrap>
        {viewFeaktionData?.length === 0 ? (
          <NoConetentWrap>
            <Text>작품이 없습니다</Text>
          </NoConetentWrap>
        ) : (
          <VerticalLayout>
            <VerticalScroll
              type={''}
              navi={currentRouteValue.navi}
              items={viewFeaktionData}
              buttonPress={moreButtonHandler}
              naviPress={naviPressHandler}
              reFresh={() => {}}
              onEndReached={InfinityDataHandler}
            />
          </VerticalLayout>
        )}
      </Layout>
      <Dropdown
        data={isWrite ? isMedropdownList : isNotMedropdownList}
        visible={isModal}
        onClose={() => setIsModal(false)}
        onPress={panModalHandler}
        position={layoutXY}
        type="smallDropdownPan"
      />
    </>
  )
}

// header
const HeaderWrap = styled.View`
  width: 100%;
`

const Layout = styled.View`
  background: ${({ theme }) => theme.color.gray12};
  flex: 1;
`

const NoConetentWrap = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding-top: 160px;
`

const Text = styled.Text`
  color: ${({ theme }) => theme.color.gray3};
  font-size: ${({ theme }) => theme.fontSize.font14};
  line-height: 20px;
`

// list render
const VerticalLayout = styled.View`
  display: flex;
  width: 100%;
  height: 100%;
`
