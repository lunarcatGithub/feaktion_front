import React from 'react'
import styled from 'styled-components/native'

type Props = {
  items: { id: number; title: string; value: string }
  select: {
    selectGenre: string
    setSelectGenre: React.Dispatch<React.SetStateAction<string>>
  }
}
export default function TagsPages({ items, select }: Props) {
  return (
    <TagButton
      onPress={() => select.setSelectGenre(items.value)}
      styling={select.selectGenre === items.value}>
      <TextTitle styling={select.selectGenre === items.value}>
        {items.title}
      </TextTitle>
    </TagButton>
  )
}

const TagButton = styled.TouchableOpacity<{ styling: boolean }>`
  display: flex;
  padding: 4px 10px;
  background: ${({ theme, styling }) =>
    styling ? theme.color.purple4 : theme.color.gray6};
  margin-right: 8px;
  border-radius: 25px;
`

const TextTitle = styled.Text<{ styling: boolean }>`
  color: ${({ theme, styling }) =>
    styling ? theme.color.gray6 : theme.color.gray3};
  font-size: ${({ theme }) => theme.fontSize.font12};
  line-height: 16px;
`
