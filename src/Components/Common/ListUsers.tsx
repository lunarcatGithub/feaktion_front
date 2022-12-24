import React, { useState } from 'react'
import styled from 'styled-components/native'
import { ImageSourcePropType } from 'react-native'
import { useAppContext } from '~/Hooks/useContextHook'

type Props = {
  items: {
    id: string
    user_id: number
    profile: string
    regdate: string
    nickname: string
    intro: string
  }
  navi: string
  naviPress: (props: { id: number; navi: string }) => void
}

export default function ListUsers({
  items,
  navi,
  naviPress,
}: Props): JSX.Element {
  const { getImageUrl } = useAppContext()

  return (
    <Layout>
      <ImageView source={{ uri: getImageUrl + items?.profile || undefined }} />
      <ContentsInner onPress={() => naviPress({ id: items?.user_id, navi })}>
        <TextTitle>{items?.nickname}</TextTitle>
        <TextSub>@{items?.id}</TextSub>
        <TitleIntro numberOfLines={2}>{items?.intro}</TitleIntro>
      </ContentsInner>
    </Layout>
  )
}

const Layout = styled.View`
  padding: 0 16px;
  margin-bottom: 24px;
  flex-direction: row;
`

const ContentsInner = styled.TouchableOpacity`
  flex-direction: column;
  margin-left: 12px;
  flex: 1;
`

const ImageViewWrap = styled.View``

const ImageView = styled.Image`
  width: 48px;
  height: 48px;
  border-radius: 50px;
  background: ${({ theme }) => theme.color.gray2};
`

const TextTitle = styled.Text`
  color: ${({ theme }) => theme.color.gray1};
  font-size: ${({ theme }) => theme.fontSize.font14};
  font-family: ${({ theme }) => theme.font.notoMedium};
`

const TextSub = styled.Text`
  color: ${({ theme }) => theme.color.gray3};
  font-size: ${({ theme }) => theme.fontSize.font12};
  margin-top: 2px;
`

const TitleIntro = styled(TextSub)`
  color: ${({ theme }) => theme.color.gray1};
`
