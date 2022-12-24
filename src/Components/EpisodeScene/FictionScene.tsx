import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components/native'

// components
import { Header } from '../Header/Header'
import InputBundle from '../Common/InputBundle'
import ModalPopup from '../Popup/Modal'

// hooks
import useCropImagePicker from '~/Hooks/useCropImagePicker'

// data
import { sceneList } from '~/Data/sceneUploadData'

// hooks
import { useUploadContext } from '~/Hooks/useContextHook'

export default function FictionScene({ navigation, route }: any) {
  // store
  const {
    fictionData,
    setFictionData,
    currentScene,
    setCurrentScene,
    setBodyInputDetect,
  } = useUploadContext()

  // hook
  const [imageUri, cameraImagePickHandler, imageSize] = useCropImagePicker()

  const [sceneValue, setSceneValue] = useState('')
  const [buttonActive, setButtonActive] = useState(false)
  const [isImage, setIsImage] = useState<{
    uri: string | undefined
    base64: string | undefined
    type: string
  }>({})
  const [currentData, setCurrentData] = useState<any>()
  const [fictionType] = useState(route?.params)

  // popup
  const [isModal, setIsModal] = useState(false)
  const [modalType, setModalType] = useState({ type: '', modalType: '' })
  // alert
  const [alertText, setAlertText] = useState({ type: '', text: '' })

  const onChangeText = (type: string, text: string): void => {
    setSceneValue(text)
  }

  useEffect(() => {
    // 초기 input value 삽입
    setSceneValue(currentData?.title || '')
  }, [currentData])

  const currentDataHandler = () => {
    const dataNum = fictionData?.scene?.length
    if (fictionType.type === 'new' && fictionData?.scene[0]?.index === 0) {
      // 첫 SCENE
      setFictionData({
        ...fictionData,
        scene: [
          {
            ...fictionData.scene[0],
            index: 1,
            title: sceneValue,
            background: isImage,
            size: imageSize || 0,
            desc: '',
          },
        ],
      })
      setCurrentScene(1)
    } else if (fictionType.type === 'new' && dataNum >= 1) {
      // SCENE 추가
      setFictionData({
        ...fictionData,
        scene: [
          ...fictionData.scene,
          {
            ...fictionData.scene[dataNum + 1],
            index: dataNum + 1,
            title: sceneValue,
            background: isImage,
            size: imageSize || 0,
            desc: '',
          },
        ],
      })
      setCurrentScene(dataNum + 1)
    } else if (fictionType.type === 'already') {
      // 수정하기
      const sceneNum = fictionType.scene
      const selectedData = fictionData?.scene[sceneNum - 1]
      const updateData = fictionData?.scene
        ?.filter(({ index }: { index: number }) => index !== sceneNum)
        .concat({
          ...fictionData.scene[sceneNum - 1],
          index: sceneNum,
          title: sceneValue,
          background: isImage,
          size: imageSize || selectedData?.size,
        })
        .sort((a, b) => a.index - b.index)
      setFictionData({ ...fictionData, scene: [...updateData] })
      setCurrentScene(sceneNum)
    }
    navigation.goBack()
  }

  const nextStageHandler = (type: string, value: string) => {
    // first 삭제 second 완료

    if (type === 'goback') {
      navigation.goBack()
      return
    }
    if (type === 'second') {
      setBodyInputDetect(false)

      if (value === 'FictionSceneModify') {
        currentDataHandler()
      } else {
        // if(fictionData?.scene?.length <= 1){
        //   setFictionData({...fictionData, scene:[{index:0, title:'', desc:'', background:'', size:0}]});
        //   setCurrentScene(1);
        // }
      }
    } else {
      setBodyInputDetect(false)

      if (value === 'FictionSceneModify') {
        setModalType({ type: 'SceneRemove', modalType: 'Popup' })
        setIsModal(true)
      } else {
        // Scene 추가
        currentDataHandler()
      }
      // navigation.navigate('UploadFiction', {screen:'FictionEditor', params:{currentNum:fictionData.scene.length}});
    }
  }

  const buttonData = [
    {
      _type: '',
      type: 'title',
      secure: false,
      placeholder: 'SCENE 제목',
      removeBtn: true,
      maxLength: 60,
      value: sceneValue,
      alert: { type: alertText.type, text: '' },
    },
  ]

  const modalHandler = (type: string, value?: string): void => {
    // modal을 통한 data handle

    if (type === 'SceneRemove') {
      if (value === 'confirm') {
        if (fictionData?.scene?.length >= 2) {
          // scene이 2개 이상 일 경우
          const sceneNum = fictionType.scene
          const removeData = fictionData?.scene
            ?.filter(({ index }) => index !== sceneNum)
            ?.map((items, keyNum) => ({ ...items, index: keyNum + 1 }))

          setFictionData({ ...fictionData, scene: [...removeData] })
          setCurrentScene(sceneNum === 1 ? 1 : sceneNum - 1)
          navigation.goBack()
        } else {
          if (currentData?.background?.uri) {
            navigation.goBack()
            return
          } else {
            setFictionData({
              ...fictionData,
              scene: [
                {
                  index: 0,
                  title: '',
                  background: { uri: undefined, base64: undefined, type: '' },
                  size: 0,
                  desc: '',
                },
              ],
            })
            setCurrentScene(0)
            navigation.goBack()
          }
        }
      }
    } else if (type === 'ToastPopup') {
      if (value === 'removeImage') {
        setIsImage({ uri: undefined, base64: undefined, type: '' })
      } else if (value === 'ImageUpload') {
        cameraImagePickHandler()
      }
    } else if (type === 'Layout') {
      setModalType({ type: 'Scene', modalType: 'ToastPopup' })
    }
    setIsModal(false)
  }

  const imageModalHandler = () => {
    if (isImage) {
      setIsModal(true)
      setModalType({ type: 'Scene', modalType: 'ToastPopup' })
    } else {
      cameraImagePickHandler()
    }
  }

  useEffect(() => {
    // 이미지 수정하기 default
    const sceneNum = fictionType.scene
    const selectedData = fictionData?.scene[sceneNum - 1]
    setIsImage(selectedData?.background || undefined)
  }, [fictionData])

  useEffect(() => {
    if (fictionType?.type === 'new') {
      setCurrentData(null)
    } else if (fictionType?.type === 'already') {
      setCurrentData(fictionData?.scene[currentScene - 1])
    }
  }, [fictionData, fictionType])

  useEffect(() => {
    if (!imageUri?.uri) return
    setIsImage(imageUri || currentData?.background || undefined)
    setButtonActive(currentData?.background || imageUri ? true : false)
  }, [currentData, imageUri])

  useEffect(() => {
    setIsModal(false)
  }, [imageUri])

  return (
    <>
      <Layout>
        <BackgroundImageWrap>
          {isImage?.uri ? (
            <BackgroundImage source={{ uri: isImage?.uri, cache: 'reload' }} />
          ) : null}
          {isImage?.uri || currentData?.background ? <ImageGradient /> : null}
        </BackgroundImageWrap>
        <HeaderWrap>
          <Header
            navigation={navigation}
            route={{
              name:
                fictionType.type === 'new'
                  ? 'FictionScene'
                  : 'FictionSceneModify',
              params: { title: 'SCENE 편집' },
            }}
            onPress={nextStageHandler}
          />
          <InputWrap>
            <InputBundle
              data={buttonData}
              onChangeText={onChangeText}
              buttonActive={buttonActive}
              buttonText={isImage?.uri ? `이미지 수정하기` : `이미지 불러오기`}
              buttonOnPress={imageModalHandler}
              interval={22}
            />
          </InputWrap>
        </HeaderWrap>
      </Layout>
      <ModalPopup
        data={modalType?.type === 'Scene' ? sceneList : null}
        visible={isModal}
        onClose={() => setIsModal(false)}
        onPress={modalHandler}
        type={modalType?.type}
        modalType={modalType?.modalType}
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

// header
// header - tab
const HeaderWrap = styled.View`
  display: flex;
  width: 100%;
  height: 48px;
`

const InputWrap = styled.View`
  padding: 56px 16px;
`
const BackgroundImageWrap = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`

const BackgroundImage = styled.Image`
  position: absolute;
  width: 100%;
  height: 100%;
`

const ImageGradient = styled.View`
  flex: 1;
  background: rgba(0, 0, 0, 0.7);
`
