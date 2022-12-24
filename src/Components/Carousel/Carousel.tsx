import React, { useEffect, useRef, useState } from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

// components
import Page from './Pages'

// icons
import BannerStar from '@Icons/banner_star.svg'

type Props = {
  gap: number
  offset: number
  pages: { id: number; images: string }[]
  pageWidth: number
}

const times = 3000

export default function Carousel({
  gap,
  offset,
  pages,
  pageWidth,
}: Props): JSX.Element {
  // ref
  const _flatListRef = useRef<FlatList | null>(null)
  const currentCount = useRef(0)

  // hook data

  const [number, setNumber] = useState(0)
  const [page, setPage] = useState<number>(0)

  const onScroll = e => {
    const newPage = Math.round(
      e.nativeEvent.contentOffset.x / (pageWidth + gap)
    )
    // currentCount.current
    setPage(newPage)
    currentCount.current = newPage
  }

  const movePage = () => {
    // banner slide용
    if (currentCount.current >= pages?.length - 1) {
      setNumber(0)
      currentCount.current = 0
    } else {
      setNumber(() => number + 1)
      currentCount.current += 1
    }

    _flatListRef?.current?.scrollToIndex({
      // flatlist에 ref로 접근해서 page 넘김
      index: currentCount.current,
      animated: true,
    })
  }

  useEffect(() => {
    // auto scroll 3000 mil
    const timer = setTimeout(() => {
      movePage()
    }, times)

    return () => clearTimeout(timer)
  }, [number])

  const IndicatorHandler = (): any => {
    const Icons = Array.from({ length: pages.length }, (_, i) => i).map(i => {
      if (page === i) {
        return (
          <IconWrap key={`keys__${i}`}>
            <BannerStar width={10} height={10} />
          </IconWrap>
        )
      } else {
        return (
          <IndicatorRoundWrap key={`keys__${i}`}>
            <Indicator focused={i === page} />
          </IndicatorRoundWrap>
        )
      }
    })
    return Icons
  }

  return (
    <Container>
      <FlatList
        ref={_flatListRef}
        initialScrollIndex={page}
        onScrollToIndexFailed={info => {
          const wait = new Promise(resolve => setTimeout(resolve, 500))
          wait.then(() => {
            _flatListRef.current?.scrollToIndex({
              index: info.index,
              animated: true,
            })
          })
        }}
        contentContainerStyle={{
          paddingHorizontal: offset + gap / 2,
        }}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 100,
        }}
        data={pages}
        decelerationRate="fast"
        horizontal
        keyExtractor={item => `page__${item.id}`}
        onScroll={onScroll}
        pagingEnabled
        renderItem={({ item }: { item: { id: number; images: string } }) => (
          <TouchMoveLayout>
            <Page item={item} style={{ width: pageWidth }} />
          </TouchMoveLayout>
        )}
        // snapToInterval={pageWidth + gap}
        snapToAlignment="start"
        showsHorizontalScrollIndicator={false}
        bounces={false}
      />
      <IndicatorWrapper>{IndicatorHandler()}</IndicatorWrapper>
    </Container>
  )
}
const TouchMoveLayout = styled.View``

const Container = styled.View`
  position: relative;
  display: flex;
  width: 100%;
  height: 363px;
  justify-content: center;
  align-items: center;
`

const IndicatorRoundWrap = styled.View`
  margin: 0px 4px;
  width: 10px;
  height: 10px;
  justify-content: center;
  align-items: center;
`

const Indicator = styled.View<{ focused: boolean }>`
  background-color: ${({ theme }) => theme.color.white};
  opacity: ${({ focused }) => (focused ? '1' : '0.5')};
  width: 6px;
  height: 6px;
  border-radius: 3px;
`

const IndicatorWrapper = styled.View`
  position: absolute;
  /* top:0; */
  left: 0;
  right: 0;
  bottom: 15px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

const IconWrap = styled.View`
  margin: 0px 4px;
`
