import React from 'react'
import { LayoutChangeEvent } from 'react-native'
import styled from 'styled-components/native'

// components
import SmallDropdown from './SmallDropdown'
import BigDropdown from './BigDropdown'

type props = {
  data?: { index: number; desc: string; value: string }[]
  visible: boolean
  onPress: (type: string, index?: number) => void
  onClose: () => void
  position: number
  type?: string
  modalType?: string
  navigation?: any
  layout?: (e: LayoutChangeEvent) => void
}
export default function Dropdown({
  data,
  visible,
  onClose,
  onPress,
  position,
  type,
  modalType,
  layout,
}: props): JSX.Element {
  const diviedDeopdown = () => {
    if (type === 'bigDropdown') {
      return (
        <BigDropdown
          data={data}
          onPress={onPress}
          type={type}
          modalType={modalType}
        />
      )
    } else {
      return (
        <SmallDropdown
          data={data}
          onPress={onPress}
          modalType={modalType}
          type={type}
        />
      )
    }
  }

  return (
    <>
      {visible ? (
        <>
          <ModalLayout onPress={onClose} />
          {type === 'bigDropdown' ? (
            <Layout onLayout={layout} position={position} modalType={modalType}>
              {diviedDeopdown()}
            </Layout>
          ) : (
            <SmallLayout position={position} type={type}>
              {diviedDeopdown()}
            </SmallLayout>
          )}
        </>
      ) : null}
    </>
  )
}

const ModalLayout = styled.TouchableOpacity`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  flex: 1;
  z-index: 99999;
`

const Layout = styled.ScrollView<{
  position: number
  modalType: string | undefined
}>`
  position: absolute;
  z-index: 99999;
  width: 100%;
  background: ${({ theme }) => theme.color.gray10};
  max-height: 240px;

  ${({ modalType, position, theme }) => {
    console.log(modalType)
    if (modalType === 'view') {
      return `
  bottom:${position}px;
  `
    } else {
      return `
    top:${position}px;
    `
    }
  }}
`

const SmallLayout = styled.View<{ position: number; type: string | undefined }>`
  position: absolute;
  z-index: 9999999999;
  ${({ type, position, theme }) => {
    if (type === 'smallDropdownPan') {
      return `
    flex-direction:row;
    justify-content:flex-start;
    width:138px;
    padding:0px 8px;
    top:${position}px;
    right:18px;
    background:${theme.color.gray6};
    `
    } else {
      return `
    right:8px;
    top:${position}px;
    background:${theme.color.gray6};
    `
    }
  }}
`
