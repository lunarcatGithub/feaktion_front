import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import { QueryKey, useQueryClient } from 'react-query'

// hooks
import { useUploadContext } from '~/Hooks/useContextHook'
import useMutationHook from '~/Hooks/useMutationHook'
import useFictionUploadHook from '~/Hooks/useFictionUploadHook'
import useAsyncStorage from '~/Hooks/useAsyncStorage'

// utils
import bufferHandler from '~/Utils/bufferConvert'
import SaveCheck from '~/Hooks/SaveCheck'

// components
import { Header } from '../Header/Header'
import { InputText } from '../Input'
import CustomTabButton from '../CustomTabButton'
import { LargeButton } from '../Button'
import StackLoading from '../Loading/StackLoading'

const FILESIZE_CONVERT = 2 ** 20 // 1MB

export default function EditorWorkCheck({
  navigation,
  route,
}: any): JSX.Element {
  // hooks
  const [uploadHandlerHook, alertText] = useFictionUploadHook()
  // store
  const {
    fictionData,
    uploadFictionId,
    currentType,
    initFictionData,
    setNewFictionCover,
    newFictionCover,
  } = useUploadContext()

  const [writerTalk, setWriterTalk] = useState('')
  const [workCompleted, setWorkCompleted] = useState(false)
  const [isWorkPublic, setIsWorkPublic] = useState(false)

  // check
  const [textCount, setTextCount] = useState(0)
  const [imageSize, setImageSize] = useState(0)

  // fetch
  const queryClient = useQueryClient()
  const episodeAsync = useMutationHook('post') // patch도 염두해두기

  // const episodeAsync = useMutation((episode:{}) => useFetch(`/feaktion/${uploadFictionId || shortFictionId}/episode`, 'post', episode));
  // const shortAsync = useMutationHook('post');
  const [saveFictionHandler] = SaveCheck()

  // data
  const [cacheData, setCacheData] = useState(0)

  const calcFictionDesc = () => {
    // text count
    const count = fictionData?.scene
      ?.map(({ desc }) => (!desc ? 0 : desc?.length))
      .reduce((acc, cur) => acc + cur, 0)
    const sizeResult = fictionData?.scene
      ?.map(({ size }) => (!size ? 0 : size))
      .reduce((acc, cur) => acc + cur, 0)

    setTextCount(count)
    const _size = byteCalculation(sizeResult)
    setImageSize(_size)
  }

  const byteCalculation = (byteSize: number) => {
    let resultSize
    if (byteSize >= FILESIZE_CONVERT) {
      resultSize = (byteSize / FILESIZE_CONVERT).toFixed(0)
    } else {
      resultSize = 0
    }
    return Number(resultSize)
  }

  const submitFictionHandler = async (
    position: string,
    type: string
  ): Promise<void> => {
    if (position === 'goback') {
      navigation.goBack()
      return
    }

    const image = fictionData?.scene?.map(({ background }, index: number) => ({
      index,
      ...background,
    }))
    const sceneBackground = await bufferHandler(image)
    const filterFictionData = fictionData?.scene?.map(
      ({ title, desc }, index) => {
        if (index === sceneBackground[index].index) {
          return { title, scene: desc, image: sceneBackground[index]?.name }
        } else {
          return { title, scene: desc, image: '' }
        }
      }
    )

    const params = {
      episode_title: fictionData.episodeTitle,
      writer_comment: writerTalk,
      scenes: filterFictionData,
    }

    if (
      ['Short', 'ShortModify', 'Episode', 'EpisodeModify'].includes(
        currentType
      ) &&
      position === 'second'
    ) {
      uploadHandlerHook({
        // post fiction data
        fictionId: uploadFictionId, // 단편 patch 할 때 fictionId 받아오기
        navigation,
        divideType: 'check',
        episodeParams: params,
        sceneBackground,
      })
      return
    } else {
      // localstorage set (임시 저장)
      saveFictionHandler({
        uploadFictionId,
        fictionData,
        currentType,
        newFictionCover,
      })
    }
    setNewFictionCover(initFictionData) // upload cover init 초기화
  }

  const userSetting = [
    {
      _index: 0,
      _title: '비공개 설정',
      _type: 'Toggle',
      method: () => setIsWorkPublic(!isWorkPublic),
      toggle: isWorkPublic,
    },
    {
      _index: 1,
      _title: '완결',
      _type: 'Toggle',
      method: () => setWorkCompleted(!workCompleted),
      toggle: workCompleted,
    },
  ]

  useEffect(() => {
    calcFictionDesc()
  }, [])

  const typeHandler = () => {
    if (currentType === 'Short') {
      return '단편'
    } else if (currentType === 'ShortModify') {
      return '단편 수정'
    } else if (['EpisodeModify', 'Episode'].includes(currentType)) {
      return cacheData + 1
    }
  }

  const checkTabs = [
    { index: 0, title: '글자수', value: textCount },
    { index: 1, title: '이미지용량', value: imageSize },
    { index: 2, title: 'SCENE', value: fictionData?.scene?.length },
    { index: 3, title: '에피소드', value: typeHandler() },
  ]

  useEffect(() => {
    // query cache get
    if (!queryClient) return
    const cache: [QueryKey, { data: any }][] = queryClient?.getQueriesData([
      'fiction',
      uploadFictionId,
    ])
    const isData = Object.keys(cache).length === 0
    setCacheData(isData ? 0 : cache[0][1]?.data?.data?.episode?.length)
  }, [])

  return (
    <>
      <Layout>
        <HeaderWrap>
          <Header
            navigation={navigation}
            route={{
              name: 'EditorWorkCheck',
              params: {
                title: ['Episode', 'Short'].includes(currentType)
                  ? '투고하기'
                  : '수정하기',
              },
            }}
            onPress={submitFictionHandler}
          />
        </HeaderWrap>
        <PreviewWrap>
          {checkTabs?.map(({ index, title, value }) => (
            <PreviewTabs key={`keys__${index}`}>
              <PreviewTabInner>
                <TitleText>
                  {value}
                  {index === 1 ? <MB>MB</MB> : null}
                </TitleText>
                <SoftText>{title}</SoftText>
              </PreviewTabInner>
            </PreviewTabs>
          ))}
        </PreviewWrap>
        <ContentsWrap>
          <InputWrap>
            <InputText
              secure={false}
              placeholder={'작가의 한마디'}
              removeBtn={false}
              onChangeText={setWriterTalk}
              value={writerTalk}
              type={'limitNumber'}
              maxLength={60}
              onPress={() => {
                console.log('EditorWorkCheck InputText OnPress')
              }}
            />
          </InputWrap>
          {userSetting?.map(({ _index, _title, _type, method, toggle }) => (
            <CustomTabButton
              key={_index}
              type={_type}
              onPress={method}
              title={_title}
              toggle={toggle}
            />
          ))}
          <ButtonWrap>
            <LargeButton
              active={true}
              buttonText={'미리보기'}
              onPress={() =>
                navigation.navigate('UploadFiction', {
                  screen: 'Preview',
                  params: {
                    currentType: 'Preview',
                    previewData: fictionData,
                    fictionId: uploadFictionId,
                  },
                })
              }
            />
          </ButtonWrap>
        </ContentsWrap>
      </Layout>
      {episodeAsync?.isLoading ? <StackLoading /> : null}
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

// preview

const PreviewWrap = styled.View`
  flex-direction: row;
  padding: 0 8px;
  margin: 24px 0;
`

const PreviewTabs = styled.View`
  position: relative;
  flex: 1;
  margin: 0 8px;
  padding-bottom: 22%;
  background: ${({ theme }) => theme.color.gray10};
  border-radius: 4px;
`

const PreviewTabInner = styled.View`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  flex: 1;
  justify-content: center;
  align-items: center;
  z-index: 999;
`

const TitleText = styled.Text`
  color: ${({ theme }) => theme.color.gray1};
  font-size: ${({ theme }) => theme.fontSize.font14};
  font-family: ${({ theme }) => theme.font.notoMedium};
  line-height: 20px;
  margin-bottom: 4px;
`

const SoftText = styled.Text`
  color: ${({ theme }) => theme.color.gray3};
  font-size: ${({ theme }) => theme.fontSize.font10};
  line-height: 14px;
`

const MB = styled(TitleText)`
  font-size: ${({ theme }) => theme.fontSize.font10};
`

// Body
const ContentsWrap = styled.View`
  padding: 0 16px;
`

// input

const InputWrap = styled.View`
  margin-bottom: 24px;
`
// button

const ButtonWrap = styled.View`
  margin-top: 24px;
`
