import React from 'react'
import styled from 'styled-components/native'

type Props = {
  title: string
  onPress: () => void
}
export default function TitleHeader({
  title = '',
  onPress,
}: Props): JSX.Element {
  return (
    <ScrollTitleWrap>
      <ScrollTitle>{title}</ScrollTitle>
      <MoreViewButton onPress={onPress}>
        <MoreViewButtonText>더보기</MoreViewButtonText>
      </MoreViewButton>
    </ScrollTitleWrap>
  )
}

const ScrollTitleWrap = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  margin-bottom: 16px;
`

const ScrollTitle = styled.Text`
  color: ${({ theme }) => theme.color.gray1};
  font-size: ${({ theme }) => theme.fontSize.font16};
  font-family: ${({ theme }) => theme.font.notoMedium};
`

const MoreViewButton = styled.TouchableOpacity``

const MoreViewButtonText = styled.Text`
  color: ${({ theme }) => theme.color.gray1};
  font-size: ${({ theme }) => theme.fontSize.font12};
  opacity: 0.5;
`
