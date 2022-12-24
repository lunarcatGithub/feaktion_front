import React from 'react'
import styled from 'styled-components/native'

type modal = {
  onPress: (type: string, value: string) => void
  type: string
  modalType: string
  data:
    | {
        index: number
        value: string
        desc: string
      }[]
    | null
}

type listType = {
  index: number
  desc: string
  value: string
}[]

export default function ToastPopup({
  data,
  onPress,
  type,
  modalType,
}: modal): JSX.Element {
  // const [title, setTitle] = useState([{}]);

  return (
    <Layout>
      <ButtonWrap>
        {data?.map(({ index, desc, value }) => (
          <Button
            onPress={() => onPress(modalType, value)}
            key={`key__${index}`}>
            <ButtonText>{desc}</ButtonText>
          </Button>
        ))}
      </ButtonWrap>
    </Layout>
  )
}

const Layout = styled.View`
  width: 100%;
  background: ${({ theme }) => theme.color.gray6};
  border-radius: 16px 16px 0 0;
  z-index: 99999;
`

const ButtonWrap = styled.View`
  flex-direction: column;
  padding: 24px 0;
`

const Button = styled.TouchableOpacity`
  width: 100%;
  justify-content: center;
  align-items: center;
  padding: 14px 0;
`

// text

const TitleText = styled.Text`
  color: ${({ theme }) => theme.color.gray1};
  font-size: ${({ theme }) => theme.fontSize.font14};
`

const ButtonText = styled(TitleText)`
  color: ${({ theme }) => theme.color.gray1};
  font-size: ${({ theme }) => theme.fontSize.font14};
  font-family: ${({ theme }) => theme.font.notoMedium};
`
