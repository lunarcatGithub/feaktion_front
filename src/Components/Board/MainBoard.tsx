import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'

//hooks
import { useDateTimeConvert } from '~/Hooks/useDateTimeConvert'

// components
import ListContent from '../Common/ListContent'
import TitleHeader from '../Common/TitleHeader'
import CustomTabButton from '../CustomTabButton'

// symbols
import { Line100 } from '~/Symbols/Line100'
import ShortContent from '../Common/ShortContent'
import Dropdown from '../Popup/Dropdown'

// data
import { isMedropdownList, isNotMedropdownList } from '@Data/dropdownData'
import { Header } from '../Header/Header'
import { useAppContext, useUploadContext } from '~/Hooks/useContextHook'
import ModalPopup from '../Popup/Modal'
import { reportFictionList } from '~/Data/reportData'
import Skeleton from '../Common/Skeleton'
import HideLayout from '../Common/HideLayout'
import { uploadType } from '~/Store/UploadStore'

// type
type props = {
  navigation: any
  items: {}[]
  type: string
  isMe: boolean
}

export default function MainBoard({
  navigation,
  items,
  type,
  isMe,
}: props): JSX.Element {
  // modal
  const [isModal, setIsModal] = useState(false)
  const [isPopup, setIsPopup] = useState(false)
  const [layoutXY, setLayoutXY] = useState(0)

  // store
  const { userProfile, getImageUrl } = useAppContext()
  const { setFictionData, setModifyUploadData, setCurrentType } =
    useUploadContext()

  // hooks
  const tabButtonArr = [
    {
      index: 0,
      title: '계정설정',
      _type: 'Arrow',
      method: () => navigation.navigate('Setting', { screen: 'MainSetting' }),
    },
    { index: 1, title: '고객센터', _type: '', method: () => {} },
  ]

  const [currentTime] = useDateTimeConvert(userProfile?.regdate, 'JustDate')
  const [profileImage, setProfileImage] = useState<string | undefined>(
    undefined
  )

  // state
  const [propsFictionData, setPropsFictionData] = useState<{
    feaktion_id: number
    feaktion_title: string
    feaktion_type: 'novel'
  } | null>(null)

  const moreViewHandler = (type: string) => {
    navigation.navigate('SideBottomStack', {
      screen: 'OtherFictionList',
      params: { type: `UserBoard${type}`, id: userProfile?.user_id },
    })
  }

  const modalMoveCtrl = (type: string) => {
    if (type === 'report') {
      setIsPopup(true)
      setIsModal(false)
    }

    // 수정 버튼 눌렀을 때 index cover 수정 화면으로 넘어감(장르, 태그 값 확인 필요)
    if (type === 'modify') {
      const isNovel =
        propsFictionData?.feaktion_type === 'novel'
          ? uploadType.FICTIONMODIFY
          : uploadType.SHORTMODIFY

      setCurrentType(isNovel)
      navigation.navigate('UploadFiction', {
        screen: 'UploadCover',
        params: {
          fictionId: propsFictionData?.feaktion_id,
          postData: isNovel,
        },
      })
    }
  }

  const modalHandler = ({
    position,
    userId,
    data,
    type,
  }: {
    position: number
    userId: number
    type: string
    data: {
      feaktion_id: number
      feaktion_title: string
      feaktion_type: 'novel'
    }
  }): void => {
    setPropsFictionData(data)
    setLayoutXY(position)
    setIsModal(true)
  }

  const contentsNavigationHandler = ({
    id,
    contentType,
    navi,
  }: {
    id: number
    contentType: string
    navi: string
  }) => {
    if (contentType === 'user') {
      navigation.navigate('SideStack', {
        screen: 'UserBoard',
        params: { userId: id, type: 'otherUser' },
      })
    } else if (contentType === 'novel') {
      navigation.navigate('SideStack', {
        screen: 'FictionIndex',
        params: { currentType: 'Story', fictionId: id },
      })
    }
  }

  const shortHandler = ({ fictionId }: { fictionId: number }): void => {
    navigation.navigate('SideStack', {
      screen: 'Viewer',
      params: { currentType: 'Short', fictionId },
    })
  }

  type TypeEnums = 'first' | 'second' | 'goback'

  const naviHandler = (type: TypeEnums, value: string) => {
    if (type === 'goback') navigation.goBack()
    if (value === 'UserBoard') {
      if (type === 'first') {
        navigation.navigate('Search')
      } else if (type === 'second') {
        navigation.navigate('Notification')
      }
    } else {
      if (type === 'first') {
        navigation.navigate('Setting', { screen: 'ModifyProfileSetting' })
      }
    }
  }

  const toastPopupHandler = (type: string, value: string): void => {
    console.log(type, value)
  }

  const dataList = [
    { index: 0, data: items[0], title: '연재 작품', value: 'Episode' },
    { index: 1, data: items[1], title: '단편 작품', value: 'Shorts' },
  ]

  useEffect(() => {
    // user profile image
    setProfileImage(getImageUrl + userProfile?.profile || undefined)
  }, [getImageUrl])

  useEffect(() => {
    setIsPopup(false)
    setIsModal(false)
  }, [])

  return (
    <>
      <Layout>
        {/* <----------- 더보기 버튼 컨트롤 ------------> */}
        <HideLayout isHide={isModal} onPress={setIsModal} />
        <HeaderWrap>
          <Header
            navigation={navigation}
            route={{
              name: isMe ? 'MyBoard' : 'UserBoard',
              params: { title: userProfile?.id },
            }}
            onPress={naviHandler}
          />
        </HeaderWrap>
        <LayoutInner>
          <UserInfoWrap>
            <UserProfileWrap>
              <UserProfile
                source={{
                  uri: profileImage,
                }}
              />
            </UserProfileWrap>
            <NickTitle>{userProfile?.nickname}</NickTitle>
            {userProfile?.intro === undefined ? (
              <Skeleton width={150} height={20} margin={3} />
            ) : (
              <IntroText>
                {userProfile?.intro ||
                  `${userProfile?.nickname}님의 보드입니다`}
              </IntroText>
            )}
            {userProfile?.regdate ? (
              <DateText>{currentTime} 가입함</DateText>
            ) : (
              <Skeleton width={110} height={20} margin={3} />
            )}
          </UserInfoWrap>
          <Line100 top={0} bottom={24} />
          {dataList?.map(
            ({
              title,
              value,
              index,
              data,
            }: {
              title: string
              value: string
              index: number
              data: any
            }) => (
              <DummyView key={index}>
                <ListTitleWrap>
                  <TitleHeader
                    title={title}
                    onPress={() => moreViewHandler(value)}
                  />
                </ListTitleWrap>
                <FictionListWrap>
                  {data?.length > 0 ? (
                    data?.map((items: [], i: number) => {
                      if (value === 'Episode') {
                        return (
                          <ListContent
                            key={i}
                            items={items}
                            navi={isMe ? 'MyBoard' : 'UserBoard'}
                            naviPress={contentsNavigationHandler}
                            buttonPress={modalHandler}
                          />
                        )
                      } else {
                        return (
                          <ShortContent
                            key={i}
                            items={items}
                            onPress={shortHandler}
                          />
                        )
                      }
                    })
                  ) : (
                    <NoContents>
                      <TextTitle>등록된 작품이 없습니다</TextTitle>
                    </NoContents>
                  )}
                </FictionListWrap>
              </DummyView>
            )
          )}
          <TabButtonWrap>
            {type === 'UserBoard' && isMe
              ? tabButtonArr.map(({ index, title, method, _type }) => (
                  <TabIntervalWrap key={index}>
                    <CustomTabButton
                      type={_type}
                      onPress={method}
                      title={title}
                    />
                  </TabIntervalWrap>
                ))
              : null}
          </TabButtonWrap>
        </LayoutInner>
      </Layout>
      <Dropdown
        data={isMe ? isMedropdownList : isNotMedropdownList}
        visible={isModal}
        onClose={() => setIsModal(false)}
        onPress={modalMoveCtrl}
        position={layoutXY}
        type="smallDropdownPan"
        modalType="general"
      />
      <ModalPopup
        data={reportFictionList}
        visible={isPopup}
        onPress={toastPopupHandler}
        onClose={() => setIsPopup(false)}
        type="UserBoard"
        modalType="ToastPopup"
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

const DummyView = styled.View`
  margin-bottom: 18px;
  flex: 1;
`

const Layout = styled.View`
  flex: 1;
  background: ${({ theme }) => theme.color.gray12};
  flex-direction: column;
`

const LayoutInner = styled.ScrollView`
  flex: 1;
`

const UserInfoWrap = styled.View`
  display: flex;
  width: 100%;
  /* justify-content: center; */
  align-items: center;
  flex-direction: column;
  padding: 24px 40px;
`
const UserProfileWrap = styled.View`
  width: 56px;
  height: 56px;
  border-radius: 50px;
  margin-bottom: 12px;
  overflow: hidden;
  background: ${({ theme }) => theme.color.gray6};
`

const UserProfile = styled.Image`
  width: 100%;
  height: 100%;
`

const NickTitle = styled.Text`
  color: ${({ theme }) => theme.color.gray1};
  font-size: ${({ theme }) => theme.fontSize.font14};
  font-family: ${({ theme }) => theme.font.notoMedium};
  margin-bottom: 8px;
`

const IntroText = styled.Text`
  color: ${({ theme }) => theme.color.gray3};
  font-size: ${({ theme }) => theme.fontSize.font12};
  font-family: ${({ theme }) => theme.font.notoMedium};
  line-height: 16px;
  text-align: center;
  margin-bottom: 8px;
`

const DateText = styled(IntroText)`
  margin-bottom: 32px;
`

// 작품 목록 리스트

const FictionListWrap = styled.View`
  display: flex;
  flex: 1;
  width: 100%;
`

const ListTitleWrap = styled.View`
  margin-bottom: 14px;
`

// 작품이 없을 때

const NoContents = styled.View`
  width: 100%;
  height: 280px;
  align-items: center;
  justify-content: center;
`

const TextTitle = styled(NickTitle)`
  color: ${({ theme }) => theme.color.gray3};
  /* padding:80px 0 154px 0; */
`

// Tabbutton

const TabButtonWrap = styled.View`
  margin: 12px 0;
`

const TabIntervalWrap = styled.View`
  padding: 0 16px;
  margin: 8px 0;
`
