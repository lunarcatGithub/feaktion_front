import React, { useRef, useState } from 'react'
import styled from 'styled-components/native'

// icons
import Heart from '@Icons/heart.svg'
import Star from '@Icons/star.svg'
import View from '@Icons/view.svg'
import MoreMenu from '@Icons/moreMenu.svg'

// hooks
import { useDateTimeConvert } from '@Hooks/useDateTimeConvert'
import useToggleFetchHook from '~/Hooks/useToggleFetchHook'

// components
import SpreadLayoutButton from '../SpreadLayoutButton'
import HideLayout from './HideLayout'

// icons
import NotificationOn from '@Icons/notificationOn.svg'
import Notification from '@Icons/notification.svg'
import { useAppContext } from '~/Hooks/useContextHook'
import { FictionGetDataType } from '../types/FictionType'

type Props = {
  items: any
  navi?: string
  buttonPress: (props: {
    data?: any
    userId: number
    position: number
    type: string
  }) => void
  naviPress: (props: { id: number; contentType: string; navi: string }) => void
  type: 'coverIndex' | 'Preferred' | 'Continue' | 'InheritFiction' | ''
}

type refType = {
  measure: (
    prams: (
      x: number,
      y: number,
      width: number,
      height: number,
      pageX: number,
      pageY: number
    ) => void
  ) => void
}

export default function ListContent({
  items,
  navi = '',
  type,
  buttonPress,
  naviPress,
}: Props): JSX.Element {
  console.log('items>>>', items)
  // store
  const { getImageUrl } = useAppContext()
  const [data] = useState(navi === 'ContentsArchive' ? items?.feaktion : items)

  // hooks
  const [currentTime] = useDateTimeConvert(
    data?.feaktion_uploaddate,
    'JustDate'
  )
  const buttonRef = useRef<refType>(null)

  const [pick, pickBtnHandler, loading] = useToggleFetchHook({
    type: 'pick',
    initid: items?.id,
  })

  // state
  const [moreButtonHandle, setMoreButtonHandle] = useState(false)

  const reactList = [
    {
      index: 0,
      icon: <Star width={14} height={14} />,
      score: data?._count?.favorite_feaktion,
    },
    {
      index: 1,
      icon: <Heart width={14} height={14} />,
      score: data?._count?.episode_like,
    },
    {
      index: 2,
      icon: <View width={14} height={14} />,
      score: data?._count?.reading_history,
    },
  ]

  const onPressWithMeasure = () => {
    if (!buttonRef.current) return
    if (type === 'Preferred') {
      pickBtnHandler(data.feaktion_id)
      return
    } else {
      buttonRef?.current?.measure((x, y, width, height, pageX, pageY) => {
        buttonPress({
          data: items,
          userId: data?.feaktion_user?.user_id,
          position: pageY + 16,
          type: '',
        })
      })
    }
  }

  const moreOrNotiButtonHandler = () => {
    if (['myfeaktions', 'inheritFiction'].includes(navi)) return
    if (type === 'Preferred') {
      return (
        <Button>
          {pick ? (
            <NotificationOn width={20} height={20} />
          ) : (
            <Notification width={20} height={20} />
          )}
        </Button>
      )
    } else {
      return (
        <Button>
          <MoreMenu width={20} height={20} />
        </Button>
      )
    }
  }

  const dummyLayout = [
    'TrendSearch',
    'LatestSearch',
    'RecentUploaded',
    'ContentsContinue',
    'UserBoard',
    'MyBoard',
  ]

  const spreadLayoutCtrl = () => {
    return dummyLayout.includes(navi) ? <LayoutDummy /> : <LineDummy />
  }

  return (
    <ImageWrapper>
      {/* <----------- 더보기 버튼 컨트롤 ------------> */}
      <HideLayout isHide={moreButtonHandle} onPress={setMoreButtonHandle} />
      <ImageWrapperInner>
        <ContentAndMoreMenuWrap>
          <ContentsAndDetailWrap>
            <ImageButton
              onPress={() =>
                naviPress({
                  id: data?.feaktion_id,
                  contentType: data?.feaktion_type,
                  navi,
                })
              }>
              <PageItem
                source={{
                  uri: [
                    'https://image.novelpia.com',
                    undefined,
                    null,
                  ]?.includes(data?.feaktion_thumb)
                    ? undefined
                    : getImageUrl + data?.feaktion_thumb,
                }}
              />
            </ImageButton>
            <ContentsInner>
              <TextButton
                onPress={() =>
                  naviPress({
                    id: data?.feaktion_id,
                    contentType: data?.feaktion_type,
                    navi,
                  })
                }>
                <PageTitle numberOfLines={2}>{data?.feaktion_title}</PageTitle>
              </TextButton>
              <TextButton
                onPress={() =>
                  naviPress({
                    id: data?.feaktion_user?.user_id,
                    contentType: 'user',
                    navi,
                  })
                }>
                <SubTitle>{data?.feaktion_user?.nickname}</SubTitle>
              </TextButton>
              <RowWrap>
                <SSubTitle>
                  {data?.feaktion_type === 'novel'
                    ? `총 ${data?._count?.episode}편`
                    : '단편'}
                </SSubTitle>
                <SSubTitle>최근 등록일 {currentTime}</SSubTitle>
              </RowWrap>
              <RowReactWrap>
                {reactList.map(({ index, icon, score }) => (
                  <IconWrap key={index}>
                    {icon}
                    <IconScore>{score}</IconScore>
                  </IconWrap>
                ))}
              </RowReactWrap>
            </ContentsInner>
          </ContentsAndDetailWrap>
          {/* <TapGestureHandler onHandlerStateChange={popupHandler}>
            <ButtonWrap>{moreOrNotiButtonHandler()}</ButtonWrap>
          </TapGestureHandler> */}
          <ButtonTest
            ref={buttonRef}
            // onPress={() => setMoreButtonHandle(!moreButtonHandle)}>
            onPress={onPressWithMeasure}>
            <ButtonWrap>{moreOrNotiButtonHandler()}</ButtonWrap>
          </ButtonTest>
        </ContentAndMoreMenuWrap>
        <SpreadButtonWrap>
          {[
            'Myfictionlist',
            'novels',
            'shorts',
            'myfeaktions',
            'readed',
            'interestgenre',
            'ContentsArchive',
          ].includes(navi) ? (
            <SpreadLayoutButton
              value={data?.feaktion_description}
              type="text"
              onPress={() => {}}
            />
          ) : null}
        </SpreadButtonWrap>
      </ImageWrapperInner>
      {spreadLayoutCtrl()}
    </ImageWrapper>
  )
}

