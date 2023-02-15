import React from 'react'
import styled from 'styled-components/native'

// hooks
import { useViewerContext } from '~/Hooks/useContextHook'

// icons
import BigHeart from '@Icons/bigUnHeart.svg'
import BigHeartOn from '@Icons/heartOn.svg'
import useToggleFetchHook from '~/Hooks/useToggleFetchHook'
import { viewDataType } from '~/Store/ViewStore'

export default function ViewReact({
    data,
}: {
    data: viewDataType
}): JSX.Element {
    const [like, likeBtnHandler] = useToggleFetchHook({
        type: 'like',
        initid: data?.episode_like[0]?.like_id || null,
    })

    //store
    const { episodePostId, fictionPostId } = useViewerContext()

    return (
        <Layout>
            <Wrap>
                <Title>이 작품은 어떠셨나요?</Title>
            </Wrap>
            <ButtonWrap>
                <LikeButton
                    onPress={() => {
                        if (!episodePostId) return
                        likeBtnHandler(fictionPostId, episodePostId)
                    }}>
                    <LikeButtonWrap>
                        {like ? (
                            <BigHeartOn width={38} height={38} />
                        ) : (
                            <BigHeart width={38} height={38} />
                        )}
                    </LikeButtonWrap>
                </LikeButton>
            </ButtonWrap>
            <UserWrap>
                <UserProfileWrap>
                    <UserProfile source={{ uri: undefined }} />
                </UserProfileWrap>
                <UserContentsWrap>
                    <Title>{data?.feaktion_user?.nickname}</Title>
                    <TextWrap>
                        <Desc>
                            {data?.writer_comment
                                ? data?.writer_comment
                                : '...'}
                        </Desc>
                    </TextWrap>
                </UserContentsWrap>
            </UserWrap>
        </Layout>
    )
}

const Layout = styled.View`
    width: 100%;
    height: 100%;
    flex-direction: column;
    padding: 180px 16px;
    z-index: 9999999;
`

const Wrap = styled.View`
    width: 100%;
    align-items: center;
`

const ButtonWrap = styled(Wrap)`
    margin-top: 16px;
`

const Title = styled.Text`
    color: ${({ theme }) => theme.color.gray3};
    font-size: ${({ theme }) => theme.fontSize.font14};
    font-family: ${({ theme }) => theme.font.notoMedium};
    line-height: 18px;
`

const Desc = styled.Text`
    color: ${({ theme }) => theme.color.gray3};
    font-size: ${({ theme }) => theme.fontSize.font12};
`

const LikeButton = styled.TouchableOpacity`
    width: 56px;
    height: 56px;
    border-radius: 50px;
    align-items: center;
    justify-content: center;
    background: ${({ theme }) => theme.color.gray4};
`

const LikeButtonWrap = styled.View`
    margin-top: 4px;
`

// writer wrap
const UserWrap = styled.View`
    flex-direction: row;
    margin-top: 160px;
    flex: 1;
`

const UserContentsWrap = styled.View`
    flex-direction: column;
    margin-left: 12px;
    flex: 1;
`

const UserProfileWrap = styled.View`
    width: 38px;
    height: 38px;
    border-radius: 50px;
    overflow: hidden;
`

const UserProfile = styled.Image`
    width: 100%;
    height: 100%;
    background: #777;
`

const TextWrap = styled.View`
    flex: 1;
`
