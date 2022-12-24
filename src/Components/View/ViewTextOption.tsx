import React, { useState, useCallback, useEffect, memo, RefObject } from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'
import SystemSetting from 'react-native-system-setting'
import theme from '~/Styles/Theme'

// icons
import TextFont from '@Icons/textsetting.svg'
import TextSize from '@Icons/textSize.svg'
import SpaceLine from '@Icons/spaceLines.svg'
import SpacePragraph from '@Icons/spacePragraph.svg'
import PragraphWidth from '@Icons/pragraphWidth.svg'
import Plus from '@Icons/uploadPlus.svg'
import Bright from '@Icons/brightness.svg'

// utils
import ScrollBar from '~/Utils/ScrollBar'

// store
// hooks
import { useViewerContext } from '~/Hooks/useContextHook'
import useAsyncStorage from '~/Hooks/useAsyncStorage'

type props = {
  onClose: () => void
}

type optType = {
  bright: number
  font: string
  textsize: number
  spaceline: number
  spacepragraph: number
  pragraphwidth: number
  backcolor: string
}

function ViewTextOption({ onClose }: props) {
  const [currentBright, setCurrentBright] = useState<number>(0.5)
  const [optData, setOptData] = useState<optType | null>()

  // store
  const { adjustViewText, setAdjustViewText } = useViewerContext()

  // hooks
  const [asyncHandler, _result] = useAsyncStorage()

  const InitOpt = [
    { index: 0, value: 'initial', title: '초기화' },
    { index: 1, value: 'Synchronize', title: '설정 동기화' },
  ]

  const backgroundColorOpt = [
    { index: 0, value: 'white', color: '#E0E0E0' },
    { index: 1, value: 'black', color: '#121212' },
    { index: 2, value: 'green', color: '#284648' },
    { index: 3, value: 'dark', color: '#000000' },
    { index: 4, value: 'gray', color: '#414141' },
  ]

  const fontOpt = [
    { index: 0, title: '시스템 글꼴', type: 'system' },
    { index: 1, title: '로보토', type: 'roboto' },
    { index: 2, title: '세리프', type: 'serif' },
  ]

  const { backcolor, font } = adjustViewText

  const optList = [
    {
      index: 0,
      value: 'bright',
      icon: <Bright width={24} height={24} />,
      title: '',
      limit: 0,
      currentValue: optData?.bright,
      realValue: optData?.bright,
    },
    {
      index: 1,
      value: 'font',
      icon: <TextFont width={24} height={24} />,
      title: '글꼴',
      currentValue: optData?.font,
      realValue: optData?.font,
    },
    {
      index: 2,
      value: 'textsize',
      icon: <TextSize width={24} height={24} />,
      title: '글자 크기',
      limit: 18,
      least: 10,
      currentValue: optData?.textsize,
      realValue: optData?.textsize,
    },
    {
      index: 3,
      value: 'spaceline',
      icon: <SpaceLine width={24} height={24} />,
      title: '줄 간격',
      limit: 8,
      least: 1,
      currentValue: optData?.spaceline,
      realValue: optData ? optData?.spaceline / 4 : 0,
    },
    {
      index: 4,
      value: 'spacepragraph',
      icon: <SpacePragraph width={24} height={24} />,
      title: '문단 간격',
      limit: 5,
      least: 1,
      currentValue: optData?.spacepragraph,
      realValue: optData?.spacepragraph,
    },
    {
      index: 5,
      value: 'pragraphwidth',
      icon: <PragraphWidth width={24} height={24} />,
      title: '문단 너비',
      limit: 8,
      least: 1,
      currentValue: optData?.pragraphwidth,
      realValue: optData ? optData?.pragraphwidth / 4 : 0,
    },
  ]

  const valueUpdate = useCallback(
    (type, limit?, currentValue?, value?, realValue?, least?) => {
      let setValue

      if (type === 'plus' && limit <= realValue) return
      if (type === 'minus' && least >= realValue) return
      if (['minus', 'plus']?.includes(type)) {
        const minus = ['pragraphwidth', 'spaceline']?.includes(value)
          ? type === 'minus'
            ? currentValue - 4
            : currentValue + 4
          : type === 'minus'
          ? currentValue - 1
          : currentValue + 1

        setValue = { ...adjustViewText, [value]: minus }
      } else if (type === 'init') {
        setValue = {
          ...adjustViewText,
          backcolor: 'image',
          bright: currentBright,
          font: 'system',
          textsize: 14,
          spaceline: 24,
          spacepragraph: 1,
          pragraphwidth: 16,
        }
      } else {
        SystemSetting.setAppBrightness(currentValue)
        setCurrentBright(currentValue)
        setValue = { ...adjustViewText, [value]: currentValue }
      }

      setAdjustViewText(setValue)

      asyncHandler('SET', 'textOpt', JSON.stringify(setValue))
      setOptData(setValue)
    },
    [adjustViewText, optData]
  )

  const buttonSaveHandler = (type: string, value: string) => {
    const modifiedValue = { ...adjustViewText, [type]: value }

    asyncHandler('SET', 'textOpt', JSON.stringify(modifiedValue))
    setAdjustViewText(modifiedValue)
  }

  useEffect(() => {
    if (_result) {
      const storageText = JSON.parse(JSON.parse(_result?.result))
      setOptData(storageText)
    } else {
      setOptData(adjustViewText)
    }
  }, [_result])

  useEffect(() => {
    asyncHandler('GET', 'textOpt')
  }, [])

  const buttonHandler = (
    type: string,
    limit?: number,
    currentValue?: number | string,
    realValue?: number | string,
    least?: number
  ) => {
    // press button handle
    if (type === 'font') {
      return (
        <Wrap>
          {fontOpt?.map(({ index, title, type }) => (
            <PureButton
              key={index}
              onPress={() => {
                setAdjustViewText({ ...adjustViewText, font: type })
              }}>
              <CustomFont styling={type} focus={font === type}>
                {title}
              </CustomFont>
            </PureButton>
          ))}
        </Wrap>
      )
    } else if (type === 'bright') {
      if (typeof currentValue === 'string') return
      return (
        <SliderWrap>
          <ScrollBar
            value={currentValue || 0.5}
            onValueChange={value => valueUpdate(type, limit, value, type)}
            minimumValue={0.1}
            maximumValue={1}
            step={0.1}
          />
        </SliderWrap>
      )
    } else {
      return (
        <>
          <Wrap>
            <CurrentText styling={limit === realValue}>{realValue}</CurrentText>
            <TitleText>/{limit}</TitleText>
          </Wrap>
          <Wrap>
            <AdjustButton
              styling={'left'}
              onPress={() =>
                valueUpdate(
                  'minus',
                  limit,
                  currentValue,
                  type,
                  realValue,
                  least
                )
              }>
              <Minus />
            </AdjustButton>
            <AdjustButton
              styling={'right'}
              onPress={() =>
                valueUpdate('plus', limit, currentValue, type, realValue, least)
              }>
              <Plus width={16} height={16} />
            </AdjustButton>
          </Wrap>
        </>
      )
    }
  }

  return (
    <Layout>
      <Button onPress={onClose} />
      <OptLayout>
        <InitWrap>
          {InitOpt?.map(({ index, title, value }) => (
            <PureButton key={index} onPress={() => valueUpdate('init')}>
              <ButtonText>{title}</ButtonText>
            </PureButton>
          ))}
        </InitWrap>
        <OptLayoutInner>
          <ContentsWrap>
            {backgroundColorOpt?.map(({ index, color, value }) => (
              <ColorButton
                onPress={() => buttonSaveHandler('backcolor', color)}
                key={index}>
                <ColorView color={color} focus={color === backcolor} />
              </ColorButton>
            ))}
          </ContentsWrap>
          <Wrap>
            <SelectImageButton
              onPress={() => buttonSaveHandler('backcolor', 'image')}
              focus={'image' === backcolor}>
              <ImageBtnText focus={'image' === backcolor}>이미지</ImageBtnText>
            </SelectImageButton>
          </Wrap>
        </OptLayoutInner>
        {optList?.map(
          ({
            index,
            value,
            icon,
            title,
            limit,
            currentValue,
            realValue,
            least,
          }) => (
            <OptLayoutInner key={index} styling={value}>
              <ContentsWrap>
                <IconWrap>{icon}</IconWrap>
                {title ? <TitleText>{title}</TitleText> : null}
              </ContentsWrap>
              <ContentsWrap>
                {buttonHandler(value, limit, currentValue, realValue, least)}
              </ContentsWrap>
            </OptLayoutInner>
          )
        )}
      </OptLayout>
    </Layout>
  )
}
// slider
const SliderWrap = styled.View`
  width: 95%;
`

