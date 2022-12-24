import React, { useEffect } from 'react'
import styled from 'styled-components/native'

// icons
import LogoFull from '@Icons/LogoFull.svg'
import Notification from '@Icons/notification.svg'
import Search from '@Icons/search.svg'

// hooks
import { useAppContext } from '~/Hooks/useContextHook'

export default function MainHeader({ navigation, name }: any) {
  // reduce
  const { setHeaderName } = useAppContext()

  const naviHandler = (navi: string): void => {
    if (navi === 'Notification') {
      navigation.navigate('Bottom', { screen: 'Notification' })
    } else {
      navigation.navigate(navi)
    }
  }

  useEffect(() => {
    setHeaderName(name)
  }, [navigation, name])

  return (
    <GnbLayout>
      <BackButton onPress={() => naviHandler('Main')}>
        <LogoFull width={90} height={30} />
      </BackButton>
      <Iconwrap>
        <SearchIconButton onPress={() => naviHandler('Search')}>
          <Search width={24} height={24} />
        </SearchIconButton>
        <NotiIconButton onPress={() => naviHandler('Notification')}>
          <Notification width={24} height={24} />
        </NotiIconButton>
      </Iconwrap>
    </GnbLayout>
  )
}

const GnbLayout = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  z-index: 9999;
`

const BackButton = styled.TouchableOpacity``

const Text = styled.Text`
  color: ${({ theme }) => theme.color.white};
  font-size: ${({ theme }) => theme.fontSize.font16};
  margin-left: 8px;
`

const Iconwrap = styled.View`
  display: flex;
  flex-direction: row;
`

const SearchIconButton = styled.TouchableOpacity`
  padding: 0 8px;
`

const NotiIconButton = styled(SearchIconButton)`
  padding: 0;
`
