import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import styled from 'styled-components/native'
import theme from '~/Styles/Theme'

// icon
import RemoveBtn from '@Icons/removeX.svg'
import { useUploadContext } from '~/Hooks/useContextHook'

type props = {
  onChangeText: Dispatch<SetStateAction<string>>
  onPress: (type: number | null) => void
  value: string
  data: { id: number; tag: string }[] | []
  type: string
}

export default function TagInput({
  onChangeText,
  type,
  onPress,
  data,
  value,
}: props) {
  const [currentTags, setCurrentTags] = useState<
    { id: number; value: string; type?: string }[]
  >([])
  const [count, setCount] = useState(0)

  // stroe
  const { newFictionCover, setNewFictionCover } = useUploadContext()

  const TagBuildHandler = () => {
    const blankCheck = /[\s]/g
    if (value?.match(blankCheck)) {
      setCurrentTags([...currentTags, { id: count, value: value?.trim() }])
      onChangeText('')
      setCount(() => count + 1)
    }
  }

  useEffect(() => {
    if (!['novelModify', 'shortModify'].includes(type)) return
    const resultValue = data?.map(({ id, tag }) => ({
      id,
      value: tag,
      type: 'modify',
    }))
    setCurrentTags(resultValue)
  }, [data, type])

  const removeTagHandle = (selectId: number, type?: string) => {
    onPress(selectId || null) // props to d
    const removeTag = currentTags?.filter(({ id }) => id !== selectId)
    setCurrentTags(removeTag)
  }

  const TagsRender = () => {
    if (currentTags?.length === 0) return

    return currentTags?.map(({ id, value, type }, index) => {
      if (value === '') return
      return (
        <TagForm key={`index__${index}`}>
          <Tag numberOfLines={1}>#{value}</Tag>
          <Button onPress={() => removeTagHandle(id, type)}>
            <RemoveBtn width={20} height={20} />
          </Button>
        </TagForm>
      )
    })
  }

  useEffect(() => {
    TagBuildHandler()
  }, [value, type, data])

  useEffect(() => {
    setNewFictionCover({
      ...newFictionCover,
      tag: currentTags?.map(({ value }) => value),
    })
  }, [currentTags])

  return (
    <Layout>
      <LayoutInner styling={currentTags?.length !== 0}>
        {TagsRender()}
        <InputWrap>
          <InputLayout
            // autoFocus={true}
            placeholder={
              currentTags?.length === 0 || !currentTags
                ? '태그를 입력해주세요'
                : ''
            }
            placeholderTextColor={`${theme.color.gray2}`}
            maxLength={100}
            onChangeText={text => {
              onChangeText(text)
            }}
            value={value}
            editable
            styling={currentTags?.length > 0}
          />
        </InputWrap>
      </LayoutInner>
    </Layout>
  )
}

const Layout = styled.View`
  position: relative;
  background: ${theme.color.gray6};
  border-radius: 4px;
  padding: 0 16px;
  min-height: 48px;
`

const LayoutInner = styled.View<{ styling: boolean }>`
  flex-wrap: wrap;
  flex-direction: row;
  width: 100%;
  padding: ${({ styling }) => (styling ? `4px 0` : `12px 0`)};
`

const InputWrap = styled.View`
  min-width: 50px;
  flex: 1;
  flex-direction: row;
`

const InputLayout = styled.TextInput<{ styling: boolean }>`
  color: ${({ theme }) => theme.color.white};
  font-size: ${({ theme }) => theme.fontSize.font14};
  margin-left: 4px;
  width: 100%;
  ${styling => styling && { padding: 0 }};
`

const TagForm = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  max-width: 260px;
  margin-right: 8px;
  margin: 6px 8px 6px 0;
  padding: 4px 4px 4px 10px;
  border-radius: 4px;
  background: ${({ theme }) => theme.color.gray4};
  height: 28px;
`

const Tag = styled.Text`
  font-size: ${({ theme }) => theme.fontSize.font14};
  color: ${({ theme }) => theme.color.white};
`

const Button = styled.TouchableOpacity`
  margin-left: 1px;
`
