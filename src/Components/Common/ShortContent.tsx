import React from 'react'
import styled from 'styled-components/native'
import { useDateTimeConvert } from '~/Hooks/useDateTimeConvert'
import { FictionGetDataType } from '../types/FictionType'

type props = {
  // items: FictionGetDataType['feaktion'];
  items: any
  onPress: (props: { fictionType: string; fictionId: number }) => void
}

export default function ShortContent({ items, onPress }: props): JSX.Element {
  const { feaktion_uploaddate, feaktion_title, feaktion_id } = items

  // hooks
  const [currentTime] = useDateTimeConvert(feaktion_uploaddate, 'JustDate')

  return (
    <Layout>
      <Button
        onPress={() =>
          onPress({ fictionType: 'short', fictionId: feaktion_id })
        }>
        <TitleText numberOfLines={1}>{feaktion_title}</TitleText>
      </Button>
      <DateText>{currentTime}</DateText>
    </Layout>
  )
}

const Layout = styled.View`
  width: 100%;
  height: 40px;
  padding: 0 16px;
  flex-direction: row;
  align-items: center;
`

const Button = styled.TouchableOpacity`
  flex: 1;
  height: 100%;
  justify-content: center;
`

const TitleText = styled.Text`
  color: ${({ theme }) => theme.color.gray1};
  font-size: ${({ theme }) => theme.fontSize.font14};
  font-family: ${({ theme }) => theme.font.notoMedium};
  line-height: 17px;
`

const DateText = styled.Text`
  color: ${({ theme }) => theme.color.gray3};
  font-size: ${({ theme }) => theme.fontSize.font10};
`
