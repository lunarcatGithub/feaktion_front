import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'

// components
import MainBoard from './MainBoard'

// hooks
import { useAppContext } from '~/Hooks/useContextHook'
import { getUserAgent } from '~/Agent/UserAgent'

export default function UserBoard({ navigation, route }: any): JSX.Element {
  const { userId } = route?.params

  // store
  const { setUserProfile } = useAppContext()

  // fetch
  const userGetData = getUserAgent({
    key: ['userProfile', userId],
    url: `/user/${userId}`,
    option: { retry: true },
  })

  const [isMe, setIsMe] = useState(false)

  const [userShortBoard, setUserShortBoard] = useState([])
  const [userNovelsBoard, setUserNovelsBoard] = useState([])

  useEffect(() => {
    if (!userGetData) return
    const userInfo = userGetData?.data
    setUserProfile(userInfo)
    setUserShortBoard(userInfo?.shorts)
    setUserNovelsBoard(userInfo?.novels)
    setIsMe(userInfo?.isMe)
  }, [userGetData?.data])

  return (
    <Layout>
      <MainBoard
        items={[userNovelsBoard?.slice(0, 4), userShortBoard?.slice(0, 4)]}
        type="UserBoard"
        isMe={isMe}
        navigation={navigation}
      />
    </Layout>
  )
}

const Layout = styled.View`
  flex: 1;
  background: ${({ theme }) => theme.color.gray12};
  flex-direction: column;
`
