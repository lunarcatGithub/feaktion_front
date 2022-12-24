import React, { Dispatch, SetStateAction, useState, useEffect } from 'react'
import styled from 'styled-components/native'

// icons
import Front from '@Icons/front.svg'
import Back from '@Icons/back.svg'
import TextSetting from '@Icons/textsetting.svg'
import Comment from '@Icons/comment.svg'
import BookList from '@Icons/booklist.svg'
import Down from '@Icons/down.svg'

// hooks
import { useViewerContext } from '~/Hooks/useContextHook'
import useOnLayout from '~/Hooks/useOnLayout'
import { uploadType } from '~/Store/UploadStore'

type props = {
  navigation: any
  setTextOpt: Dispatch<SetStateAction<boolean>>
  setDropdownType: Dispatch<
    SetStateAction<{
      data: {
        index: number
        desc: string
        value: string
      }[]
      position: number
      type: string
      dropdownType: string
    }>
  >
  setIsModal: Dispatch<SetStateAction<boolean>>
  scrollHeight: number
  layoutXY: { x: number; y: number; width: number; height: number }
  finalData: any
  setCurrentView: Dispatch<SetStateAction<number>>
  currentView: number
  currentType: string
  scrollHandler: () => void
}

type sceneArrType = {
  title: string
  scene?: string
  image?: string
  desc: string
  background: string
}

export default function ViewBottom({
  navigation,
  setTextOpt,
  setIsModal,
  setDropdownType,
  finalData,
  layoutXY,
  setCurrentView,
  currentView,
  currentType,
  scrollHandler,
}: props): JSX.Element {
  // store
  const {
    viewData,
    curEpisodeCount,
    setEpisodePostId,
    episodePostId,
    viewFictionData,
  } = useViewerContext()

  const [sceneList, setSceneList] = useState<
    { index: number; value: string; desc: string }[]
  >([])
  const [dropDownList, setDropDownList] = useState<
    { index: number; value: string; desc: string }[]
  >([])

  const [preventButton, setpreventButton] = useState('ok')
  const [layoutSize, setLayoutSize] = useState({ scene: 0, list: 0 })

  const [sceneSize, getSceneSizeLayout] = useOnLayout('')
  const [listSize, getListSizeLayout] = useOnLayout('')

  // epiList
  const [curEpiList, setCurEpiList] = useState(0)

  // enum

  const buttonList = [
    {
      index: 0,
      value: 'booklist',
      title: '목록',
      icon: <BookList width={24} height={24} />,
    },
    {
      index: 1,
      value: 'comment',
      title: '댓글',
      icon: <Comment width={24} height={24} />,
    },
    {
      index: 2,
      value: 'textSetting',
      title: '설정',
      icon: <TextSetting width={24} height={24} />,
    },
    {
      index: 3,
      value: 'back',
      title: '이전화',
      icon: <Back width={24} height={24} />,
    },
    {
      index: 4,
      value: 'front',
      title: '다음화',
      icon: <Front width={24} height={24} />,
    },
  ]

  const buttonHandler = (type: string) => {
    if (type === 'comment') {
      navigation.navigate('UploadFiction', { screen: 'Comment' })
    } else if (type === 'booklist') {
      if (currentType === uploadType?.SHORT) return
      modalHandler('list')
    } else if (type === 'textSetting') {
      setTextOpt(true)
    } else if (['back', 'front'].includes(type)) {
      if (currentType === uploadType?.SHORT) return

      if (curEpiList === 0 && type === 'front') return
      if (curEpisodeCount.length === curEpiList + 1 && type === 'back') return
      setEpisodePostId(
        curEpisodeCount[curEpiList - (type === 'back' ? -1 : +1)]
      )
      // setCurrentView(() => currentView - (type === 'back' ? -1 : +1));
      setCurrentView(0)
      scrollHandler()
    }
  }

  useEffect(() => {
    const selectedArr = curEpisodeCount?.findIndex(
      element => element === episodePostId
    )
    setCurEpiList(selectedArr)

    if (selectedArr === 0) {
      if (viewFictionData?.length <= 1) {
        setpreventButton('none')
      } else {
        setpreventButton('front')
      }
      return
    } else if (curEpisodeCount.length === selectedArr + 1) {
      setpreventButton('back')
      return
    } else {
      setpreventButton('ok')
    }
  }, [episodePostId])

  const modalHandler = (type: 'scene' | 'list') => {
    setIsModal(true)
    let divideData = {
      data: sceneList,
      position: Math.floor(layoutSize?.list),
      type: 'bigDropdown',
      dropdownType: 'view',
    }

    if (type === 'scene') {
      divideData = {
        ...divideData,
        position: Math.floor(sceneSize?.height),
      }
    } else {
      divideData = {
        ...divideData,
        data: dropDownList,
        dropdownType: 'view',
        position: Math.floor(listSize?.height),
      }
      setCurrentView(0)
    }

    setDropdownType(divideData)
  }

  useEffect(() => {
    // scene dropdown
    const dropDownListData = finalData?.map(
      (items: sceneArrType, index: number) => {
        return {
          index: index + 1,
          desc: items?.title,
        }
      }
    )
    setSceneList([...dropDownListData])
  }, [finalData])

  useEffect(() => {
    // list dropdown
    if (!viewFictionData) return
    if (currentType === uploadType?.SHORT) return
    const dropDownListData = viewFictionData?.map(
      (items: { episode_title: string; episode_id: number }, index: number) => {
        return {
          index: index + 1,
          desc: items?.episode_title,
          value: items?.episode_id,
        }
      }
    )
    setDropDownList([...dropDownListData])
  }, [])

  return (
    <Layout onLayout={getSceneSizeLayout}>
      <SceneTab onPress={() => modalHandler('scene')}>
        <SceneTitle>{'SCENE'}</SceneTitle>
        <Down
          width={24}
          height={24}
          style={{ transform: [{ rotate: '180deg' }] }}
        />
      </SceneTab>
      <LayoutInner onLayout={getListSizeLayout}>
        {buttonList?.map(({ index, value, title, icon }) => (
          <Button key={index} onPress={() => buttonHandler(value)}>
            <IconAdjust
              prevent={preventButton}
              type={currentType}
              value={value}>
              {icon}
              {value === 'comment' ? (
                <CommentReply>
                  <MiniText>{viewData?.comment?.length || 0}</MiniText>
                </CommentReply>
              ) : null}
            </IconAdjust>
            <TextAdjust>{title}</TextAdjust>
          </Button>
        ))}
      </LayoutInner>
    </Layout>
  )
}

