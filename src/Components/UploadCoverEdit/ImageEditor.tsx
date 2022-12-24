import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import Canvas, { Image } from 'react-native-canvas'
import { Image as RNimage } from 'react-native'
import test from '@Images/test.jpg'

type props =
  | { uri: string | undefined; base64: string | undefined; type: string }
  | undefined

export default function ImageEditor({ imageUri }: { imageUri: props }) {
  // console.log('imageUri', test)
  const [imageTest, setImageTest] = useState()
  const canvasHandler = (canvas: any) => {
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    // ctx.fillStyle = 'purple';
    // ctx.fillRect(0, 0, 100, 100);
    imageHandle(canvas, ctx)
  }

  const imageHandle = (canvas: any, ctx) => {
    if (!imageUri?.uri) return
    // setImageTest(imageUri?.uri)
    const _imageUri = RNimage.resolveAssetSource(imageUri).base64
    console.log('_imageUri', imageUri?.uri)
    const canvasImage = new Image(canvas, 0, 0)
    canvasImage.src = _imageUri
    // canvasImage.src = imageUri?.uri;
    canvasImage.addEventListener('load', () => {
      // loaded! now you can draw, etc.
      ctx.DrawImage(canvasImage, 0, 0)
    })
  }
  // 개발 목표
  // 1. 이미지 get
  // 2. 이미지 사이즈 (가변) - 넘지 않도록
  // 3. Text input
  // 4. drawing
  // 5. filter
  // 6. undo, redo
  // 7. save

  return (
    <ImageLayout>
      <Canvas ref={canvasHandler} />
      <Test source={require('@Images/test.jpg')} />
    </ImageLayout>
  )
}

const ImageLayout = styled.View`
  width: 100%;
  height: 100%;
`

const Test = styled.Image`
  flex: 1;
`
