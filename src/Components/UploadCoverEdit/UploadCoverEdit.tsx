import React, { useState, useEffect } from 'react'
import styled from 'styled-components/native'
import { ImageSourcePropType } from 'react-native'

// components
import { Header } from '../Header/Header'
import ImageEditor from './ImageEditor'

// icons
import Disable from '@Icons/disable.svg'
import Left from '@Icons/alignLeft.svg'
import Center from '@Icons/alignCenter.svg'
import Right from '@Icons/alignRight.svg'
import LeftOn from '@Icons/alignLeftOn.svg'
import CenterOn from '@Icons/alignCenterOn.svg'
import RightOn from '@Icons/alignRightOn.svg'
import Plus from '@Icons/uploadPlus.svg'

// hooks
import useCropImagePicker from '~/Hooks/useCropImagePicker'
import { useUploadContext } from '~/Hooks/useContextHook'

export default function UploadCoverEdit({
  navigation,
  route,
}: any): JSX.Element {
  // store
  const { newFictionCover, setNewFictionCover } = useUploadContext()

  // hook
  const [imageUri, cameraImagePickHandler] = useCropImagePicker()

  // target icon
  const [targetIcon, setTargetIcon] = useState('serif')
  const [alignIcon, setAlignIcon] = useState('left')
  const [imageGenre, setImageGenre] = useState('Upload')
  const [pickerImage, setPickerImage] = useState(imageUri)

  // useState
  const [currentRoute, setCurrentRoute] = useState(route?.params)

  const fontList = [
    { index: 0, type: 'disable', visible: <Disable width={24} height={24} /> },
    { index: 1, type: 'serif', visible: '세리프' },
    { index: 2, type: 'sanSerif', visible: '산세리프' },
  ]

  const alignList = [
    {
      index: 0,
      type: 'left',
      visible:
        alignIcon === 'left' ? (
          <LeftOn width={24} height={24} />
        ) : (
          <Left width={24} height={24} />
        ),
    },
    {
      index: 1,
      type: 'center',
      visible:
        alignIcon === 'center' ? (
          <CenterOn width={24} height={24} />
        ) : (
          <Center width={24} height={24} />
        ),
    },
    {
      index: 2,
      type: 'right',
      visible:
        alignIcon === 'right' ? (
          <RightOn width={24} height={24} />
        ) : (
          <Right width={24} height={24} />
        ),
    },
  ]

  const imageGenreList = [
    { index: 0, type: 'Upload', visible: '업로드' },
    { index: 1, type: 'type1', visible: 'SF' },
    { index: 2, type: 'type2', visible: '판타지' },
    { index: 3, type: 'type3', visible: '로맨스' },
    { index: 4, type: 'type4', visible: '학원' },
    { index: 5, type: 'type5', visible: '일상' },
  ]

  const imageSelectList = [
    {
      index: 0,
      type: 'Upload',
      visible:
        pickerImage?.uri || currentRoute?.changeImage ? (
          <GenreImage
            source={{ uri: pickerImage?.uri || currentRoute?.changeImage }}
          />
        ) : (
          <Plus width={24} height={24} />
        ),
    },
    {
      index: 1,
      type: 'Fantasy',
      visible: <GenreImage source={{ uri: undefined }} />,
    },
    {
      index: 2,
      type: 'SF',
      visible: <GenreImage source={{ uri: undefined }} />,
    },
  ]

  const targetIconHandler = (
    _type: string,
    type: string
  ): React.Ref<Text> | undefined => {
    console.log('type', type)
    if (_type === 'opt') {
      if (type === 'disable') return
      setTargetIcon(type)
    } else if (_type === 'align') {
      setAlignIcon(type)
    } else if (_type === 'category') {
      setImageGenre(type)
      if (type === 'Upload') {
        cameraImagePickHandler()
        return
      }
    }
  }

  const optionIcon = (type: string, visible: any) => {
    if (type === 'disable') {
      return visible
    } else if (type === 'serif' || type === 'sanSerif') {
      return <TextButton focus={type === targetIcon}>{visible}</TextButton>
    }
  }

  const completeEdit = (type: string) => {
    if (type === 'first') {
      setNewFictionCover({
        ...newFictionCover,
        image: [
          {
            index: 0,
            uri: '',
            base64: '',
            type: '',
          },
        ],
      })
      setCurrentRoute({ changeImage: '' })
      setPickerImage('')
    } else if (type === 'second') {
      if (pickerImage?.uri) {
        setNewFictionCover({
          ...newFictionCover,
          image: [
            {
              index: 0,
              uri: pickerImage?.uri,
              base64: pickerImage?.base64,
              type: pickerImage?.type,
            },
          ],
        })
        navigation.goBack()
        return
      } else {
        // 변경 안했을 때는 그냥 return\
        navigation.goBack()
        return
      }
    } else {
      if (pickerImage?.uri) {
        setNewFictionCover({ ...newFictionCover })
      }
      navigation.goBack()
      return
    }
  }

  useEffect(() => {
    setPickerImage(imageUri)
  }, [imageUri?.uri])

  return (
    <Layout>
      <HeaderWrap>
        <Header
          navigation={navigation}
          route={{
            name: 'UploadCoverEdit',
            params: { title: '표지 썸네일 생성' },
          }}
          onPress={completeEdit}
        />
      </HeaderWrap>
      <ImageEditLayout>
        {/* <ImageEditor imageUri={pickerImage} /> */}
        {pickerImage?.uri || currentRoute?.changeImage ? (
          <GenreImage
            source={{
              uri: pickerImage?.uri || currentRoute?.changeImage,
            }}
          />
        ) : null}
      </ImageEditLayout>
      <OptionBoxLayout>
        {/* <OptionBar>
          <OptionBarInner divied={'first'}>
            { 
              fontList?.map(({ index, type, visible }) => (
                <OptionButton onPress={ () => targetIconHandler('opt', type)} key={`keys__${index}`}>
                  { optionIcon(type, visible) }
                </OptionButton>
              ) ) 
            }
          </OptionBarInner>
          <OptionBarInner divied={'last'}>
          { 
            alignList?.map(({ index, type, visible }) => (
                <OptionButton onPress={ () => targetIconHandler('align', type)} key={`keys__${index}`}>
                  { visible }
                </OptionButton>
              ) ) 
            }
          </OptionBarInner>
        </OptionBar> */}
        <OptionBar>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {imageGenreList?.map(({ index, type, visible }) => (
              <OptionButton
                onPress={() => targetIconHandler('category', type)}
                key={`keys__${index}`}>
                <CategoryText focus={type === imageGenre}>
                  {visible}
                </CategoryText>
              </OptionButton>
            ))}
            <DummyDiv />
          </ScrollView>
        </OptionBar>
        <OptionBar>
          <ScrollView horizontal={true}>
            {imageSelectList?.map(({ index, type, visible }) => (
              <ImageGenreButton
                onPress={() => targetIconHandler('category', type)}
                key={`keys__${index}`}>
                {visible}
              </ImageGenreButton>
            ))}
            <DummyDiv />
          </ScrollView>
        </OptionBar>
      </OptionBoxLayout>
    </Layout>
  )
}

