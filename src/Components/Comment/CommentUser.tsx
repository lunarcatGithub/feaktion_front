import React, { useState } from 'react'
import styled from 'styled-components/native'
import {
  HandlerStateChangeEvent,
  RectButton,
  TapGestureHandler,
  TapGestureHandlerEventPayload,
} from 'react-native-gesture-handler'
import { Platform } from 'react-native'

//icons
import Like from '@Icons/like.svg'
import Comment from '@Icons/comment.svg'
import MoreMenu from '@Icons/moreMenu.svg'

// hooks
import { useDateTimeConvert } from '@Hooks/useDateTimeConvert'
import useOnLayout from '@Hooks/useOnLayout'

type Props = {
  item: {
    comment_id: number
    comment_body: string
    comment_updatedate: Date
    feaktion_user: {
      nickname: string
    }
    isWriter: boolean
  }
  onPress: (type: string, isMe: boolean, size?: number, id?: number) => void
  type: string
}

export default function CommentUser({
  item,
  onPress,
  type,
}: Props): JSX.Element {
  const {
    comment_id,
    comment_body,
    comment_updatedate,
    feaktion_user: { nickname },
    isWriter,
  } = item

  // size adjust
  const [getSize, setGetSize] = useState(0)
  // hooks
  const [currentTime] = useDateTimeConvert(comment_updatedate, '')
  const [size, getSizeLayout] = useOnLayout('')

  const onPressHandler = (
    e: HandlerStateChangeEvent<TapGestureHandlerEventPayload>
  ) => {
    const heightSize = Platform.OS === 'ios' ? 50 : 35
    setGetSize(e.nativeEvent.absoluteY - size.height - heightSize)
  }

  const iosNandroidButton = () => {
    const icon = <MoreMenu width={14} height={14} />
    const params = () => onPress('More', isWriter, getSize, comment_id)
    let JSX
    if (Platform.OS === 'ios') {
      JSX = <GeneralButton onPress={params}>{icon}</GeneralButton>
    } else {
      JSX = <AndroidButton onPress={params}>{icon}</AndroidButton>
    }
    return JSX
  }

  const reactList = [
    {
      index: 0,
      _type: 'Like',
      component: (
        <>
          <ButtonOpacity>
            <Like width={14} height={14} />
          </ButtonOpacity>
          <NormalSizeText>좋아요 {0}</NormalSizeText>
        </>
      ),
    },
    {
      index: 1,
      _type: 'Reply',
      component: (
        <>
          <ButtonOpacity>
            <Comment width={14} height={14} />
          </ButtonOpacity>
          <NormalSizeText>댓글 {0}</NormalSizeText>
        </>
      ),
    },
  ]

  return (
    <Layout onLayout={getSizeLayout}>
      <ProfileContentWrap>
        <ProfileWrap>
          <ProfileImage source={{ uri: undefined }} />
        </ProfileWrap>
      </ProfileContentWrap>
      <ContentsWrap>
        <TitleTextWrap>
          <TitleText>{nickname}</TitleText>
          <SmallSizeText>{currentTime}</SmallSizeText>
        </TitleTextWrap>
        <CommentDescWrap>
          <NormalSizeText>{comment_body}</NormalSizeText>
        </CommentDescWrap>
        <TapGestureHandler onHandlerStateChange={onPressHandler}>
          <ReactTabsWrap>
            <OnlyReactTabs>
              {/* {reactList?.map(({ index, component, _type }) => {
                if (type === _type) {
                  return;
                } else {
                  return (
                    <ButtonVerticalWrap
                      key={index}
                      onPress={() => onPress(_type, false)}
                    >
                      {component}
                    </ButtonVerticalWrap>
                  );
                }
              })} */}
            </OnlyReactTabs>
            {iosNandroidButton()}
          </ReactTabsWrap>
        </TapGestureHandler>
      </ContentsWrap>
    </Layout>
  )
}

const Layout = styled.View`
  width: 100%;
  flex-direction: row; ;
`

const ProfileContentWrap = styled.View``

const ContentsWrap = styled.View`
  flex-direction: column;
  flex: 1;
`

// contents
const ProfileWrap = styled.View`
  border-radius: 50px;
  overflow: hidden;
  width: 38px;
  height: 38px;
  margin-right: 12px;
  background: ${({ theme }) => theme.color.gray8};
`

const ProfileImage = styled.Image`
  width: 100%;
  height: 100%;
`

const TitleTextWrap = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 2px;
  margin-bottom: 4px;
`

const TitleText = styled.Text`
  color: ${({ theme }) => theme.color.gray3};
  font-family: ${({ theme }) => theme.font.notoMedium};
  font-size: ${({ theme }) => theme.fontSize.font16};
  line-height: 20px;
`

const SmallSizeText = styled.Text`
  color: ${({ theme }) => theme.color.gray3};
  font-size: ${({ theme }) => theme.fontSize.font10};
`

const NormalSizeText = styled(SmallSizeText)`
  font-size: ${({ theme }) => theme.fontSize.font12};
`
// body desc
const CommentDescWrap = styled.View`
  margin-bottom: 8px;
`

// react

const ButtonOpacity = styled.View`
  opacity: 0.65;
  margin-right: 4px;
`

const ReactTabsWrap = styled.View`
  flex-direction: row;
  justify-content: space-between;
`

const OnlyReactTabs = styled.View`
  flex-direction: row;
`

const ButtonVerticalWrap = styled.TouchableOpacity`
  margin-right: 8px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
`

const GeneralButton = styled.TouchableOpacity``

const AndroidButton = styled(RectButton)``
