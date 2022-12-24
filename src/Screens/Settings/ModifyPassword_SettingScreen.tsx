import React from 'react'
import styled from 'styled-components/native'

// components
import ModifyPasswordSetting from '~/Components/Settings/ModifyPasswordSetting'

export default function ModifyPasswordSettingScreen({ navigation }: any) {
  return <ModifyPasswordSetting navigation={navigation} />
}

const Layout = styled.View`
  flex: 1;
  background: ${({ theme }) => theme.color.gray12};
  flex-direction: column;
`