const Layout = styled.View`
  flex: 1;
  flex-direction: column;
  background: ${({ theme }) => theme.color.gray12};
`

const HeaderWrap = styled.View`
  display: flex;
  width: 100%;
  height: 48px;
`

const ImageEditLayout = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`

const OptionBoxLayout = styled.View`
  flex-direction: column;
  width: 100%;
`

const OptionBar = styled.View`
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  width: 100%;
  /* height:48px; */
  padding: 12px 0;
  background: ${({ theme }) => theme.color.gray10};
  margin-bottom: 4px;
`

const OptionBarInner = styled.View<{ divied: string }>`
  flex-direction: row;
  align-items: center;
  margin-right: ${({ divied }) => (divied ? `16px` : `0px`)};
`

const GenreImage = styled.Image<ImageSourcePropType>`
  width: 100%;
  height: 100%;
`

// button
const OptionButton = styled.TouchableOpacity`
  margin-left: 16px;
`

const ImageGenreButton = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  border-radius: 4px;
  margin-left: 16px;
  background: rgba(255, 255, 255, 0.1);
`

// text

const TextButton = styled.Text<{ focus: boolean }>`
  color: ${({ theme, focus }) =>
    focus ? theme.color.gray1 : theme.color.gray4};
  font-size: ${({ theme }) => theme.fontSize.font16};
  /* font-family:${({ theme }) => theme.font.notoMedium}; */
`

const CategoryText = styled(TextButton)``

// ScrollView
const ScrollView = styled.ScrollView``

const DummyDiv = styled.View`
  width: 40px;
`
