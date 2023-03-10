import React, {
    RefObject,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react'
import { FlatList, LayoutChangeEvent, StyleSheet } from 'react-native'
import styled from 'styled-components/native'
import Animated, {
    SharedValue,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated'
import { useQueryClient } from 'react-query'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import SystemSetting from 'react-native-system-setting'

// components
import ViewList from './ViewList'
import ViewBottom from './ViewBottom'
import ViewTextOption from './ViewTextOption'
import ViewReact from './ViewReact'
import StackLoading from '../Loading/StackLoading'
import Dropdown from '../Popup/Dropdown'

// data
import ModalPopup from '../Popup/Modal'
import { reportFictionList } from '~/Data/reportData'

// hooks
import {
    useAppContext,
    useViewerContext,
    useUploadContext,
} from '~/Hooks/useContextHook'
import { MethodMytateEnum, useMutationHook } from '~/Hooks/useMutationHook'
// import ToastPush from '../Interaction/ToastPush'
import useDebounce from '~/Hooks/useDebounce'
import ViewIndexCover from './ViewIndexCover'
import useAsyncStorage from '~/Hooks/useAsyncStorage'

import { uploadType } from '~/Store/UploadStore'
import { viewDataType } from '~/Store/ViewStore'

// type
type sceneArrType = {
    title: string
    scene?: string
    image?: string | undefined
    desc: string
    background: string
}

type modalData = { index: number; desc: string; value: string }[] | null
type props = {
    navigation: any
    // data: {
    //     isLoading: boolean
    //     episode_title: string
    //     episodeTitle: string
    //     scenes: []
    //     episode_like: { like_id: number | undefined }[]
    //     feaktion_user: { nickname: string }
    //     writer_comment: string
    // }
    data: viewDataType
    currentType: string
    fictionId: number
    episodeId: number
    coverData?: { feaktion_title: string; isWriter: boolean }
    scroll?: number
    isUploaded?: any
}

export default function ViewContent({
    navigation,
    data,
    currentType,
    fictionId,
    episodeId,
    coverData,
    scroll = 0,
    isUploaded,
}: props): JSX.Element {
    const { getImageUrl, initBright } = useAppContext()
    const { setCurrentType, setCurrentEpisodeId, fictionData } =
        useUploadContext()
    const [asyncHandler, _result] = useAsyncStorage()

    const [currentView, setCurrentView] = useState(0)
    const [scrollOffset, setScrollOffset] = useState(0)
    const [scrollCtrl, setScrollCtrl] = useState(0)
    const [isScrollDrag, setIsScrollDrag] = useState(false)
    const [scrollHeight, setScrollHeight] = useState(0)

    // scroll ctrl
    const [hideBottom, setHideBottom] = useState(false)

    // fetch
    const RemoveMutate = useMutationHook(MethodMytateEnum.DELETE)
    const queryClient = useQueryClient()

    // view data
    const [finalData, setFinalData] = useState<sceneArrType[]>([])
    const [backgroundImage, setBackgroundImage] = useState<string | undefined>(
        undefined
    )
    const [curImage, setCurImage] = useState<null | JSX.Element>(null)
    const [layoutHeight, setLayoutHeight] = useState<
        { index: number; height: number }[]
    >([])
    const [itemsHeight, setItemsHeight] = useState<
        { index: number; height: number }[]
    >([])

    // modal control
    const [textOpt, setTextOpt] = useState(false)
    const [layoutXY, setLayoutXY] = useState({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    })

    const [isModal, setIsModal] = useState(false)
    const [toastPush, setToastPush] = useState('')
    const [dropdownType, setDropdownType] = useState({
        data: [
            {
                index: 0,
                desc: '',
                value: '',
            },
        ],
        position: 0,
        type: '',
        dropdownType: '',
    })

    const [modalType, setModalType] = useState<{
        data: modalData
        type: string
        modalType: string
    }>({
        data: null,
        modalType: 'popup',
        type: 'FictionRemove',
    })

    const [isPopup, setIsPopup] = useState(false)

    // animation handler

    const { setEpisodePostId, setFictionPostId, setViewData, adjustViewText } =
        useViewerContext()

    // ref
    const scrollRef: RefObject<FlatList<any>> = useRef(null)
    const opacityImage: SharedValue<number> = useRef(useSharedValue(0)).current
    const moveAnimation: SharedValue<number> = useRef(useSharedValue(0)).current

    // bright
    useEffect(() => {
        asyncHandler('GET', 'textOpt')
    }, [])

    useEffect(() => {
        // ?????? ?????????????????? ??????/?????? ??? ?????? ??????????????? ?????? ????????? ??????
        if (!episodeId && !fictionId) return
        setEpisodePostId(episodeId)

        if (fictionId === 0 || !fictionId) return
        setFictionPostId(fictionId)
    }, [episodeId, fictionId])

    useEffect(() => {
        if (!_result?.result) return
        const storageText = JSON.parse(JSON.parse(_result?.result))
        SystemSetting.setAppBrightness(Math.round(storageText?.bright))
    }, [_result?.result])

    useEffect(
        () =>
            navigation.addListener('blur', () => {
                // ????????? ???????????? ?????? ????????? ????????????
                SystemSetting.setAppBrightness(initBright)

                if (currentType === 'Viewer') {
                    // ???????????? ??????????????? ?????? ??? ?????? ????????? ?????? ??????
                    queryClient.invalidateQueries(['fiction', fictionId])
                }
            }),
        []
    )

    const sceneChange = () => {
        itemsHeight?.map(({ height, index }) => {
            if (height <= scrollOffset) {
                setCurrentView(index)
            } else {
                // ?????? ??? ??????
                if (index === currentView && isScrollDrag) {
                    setCurrentView(index - 1)
                } else {
                    return
                }
            }
        })
    }

    useEffect(() => {
        sceneChange()
    }, [itemsHeight, scrollOffset])

    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        new Promise(res => {
            setTimeout(() => {
                res(scroll)
                setCurrentIndex(scroll)
            }, 500)
        })
            .then(nextIndex => {
                if (!nextIndex) return
                if (!scrollRef.current) return
                scrollRef.current.scrollToIndex({
                    animated: true,
                    index: currentIndex,
                })
            })
            .catch(err => console.log(err))
    }, [scroll, currentIndex])

    const handleScroll = (e: any) => {
        const yOffset = e.nativeEvent.contentOffset.y
        setScrollOffset(yOffset)
    }

    function getLayout(e: LayoutChangeEvent): void {
        const { height } = e.nativeEvent.layout
        setScrollHeight(height)
    }

    const renderDataHandler = () => {
        let currentImage
        let finalView

        if (currentType === 'Preview') {
            if (fictionData?.scene?.length === 0) return
            const { scene } = fictionData

            if (!scene) return
            currentImage = scene[currentView - 1]?.background?.uri

            finalView = scene?.map(items => ({
                ...items,
                epititle: data?.episodeTitle,
                scene: items?.desc,
                image: items?.background,
            }))
        } else {
            if (!data?.scenes) return

            const { scenes } = data
            const imageList = scenes?.map(
                ({ image }: { image: string }, index: number) => ({
                    id: index,
                    background: image,
                })
            )
            currentImage = imageList[currentView]?.background
            finalView = scenes?.map((items: any, index: number) => ({
                index,
                epititle: data?.episode_title,
                ...items,
            }))
        }
        setFinalData(finalView)
        setBackgroundImage(currentImage)
    }

    // scroll handler get current page
    const getCurrentPage = () => {
        // 1. ??? ?????? height ??? ??????
        // 2. ????????? ???????????? trigger ?????? state ??? ??????
        const heightArr = []

        const lastReduceResult = layoutHeight?.reduce(
            (acc: number, cur: { height: number }, index) => {
                if (acc !== 0) {
                    heightArr.push({ index, height: acc })
                }
                return acc + cur.height
            },
            0
        )

        heightArr.push({
            index: layoutHeight?.length,
            height: lastReduceResult,
        })
        setItemsHeight(heightArr)
    }

    useEffect(() => {
        getCurrentPage()
    }, [layoutHeight])

    useEffect(() => {
        opacityImage.value = 0

        if (adjustViewText?.backcolor === 'image') {
            const typeDivide =
                currentType === 'Preview'
                    ? backgroundImage
                    : backgroundImage
                    ? `${getImageUrl}${backgroundImage}`
                    : undefined

            setCurImage(
                <Animated.Image
                    source={{ uri: typeDivide }}
                    style={[styles.backgroundStyle, animatedStyles]}
                    onLoad={onLoadHandler}
                />
            )
        } else {
            setCurImage(null)
        }
    }, [backgroundImage, adjustViewText?.backcolor, currentView])

    const sceneMoveCtrl = (
        type = '',
        current?: number | string,
        id?: number
    ): void => {
        // scene ????????? ??????
        if (type === 'remove') {
            setModalType({
                data: null,
                type: 'FictionRemove',
                modalType: 'Popup',
            })
            setIsPopup(true)
        } else if (type === 'modify') {
            // episode ????????????
            if (currentType === 'Short') {
                setCurrentType(uploadType.SHORTMODIFY)
                navigation.navigate('UploadFiction', {
                    screen: 'UploadCover',
                    params: {
                        type,
                        fictionId,
                        fictionData: coverData,
                        episodeData: finalData,
                    },
                })
            } else {
                setCurrentType(uploadType.EPISODEMODIFY)
                setCurrentEpisodeId(episodeId) // ????????? id
                navigation.navigate('UploadFiction', {
                    screen: 'FictionEditor',
                    params: {
                        type,
                        fictionId,
                        fictionData: finalData,
                        title: coverData?.feaktion_title,
                    },
                })
            }
        } else if (type === 'list') {
            if (id) {
                // episode ??????
                setEpisodePostId(id)
            } else {
                // scroll ??????
                if (!current) return
                if (typeof current === 'string') return
                scrollRef?.current?.scrollToIndex({ index: current - 1 })
                setCurrentView(current - 1)
                setIsModal(false)
            }
        } else if (type === 'report') {
            // ????????????
            reportHandler()
        }
        setIsModal(false)
    }

    const viewTextOptScrollHandler = () => {
        // ?????? ??????????????? ??? ??? ?????? ??????
        new Promise(res => {
            scrollRef?.current?.scrollToIndex({ index: 0 })
            res(false)
        }).then((bool: boolean | unknown): void => {
            if (typeof bool !== 'boolean') return
            setHideBottom(bool)
        })
    }

    const reportHandler = () => {
        setModalType({
            data: reportFictionList,
            type: 'ViewHeader',
            modalType: 'ToastPopup',
        })
        setIsPopup(true)
        setIsModal(false)
    }

    const modalHandler = (type: string, position: string) => {
        console.log('fictionId', fictionId)
        if (position === 'confirm') {
            const url =
                currentType === 'Short'
                    ? `/feaktion/${fictionId}`
                    : `/feaktion/${fictionId}/episode/${episodeId}`
            RemoveMutate?.mutateAsync({ url, data: {} }).then(() => {
                setIsPopup(false)
                navigation.goBack()
            })
        } else {
            setIsPopup(false)
            return
        }
    }

    useEffect(() => {
        setViewData(data)
    }, [data, currentType])

    useEffect(() => {
        if (!data) return
        renderDataHandler()
    }, [currentView, data])

    useEffect(() => {
        if (scrollCtrl > scrollOffset) {
            // ?????? ????????? ?????? ??????
            setIsScrollDrag(true)
        } else {
            setIsScrollDrag(false)
            setHideBottom(true)
        }
    }, [scrollCtrl, scrollOffset])

    const bottomPosition = (e: LayoutChangeEvent): void => {
        const { x, y, width, height } = e.nativeEvent.layout
        setLayoutXY({ x, y, width, height })
    }

    const animatedStyles = useAnimatedStyle(() => {
        return {
            opacity: opacityImage.value,
        }
    })

    const onLoadHandler = () => {
        // ????????? ?????? ?????? ??????
        opacityImage.value = withTiming(1, { duration: 500 })
    }

    const scrollDebounce: boolean | undefined = useDebounce(hideBottom)

    useEffect(() => {
        // bottom animation
        moveAnimation.value = withSpring(scrollDebounce ? -100 : 0, {
            damping: 20,
            stiffness: 200,
        })
    }, [scrollDebounce])

    const bottomAnimatedStyles = useAnimatedStyle(() => {
        return {
            bottom: moveAnimation.value,
        }
    })

    const bottomRenderHandler = () => {
        if (currentType === 'Preview') return <></>

        return (
            <>
                {textOpt ? (
                    <ViewTextOption onClose={() => setTextOpt(!textOpt)} />
                ) : (
                    <Animated.View
                        onLayout={bottomPosition}
                        style={[styles.bottomWrap, bottomAnimatedStyles]}>
                        <ViewBottom
                            navigation={navigation}
                            setTextOpt={setTextOpt}
                            scrollHeight={scrollHeight}
                            setIsModal={setIsModal}
                            setDropdownType={setDropdownType}
                            finalData={finalData}
                            layoutXY={layoutXY}
                            currentView={currentView}
                            setCurrentView={setCurrentView}
                            currentType={currentType}
                            scrollHandler={viewTextOptScrollHandler}
                        />
                    </Animated.View>
                )}
            </>
        )
    }
    console.log('finalData', finalData)

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            {data?.isLoading ? <StackLoading /> : null}
            <Layout>
                <ViewIndexCover
                    coverData={coverData}
                    fictionId={fictionId}
                    setToastPush={setToastPush}
                    navigation={navigation}
                    currentType={currentType}
                    setIsModal={setIsModal}
                    setDropdownType={setDropdownType}
                    data={data}
                    isUploaded={isUploaded}
                />
                <LayoutInner onTouchStart={() => setHideBottom(false)}>
                    <BackgroundWrap>{curImage}</BackgroundWrap>
                    <ViewerList
                        ref={scrollRef}
                        keyExtractor={useCallback(
                            (_: any, i: number) => `pages__${i}`,
                            []
                        )}
                        onEndReachedThreshold={1}
                        ListFooterComponent={
                            currentType === 'Preview' ? (
                                <></>
                            ) : (
                                <ViewReact data={data} />
                            )
                        }
                        showsVerticalScrollIndicator={true}
                        onLayout={getLayout}
                        onScrollBeginDrag={() => setScrollCtrl(scrollOffset)} // ????????? ?????? ??????
                        // onScrollEndDrag={() => isUpAndDownDetect('end')}
                        onScroll={handleScroll}
                        data={finalData}
                        // renderItem={(items) => <Test />}
                        renderItem={useCallback(
                            (_data: any) =>
                                _data ? (
                                    <Wrap key={`key__${_data?.index}`}>
                                        <ViewList
                                            data={_data}
                                            currentType={currentType}
                                            currentView={currentView}
                                            setLayoutHeight={setLayoutHeight}
                                            layoutheight={layoutHeight}
                                        />
                                    </Wrap>
                                ) : null,
                            [currentView, layoutHeight]
                        )}
                    />
                    {bottomRenderHandler()}
                </LayoutInner>
            </Layout>
            <Dropdown
                data={dropdownType?.data}
                visible={isModal}
                onClose={() => setIsModal(false)}
                onPress={sceneMoveCtrl}
                position={dropdownType?.position}
                type={dropdownType?.type}
                modalType={dropdownType?.dropdownType}
            />
            <ModalPopup
                data={modalType?.data}
                visible={isPopup}
                onClose={() => setIsPopup(false)}
                onPress={modalHandler}
                type={modalType?.type}
                modalType={modalType?.modalType}
            />
            {/* {["PICKOFF", "PICKON"].map((items, index) => (
        <Wrap key={`keys__${index}`}>
          <ToastPush type={items} />
        </Wrap>
      ))} */}
        </GestureHandlerRootView>
    )
}

const styles = StyleSheet.create({
    backgroundStyle: {
        width: '100%',
        height: '100%',
    },
    bottomWrap: {
        position: 'absolute',
        left: 0,
        right: 0,
        width: '100%',
        height: 'auto',
    },
})

const Test = styled.View`
    width: 100%;
    height: 300px;
    background-color: red;
    z-index: 99999;
`

const ViewerList = styled.FlatList``

const Skeleton = styled.View`
    width: 360px;
    height: 500px;
`
const Wrap = styled.View``

const Layout = styled.View`
    flex: 1;
    flex-direction: column;
    background-color: ${({ theme }) => theme.color.gray12};
`

const LayoutInner = styled.View`
    flex: 1;
`

// background
const BackgroundWrap = styled.View`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
`
