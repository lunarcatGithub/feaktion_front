import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'

// icons
import Star from '@Icons/star.svg'
import StarOn from '@Icons/starOn.svg'
import useMutationHook from '~/Hooks/useMutationHook'

type props = {
  type: string
  targetId: number | string
  count: number
  init: boolean | undefined
}

export default function usePickFetchHook({
  type,
  targetId,
  init,
  count,
}: props) {
  const [toggle, setToggle] = useState<boolean>(false)
  const [pickId, setPickId] = useState(0)
  const [toggleRest, setToggleRest] = useState<'post' | 'delete'>('delete')

  const postMutate = useMutationHook(toggleRest)

  const toggleHandler = () => {
    if (postMutate?.isLoading) return
    // let params;
    const params = toggle ? { pickId } : {}
    postMutate
      ?.mutateAsync({ url: `/feaktion/${targetId}/favorite`, params })
      .then(result => {
        const {
          data: { data },
          status,
        } = result
        if (![200, 201].includes(status)) return
        setPickId(data?.feaktion_id)
      })
  }

  useEffect(() => {
    if (init === undefined) return
    setToggle(init)
  }, [init])

  // useEffect(() => { // init like data handling
  //   if(!data) return;
  //   if(data?.episode_like?.length === 0) return;
  //   setPickId(data?.episode_like[0]?.like_id || 0);
  //   setToggle(true);
  // }, [data?.episode_like]);

  useEffect(() => {
    toggle ? setToggleRest('delete') : setToggleRest('post')
  }, [toggle])

  return []
}

const Button = styled.TouchableOpacity`
  display: flex;
`

const ButtonWrap = styled.View`
  flex-direction: column;
  align-items: center;
`

const ReactCount = styled.Text`
  color: ${({ theme }) => theme.color.gray1};
  font-size: 10px;
  padding-top: 2px;
`
