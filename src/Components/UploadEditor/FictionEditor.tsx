import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import {
  Keyboard,
  LayoutChangeEvent,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native'

// components
import EditorHeader from './EditorHeader'
import MicEditor from './MicEditor'
import Dropdown from '../Popup/Dropdown'
import TextBoard from './TextBoard'

// hooks
import KeyInduct from './KeyInduct'

// type
import { useAppContext, useUploadContext } from '~/Hooks/useContextHook'
import ModalPopup from '../Popup/Modal'

export default function FictionEditor({ navigation, route }: any) {
  const [selection, setSelection] = useState<
    { start: number; end: number } | undefined
  >(undefined)

  // store
  const {
    fictionData,
    currentScene,
    setCurrentScene,
    setFictionData,
    setNewFictionCover,
    initFictionData,
  } = useUploadContext()
  const { getImageUrl } = useAppContext()

  const [currentEpisodeData, setCurrentEpisodeData] = useState<any>()
  const [dementionHeight, setDementionHeight] = useState(0)

  const [headerHide, setHeaderHide] = useState<boolean>(true)
  const [dropDownList, setDropDownList] =
    useState<{ index: number; desc: string; value: string }[]>()

  // hooks
  // const [selection, onSelectionChange] = useSelectedText();

  // popup
  const [isModal, setIsModal] = useState(false)
  const [layoutXY, setLayoutXY] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const [isPopup, setIsPopup] = useState(false)
  const [isPopupType, setIsPopupType] = useState('')

  // voice
  const [micVoice, setMicVoice] = useState('')
  const [previewMicVoice, setPreviewMicVoice] = useState('')
  const [mergeText, setMergeText] = useState<string>('')

  //route
  const [currentRoute] = useState(route?.params?.postData || '')
  const [currentType] = useState(route?.params?.type || '')

  // fetch
  // const deleteMutate = useMutationHook('delete');

  // const [lastSelection, setLastSelection] = useState<{}>({});

  const onLayout = (e: LayoutChangeEvent): void => {
    if (dementionHeight > 0) return
    const { height } = e.nativeEvent.layout
    setDementionHeight(height)
  }

  const voiceHandler = () => {
    // if(mergeText.length === 0) return;
    if (currentScene - 1 === -1) return
    const completeArr = previewAndvoiceHandle('voice')

    setMergeText(completeArr)
  }

  const keyinductHandler = (value: string | Element, keyType: string) => {
    // if(mergeText.length === 0) return;
    if (currentScene - 1 === -1) return
    const completeArr = previewAndvoiceHandle('keyInduct', value, keyType)

    setMergeText(completeArr)
    if (currentScene === 0) return
    // fictionData.scene[currentScene - 1].desc = completeArr

    // setMergeText([mergeText?.slice(0, selection[0]), `${micVoice} `, mergeText?.slice(selection.end)].join(''))
  }

  const previewAndvoiceHandle = (
    type: string,
    _value?: string | Element,
    keyType?: string
  ) => {
    // voiceHandler 함수 반복
    let value: string | undefined

    if (type === 'keyInduct') {
      if (keyType === 'ChangeLine') {
        value = '\n'
      } else {
        value = `${_value}`
      }
    } else {
      value = `${micVoice} `
    }
    let text

    if (selection?.start === selection?.end) {
      text =
        mergeText.slice(0, selection?.start) +
        value +
        mergeText.slice(selection?.end)
    } else {
      // setLastSelection({start:selection[0], end:selection[0]});
      text =
        mergeText.slice(0, selection?.start) +
        `` +
        mergeText.slice(selection?.end) +
        value
    }

    return text
  }

  const removeRangeSelect = () => {
    // 음성 인식 때 범위 제거
    if (selection?.start !== selection?.end) {
      const removeText =
        mergeText.slice(0, selection?.start) +
        '' +
        mergeText.slice(selection?.end)
      setMergeText(removeText)
    }
  }

  const lastTextInputHandler = (type: string, text: string) => {
    if (type === 'board') setMergeText(text)
    if (type === 'title') setFictionData({ ...fictionData, episodeTitle: text })
  }

  const sceneMoveCtrl = (type: string, value?: number | undefined): void => {
    // scene 선택시
    setIsModal(false)
    if (type === 'last') {
      navigation.navigate('FictionScene', { type: 'new' })
    } else {
      // navigation.navigate('FictionScene', { scene:currentScene, type });
      if (!value) throw Error('fiction editor scene number undefined')
      setCurrentScene(value)
      setIsModal(false)
      // setMergeText(fictionData?.scene[value - 1]?.desc || '');
    }
  }

  const modalHandler = (type: string, trigger: string) => {
    // 투고 실패 or 뒤로가기 버튼

    if (type === 'Goback') {
      if (trigger === 'confirm') {
        navigation.goBack()
        setNewFictionCover(initFictionData)
      }
    } else if (type === 'ShortGoback') {
      if (trigger === 'confirm') {
        navigation.navigate('Bottom', { screen: 'Main' })
        setNewFictionCover(initFictionData)
      }
    }

    if (['confirm', 'close', 'cancel'].includes(trigger)) {
      setIsPopup(false)
    }
    setIsPopup(false)
  }

  useEffect(() => {
    if (!fictionData) return
    setCurrentEpisodeData(fictionData?.scene[currentScene - 1])
    setMergeText(fictionData?.scene[currentScene - 1]?.desc || '')
  }, [fictionData, currentScene, route?.params])

  useEffect(() => {
    // 초기 editor clean or modify value injection
    if (['modify', 'Saved'].includes(currentType)) {
      const { fictionData } = route?.params
      setCurrentScene(1)
      setFictionData({
        type: '',
        index: 0,
        episodeTitle: fictionData[0]?.epititle,
        scene: fictionData?.map(
          ({
            index,
            scene,
            title,
            image,
          }: {
            index: number
            image: string
            scene: string
            title: string
          }) => ({
            index: index + 1,
            title,
            desc: scene,
            size: 0,
            background: {
              uri: image ? getImageUrl + image : '',
              ...fictionData?.background,
            },
          })
        ),
      })
    } else {
      setFictionData({
        type: '',
        index: 0,
        episodeTitle: '',
        scene: [
          {
            index: 0,
            title: '',
            desc: '',
            background: { uri: undefined, base64: undefined, type: '' },
            size: 0,
          },
        ],
      })
    }
  }, [])

  useEffect(() => {
    const dropDownListData = fictionData?.scene?.map((items, index: number) => {
      return {
        index: index + 1,
        desc: items?.title || `SCENE ${index + 1}`,
        value: '',
      }
    })
    setDropDownList([...dropDownListData])
  }, [fictionData])

  useEffect(() => {
    voiceHandler()
  }, [micVoice])

  useEffect(() => {
    if (!fictionData) return
    if (currentScene - 1 === -1) return
    fictionData.scene[currentScene - 1]['desc'] = mergeText
  }, [mergeText, currentScene])

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Layout>
          <HeaderLayout>
            <EditorHeader
              navigation={navigation}
              headerHide={headerHide}
              currentEpisodeData={currentEpisodeData}
              setLayoutXY={setLayoutXY}
              setIsModal={setIsModal}
              setIsPopup={setIsPopup}
              setIsPopupType={setIsPopupType}
              currentRoute={currentRoute}
              route={route}
            />
          </HeaderLayout>
          <ImageBody onLayout={onLayout}>
            <BackgroundImage
              source={{
                uri: currentEpisodeData?.background?.uri || '',
                cache: 'only-if-cached',
              }}
            />
            {currentEpisodeData?.background?.uri ? <ImageGradient /> : null}
            <TextBoard
              lastTextInputHandler={lastTextInputHandler}
              mergeText={mergeText}
              setSelection={setSelection}
              currentRoute={currentRoute}
            />
          </ImageBody>
          <KeyInduct
            keyinductHandler={keyinductHandler}
            previewMicVoice={previewMicVoice}
            setHeaderHide={setHeaderHide}
          />
          {Platform.OS === 'ios' ? null : (
            <MicWrap>
              <MicEditor
                setMicVoice={setMicVoice}
                setPreviewMicVoice={setPreviewMicVoice}
                removeRangeSelect={removeRangeSelect}
                // voiceHandler={voiceHandler}
              />
            </MicWrap>
          )}
        </Layout>
      </TouchableWithoutFeedback>
      <Dropdown
        data={dropDownList}
        visible={isModal}
        onClose={() => setIsModal(false)}
        onPress={sceneMoveCtrl}
        position={layoutXY?.y + layoutXY?.height + 4}
        type="bigDropdown"
        modalType="upload"
      />
      <ModalPopup
        data={null}
        visible={isPopup}
        onClose={() => setIsPopup(false)}
        onPress={modalHandler}
        type={isPopupType}
        modalType="Popup"
      />
    </>
  )
}

const Layout = styled.View`
  position: relative;
  flex: 1;
  flex-direction: column;
  background: ${({ theme }) => theme.color.gray12};
`

const HeaderLayout = styled.View`
  flex-direction: column;
`

const ImageBody = styled.View`
  /* position: relative; */
  flex: 1;
`

// image
const BackgroundImage = styled.Image`
  position: absolute;
  width: 100%;
  height: 100%;
`

const ImageGradient = styled.View`
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
`

const MicWrap = styled.View`
  position: absolute;
  right: 0;
  left: 0;
  bottom: 100px;
  height: 1px;
  flex: 1;
  align-items: center;
  justify-content: center;
`