// layout
const Layout = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.65);
  flex: 1;
  justify-content: flex-end;
  z-index: 9999;
`

const IconWrap = styled.View`
  margin-right: 16px;
  opacity: 0.65;
`

const Button = styled.TouchableOpacity`
  flex: 1;
`

const PureButton = styled.TouchableOpacity`
  margin-left: 14px;
`

const OptLayout = styled.View`
  background: ${({ theme }) => theme.color.gray12};
  width: 100%;
`

const OptLayoutInner = styled.View<{ styling?: string }>`
  flex-direction: row;
  width: 100%;
  height: 48px;
  padding: 0 16px;
  ${({ styling }) =>
    styling === 'textSize' || styling === 'bright'
      ? `margin-bottom:4px`
      : null};
  align-items: center;
  justify-content: space-between;
  background: ${({ theme }) => theme.color.gray10};
`

const ContentsWrap = styled.View`
  flex-direction: row;
  align-items: center;
`

const Wrap = styled.View`
  flex-direction: row;
  margin-left: 12px;
`

const TitleText = styled.Text`
  color: ${({ theme }) => theme.color.gray3};
  font-size: ${({ theme }) => theme.fontSize.font12};
  letter-spacing: 0.5px;
`

const ButtonText = styled(TitleText)`
  color: ${({ theme }) => theme.color.gray3};
  letter-spacing: -0.25px;
