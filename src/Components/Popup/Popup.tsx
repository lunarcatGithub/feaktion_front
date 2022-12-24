import React from 'react'
import styled from 'styled-components/native'

type modal = {
  onPress: (target: string, value: string) => void
  type: string
  modalType: string
}

export default function Popup({
  onPress,
  type,
  modalType,
}: modal): JSX.Element {
  const titleHandler = () => {
    if (type === 'SceneAdd') {
      return 'SCENE을 추가하시겠습니까?'
    } else if (type === 'preferenceRemove') {
      return '선호작품 목록에서 삭제하시겠습니까?'
    } else if (type === 'SceneRemove') {
      return 'SCENE을 삭제하시겠습니까?'
    } else if (type === 'Logout') {
      return '로그아웃 하시겠습니까?'
    } else if (type === 'Widthdrawal') {
      return '정말 탈퇴하시겠습니까?'
    } else if (type === '404error') {
      return '작품이 존재하지 않거나 삭제되었습니다'
    } else if (type === 'FictionRemove') {
      return '정말로 작품을 삭제하시겠습니까?'
    } else if (type === 'CommentRemove') {
      return '정말로 댓글을 삭제하시겠습니까?'
    } else if (type === 'EpisodeRemove') {
      return '정말로 에피소드를 삭제하시겠습니까?'
    } else if (type === 'NotFound') {
      return '삭제되거나 존재하지 않는 소설입니다'
    } else if (type === 'NoEpisode') {
      return '에피소드 제목을 입력해주세요'
    } else if (type === 'NoDesc') {
      return '내용은 총 100자 이상 입력해주세요'
    } else if (type === 'NoScene') {
      return 'Scene을 추가해주세요'
    } else if (type === 'ImageSize') {
      return '이미지는 총 100mb를 넘을 수 없습니다'
    } else if (type === 'ShortGoback') {
      return '작성했던 내용과 표지 전부 삭제됩니다. 정말 뒤로 가시겠습니까?'
    } else if (type === 'Goback') {
      return '작성했던 내용이 삭제됩니다. 정말 뒤로 가시겠습니까?'
    } else if (type === 'CommentPatchCancel') {
      return '댓글 수정을 취소하시겠습니까?'
    } else if (type === 'NoticeRemove') {
      return '정말로 공지를 삭제하시겠습니까?'
    } else if (type === 'Genre') {
      return '선호 장르 3개 이상 선택해야합니다'
    }
  }

  return (
    <Layout>
      <TitleWrap>
        <TitleText>{titleHandler()}</TitleText>
      </TitleWrap>
      <ButtonWrap>
        {![
          '404error',
          'NoEpsode',
          'NoDesc',
          'NoScene',
          'ImageSize',
          'Genre',
        ].includes(type) ? (
          <Button onPress={() => onPress(type, 'cancel')}>
            <ButtonText type="cancel">취소</ButtonText>
          </Button>
        ) : (
          <Dummy />
        )}
        <Button onPress={() => onPress(type, 'confirm')}>
          <ButtonText type="confirm">확인</ButtonText>
        </Button>
      </ButtonWrap>
    </Layout>
  )
}

const Layout = styled.View`
  flex-direction: column;
  width: 100%;
  max-width: 100%;
  /* padding:10px 80px; */
  z-index: 99999;
  background: ${({ theme }) => theme.color.gray4};
`

const TitleWrap = styled.View`
  justify-content: center;
  align-items: center;
  padding: 32px 0;
`

const ButtonWrap = styled.View`
  width: 100%;
  justify-content: space-around;
  flex-direction: row;
`

const Button = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  padding: 24px 0px;
`

const Dummy = styled.View`
  padding: 24px 70px;
`

// text

const TitleText = styled.Text`
  color: ${({ theme }) => theme.color.gray1};
  font-size: ${({ theme }) => theme.fontSize.font14};
  padding: 0 32px;
`

const ButtonText = styled(TitleText)<{ type: string }>`
  color: ${({ theme, type }) =>
    type === 'cancel' ? theme.color.gray1 : theme.color.purple4};
  font-size: ${({ theme }) => theme.fontSize.font14};
  font-family: ${({ theme }) => theme.font.notoMedium};
`
