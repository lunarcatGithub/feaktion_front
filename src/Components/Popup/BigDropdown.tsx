import React from 'react'
import styled from 'styled-components/native'

// icon
import Plus from '@Icons/uploadPlus.svg'

type props = {
  data: { index: number; desc: string; value?: number | string }[] | undefined
  onPress: (type: string, index?: number, value?: number | string) => void
  type: string
  modalType: string | undefined
}

export default function BigDropdown({
  data,
  onPress,
  type,
  modalType,
}: props): JSX.Element {
  return (
    <>
      {data?.map(({ index, desc, value }) => (
        <TextButton
          onPress={() => onPress('list', index, value)}
          key={`keys__${index}`}>
          <Text>
            {index}. {desc}
          </Text>
        </TextButton>
      ))}
      {modalType === 'upload' ? (
        <TextButton onPress={() => onPress('last')}>
          <Text>SCENE 추가</Text>
          <PlusWrap>
            <Plus width={24} height={24} />
          </PlusWrap>
        </TextButton>
      ) : null}
    </>
  )
}

const TextButton = styled.TouchableOpacity`
  width: 100%;
  padding: 14px 16px;
  justify-content: space-between;
  flex-direction: row;
`

const Text = styled.Text`
  color: ${({ theme }) => theme.color.gray3};
  font-size: ${({ theme }) => theme.fontSize.font14};
`

const PlusWrap = styled.View`
  opacity: 0.6;
`
