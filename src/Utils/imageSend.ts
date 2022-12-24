import { UseMutationResult } from 'react-query/types/react/types'

type imagePromise = {
  index: number
  name: string
  buff: ArrayBufferLike
  type: string
}[]

export default function imageSend(
  bufferResult: imagePromise,
  putImageUrl: string,
  imageMutate: UseMutationResult<any, unknown, any, unknown>
) {
  return bufferResult?.map(async ({ name, buff, type }) => {
    if (!name) return
    const headers = {
      'Content-Encoding': 'base64', // required
      'Content-Type': `${type}`, // required. Notice the back ticks
    }

    return await imageMutate
      ?.mutateAsync({
        url: `${putImageUrl + name}`,
        data: buff,
        headers,
      })
      .then(result => {
        const { status } = result
        if (![200, 201].includes(status)) return 'image error'
      })
      .catch(err => console.error(err))
  })
}