const Layout = styled.View`
  width: 100%;
  background: ${({ theme }) => theme.color.gray12};
`

const SceneTab = styled.TouchableOpacity`
  width: 100%;
  height: 48px;
  padding: 0 16px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background: ${({ theme }) => theme.color.gray10};
`

const LayoutInner = styled.View`
  width: 100%;
  height: 48px;
  flex-direction: row;
  background: ${({ theme }) => theme.color.gray10};
  margin-top: 1px;
`

const Button = styled.TouchableOpacity`
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const IconAdjust = styled.View<{
  prevent?: string
  type: string
  value: string
}>`
  position: relative;
  opacity: ${({ prevent, type, value }) => {
    if (type === 'Short' && ['booklist', 'back', 'front'].includes(value)) {
      return `0.3`
    } else if (
      type === 'Fiction' &&
      ['back', 'front'].includes(value) &&
      prevent === 'none'
    ) {
      return `0.3`
    } else if (prevent === value) {
      return prevent ? `0.4` : `1`
    } else {
      return 1
    }
  }};
`

const CommentReply = styled.View`
  position: absolute;
  bottom: 11px;
  left: 9px;
  width: 20px;
  height: 14px;
  border-radius: 25px;
  justify-content: center;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.color.gray10};
  background: ${({ theme }) => theme.color.gray1};
`

const TextAdjust = styled.Text`
  color: ${({ theme }) => theme.color.gray3};
  font-family: ${({ theme }) => theme.font.notoMedium};
  font-size: ${({ theme }) => theme.fontSize.font10};
  line-height: 14px;
  margin-top: 4px;
`

const MiniText = styled(TextAdjust)`
  color: ${({ theme }) => theme.color.gray6};
  margin-top: -1px;
`

const SceneTitle = styled.Text`
  color: ${({ theme }) => theme.color.gray3};
  font-size: ${({ theme }) => theme.fontSize.font14};
`
