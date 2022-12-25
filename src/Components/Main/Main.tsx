import React, { useEffect, useState, useRef, useContext } from 'react'
import styled from 'styled-components/native'
import { useQuery, useQueryClient } from 'react-query'
import { Animated, BackHandler } from 'react-native'
import SystemSetting from 'react-native-system-setting'
import useFetch from '@Hooks/useAxiosFetch'

// components
import MainHeader from '../Header/MainHeader'
import HorizonScroll from '../HorizonScroll/HorizonScroll'
import TagsScroll from '../HorizonScroll/TagsScroll'
import Dropdown from '../Popup/Dropdown'
import MainBanner from './MainBanner'

// store
import VerticalScroll from '../VerticalScroll/VerticalScroll'
import TitleHeader from '../Common/TitleHeader'
import ShortContent from '../Common/ShortContent'
import { AuthContext } from '~/App'

// hooks
import { useAppContext, useAsyncContext } from '~/Hooks/useContextHook'
import useAsyncStorage from '~/Hooks/useAsyncStorage'
import useBackExit from '~/Hooks/useBackExit'

// data
import { isMedropdownList, isNotMedropdownList } from '~/Data/dropdownData'
import { reportFictionList } from '~/Data/reportData'

// type
import { AsyncCallType } from '~/Context/types/contextType'
import { MainNavigationStackProps } from '~/Router/types/MainRouterTypes'
import { NavigationScreenType } from '~/Router/types/NavigationType'
import { GenreType, ListFictionType } from '../types/FictionType'
import { RouterMoveType } from '@Router/types/RouterType'
import { ScrollDirectionType } from '../types/LayoutType'
import { OnScrollEvent } from '../types/CommonType'
import { uploadType } from '~/Store/UploadStore'
import useMutationHook from '~/Hooks/useMutationHook'

type MainDataType = {
  recent: {}
  interest_genres: {}
  novels: {}
  shorts: {}
} | null

type ScrollDataType = {
  id: number
  isTags: boolean
  scrollType: ScrollDirectionType
  navi: Exclude<RouterMoveType, 'ShortUploaded' | 'RecentUploaded'>
  data: any
  // data: ListFictionType[];
  title: string
}

