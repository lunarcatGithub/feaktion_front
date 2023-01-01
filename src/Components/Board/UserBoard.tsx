import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'

// components
import MainBoard from './MainBoard'

// hooks
import { useAppContext } from '~/Hooks/useContextHook'
import { useQuery } from 'react-query'
import useFetch from '~/Hooks/useAxiosFetch'
import { getUserAgent } from '~/Agent/UserAgent'

export default function UserBoard({ navigation, route }: any): JSX.Element {
  const { userId, type } = route?.params
  // store
  const { setUserProfile } = useAppContext()

  // fetch
  const userGetData = getUserAgent({
    key: ['userProfile'],
    url: `/user/${userId}`,
    option: { retry: false },
  })
  console.log('userGetData ==> ', userGetData)
  const [isMe, setIsMe] = useState(false)

  const [userShortBoard, setUserShortBoard] = useState([])
  const [userNovelsBoard, setUserNovelsBoard] = useState([])

  useEffect(() => {
    if (!userGetData) return
    // const userInfo = userGetData?.data

    // if ([200, 201].includes(userInfo?.status)) {
    //   const { data } = userInfo?.data
    //   setUserProfile(data)
    //   setUserShortBoard(data?.shorts)
    //   setUserNovelsBoard(data?.novels)
    //   setIsMe(data?.isMe)
    // }
  }, [])

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
