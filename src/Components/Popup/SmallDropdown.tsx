import React from 'react'
import styled from 'styled-components/native'

type props = {
  onPress: (type: string, value?: number) => void
  type: string | undefined
  modalType: string | undefined
  data: { index: number; desc: string; value: string }[] | undefined
}

export default function SmallDropdown({
  onPress,
  data,
  type,
  modalType,
}: props): JSX.Element {
  return (
    <Layout>
      {data?.map(({ index, desc, value }) => (
        <Button onPress={() => onPress(value)} key={`key__${index}`}>
          <Title>{desc}</Title>
        </Button>
      ))}
    </Layout>
  )
}

const Layout = styled.View`
  flex: 1;
  padding: 10px 0;
`

const Button = styled.TouchableOpacity`
  padding: 8px;
`

const Title = styled.Text`
  color: ${({ theme }) => theme.color.gray1};
  font-size: ${({ theme }) => theme.fontSize.font14};
`
