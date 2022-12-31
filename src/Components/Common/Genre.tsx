import React, { useState, useEffect } from 'react'
import styled from 'styled-components/native'
import { BackHandler, LayoutChangeEvent } from 'react-native'
import { useQueryClient } from 'react-query'
import { StackActions } from 'react-navigation'

// hooks
import { useAppContext, useUploadContext } from '~/Hooks/useContextHook'
import { MethodMytateEnum, useMutationHook } from '~/Hooks/useMutationHook'

// components
import { ExtraButton } from '../Button'
import { Header } from '../Header/Header'
import ModalPopup from '../Popup/Modal'
import genreFilterUtil from '~/Utils/genreFilterUtil'
import { patchhGenreAgent } from '~/Agent/FeaktionAgent'

type genreList = {
  index: number
  value: string
  title: string
}

export enum ComponentType {
  UPLOADCOVER = 'UploadCover',
  SETTING = 'Setting',
  AUTH = 'Auth',
}

export function Genre({ navigation, route }: any): JSX.Element {
  /**
   * 1. 가입할 때, -> Main
   * 2. 프로필에서 수정할 때, -> MainSetting
   * 3. 작품 업로드 할 때, -> UploadCover
   *  => CRUD 필요(context에서 핸들링)
   * */

  // store
  const {
    pickGender,
    genreMaleArr,
    genreFemaleArr,
    thirdPickGenre,
    setThirdPickGenre,
    oneMorePickGenre,
    setOneMorePickGenre,
  } = useAppContext()
  const queryClient = useQueryClient()
  const { selectGenre, setSelectGenre } = useUploadContext()

  // fetch
  const patchMutate = useMutationHook(MethodMytateEnum.PATCH)
  // const patchMutate = useMutationHook(MethodMytateEnum.POST)

  // popup
  const [isPopup, setIsPopup] = useState(false)

  // genre data
  const [userPickGenre, setUserPickGenre] = useState([])
  const [resistPrevend, setResistPrevend] = useState(false)
  const [getLayout, setGetLayout] = useState(0)
  const [genreMergeArr, setGenreMergeArr] = useState<genreList[] | undefined>()

  const { navi } = route?.params

  useEffect(() => {
    // 선택 장르 수 정의
    if (navi === ComponentType.UPLOADCOVER) {
      // 사용처가 작품 업로드일 경우 1개 이상 등록하지 않을시 막기
      setResistPrevend(userPickGenre.length >= 1)
      return
    }
    //그 외의 경우 3개 이상 등록하지 않을시 막기
    setResistPrevend(userPickGenre.length >= 3)
  }, [userPickGenre])

  const submitHandler = async () => {
    if (!resistPrevend) return
    const { UPLOADCOVER, AUTH, SETTING } = ComponentType

    // 작품 등록 할 때
    if (navi === UPLOADCOVER) {
      // 작품 표지 cover
      navigation.navigate('UploadFiction', {
        screen: 'UploadCover',
        params: {
          genreType: 'genreModify',
        },
      })

      setSelectGenre(userPickGenre)
      // setOneMorePickGenre(userPickGenre);
    }

    // 회원가입, 장르 재설정
    if ([AUTH, SETTING]?.includes(navi)) {
      // // 유저가 직접 선택한 장르의 value값만 배열로 생성
      // const userPickValueArr = userPickGenre.map(
      //   ({ value }: { value: string }) => value,
      // );
      // // 외부에서 fetching된 데이터 장르의 value값만 배열로 생성 (새로 선택했는지 비교)
      // const thirdPickValueArr = thirdPickGenre.map(
      //   ({ value }: { value: string }) => value,
      // );
      // const params = {
      //   // 신규 추가 되는 장르(중복해서 보내면 안됨)
      //   genres: userPickGenre
      //     ?.map(({ value }) => {
      //       if (!thirdPickValueArr.includes(value)) return value;
      //     })
      //     .filter(data => data),
      //   // 제거하고 싶은 장르(id만 추출해서 보내기)
      //   removed_genres: thirdPickGenre
      //     .map(({ id, value }) => {
      //       if (!userPickValueArr.includes(value)) return id;
      //     })
      //     .filter(data => data),
      // };
      // 수정 삭제 장르 유틸 함수
      const params = genreFilterUtil({
        userSelectData: userPickGenre,
        fetchedData: thirdPickGenre,
      })

      const result = await patchhGenreAgent({
        mutate: patchMutate,
        data: params,
      })
      if (result?.data) {
        queryClient.invalidateQueries(['myProfile'])
        navigation.navigate(navi === 'Setting' ? 'Setting' : 'Bottom', {
          screen: navi === 'Setting' ? 'MainSetting' : 'Main',
          params: { genre: userPickGenre },
        })
      }
      // setThirdPickGenre(userPickGenre)
    }
  }

  const genrePickHandler = (values: genreList): void => {
    const initArr: genreList[] = []
    initArr.push(values)

    if (
      userPickGenre
        .map(({ value }: { value: string }) => value)
        .includes(values?.value)
    ) {
      // 선택 된 장르 다시 해제
      const diviedPick = userPickGenre.filter(
        ({ value }: { value: string }) => {
          return value !== values?.value
        }
      )
      setUserPickGenre(diviedPick)
    } else {
      const merge = userPickGenre.concat(initArr)
      setUserPickGenre(merge)
    }
  }

  useEffect(() => {
    // 장르 리스트 섞어주기
    genreMaleArr.sort(() => Math.random() - Math.random())
    genreFemaleArr.sort(() => Math.random() - Math.random())

    if (pickGender === 'Male') {
      setGenreMergeArr([...genreMaleArr, ...genreFemaleArr])
      return
    }
    if (pickGender === 'Female') {
      setGenreMergeArr([...genreFemaleArr, ...genreMaleArr])
      return
    }
  }, [])

  useEffect(() => {
    const { UPLOADCOVER, AUTH, SETTING } = ComponentType
    let genreData: any
    if (navi === UPLOADCOVER) {
      genreData = selectGenre
    }
    if ([AUTH, SETTING].includes(navi)) {
      genreData = thirdPickGenre
    }

    setUserPickGenre(
      genreData?.map(({ title, value }: { title: string; value: string }) => ({
        title,
        value,
      }))
    )
  }, [selectGenre, thirdPickGenre])

  const currentLayoutSize = (e: LayoutChangeEvent) => {
    const { height } = e.nativeEvent.layout
    setGetLayout(height)
  }

  const naviHandler = (type: string, value: string) => {
    if (navi === 'Auth' && type === 'goback') {
      setIsPopup(true)
      return
    } else {
      navigation.goBack()
      return
    }
  }

  const popupHandler = (type: string, value: string): void => {
    if (value === 'confirm') {
      setIsPopup(false)
    }
  }

  const hookBackHandle = () => {
    if (navi === 'Auth') {
      setIsPopup(true)
      return true
    }
    return true
  }

  // back
  useEffect(() => {
    const back = BackHandler.addEventListener(
      'hardwareBackPress',
      hookBackHandle
    )
    return () => back.remove()
  }, [])

  return (
    <>
      <Layout>
        <HeaderWrap>
          <Header
            navigation={navigation}
            route={{
              name: 'Genre',
              params: { title: '선호 장르', type: 'Genre' },
            }}
            onPress={naviHandler}
          />
        </HeaderWrap>

        <GenreList>
          <GenreButtonWrap>
            <GenreTextWrap>
              {navi === 'UploadCover' ? (
                <GenreText>작품 태그를 선택해주세요</GenreText>
              ) : (
                <>
                  <GenreText>선호하는 장르를 선택해주세요.</GenreText>
                  <GenreText>(3개 이상)</GenreText>
                </>
              )}
            </GenreTextWrap>
            {genreMergeArr?.map(
              (value, i: number): JSX.Element => (
                <GenreButton
                  key={i}
                  toggle={userPickGenre
                    ?.map(({ value }: { value: {} }) => value)
                    .includes(value?.value)}
                  onPress={() => genrePickHandler(value)}
                  onLayout={currentLayoutSize}>
                  <GenreButtonView size={getLayout}>
                    <GenreButtonText>{value?.title}</GenreButtonText>
                  </GenreButtonView>
                </GenreButton>
              )
            )}
          </GenreButtonWrap>
        </GenreList>
        <ExtraButton
          active={resistPrevend}
          buttonText={navi === 'UploadCover' ? '장르선택' : '선택하기'}
          onPress={submitHandler}
        />
      </Layout>
      <ModalPopup
        data={null}
        visible={isPopup}
        onPress={popupHandler}
        onClose={() => setIsPopup(false)}
        type={'Genre'}
        modalType={'Popup'}
      />
    </>
  )
}

