import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import { ImageSourcePropType } from 'react-native'

// hooks
import { useDateTimeConvert } from '@Hooks/useDateTimeConvert'

type StringOrNum = string | number

type Props = {
  items: {}
  navi: string
}

export default function ListNotification({ items }): JSX.Element {
  const {
    notiType,
    images,
    detailType,
    targetUser,
    contentTitle,
    contentSeries,
    date,
    adminTitle,
  } = items
  const [devideHeader, setDevideHeader] = useState('')
  const [descript, setDescript] = useState('')

  // hooks
  const [currentTime] = useDateTimeConvert(date, '')

  const devideHeaderHandler = (): void => {
    if (notiType === 'comment') {
      if (detailType === 'comment') {
        setDevideHeader('댓글')
        setDescript(`${targetUser}님이 댓글을 남겼습니다`)
      } else if (detailType === 'reply') {
        setDevideHeader('답글')
        setDescript(`${targetUser}님이 댓글에 답글을 남겼습니다`)
      }
    } else if (notiType === 'preference') {
      if (detailType === 'preference') {
        setDevideHeader('선호작')
        setDescript(`<${contentTitle} ${contentSeries}화> 가 업로드 되었습니다`)
      } else if (detailType === 'newWork') {
        setDevideHeader('신작')
        setDescript(`[${contentTitle}] 작품이 새로 연재되었습니다`)
      }
    } else if (notiType === 'notice') {
      if (detailType === 'notice') {
        setDevideHeader('공지사항')
      } else if (detailType === 'event') {
        setDevideHeader('이벤트')
      }
      setDescript(adminTitle)
    }
  }

  useEffect(() => {
    devideHeaderHandler()
  }, [items])

  return (
    <Layout>
      <ImageView source={images} />
      <ContentsInner>
        <TextSub>{devideHeader}</TextSub>
        <TitleDesc>{descript}</TitleDesc>
        <TextSub>{currentTime}</TextSub>
      </ContentsInner>
    </Layout>
  )
}

const Layout = styled.View`
  padding: 0 16px;
  margin-bottom: 24px;
  flex-direction: row;
`

const ContentsInner = styled.TouchableOpacity`
  flex-direction: column;
  margin-left: 12px;
  flex: 1;
`

const ImageView = styled.Image`
  width: 48px;
  height: 48px;
  border-radius: 50px;
  background: ${({ theme }) => theme.color.gray2};
`

const TextTitle = styled.Text`
  color: ${({ theme }) => theme.color.gray1};
  font-size: ${({ theme }) => theme.fontSize.font14};
  font-family: ${({ theme }) => theme.font.notoMedium};
`

const TextSub = styled.Text`
  color: ${({ theme }) => theme.color.gray3};
  font-size: ${({ theme }) => theme.fontSize.font12};
  margin-top: 2px;
`

const TitleDesc = styled(TextSub)`
  color: ${({ theme }) => theme.color.gray1};
`
