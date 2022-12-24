import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import { QueryKey, useQueryClient } from 'react-query'

// store
import { Header } from '../Header/Header'

// components
import CustomTabButton from '../CustomTabButton'

// hooks
import useAsyncStorage from '~/Hooks/useAsyncStorage'
import ModalPopup from '../Popup/Modal'
import { useAppContext, useAuthContext } from '~/Hooks/useContextHook'

export default function MainSetting({ navigation, route }: any): JSX.Element {
  // reducer
  const { setUserToken } = useAuthContext()
  const { genreMaleArr, genreFemaleArr, setThirdPickGenre } = useAppContext()

  // hooks
  const [asyncHandler, _result] = useAsyncStorage()

  // popup
  const [isPopup, setIsPopup] = useState(false)

  // route
  const [currentRoute] = useState(route?.params)

  // general
  const [viewToggle, setViewToggle] = useState(false)

  // fetch
  const queryClient = useQueryClient()
  const [cacheData, setCacheData] = useState<
    { id: number; interest: string }[]
  >([])

  const modalHanddler = (modalType: string, select: string): void => {
    if (select === 'confirm') {
      asyncHandler('SET', 'token', JSON.stringify(false))
      setUserToken(false)
    }

    setIsPopup(false)
  }

  const genreMoveHandler = () => {
    navigation.navigate('SideStack', {
      screen: 'GenreSelect',
      params: { navi: 'Setting' },
    })
  }

  useEffect(() => {
    // 기존 유저가 설정한 장르 데이터를 프로필 get
    if (!queryClient) return
    const cache: [QueryKey, { data: { data: { user_interest: [] } } }][] =
      queryClient?.getQueriesData(['myProfile'])
    const isData: boolean = Object.keys(cache).length === 0
    setCacheData(isData ? [] : cache[0][1]?.data?.data?.user_interest)
  }, [])

  useEffect(() => {
    // cache data(server)형식을 프론트의 데이터로 가공
    if (!cacheData) return
    const filtering = cacheData?.map(({ id, interest }) => ({ id, interest }))
    const genrePick = [...genreMaleArr, ...genreFemaleArr]
      .map(({ value, title }) => {
        let test
        for (let key = 0; key < filtering?.length; key++) {
          if (value === filtering[key]?.interest) {
            test = { id: filtering[key].id, value, title }
          }
        }
        return test
      })
      .filter(data => data)
    setThirdPickGenre(genrePick)
  }, [cacheData])

  const tabButtonArr = [
    {
      index: 0,
      title: '계정',
      buttonList: [
        {
          _index: 0,
          _title: '계정연동',
          _type: 'Arrow',
          method: () => navigation.navigate('LinkAccountsSetting'),
        },
        {
          _index: 1,
          _title: '비밀번호 수정',
          _type: 'Arrow',
          method: () => navigation.navigate('ModifyPasswordSetting'),
        },
      ],
    },
    {
      index: 1,
      title: '앱설정',
      buttonList: [
        {
          _index: 0,
          _title: '선호 장르 설정',
          _type: 'Arrow',
          method: () => genreMoveHandler(),
        },
        {
          _index: 1,
          _title: '알림설정',
          _type: 'Arrow',
          method: () => navigation.navigate('NotificationSetting'),
        },
        {
          _index: 2,
          _title: '뷰어 설정 동기화',
          _type: 'Toggle',
          method: () => setViewToggle(!viewToggle),
          toggle: viewToggle,
        },
      ],
    },
    {
      index: 2,
      title: '이용약관',
      buttonList: [
        {
          _index: 0,
          _title: '픽션 서비스 방침',
          _type: 'Arrow',
          method: () => null,
        },
      ],
    },
    {
      index: 3,
      title: '정보',
      buttonList: [
        { _index: 0, _title: '버전 0.70.0', _type: '', method: () => null },
        { _index: 1, _title: '운영노트', _type: 'Arrow', method: () => null },
      ],
    },
    {
      index: 4,
      title: '로그인',
      buttonList: [
        {
          _index: 0,
          _title: '로그아웃',
          _type: '',
          method: () => setIsPopup(true),
        },
      ],
    },
  ]

  return (
    <>
      <Layout>
        <HeaderWrap>
          <Header
            navigation={navigation}
            route={{ name: 'Setting', params: { title: '설정' } }}
            onPress={() => navigation.goBack()}
          />
        </HeaderWrap>

        <LayoutInner>
          {tabButtonArr?.map(({ index, title, buttonList }) => (
            <ButtonBoxLayout key={index}>
              <ButtonBoxTitle>{title}</ButtonBoxTitle>
              {buttonList?.map(({ _index, _title, _type, method, toggle }) => (
                <TabWrap key={`key__${_index}`}>
                  <CustomTabButton
                    key={_index}
                    type={_type}
                    onPress={method}
                    title={_title}
                    toggle={toggle}
                  />
                </TabWrap>
              ))}
            </ButtonBoxLayout>
          ))}
        </LayoutInner>
      </Layout>
      <ModalPopup
        data={null}
        visible={isPopup}
        onClose={() => setIsPopup(false)}
        onPress={modalHanddler}
        type="Logout"
        modalType="Popup"
      />
    </>
  )
}
// header
const HeaderWrap = styled.View`
  display: flex;
  width: 100%;
  height: 48px;
`

const Layout = styled.View`
  flex: 1;
  background: ${({ theme }) => theme.color.gray12};
`

const LayoutInner = styled.ScrollView`
  flex: 1;
`

const ButtonBoxLayout = styled.View`
  margin-bottom: 32px;
  flex-direction: column;
`

const ButtonBoxTitle = styled.Text`
  padding: 4px 16px;
  color: ${({ theme }) => theme.color.gray3};
  font-size: ${({ theme }) => theme.fontSize.font12};
`

const TabWrap = styled.View`
  padding: 0 16px;
`
