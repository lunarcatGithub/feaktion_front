import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import styled from 'styled-components/native'

//icons
import View from '@Icons/view.svg'
import Comment from '@Icons/comment.svg'
import Heart from '@Icons/heart.svg'
import Star from '@Icons/star.svg'
import StarOn from '@Icons/starOn.svg'

// components
import useToggleFetchHook from '~/Hooks/useToggleFetchHook'
import { useAppContext } from '~/Hooks/useContextHook'
import Skeleton from './Skeleton'

type props = {
  fictionData: {
    feaktion_title: string
    feaktion_thumb: string
    feaktion_user: {
      nickname: string
    }
    favorite_feaktion: {
      id: number
      feaktion_id: number
    }[]
    _count: {
      episode_like: number
      favorite_feaktion: number
      reading_history: number
      comment: number
    }
  }
  onPress: (type: string) => void
  type: string
  fictionId: number
  setToastPush: Dispatch<SetStateAction<string>>
}

export default function IndexCover({
  fictionData,
  onPress,
  fictionId,
  type,
  setToastPush,
}: props): JSX.Element {
  // store
  const { setAnimationMove, getImageUrl } = useAppContext()

  const [pick, pickBtnHandler, loading] = useToggleFetchHook({
    type: 'pick',
    initid: fictionData?.favorite_feaktion[0]?.id,
  })

  const pickHandler = () => {
    if (loading?.isLoading) return

    pickBtnHandler(fictionId)
    const isPick = pick ? 'PICKOFF' : 'PICKON'
    setToastPush(isPick)
    setAnimationMove({ type: isPick, value: -148, bool: true, loading: true })
  }

  const reactList = [
    {
      index: 0,
      component: (
        <Button onPress={pickHandler}>
          <ButtonWrap>
            {pick ? (
              <StarOn width={24} height={24} />
            ) : (
              <Star width={24} height={24} />
            )}
            <ReactCount>
              {pick
                ? fictionData?._count?.favorite_feaktion
                : fictionData?._count?.favorite_feaktion || 0}
            </ReactCount>
          </ButtonWrap>
        </Button>
      ),
    },
    {
      index: 1,
      component: (
        <UnButtonWrap>
          <Heart width={24} height={24} />
          <ReactCount>{fictionData?._count?.episode_like || 0}</ReactCount>
        </UnButtonWrap>
      ),
    },
    {
      index: 2,
      component: (
        <UnButtonWrap>
          <View width={24} height={24} />
          <ReactCount>{fictionData?._count?.reading_history || 0}</ReactCount>
        </UnButtonWrap>
      ),
    },
    {
      index: 3,
      _type: 'last',
      component: (
        <UnButtonWrap>
          <Comment width={24} height={24} />
          <ReactCount>{fictionData?._count?.comment || 0}</ReactCount>
        </UnButtonWrap>
      ),
    },
  ]

  return (
    <FictionLayout>
      <ImageWrap>
        <ThumbnailImage
          source={{
            uri: fictionData?.feaktion_thumb
              ? getImageUrl + fictionData?.feaktion_thumb
              : undefined,
          }}
        />
      </ImageWrap>
      <InfoWrap>
        {fictionData?.feaktion_title ? (
          <Title numberOfLines={1}>{fictionData?.feaktion_title}</Title>
        ) : (
          <Skeleton width={150} height={18} margin={5} />
        )}
        {fictionData?.feaktion_user ? (
          <SoftText>{fictionData?.feaktion_user?.nickname}</SoftText>
        ) : (
          <Skeleton width={110} height={15} />
        )}
        <ReactTabsWrap>
          {reactList?.map(({ index, component, _type }) => (
            <ButtonVerticalWrap key={`index__${index}`} styling={_type}>
              {component}
            </ButtonVerticalWrap>
          ))}
        </ReactTabsWrap>
      </InfoWrap>
    </FictionLayout>
  )
}

// fiction info
const FictionLayout = styled.View`
  flex-direction: row;
  width: 100%;
  height: 112px;
  padding: 0 16px;
`

const ImageWrap = styled.View`
  width: 80px;
  height: 112px;
  background: ${({ theme }) => theme.color.gray6};
  border-radius: 2px;
  overflow: hidden;
`

const ThumbnailImage = styled.Image`
  width: 100%;
  height: 100%;
`
const InfoWrap = styled.View`
  flex-direction: column;
  margin-left: 14px;
  flex: 1;
`

const Title = styled.Text`
  color: ${({ theme }) => theme.color.gray1};
  font-family: ${({ theme }) => theme.font.notoMedium};
  font-size: ${({ theme }) => theme.fontSize.font14};
  line-height: 24px;
  margin-bottom: 4px;
  margin-top: 3px;
`

const SoftText = styled.Text`
  color: ${({ theme }) => theme.color.gray3};
  font-size: ${({ theme }) => theme.fontSize.font12};
`

const ReactTabsWrap = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  margin-top: 12px;
  padding-right: 12px;
`

const ButtonVerticalWrap = styled.View<{ styling: string | undefined }>`
  width: 48px;
  height: 48px;
  align-items: center;
  justify-content: center;
  margin-right: ${({ styling }) => (styling ? `0px` : `12px`)};
`

// react button
const ButtonWrap = styled.View`
  flex-direction: column;
  align-items: center;
`

const UnButtonWrap = styled(ButtonWrap)`
  opacity: 0.6;
`

const ReactCount = styled.Text`
  color: ${({ theme }) => theme.color.gray1};
  font-size: 10px;
  padding-top: 2px;
`

const Button = styled.TouchableOpacity`
  display: flex;
  flex-direction: column;
  align-items: center;
`
