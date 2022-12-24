import React, { useState, useEffect } from 'react'
import styled from 'styled-components/native'

// components
import { Header } from '../Header/Header'

// hooks
import TagInput from '../Common/TagInput'
import useFictionUploadHook from '~/Hooks/useFictionUploadHook'
import { useAppContext, useUploadContext } from '~/Hooks/useContextHook'

// icons
import Plus from '@Icons/uploadPlus.svg'
import CustomTabButton from '../CustomTabButton'
import { InputText } from '../Input'
import { ScrollView } from 'react-native'
import { useQuery } from 'react-query'
import useFetch from '~/Hooks/useAxiosFetch'

// types

type GenreArr = { index: number; title: string; value: string }[]

export default function UploadCover({ navigation, route }: any): JSX.Element {
  // stroe
  const {
    newFictionCover,
    setNewFictionCover,
    saveTags,
    setSaveTags,
    selectGenre,
    setSelectGenre,
    setRemoveTagsList,
    removeTagsList,
    currentType,
    modifyUploadData,
    setModifyUploadData,
    initFictionData,
    fictionData,
    setUploadFictionId,
  } = useUploadContext()

  // hooks
  const [uploadHandlerHook, fictionAlertText] = useFictionUploadHook()
  const {
    genreMaleArr,
    genreFemaleArr,
    getImageUrl,
    oneMorePickGenre,
    setOneMorePickGenre,
  } = useAppContext()
  const [alertText, setAlertText] = useState({ type: '', text: '' })

  // data
  const [currentRoute] = useState(route?.params)
  const [routeData] = useState(currentRoute?.fictionData)
  const [previewImage, setPreviewImage] = useState<string | undefined>('')

  const { data } = useQuery(
    ['favorite'],
    () =>
      useFetch({ url: `/feaktion/${currentRoute?.fictionId}`, method: 'get' }),
    { enabled: currentRoute?.fictionId ? true : false }
  )

  useEffect(() => {
    setOneMorePickGenre(routeData?.feaktion_genre || [])
  }, [])

  useEffect(() => {
    if (currentRoute?.genreType === 'genreModify') return // genre stack에서 넘어오면 type이 초기화 되기 때문
    setSaveTags(routeData?.feaktion_tag || [])
  }, [])

  // useEffect(() => {
  //   ['novel', 'short']?.includes(currentType);
  //   setModifyUploadData(currentRoute?.fictionData);
  // }, []);

  // tags
  const [tags, setTags] = useState('')

  const dataHandler = (type: string, text: string): void => {
    if (type === 'limitNumber') {
      setNewFictionCover({ ...newFictionCover, title: text })
    } else if (type === 'mutiline') {
      setNewFictionCover({ ...newFictionCover, desc: text })
    } else if (type === 'removeBtn') {
      return
      setNewFictionCover({ ...newFictionCover, tag: text })
    }
  }

  const inputArr = [
    {
      index: 0,
      placeholder: '작품제목',
      maxLength: 60,
      type: 'limitNumber',
      value: newFictionCover.title,
      multiline: false,
      alert: alertText,
      alertType: 'title',
    },
    {
      index: 1,
      placeholder: '작품설명',
      maxLength: 500,
      type: 'mutiline',
      value: newFictionCover.desc,
      multiline: true,
    },
  ]

  const completeCover = async (type: string) => {
    if (type === 'goback') {
      navigation.goBack()
      setNewFictionCover(initFictionData) // init cover
      return
    }

    const genlist = selectGenre?.map(({ value }: { value: string }) => value)

    if (['ShortModify', 'Short'].includes(currentType)) {
      if (!selectGenre || selectGenre?.length === 0) {
        setAlertText({ type: 'genre', text: '장르는 1개 이상 선택해주세요' })
        return
      }

      if (!newFictionCover?.title) {
        setAlertText({ type: 'title', text: '작품 제목을 입력해주세요' })
        return
      }

      // short navigation
      setNewFictionCover({
        ...newFictionCover,
        genre: genlist,
      })
      navigation.navigate('UploadFiction', {
        screen: 'FictionEditor',
        params: {
          // fictionId: JSON.stringify(0),
          postData: currentType === 'Short' ? 'SHORT' : 'SHORTMODIFY',
          fictionData: route?.params?.episodeData || '',
          type: ['ShortModify', 'FictionModify'].includes(currentType)
            ? 'modify'
            : '',
        },
      })
      return
    }
    // novel post loigic

    if (['Fiction', 'FictionModify'].includes(currentType)) {
      // novel = cover, short = cover + episode, episode = episode
      setAlertText(fictionAlertText)
      uploadHandlerHook({
        // post fiction data
        fictionId: currentRoute?.fictionId,
        navigation,
        divideType: 'cover',
      })
      return
    }

    // if (['short'].includes(type)) {
    //   setNewFictionCover({
    //     ...newFictionCover,
    //     genre: genlist,
    //   });

    //   navigation.navigate('UploadFiction', {
    //     screen: 'FictionEditor',
    //     params: {
    //       fictionId: JSON.stringify(0),
    //       postData: type === 'short' ? 'SHORT' : 'NOVEL',
    //     },
    //   });
    // }
  }

  useEffect(() => {
    // 장르 선택 후 화면에 렌더링
    setSelectGenre(selectGenre)
    setUploadFictionId(currentRoute?.fictionId)
  }, [route?.params])

  useEffect(() => {
    console.log('currentType', currentType)
    /** Modify 초기 화면 */
    if (['Fiction', 'Short', 'Episode'].includes(currentType)) return
    if (currentRoute?.genreType === 'genreModify') return
    // if (!currentRoute?.fictionData) return;

    const {
      feaktion_title = '',
      feaktion_description = '',
      feaktion_tag = [],
      feaktion_genre = [],
    } = data?.data?.data

    const genreArr: GenreArr = []
    feaktion_genre?.map(({ genre }: { genre: string }) => {
      const filtering = [...genreMaleArr, ...genreFemaleArr]?.filter(
        item => item.value === genre
      )
      genreArr.push(...filtering)
    })
    setSelectGenre(genreArr)
    setNewFictionCover({
      ...newFictionCover,
      title: feaktion_title,
      desc: feaktion_description,
      tag: feaktion_tag.map(({ tag }: { tag: string | number }) => tag),
    })
  }, [data, currentType])

  const genreMoveHandler = () => {
    navigation.navigate('UploadFiction', {
      screen: 'GenreSelect',
      params: {
        navi: 'UploadCover',
      },
    })
  }

  useEffect(() => {
    uploadImageHandler()
  }, [newFictionCover, modifyUploadData])

  const uploadImageHandler = (): void => {
    // preview handler
    if (['FictionModify', 'ShortModify'].includes(currentType)) {
      if (!modifyUploadData?.feaktion_thumb) return
      setPreviewImage(
        newFictionCover?.image[0]?.uri ||
          getImageUrl + modifyUploadData?.feaktion_thumb
      )
    } else {
      if (!newFictionCover?.image[0]?.uri) {
        setPreviewImage('')
      } else {
        setPreviewImage(newFictionCover?.image[0]?.uri)
      }
    }
  }

  const customArr = [
    // custom big button
    {
      _index: 0,
      alertType: 'genre',
      _title:
        selectGenre?.map(({ title }) => title)?.join(' ,  ') || '장르 선택',
      _type: 'Arrow',
      method: genreMoveHandler,
    },
    {
      _index: 1,
      alertType: '',
      _title: '비공개 여부',
      _type: 'Toggle',
      method: () =>
        setNewFictionCover({
          ...newFictionCover,
          isPrivate: !newFictionCover?.isPrivate,
        }),
      toggle: newFictionCover?.isPrivate,
    },
  ]

  const tagsHanler = (type?: number | null): void => {
    // if modified tags
    if (!type || !removeTagsList) return
    setRemoveTagsList([...removeTagsList, type])
  }

  const headerTitleHandler = () => {
    if (['FictionModify', 'ShortModify'].includes(currentType)) {
      return '작품 수정하기'
    } else if (currentType === 'ShortModify') {
      return '단편작품 수정하기'
    } else {
      return currentRoute?.title
    }
  }

  useEffect(() => {
    // alert text update when touch complete btn
    setAlertText(fictionAlertText)
  }, [fictionAlertText])

  return (
    <Layout>
      <HeaderWrap>
        <Header
          navigation={navigation}
          route={{
            name: 'UploadCover',
            params: {
              title: headerTitleHandler(),
            },
          }}
          onPress={completeCover}
        />
      </HeaderWrap>
      <ScrollView>
        <CoverWrap>
          <CoverButton
            onPress={() =>
              navigation.navigate('UploadCoverEdit', {
                changeImage: previewImage,
              })
            }>
            {previewImage ? (
              <CoverImage source={{ uri: previewImage || undefined }} />
            ) : (
              <Plus width={36} height={36} />
            )}
          </CoverButton>
        </CoverWrap>
        {customArr?.map(
          ({ _index, _title, _type, method, toggle, alertType }) => (
            <InputWrap key={`key__${_index}`}>
              <CustomTabButton
                type={_type}
                onPress={method}
                title={_title}
                toggle={toggle}
              />
              {alertText.type === alertType && alertText.text ? (
                <AlertText>{alertText.text}</AlertText>
              ) : null}
            </InputWrap>
          )
        )}
        <InputBigWrap>
          {inputArr.map(
            ({
              index,
              placeholder,
              maxLength,
              type,
              value,
              multiline,
              alertType,
            }) => (
              <InputWrap key={`key__${index}`}>
                <InputText
                  placeholder={placeholder}
                  maxLength={maxLength}
                  onChangeText={text => dataHandler(type, text)}
                  value={value}
                  type={type}
                  multiline={multiline}
                  onPress={() => console.log('')}
                />
                {alertText.type === alertType && alertText.text ? (
                  <AlertText>{alertText.text}</AlertText>
                ) : null}
              </InputWrap>
            )
          )}
          <InputWrap>
            <TagInput
              onChangeText={setTags}
              value={tags}
              data={saveTags}
              type={currentType}
              onPress={tagsHanler}
            />
          </InputWrap>
        </InputBigWrap>
      </ScrollView>
    </Layout>
  )
}

const Layout = styled.View`
  flex: 1;
  background: ${({ theme }) => theme.color.gray12};
`

const HeaderWrap = styled.View`
  display: flex;
  width: 100%;
  height: 48px;
`

const CoverWrap = styled.View`
  width: 100%;
  align-items: center;
  margin: 20px 0;
`

const CoverButton = styled.TouchableOpacity`
  width: 200px;
  height: 280px;
  border-radius: 2px;
  overflow: hidden;
  background: ${({ theme }) => theme.color.gray6};
  justify-content: center;
  align-items: center;
`

const InputWrap = styled.View`
  padding: 4px 16px;
`

const InputBigWrap = styled.View`
  margin-bottom: 120px;
`

const CoverImage = styled.Image`
  width: 100%;
  height: 100%;
`

// 경고 텍스트

const AlertText = styled.Text`
  color: ${({ theme }) => theme.color.red2};
  margin: 0 4px;
`

const TabWrap = styled.View`
  padding: 0 16px;
`