const ButtonTest = styled.TouchableOpacity``

const ImageWrapper = styled.View`
  display: flex;
  position: relative;
`

const ImageWrapperInner = styled.View`
  padding: 0 16px;
`

const ContentsInner = styled.View`
  flex: 1;
  margin-left: 12px;
  padding-right: 12px;
`

const ContentAndMoreMenuWrap = styled.View`
  flex-direction: row;
  padding-right: 16px;
`

const ContentsAndDetailWrap = styled.View`
  flex-direction: row;
  width: 100%;
`

const PageItem = styled.Image`
  width: 80px;
  height: 112px;
  border-radius: 2px;
`

// thumbnail
const ImageButton = styled.TouchableOpacity`
  position: relative;
  background: ${({ theme }) => theme.color.gray8};
  border-radius: 2px;
`

const PageTitle = styled.Text`
  color: ${({ theme }) => theme.color.gray1};
  font-size: ${({ theme }) => theme.fontSize.font14};
  font-family: ${({ theme }) => theme.font.notoMedium};
  line-height: 20px;
  flex-wrap: wrap;
`

const ButtonWrap = styled.View`
  width: 20px;
  height: 20px;
`

const Button = styled.View`
  display: flex;
  width: 20px;
  height: 20px;
`

const TextButton = styled.TouchableOpacity``

const SubTitle = styled.Text`
  color: ${({ theme }) => theme.color.gray3};
  font-size: ${({ theme }) => theme.fontSize.font12};
  margin: 4px 0;
  line-height: 18px;
`

const SSubTitle = styled.Text`
  color: ${({ theme }) => theme.color.gray3};
  font-size: ${({ theme }) => theme.fontSize.font12};
  margin-right: 8px;
  line-height: 17px;
`

const RowWrap = styled.View`
  display: flex;
  flex-direction: row;
`

const SpreadButtonWrap = styled.View`
  margin-top: 16px;
`

// icon layout
const RowReactWrap = styled(RowWrap)`
  margin-top: 6px;
`

const IconWrap = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 8px;
`

const IconScore = styled.Text`
  color: ${({ theme }) => theme.color.gray1};
  font-size: ${({ theme }) => theme.fontSize.font12};
  margin-left: 3px;
`

// lines
const LineDummy = styled.View`
  width: 100%;
  margin: 20px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.color.gray6};
`

const LayoutDummy = styled.View`
  width: 100%;
`
