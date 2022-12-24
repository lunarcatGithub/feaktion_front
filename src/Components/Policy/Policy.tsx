import styled from 'styled-components/native'
import React from 'react'
import { Line100 } from '~/Symbols/Line100'

// components
import { Header } from '../Header/Header'

export default function Policy({ navigation, type }: any) {
  const contents = [
    {
      title: '픽션은 회원의 개인정보를 중요하게 생각합니다',
      subTitle: '',
      desc: '저희 픽션은 이용자의 개인정보보호를 매우 중요시하며, 이용자가 픽션과 관련 서비스를 이용함과 동시에 온라인상에서 픽션에 제공한 개인정보가 보호 받을 수 있도록 최선을 다하고 있습니다. 픽션은 정보통신 서비스제공자가 지켜야 하는 법규 및 개인정보보호에 관한 규정을 준수하고 있습니다.',
    },
  ]

  return (
    <Layout>
      <HeaderWrap>
        <Header
          navigation={navigation}
          route={{
            name: 'Policy',
            params: {
              title:
                type === 'PolicyPrivacy' ? '개인정보 처리방침' : '이용약관',
              type: 'Policy',
            },
          }}
          onPress={() => navigation.goBack()}
        />
      </HeaderWrap>
      <LayoutInner>
        <TitleWrap>
          <Title>
            {type === 'PolicyPrivacy'
              ? '픽션 개인정보 처리방침'
              : '픽션 이용약관'}
          </Title>
        </TitleWrap>
        <Line100 bottom={32} />
        {contents?.map(({ title, subTitle, desc }, index: number) => (
          <React.Fragment key={`keys__${index}`}>
            <TitleWrap>
              <Title>{title}</Title>
            </TitleWrap>
            {subTitle ? (
              <SubTitleWrap>
                <SubTitle>{subTitle}</SubTitle>
              </SubTitleWrap>
            ) : null}
            <DescTitleWrap>
              <DescTitle>{desc}</DescTitle>
            </DescTitleWrap>
            <Line100 top={20} bottom={20} />
          </React.Fragment>
        ))}
      </LayoutInner>
    </Layout>
  )
}

const Layout = styled.ScrollView`
  flex: 1;
  flex-direction: column;
  background: ${({ theme }) => theme.color.gray12};
`

const LayoutInner = styled.View`
  flex: 1;
  padding: 12px 16px;
`

// header
const HeaderWrap = styled.View`
  display: flex;
  width: 100%;
  height: 48px;
`

const TitleWrap = styled.View`
  padding: 12px 0;
`

const Title = styled.Text`
  font-size: ${({ theme }) => theme.fontSize.font16};
  font-family: ${({ theme }) => theme.font.ptdMedium};
  color: ${({ theme }) => theme.color.gray1};
`

const SubTitleWrap = styled.View``

const SubTitle = styled.Text`
  font-size: ${({ theme }) => theme.fontSize.font12};
  color: ${({ theme }) => theme.color.gray1};
`

const DescTitleWrap = styled.View`
  padding: 12px 0;
`

const DescTitle = styled(SubTitle)`
  line-height: 20px;
`
