import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react'
import styled from 'styled-components/native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { NativeSyntheticEvent, TextInput } from 'react-native'

// store
import theme from '~/Styles/Theme'
import { useUploadContext } from '~/Hooks/useContextHook'

type props = {
  mergeText: string[] | string
  previewText?: string | []
  lastTextInputHandler: (type: 'board' | 'title', text: string) => void
  setSelection: Dispatch<
    SetStateAction<{ start: number; end: number } | undefined>
  >
  currentRoute: string
}

type OnSelection = {
  start: number
  end: number
}

export default function TextBoard({
  lastTextInputHandler,
  mergeText,
  setSelection,
  currentRoute,
}: props): JSX.Element {
  const scroll = useRef(null)
  const textRef = useRef<React.RefObject<TextInput>>(null)
  console.log('currentRoute', currentRoute)
  // store
  const { fictionData, currentScene, bodyInputDetect, setBodyInputDetect } =
    useUploadContext()

  const [localText, setlocalText] = useState('')

  // data
  const [currentEpisodeData, setCurrentEpisodeData] = useState<{
    title: string
    index: number
  }>()
  const [multilineSize, setMultilineSize] = useState(0)

  // const _scrollToInput = (reactNode:number):void => {
  //   scroll?.props?.scrollToFocusedInput(reactNode)
  // };

  const onSelectionChange = (e: NativeSyntheticEvent<any>): void => {
    const { start, end }: OnSelection = e?.nativeEvent?.selection

    setSelection({ start, end })
  }

  const bodyTextHandler = () => {
    // _scrollToInput(ReactNative.findNodeHandle(e?.target));
    setBodyInputDetect(true)
  }

  const bodyTextNothing = () =>
    mergeText?.length <= 1 && setBodyInputDetect(false)

  const inputValueCtrl = (): string[] | string => {
    return mergeText
  }
  const updateSize = (size: number) => {
    setMultilineSize(size)
  }

  useEffect(() => {
    if (!fictionData) return
    setCurrentEpisodeData(fictionData?.scene[currentScene - 1])
  }, [fictionData, currentScene])

  return (
    <KeyboardAwareScrollView>
      <InputTitleLayout>
        {currentRoute !== 'SHORT' ? (
          <EditorTitleInput
            placeholder="에피소드 제목을 입력해주세요"
            numberOfLines={2}
            maxLength={60}
            onContentSizeChange={e =>
              updateSize(e.nativeEvent.contentSize.height)
            }
            placeholderTextColor={theme.color.gray3}
            onChangeText={title => {
              lastTextInputHandler('title', title)
              setlocalText(title)
            }}
            multiline
            heightSize={multilineSize}
            value={localText || fictionData?.episodeTitle}
          />
        ) : null}
      </InputTitleLayout>
      {currentEpisodeData?.index ? (
        <>
          <InputLayout>
            <Text>{currentEpisodeData?.title}</Text>
          </InputLayout>
          <>
            <BodyEditorText
              ref={textRef.current}
              onFocus={bodyTextHandler}
              onBlur={bodyTextNothing}
              placeholder={bodyInputDetect ? '' : '내용을 입력해 주세요'}
              placeholderTextColor={theme.color.gray3}
              onChangeText={text => lastTextInputHandler('board', text)}
              _position={bodyInputDetect}
              onSelectionChange={onSelectionChange}
              selection={undefined}
              multiline>
              {inputValueCtrl()}
            </BodyEditorText>
          </>
        </>
      ) : (
        <InputLayout>
          <Text>Scene을 추가해 주세요</Text>
        </InputLayout>
      )}
    </KeyboardAwareScrollView>
  )
}
// const Flex = styled.View`flex:1`;

const InputTitleLayout = styled.View`
  align-items: center;
  width: 100%;
  margin-top: 72px;
`

const InputLayout = styled.View`
  align-items: center;
  width: 100%;
  padding: 16px 0;
`

const EditorTitleInput = styled.TextInput<{ heightSize: number }>`
  font-size: ${({ theme }) => theme.fontSize.font20};
  color: ${({ theme }) => theme.color.gray3};
  text-align: center;
  height: ${({ heightSize }) => (heightSize ? `${heightSize}px` : `30px`)};
  padding: 0 16px;
  margin: 0;
`

const BodyEditorText = styled.TextInput<{ _position: boolean }>`
  text-align: ${({ _position }) => !_position && 'center'};
  font-size: ${({ theme }) => theme.fontSize.font14};
  color: ${({ theme }) => theme.color.gray3};
  letter-spacing: -0.2px;
  line-height: 24px;
  width: 100%;
  padding: 0 24px 94px 24px;
`

const Text = styled.Text`
  font-size: ${({ theme }) => theme.fontSize.font14};
  color: ${({ theme }) => theme.color.gray3};
`