export default function Main({
  navigation,
}: MainNavigationStackProps): JSX.Element {
  // enum type
  const { RECENTVIEW, GENREFICTION, SHORTUPLOADED, RECENTUPLOADED } =
    RouterMoveType
  const {
    USERBOARD,
    SIDEBOTTOMSTACK,
    SIDESTACK,
    FICTIONINDEX,
    OTHERFICTIONLIST,
    GENRESELECT,
  } = NavigationScreenType

  const { FICTION, SHORT } = uploadType
  const { HORIZON, LIST, VERTICAL } = ScrollDirectionType

  // ref
  const scrollRef = useRef(null)

  // fetch
  const { data: mainGetData }: { data: any } = useQuery(
    ['fiction'],
    () => useFetch({ url: `/feaktion`, method: 'get' }),
    { retry: true }
  )

  const { data: recentGetData, mutateAsync } = useMutationHook('get')

  const queryClient = useQueryClient()
  const { setUserToken } = useContext(AuthContext)

  // context
  const { asyncDispatch } = useAsyncContext()
  const {
    genreMaleArr,
    genreFemaleArr,
    toastPopup,
    setToastPopup,
    setIsToastPopup,
    setHeaderScroll,
    getUser,
    setInitBright,
  } = useAppContext()

  const [userGenderType, setUserGenderType] = useState('Male')
  const [page, setPage] = useState(0)

  const [mergeGenre, setMergeGenre] = useState<
    { index: number; value: string; title: string }[] | undefined
  >([])
  const [isCheckedGenre, setIsCheckedGenre] = useState<
    { index: number; value: string; title: string; checked: boolean }[]
  >([])

  const [toValue, setToValue] = useState(0)
  const [layoutXY, setLayoutXY] = useState(0)

  const [mainData, setMainData] = useState<MainDataType>(null)

  // isMe
  const [isMe, setIsMe] = useState(false)

  // trigger event
  const [currentHeight, setCurrentHeight] = useState(false)

  // animation
  const [headerOpacity] = useState(new Animated.Value(0))

  // hooks
  const [asyncHandler, _result] = useAsyncStorage()

  // popup
  const [isModal, setIsModal] = useState(false)

  // back
  const backHandler = useBackExit()

  useEffect(() => {
    // init bright
    SystemSetting.getAppBrightness().then(brightness => {
      // no permission
      // SystemSetting.setAppBrightness(brightness)
      setInitBright(brightness)
    })
  }, [])

  useEffect(() => {
    // animation
    return Animated.timing(headerOpacity, {
      toValue,
      duration: 200,
      useNativeDriver: true,
    }).start()
  }, [toValue, headerOpacity])

  const mainHeaderHandler = (): JSX.Element => {
    return (
      <>
        <DummyHeader
          display={currentHeight}
          style={{ opacity: headerOpacity }}
        />
        <MainHeaderWrap>
          <MainHeader navigation={navigation} />
        </MainHeaderWrap>
      </>
    )
  }

  const headerControl: OnScrollEvent = event => {
    const height = event.nativeEvent.contentOffset.y
    setHeaderScroll(Math.floor(height))
    if (310 < height) {
      setCurrentHeight(true)
      setToValue(1)
    } else {
      setCurrentHeight(false)
      setToValue(0)
    }
  }

  const mergeGenreArr = () => {
    genreMaleArr.sort(() => Math.random() - Math.random())
    genreFemaleArr.sort(() => Math.random() - Math.random())

    let mergeArr
    if (userGenderType === GenreType.Male) {
      mergeArr = [...genreMaleArr, ...genreFemaleArr]
    } else if (userGenderType === GenreType.FeMale) {
      mergeArr = [...genreFemaleArr, ...genreMaleArr]
    }
    setMergeGenre(mergeArr)
  }

  useEffect(() => {
    // default select genre
    setIsCheckedGenre([])
  }, [mergeGenre])

  // const isTagsScrollHandler = (type: boolean): JSX.Element => {
  //   if (type) {
  //     return (
  //       <TagsScrollWrap>
  //         <TagsScroll
  //           items={mergeGenre}
  //           select={{ selectGenre, setSelectGenre }}
  //         />
  //       </TagsScrollWrap>
  //     );
  //   } else {
  //     return <DummyLayout />;
  //   }
  // };

  const modalMoveCtrl = (type: string) => {
    setIsModal(false)
  }

  const navigationHandler = (navi: string): void => {
    // 더보기 페이지로 이동
    navigation.navigate(SIDEBOTTOMSTACK, {
      screen: OTHERFICTIONLIST,
      params: { type: navi, fictionData: mainData?.novels },
    })
  }

  const naviPressHandler = ({
    id,
    contentType,
  }: {
    id: number
    contentType: string
  }): void => {
    if (!contentType) return
    if (contentType === 'user') {
      navigation.navigate(SIDESTACK, {
        screen: USERBOARD,
        params: { userId: id, type: 'otherUser' },
      })
    } else {
      navigation.navigate(SIDESTACK, {
        screen: FICTIONINDEX,
        params: { currentType: FICTION, fictionId: id },
      })
    }
  }

  const buttonPressHandler = ({ position }: { position: number }) => {
    // 더보기 메뉴 활성화
    setLayoutXY(Math.round(position))
    setIsModal(true)
  }

  const pageNavigationHandler = ({
    fictionType,
    fictionId,
  }: {
    fictionType: string
    fictionId: number
  }): void => {
    switch (fictionType) {
      // 장편 시리즈 소설 목록 화면으로 이동
      case FICTION:
        navigation.navigate(SIDESTACK, {
          screen: FICTIONINDEX,
          params: { currentType: FICTION, fictionId },
        })
        break
      case SHORT:
        // 단편 뷰어로 이동
        navigation.navigate(SIDESTACK, {
          screen: 'Viewer',
          params: { currentType: SHORT, fictionId },
        })
        break

      default:
        break
    }
    return
  }

  const dropdownHandler = (type: string) => {
    if (type === 'report') {
      setToastPopup({
        ...toastPopup,
        type: 'ReportFiction',
        modalType: 'ToastPopup',
        data: reportFictionList,
      })
      setIsToastPopup(true)
      setIsModal(false) // small drop down remove
    }
  }

  useEffect(() => {
    if ([200, 201].includes(mainGetData?.status)) {
      setMainData(mainGetData?.data?.data)
      return
    }
    if ([400, 403, 404, 500, 502].includes(mainGetData?.status)) {
      // login 화면으로 이동
      asyncDispatch({ type: AsyncCallType.REMOVE, key: 'token' })
      console.log('>>>>>>>>>>>>>>>>>> check')
      setUserToken(false)
      return
    }
  }, [mainGetData])

  useEffect(() => {
    const back = BackHandler.addEventListener(
      'hardwareBackPress',
      hookBackHandle
    )
    return () => back.remove()
  }, [])

  const hookBackHandle = () => {
    if (navigation?.canGoBack()) return
    backHandler()
    return true
  }

  useEffect(() => {
    /** dev 임시 로그아웃 */
    // setUserToken(false);
    // asyncHandler('SET', 'token', JSON.stringify(false));

    // 가입하자마자 장르 선택할 수 있게 하기
    // 장르가 선택되어 있다면 출력안함
    if (!getUser) return
    console.log('getUser?.user_interest', getUser?.user_interest)

    if (getUser?.user_interest?.length === 0) {
      navigation.navigate(SIDESTACK, {
        screen: GENRESELECT,
        params: {
          navi: 'Auth',
          selected: null,
        },
      })
    } else return
  }, [getUser])

  const infinityDataHandler = (type: string) => {
    if (type !== 'RecentUploaded') return
    setPage(() => page + 1)
  }

  useEffect(() => {
    return
    mutateAsync({
      url: `/feaktion/novels`,
      params: {
        take: 6,
        // feaktion_id: viewFeaktionData[viewFeaktionData.length - 1].feaktion_id,
      },
    })
  }, [])

  /** fiction data render */
  const flatListRender = ({ item }: { item: ScrollDataType }): JSX.Element => {
    const { id, title, isTags, scrollType, data, navi } = item

    return (
      <LayoutInner key={`index__${id}`}>
        <ScrollAllWrap>
          <TitleHeader title={title} onPress={() => navigationHandler(navi)} />
          {/* {isTagsScrollHandler(isTags)} */}
          {scrollType === HORIZON ? (
            <ScrollLayout styling={isTags}>
              <HorizonScroll
                items={data}
                navi={navi}
                onPress={pageNavigationHandler}
              />
            </ScrollLayout>
          ) : scrollType === VERTICAL ? (
            <VerticalLayout>
              <VerticalScroll
                items={data}
                navi={navi}
                type="coverIndex"
                buttonPress={buttonPressHandler}
                naviPress={naviPressHandler}
                reFresh={() => console.log('')}
                onEndReached={() => infinityDataHandler(navi)}
              />
            </VerticalLayout>
          ) : (
            <ShortWrap>
              {data?.map(
                (data: ListFictionType, i: number): JSX.Element => (
                  <LayoutInner key={`index__${i}`}>
                    <ShortContent
                      items={data}
                      onPress={pageNavigationHandler}
                    />
                  </LayoutInner>
                )
              )}
            </ShortWrap>
          )}
        </ScrollAllWrap>
      </LayoutInner>
    )
  }

  useEffect(() => {
    mergeGenreArr()
  }, [])

  const scrollList = [
    {
      id: 0,
      isTags: false,
      scrollType: HORIZON,
      navi: RECENTVIEW,
      data: mainData?.recent,
      title: '최근 본 작품',
    },
    {
      id: 1,
      isTags: true,
      scrollType: HORIZON,
      navi: GENREFICTION,
      data: mainData?.interest_genres,
      title: '장르별 추천 작품',
    },
    {
      id: 2,
      isTags: false,
      scrollType: LIST,
      navi: SHORTUPLOADED,
      data: mainData?.shorts,
      title: '단편 작품',
    },
    {
      id: 3,
      isTags: false,
      scrollType: VERTICAL,
      navi: RECENTUPLOADED,
      data: mainData?.novels,
      title: '최신 작품',
    },
  ]

  const RefreshControl = () => {
    queryClient.invalidateQueries(['fiction'])
  }

  // mutateAsync({
  //   url: `/feaktion/novels`,
  //   params: {
  //     take: 6,
  //     feaktion_id:
  //       viewFeaktionData[viewFeaktionData.length - 1].feaktion_id,
  //   },
  // });

  return (
    <>
      <Layout>
        {mainHeaderHandler()}
        <FlatScrollView
          ref={scrollRef}
          refreshing={false}
          onRefresh={RefreshControl}
          ListHeaderComponent={<MainBanner />}
          data={scrollList}
          renderItem={items => flatListRender(items)}
          onScroll={headerControl}
          // onEndReached={() => {}}
        />
      </Layout>
      <Dropdown
        data={isMe ? isMedropdownList : isNotMedropdownList}
        visible={isModal}
        onClose={() => setIsModal(false)}
        onPress={dropdownHandler}
        position={layoutXY}
        type="smallDropdownPan"
        modalType="general"
      />
    </>
  )
}

// layout
const Layout = styled.View`
  background: ${({ theme }) => theme.color.gray12};
`

const LayoutInner = styled.View`
  /* padding: 0 16px; */
`

// scrollview

const FlatScrollView = styled.FlatList``

// header
const MainHeaderWrap = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  padding: 12px 16px 12px 10px;
  width: 100%;
  height: 48px;
  z-index: 9999;
`

const DummyHeader = styled(Animated.View)<{ display: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  padding: 12px 16px 12px 10px;
  width: 100%;
  height: 48px;
  z-index: 1;
  background: ${({ theme }) => theme.color.gray12};
`

// list wrap

const ScrollAllWrap = styled.View`
  display: flex;
  width: 100%;
  flex-direction: column;
  margin-top: 32px;
`

const DummyLayout = styled.View`
  margin-top: 16px;
`

const ScrollLayout = styled.View<{ styling: boolean }>`
  display: flex;
  width: 100%;
  height: 160px;
`

const VerticalLayout = styled.View`
  display: flex;
  width: 100%;
  height: 100%;
  margin-bottom: 50px;
`

const TagsScrollWrap = styled.View`
  margin-top: 10px;
  margin-bottom: 16px;
`

// short
const ShortWrap = styled.View`
  margin-bottom: 24px;
`