// header
const HeaderWrap = styled.View`
  display: flex;
  width: 100%;
  height: 48px;
`

const Layout = styled.View`
  flex: 1;
  background: ${({ theme }) => theme.color.gray12};
`

const GenreList = styled.ScrollView`
  display: flex;
  flex: 1;
  background: ${({ theme }) => theme.color.gray12};
  padding: 8px;
`

const GenreTextWrap = styled.View`
  display: flex;
  width: 100%;
  /* margin: 56px 0 24px 18px; */
`

const GenreText = styled.Text`
  color: ${({ theme }) => theme.color.gray2};
  padding: 16px 0 24px 18px;
`

const GenreButtonWrap = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
  margin-bottom: 80px;
`

const GenreButton = styled.TouchableOpacity<{ toggle: boolean }>`
  position: relative;
  width: 30%;
  margin: 8px 6px;
  padding-bottom: 28%;
  border-radius: 4px;
  background: ${({ toggle, theme }) => (toggle ? theme.color.purple4 : '#555')};
`

const GenreButtonView = styled.View<{ size: number }>`
  position: absolute;
  bottom: 0;
  top: 0;
  right: 0;
  left: 0;
  justify-content: center;
  align-items: center;
`

const GenreButtonText = styled.Text`
  color: ${({ theme }) => theme.color.gray1};
  font-size: ${({ theme }) => theme.fontSize.font14};
  font-family: ${({ theme }) => theme.font.notoMedium};
`
