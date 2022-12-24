import React, { Fragment, useEffect, useState } from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'
// icons
import Down from '@Icons/down.svg'
import UserNoticeDate from './FictionIndex/UserNoticeDate'

type valueType = { notice_title: string; id: number; write_date: Date }[]
type props = {
  value: valueType | string[]
  type: string
  onPress: (type: string, value: string | number) => void
}

export default function SpreadLayoutButton({
  value,
  type,
  onPress,
}: props): JSX.Element {
  const whatIsOs = Platform.OS

  const [currentBtn, setCurrentBtn] = useState({ type: '', button: false })

  const moreButtonHandler = () => {
    setCurrentBtn({ type, button: !currentBtn?.button })
  }

  const onSpreadHandler = () => {
    if (type === 'tags') {
      if (value?.length !== 0) {
        return (
          <DetailTagsWrap
            hide={currentBtn?.type === type && currentBtn?.button}
            type={type}>
            <TextButton
              onPress={() =>
                setCurrentBtn({ type, button: !currentBtn?.button })
              }>
              {value?.map((data, i: number): JSX.Element | undefined => {
                if (data !== '') {
                  return (
                    <TagsWrap
                      key={`indexs__${i}`}
                      platform={whatIsOs === 'ios'}>
                      <Text>{data}</Text>
                    </TagsWrap>
                  )
                }
              })}
            </TextButton>
          </DetailTagsWrap>
        )
      }
    } else if (type === 'notification') {
      return (
        <DetailTagsWrap
          hide={currentBtn?.type === type && currentBtn?.button}
          type={type}>
          <NotiLayout
            onPress={() =>
              setCurrentBtn({ type, button: !currentBtn?.button })
            }>
            <Text>공지사항</Text>
          </NotiLayout>
          {
            <Dummy>
              {value?.length !== 0 ? (
                value?.map(({ notice_title, id, write_date }: any, index) => (
                  <Fragment key={`keyss__${index}`}>
                    <Button onPress={() => onPress('notice', id)}>
                      <ButtonInner>
                        <Text>{notice_title}</Text>
                        <UserNoticeDate writedate={write_date} />
                      </ButtonInner>
                    </Button>
                  </Fragment>
                ))
              ) : (
                <NotiDummy>
                  <Text>공지가 없습니다</Text>
                </NotiDummy>
              )}
            </Dummy>
          }
        </DetailTagsWrap>
      )
    } else {
      return (
        <DetailTextWrap>
          <TextButton
            onPress={() =>
              setCurrentBtn({ type, button: !currentBtn?.button })
            }>
            <NotiText
              numberOfLines={type === 'text' && currentBtn?.button ? 10 : 2}>
              {value}
            </NotiText>
          </TextButton>
        </DetailTextWrap>
      )
    }
  }

  return (
    <Layout>
      {onSpreadHandler()}
      <DetailMoreButton
        onPress={moreButtonHandler}
        numberOfLines={type === 'text' && currentBtn?.button}>
        <Down
          width={20}
          height={20}
          style={{
            transform: [{ rotate: currentBtn?.button ? '180deg' : '0deg' }],
          }}
        />
      </DetailMoreButton>
    </Layout>
  )
}

const Layout = styled.View`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const DetailMoreButton = styled.TouchableOpacity<{ numberOfLines?: boolean }>`
  padding-top: 2px;
`

const TextButton = styled.TouchableOpacity`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`

const DetailTextWrap = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-right: 12px;
  flex: 1;
`

const DetailTagsWrap = styled(DetailTextWrap)<{ hide?: boolean; type: string }>`
  ${({ hide, type }) => {
    if (hide) {
      return `height:auto;`
    } else {
      if (type === 'notification') {
        return `max-height:22px;`
      } else {
        return `max-height:28px;`
      }
    }
  }};
  height: 100%;
  flex: 1;
  overflow: hidden;
`

const NotiLayout = styled.TouchableOpacity`
  width: 100%;
  margin-top: 2px;
  padding-bottom: 3px;
`

const Button = styled.TouchableOpacity`
  padding: 8px 0;
`

const ButtonInner = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
`

const NotiDummy = styled.View`
  flex: 1;
  padding: 16px 0;
`

const Text = styled.Text`
  color: ${({ theme }) => theme.color.gray3};
  font-size: ${({ theme }) => theme.fontSize.font12};
`

const NotiText = styled(Text)`
  line-height: 19px;
`

const TagsWrap = styled.View<{ platform: boolean }>`
  max-height: ${({ platform }) => (platform ? `28px` : `25px`)};
  height: 100%;
  margin-right: 8px;
  margin-bottom: 8px;
  margin-top: 1px;
  padding: 4px 10px;
  border-radius: 14px;
  background: ${({ theme }) => theme.color.gray6};
`

const Dummy = styled.View`
  width: 100%;
  margin-top: 8px;
`
