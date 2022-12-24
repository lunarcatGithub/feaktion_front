import React from 'react'
import styled from 'styled-components/native'

// components
import Accordion from './Accordion'

type sortList = { index: number; value: string; desc: string }

type props = {
  sort: sortList[]
  data: any
  onPress: (type: string, value: string | number) => void
  active: string
  type: string
}

export default function AccordionBundle({
  sort,
  data,
  onPress,
  active,
  type,
}: props): JSX.Element {
  return (
    <>
      <SortWrap>
        {sort?.map(({ index, value, desc }: sortList) => (
          <Button key={`key__${index}`} onPress={() => onPress('sort', value)}>
            <SortText styling={value === active}>{desc}</SortText>
          </Button>
        ))}
      </SortWrap>
      {data?.map((listValue: any, index: number) => (
        <Dummy key={`key__${index}`}>
          <Accordion listValue={listValue} onPress={onPress} type={type} />
        </Dummy>
      ))}
    </>
  )
}

const Dummy = styled.View``

// sort
const SortWrap = styled.View`
  width: 100%;
  padding: 16px;
  flex-direction: row;
  justify-content: flex-end;
`

const SortText = styled.Text<{ styling: boolean }>`
  font-size: ${({ theme }) => theme.fontSize.font12};
  color: ${({ theme, styling }) =>
    styling ? theme.color.purple4 : theme.color.gray3};
  margin-left: 16px;
`

const Button = styled.TouchableOpacity`
  display: flex;
  flex-direction: column;
  align-items: center;
`
