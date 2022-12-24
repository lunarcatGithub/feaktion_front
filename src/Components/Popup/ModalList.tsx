import styled from 'styled-components/native'
import React from 'react'

type Props = {
  data:
    | {
        index: number
        desc: string
        value: string
      }[]
    | null
  onPress: (type: string, value: string) => void
  type: string
}

export default function ModalList({ data, onPress, type }: Props) {
  return (
    <Layout>
      {data?.map(({ index, value, desc }) => (
        <Button key={`keys__${index}`} onPress={() => onPress(type, value)}>
          <Text>{desc}</Text>
        </Button>
      ))}
    </Layout>
  )
}

const Layout = styled.View`
  background: ${({ theme }) => theme.color.gray4};
  width: 280px;
  border-radius: 2px;
  overflow: hidden;
  z-index: 999999999;
`

const Button = styled.TouchableOpacity`
  width: 100%;
  padding: 14px 16px;
  justify-content: center;
  flex-direction: row;
`

const Text = styled.Text`
  color: ${({ theme }) => theme.color.gray3};
  font-size: ${({ theme }) => theme.fontSize.font14};
`
