import React from 'react'
import styled from 'styled-components/native'

// components
import VerticalScroll from '../VerticalScroll/VerticalScroll'

// type
type props = {
  VerticalItems: []
  noTitle: () => string
  navi: string
  naviPress: (props: { id: number; navi: string }) => void
}
export default function ContentToScrollConnetion({
  VerticalItems = [],
  noTitle = () => '',
  navi = '',
  naviPress,
}: props): JSX.Element {
  return (
    <>
      {VerticalItems.length === 0 ? (
        <NoConetentWrap>
          <Text>{noTitle()}</Text>
        </NoConetentWrap>
      ) : (
        <VerticalLayout>
          <VerticalScroll
            navi={navi}
            type="Search"
            items={VerticalItems}
            naviPress={naviPress}
            buttonPress={() => {}}
            reFresh={() => {}}
          />
        </VerticalLayout>
      )}
    </>
  )
}

const NoConetentWrap = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding-top: 160px;
`

const Text = styled.Text`
  color: ${({ theme }) => theme.color.gray3};
  font-size: ${({ theme }) => theme.fontSize.font14};
  line-height: 20px;
`

const VerticalLayout = styled.View`
  display: flex;
  flex: 1;
`