`

const CurrentText = styled.Text<{ styling: boolean }>`
  color: ${({ theme, styling }) =>
    styling ? theme.color.gray3 : theme.color.gray1};
  font-size: ${({ theme }) => theme.fontSize.font12};
  letter-spacing: 1px;
`

const AdjustButton = styled.TouchableOpacity<{ styling: string }>`
  width: 36px;
  height: 24px;
  border-radius: ${({ styling }) =>
    styling === 'left' ? `25px 0 0 25px` : `0 25px 25px 0`};
  margin-right: ${({ styling }) => styling === 'left' && `-1px`};
  border: 1px solid ${({ theme }) => theme.color.gray4};
  align-items: center;
  justify-content: center;
`

const Minus = styled.View`
  width: 10px;
  height: 1px;
  background: ${({ theme }) => theme.color.gray1};
`

const CustomFont = styled.Text<{ styling: string; focus: boolean }>`
  font-size: ${({ theme }) => theme.fontSize.font12};
  color: ${({ theme, focus }) =>
    focus ? theme.color.purple4 : theme.color.gray3};

  ${({ theme, styling }) => {
    if (styling === 'system') {
      return null
    } else if (styling === 'roboto') {
      return `font-family:${theme.font.robotoRegular}`
    } else if (styling === 'serif') {
      return `font-family:${theme.font.notoRegular}`
    }
  }}
`

const ColorButton = styled.TouchableOpacity`
  margin-right: 8px;
`

const ColorView = styled.View<{ color: string; focus: boolean }>`
  width: 24px;
  height: 24px;
  background: ${({ color }) => color};
  border-radius: 50px;
  border: ${({ focus }) => focus && `1px solid ${theme.color.purple4}`};
`

const SelectImageButton = styled.TouchableOpacity<{ focus: boolean }>`
  width: 54px;
  height: 24px;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  background: ${({ theme, focus }) => focus && theme.color.purple4};
  border: ${({ theme, focus }) => !focus && `1px solid ${theme.color.purple4}`};
`

const ImageBtnText = styled.Text<{ focus: boolean }>`
  color: ${({ theme, focus }) =>
    !focus ? theme.color.purple4 : theme.color.gray6};
  font-size: ${({ theme }) => theme.fontSize.font10};
  font-family: ${({ theme }) => theme.font.notoMedium};
  line-height: 14px;
`

// 초기화

const InitWrap = styled.View`
  flex-direction: row;
  width: 100%;
  height: 36px;
  padding: 0 16px;
  margin-bottom: 4px;
  align-items: center;
  justify-content: flex-end;
  background: ${({ theme }) => theme.color.gray10};
`

export default memo(ViewTextOption)
