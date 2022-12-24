import React from 'react'
import styled from 'styled-components/native'

// components
import NoContent from '../Common/NoContent'

// types
type Props = {
  onRefresh: () => void
  first: string
  second?: string
}

export default function RefreshingScrollView({
  onRefresh,
  first,
  second = '',
}: Props): JSX.Element {
  return (
    <NoContentWrap
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={onRefresh} />
      }>
      <NoContent firstText={first} secondText={second} />
    </NoContentWrap>
  )
}

const NoContentWrap = styled.ScrollView``

const RefreshControl = styled.RefreshControl``
