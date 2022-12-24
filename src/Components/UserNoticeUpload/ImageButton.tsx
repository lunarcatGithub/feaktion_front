import styled from 'styled-components/native'
import React from 'react'

// icons
import UploadPlus from '@Icons/uploadPlus.svg'

type props = {
  type: 'Upload' | 'View'
  index: number
  uri: string | undefined
  onPress: (type: string, index: number) => void
}
export default function ImageButton({ type, index, uri, onPress }: props) {
  return (
    <ImageButtonWrap key={`image__${index}`}>
      {type === 'Upload' ? (
        <RemoveButton onPress={() => onPress('remove', index)}>
          <UploadPlus
            width={16}
            height={16}
            style={{ transform: [{ rotate: '45deg' }] }}
          />
        </RemoveButton>
      ) : null}
      <Button onPress={() => onPress('Select', index)}>
        <Image source={{ uri: uri || undefined }} />
      </Button>
    </ImageButtonWrap>
  )
}

const ImageButtonWrap = styled.View`
  position: relative;
`
const Image = styled.Image`
  width: 100%;
  height: 100%;
`
const RemoveButton = styled.TouchableOpacity`
  position: absolute;
  top: -8px;
  right: -1px;
  width: 20px;
  height: 20px;
  border-radius: 50px;
  background: ${({ theme }) => theme.color.gray10};
  border: 1px solid ${({ theme }) => theme.color.gray3};
  justify-content: center;
  align-items: center;
  z-index: 99999;
`

// button
const Button = styled.TouchableOpacity`
  width: 80px;
  height: 80px;
  margin: 0 8px;
  border-radius: 4px;
  overflow: hidden;
  background: ${({ theme }) => theme.color.gray6};
  justify-content: center;
  align-items: center;
`
