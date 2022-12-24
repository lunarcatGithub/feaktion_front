import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import styled from 'styled-components/native'
import { LayoutChangeEvent } from 'react-native'

// icon
import Down from '@Icons/down.svg'
import Plus from '@Icons/uploadPlus.svg'
import Setting from '@Icons/gearwheel.svg'

// components
import { Header } from '../Header/Header'

// store
import { useUploadContext } from '~/Hooks/useContextHook'

type props = {
  navigation: any
  headerHide: boolean
  setLayoutXY: Dispatch<
    SetStateAction<{ x: number; y: number; width: number; height: number }>
  >
  setIsModal: Dispatch<SetStateAction<boolean>>
  setIsPopup: Dispatch<SetStateAction<boolean>>
  setIsPopupType: Dispatch<SetStateAction<string>>
  currentRoute: string
  route: any
  currentEpisodeData: {
    index: number
    title: string
    desc: string
    background: string
  }
}

export default function EditorHeader({
  navigation,
  headerHide,
  currentEpisodeData,
  setLayoutXY,
  setIsModal,
  setIsPopup,
  setIsPopupType,
  currentRoute,
  route,
}: props): JSX.Element {
  // store
  const { currentScene, fictionData, newFictionCover } = useUploadContext()
  const [titleName, setTitleName] = useState({ name: '', title: '' })

  const undoRedo = [
    { index: 0, title: '실행취소', value: 'undo' },
    { index: 1, title: '실행복구', value: 'redo' },
  ]

  const dropTitle = () => {
    let titleText = ''

    if (currentEpisodeData?.index) {
      if (currentEpisodeData?.title) {
        titleText = currentEpisodeData?.title
      } else {
        titleText = `SCENE ${currentEpisodeData?.index}`
      }
    } else {
      titleText = `SCENE 추가`
    }

    return titleText
  }

  const sceneTabsHandler = (): JSX.Element => {
    const params = currentEpisodeData?.index ? 'dropdown' : 'add'
    const LayoutReturn = (
      <>
        <WrapButton onPress={() => addSceneHandler(params)}>
          <SceneText>{dropTitle()}</SceneText>
          {currentEpisodeData?.index ? (
            <Down width={24} height={24} />
          ) : (
            <Plus width={24} height={24} />
          )}
        </WrapButton>
        {currentEpisodeData?.index ? (
          <SettingButton onPress={() => addSceneHandler('already')}>
            <SettingButtonWrap>
              <Setting width={24} height={24} />
            </SettingButtonWrap>
          </SettingButton>
        ) : null}
      </>
    )

    return LayoutReturn
  }

  const addSceneHandler = (type: string): void => {
    if (type === 'add') {
      navigation.navigate('FictionScene', { type: 'new' })
      return
    } else if (type === 'already') {
      navigation.navigate('FictionScene', { scene: currentScene, type })
      return
    } else {
      setIsModal(true)
    }
  }

  const headerPosition = (e: LayoutChangeEvent): void => {
    const { x, y, width, height } = e.nativeEvent.layout
    setLayoutXY({ x, y, width, height })
  }

  const moveChckStackHandler = (type: string, name: string): void => {
    if (type === 'goback') {
      // 나가면 삭제된다는 경고 팝업
      // 기존 fiction 삭제하고 home으로 이동하기
      if (name === 'FictionEditor' && currentRoute === 'SHORT') {
        // 단편일 경우 goback 메인으로 나감
        setIsPopupType('ShortGoback')
        setIsPopup(true)
        return
      } else {
        // 일반 작품 뒤로가기
        setIsPopupType('Goback')
        setIsPopup(true)
        return
      }
    } else if (type === 'first') {
      if (fictionData?.episodeTitle?.length === 0 && currentRoute !== 'SHORT') {
        setIsPopupType('NoEpisode')
        setIsPopup(true)
        return
      } else if (
        fictionData?.scene?.length <= 0 ||
        (fictionData?.scene[0].desc === '' && fictionData?.scene[0].index === 0)
      ) {
        setIsPopupType('NoScene')
        setIsPopup(true)
        return
      } else {
        navigation.navigate('UploadFiction', {
          screen: 'EditorWorkCheck',
          currentRoute,
        })
      }
    }
  }

  const titleHandler = () => {
    if (currentRoute === 'SHORT') {
      // 단편인 경우 에디터 화면일 때 단편 or 단편 수정 제목
      setTitleName({
        name: 'FictionEditorShort',
        title: newFictionCover?.title || '단편쓰기',
      })
      return
    } else if (['NovelSaved', 'FictionEditorSerise'].includes(currentRoute)) {
      setTitleName({
        name: currentRoute,
        title: route?.params?.title || newFictionCover?.title,
      })
    } else if (currentRoute === 'SHORTMODIFY') {
      setTitleName({
        name: currentRoute,
        title: route?.params.fictionData[0]?.epititle,
      })
    }
  }

  useEffect(() => {
    titleHandler()
  }, [currentRoute])

  return (
    <>
      <HeaderWrap>
        <Header
          navigation={navigation}
          route={{
            name: titleName?.name,
            params: { title: titleName?.title },
          }}
          onPress={moveChckStackHandler}
        />
      </HeaderWrap>
      {/* <TabWrap>
        { 
          undoRedo?.map(({index, title}) => (
            <Button key={`key__${index}`}>
              <Text>{ title }</Text>
            </Button>
          ) )
        }
      </TabWrap> */}
      {headerHide ? (
        <SecondTabWrap onLayout={headerPosition}>
          {sceneTabsHandler()}
        </SecondTabWrap>
      ) : null}
    </>
  )
}

// header
// header - tab
const HeaderWrap = styled.View`
  display: flex;
  width: 100%;
  height: 48px;
`

const TabWrap = styled.View`
  flex-direction: row;
  padding: 14px 16px;
  background: ${({ theme }) => theme.color.gray10};
  margin-bottom: 4px;
`

const SecondTabWrap = styled(TabWrap)`
  position: relative;
  padding: 12px 16px;
  width: 100%;
`

const DownNSettingWrap = styled.View`
  flex-direction: row;
`

// button

const Button = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`

const WrapButton = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const SettingButton = styled.TouchableOpacity`
  margin-left: 8px;
`

const SettingButtonWrap = styled.View`
  opacity: 0.6;
`

// text

const SceneText = styled.Text`
  color: ${({ theme }) => theme.color.gray3};
  font-size: ${({ theme }) => theme.fontSize.font14};
`

const Text = styled(SceneText)`
  font-family: ${({ theme }) => theme.font.notoMedium};
  margin-right: 24px;
  line-height: 20px;
`
