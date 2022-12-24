import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'

// components
import MainBoard from './MainBoard'

// hooks
import { useAppContext } from '~/Hooks/useContextHook'
import { useQuery } from 'react-query'
import useFetch from '~/Hooks/useAxiosFetch'

export default function UserBoard({ navigation, route }): JSX.Element {
  const { userId, type } = route?.params

  // store
  const { setUserProfile } = useAppContext()

  // fetch
  const userData = useQuery(
    [`userprofile`, userId],
    () => useFetch({ url: `/user/${userId}`, method: 'get' }),
    { enabled: true }
  )

  const [isMe, setIsMe] = useState(false)

  const [userShortBoard, setUserShortBoard] = useState([])
  const [userNovelsBoard, setUserNovelsBoard] = useState([])

  useEffect(() => {
    if (!userData) return
    const userInfo = userData?.data

    if ([200, 201].includes(userInfo?.status)) {
      const { data } = userInfo?.data
      setUserProfile(data)
      setUserShortBoard(data?.shorts)
      setUserNovelsBoard(data?.novels)
      setIsMe(data?.isMe)
    }
  }, [userData])

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
