import React, { useEffect, useState } from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

// hooks
import { useAppContext } from '~/Hooks/useContextHook'

import { CommonFictionType, UploadType } from '../types/FictionType'

type Props = {
  items: CommonFictionType
  navi: any
  onPress: (props: {
    fictionType: 'Fiction' | 'Short'
    fictionId: number
    navi: string
  }) => void
}

export default function ScrollPages({
  items,
  navi,
  onPress,
}: Props): JSX.Element {
  // types
  const { SHORTUPLOAD } = UploadType

  // store
  const { getImageUrl } = useAppContext()

  // state
  const [fictionData, setFictionData] = useState<CommonFictionType>(items)

  useEffect(() => {
    if (items?.feaktion) {
      setFictionData(items?.feaktion)
    } else {
      setFictionData(items)
    }
  }, [items])

  return (
    <BannerLayout>
      <ContentsWrap>
        <ImageButton
          onPress={() =>
            onPress({
              fictionId: fictionData?.feaktion_id,
              fictionType:
                fictionData?.feaktion_type === 'short' ? 'Short' : 'Fiction',
              navi,
            })
          }>
          <ImageView
            source={{
              uri: [
                'https://image.novelpia.com',
                '',
                undefined,
                null,
              ]?.includes(fictionData?.feaktion_thumb)
                ? undefined
                : getImageUrl + fictionData?.feaktion_thumb,
            }}
          />
          {fictionData?.feaktion_type === SHORTUPLOAD ? (
            <TagWrap os={Platform.OS === 'ios'}>
              <TagText>단편</TagText>
            </TagWrap>
          ) : null}
        </ImageButton>
        <TextTitleWrap>
          <TextTitle numberOfLines={2}>{fictionData?.feaktion_title}</TextTitle>
        </TextTitleWrap>
      </ContentsWrap>
    </BannerLayout>
  )
}

// banner interaction
const BannerLayout = styled.View`
  width: 80px;
  height: 112px;
  margin: 0 6px;
`

const ContentsWrap = styled.View`
  flex: 1;
  flex-direction: column;
`

const TextTitleWrap = styled.View`
  width: 100%;
  align-items: center;
`

const TextTitle = styled.Text`
  color: ${({ theme }) => theme.color.gray1};
  line-height: 16px;
  margin-top: 4px;
  font-family: ${({ theme }) => theme.font.notoMedium};
  font-size: ${({ theme }) => theme.fontSize.font12};
`

const ImageView = styled.Image`
  width: 100%;
  height: 100%;
  border-radius: 2px;
`

// button

const NaviButton = styled.TouchableOpacity``

const ImageButton = styled(NaviButton)`
  background: ${({ theme }) => theme.color.gray8};
  border-radius: 2px;
`

const TagWrap = styled.View<{ os: boolean }>`
  position: absolute;
  right: 0;
  bottom: 0;
  background: rgba(65, 65, 65, 0.8);
  padding: ${({ os }) => (os ? '0px 4px' : '2px 4px')};
  border-top-left-radius: 2px;
`

const TagText = styled.Text`
  color: ${({ theme }) => theme.color.white};
  font-size: ${({ theme }) => theme.fontSize.font10};
`
