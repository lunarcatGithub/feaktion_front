import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'

// icons
import NotificationOn from '@Icons/notificationOn.svg'
import Notification from '@Icons/notification.svg'

type props = {
  type: string
  targetId: number | string
  initNoti: boolean | undefined
}
export default function NotiPreferenceFetch({
  type,
  targetId,
  initNoti,
}: props): JSX.Element {
  const [notiToggle, setNotiToggle] = useState<boolean>(false)

  const notiHandler = () => {
    console.log('성공')
  }

  useEffect(() => {
    if (initNoti === undefined) return
    setNotiToggle(initNoti)
  }, [initNoti])

  return (
    <Button onPress={notiHandler}>
      {notiToggle ? (
        <NotificationOn width={20} height={20} />
      ) : (
        <Notification width={20} height={20} />
      )}
    </Button>
  )
}

const Button = styled.TouchableOpacity`
  display: flex;
  width: 20px;
  height: 20px;
`
