import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'

//icons
import Down from '@Icons/down.svg'

//hooks
import { useDateTimeConvert } from '~/Hooks/useDateTimeConvert'
import AccordionPart from './AccordionPart'

type Props = {
  listValue: {
    episode_title: string
    episode_updatedate: Date
    episode_id: number
    scenes: { scene: string; title: string; index: number }[]
    reading_history: []
  }
  onPress: (type: string, id: number, index: number) => void
  type: string
}

export default function Accordion({
  listValue,
  onPress,
  type,
}: Props): JSX.Element {
  const {
    episode_title,
    episode_updatedate,
    episode_id,
    scenes,
    reading_history,
  } = listValue
  const [downActive, setDownActive] = useState(false)

  // input index num
  const [sceneData, setSceneData] = useState<Props['listValue']['scenes']>([])

  // hooks
  const [currentTime] = useDateTimeConvert(episode_updatedate, 'JustDate')

  useEffect(() => {
    const result = scenes?.map(({ scene, title }, index: number) => {
      return { scene, title, index }
    })
    setSceneData(result)
  }, [listValue])

  return (
    <EpisodeWrap isRead={reading_history.length > 0}>
      <EpisodeInnerWrap>
        <>
          <EpisodeTextButton
            onPress={() => onPress('accordion', episode_id, 0)}
            onLongPress={() => onPress('longPress', episode_id, 0)}>
            <EpisodeText>{episode_title}</EpisodeText>
          </EpisodeTextButton>
          <DateNDownWrap>
            {['Index', 'Saved'].includes(type) ? (
              <SoftText>{currentTime}</SoftText>
            ) : null}
            <DownWrapButton onPress={() => setDownActive(!downActive)}>
              <Down
                width={16}
                height={16}
                style={{
                  transform: [{ rotate: downActive ? '180deg' : '0deg' }],
                }}
              />
            </DownWrapButton>
          </DateNDownWrap>
        </>
      </EpisodeInnerWrap>
      {downActive &&
        sceneData?.map((items, index: number) => (
          <SceneBoxButton
            key={`key__${index}`}
            onPress={() => onPress('scene', episode_id, index)}>
            <AccordionPart items={items} type={type} />
          </SceneBoxButton>
        ))}
    </EpisodeWrap>
  )
}

// episode

const EpisodeWrap = styled.View<{ isRead: boolean }>`
  background: ${({ theme, isRead }) =>
    isRead ? theme.color.gray12 : theme.color.gray10};
  margin-bottom: 2px;
`

const EpisodeInnerWrap = styled.TouchableHighlight`
  width: 100%;
  padding: 6px 16px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const EpisodeTextButton = styled.TouchableOpacity`
  flex: 1;
`

const EpisodeText = styled.Text`
  color: ${({ theme }) => theme.color.gray1};
  line-height: 24px;
  font-size: ${({ theme }) => theme.fontSize.font14};
`

const DateNDownWrap = styled.View`
  flex-direction: row;
  align-items: center;
`

const DownWrapButton = styled.TouchableOpacity`
  margin-left: 10px;
  padding: 4px;
`

const SceneBoxButton = styled.TouchableOpacity`
  width: 100%;
  padding: 14px 19px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const SoftText = styled.Text<{ styling?: string }>`
  color: ${({ theme }) => theme.color.gray3};
  /* font-size:${({ theme, styling }) =>
    styling === 'Index' ? theme.fontSize.font12 : theme.fontSize.font14}; */
  font-size: ${({ theme }) => theme.fontSize.font12};
`
