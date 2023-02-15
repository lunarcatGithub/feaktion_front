import React, { useState, createContext, Dispatch, SetStateAction } from 'react'

export type adjustText = {
    backcolor: string
    bright: number
    font: string
    textsize: number
    spaceline: number
    spacepragraph: number
    pragraphwidth: number
}

export type viewDataType = {
    comment: {
        comment_id: number
        episode_id: number
        user_id: number | string
        comment_body: string
        comment_updatadate: Date
    }[]
    isLoading: boolean
    episode_title: string
    episodeTitle: string
    isWriter: boolean
    feaktion_title: string
    episode_like: { like_id: number }[]
    feaktion_user: { nickname: string }
    writer_comment: string
    scenes: []
}

export type appType = {
    currentScroll: {} | null
    setNewFictionCover: Dispatch<SetStateAction<{}>>
    adjustViewText: adjustText
    setAdjustViewText: Dispatch<SetStateAction<adjustText>>
    episodePostId: number
    setEpisodePostId: Dispatch<SetStateAction<number>>
    fictionPostId: number
    setFictionPostId: Dispatch<SetStateAction<number>>
    viewData: viewDataType | null
    setViewData: Dispatch<SetStateAction<viewDataType | null>>
    isWrite: boolean
    setIsWrite: Dispatch<SetStateAction<boolean>>
    curEpisodeCount: number[]
    setCurEpisodeCount: Dispatch<SetStateAction<number[]>>
    viewFictionData: any
    setViewFictionData: Dispatch<SetStateAction<any>>
}

export const ViewContext = createContext<appType | null>(null)

export default function ViewStore({
    children,
}: {
    children: React.ReactNode
}): JSX.Element {
    // upload value
    const [currentScroll, setNewFictionCover] = useState<{} | null>(null)

    // viewer control
    const [adjustViewText, setAdjustViewText] = useState<adjustText>({
        backcolor: 'image',
        bright: 0.5,
        font: 'system',
        textsize: 14,
        spaceline: 24,
        spacepragraph: 1,
        pragraphwidth: 16,
    })

    const [episodePostId, setEpisodePostId] = useState<number>(0)
    const [fictionPostId, setFictionPostId] = useState<number>(0)

    // view data
    const [viewData, setViewData] = useState<viewDataType | null>(null)
    const [curEpisodeCount, setCurEpisodeCount] = useState([0])

    // fiction data
    const [viewFictionData, setViewFictionData] = useState({})
    // isMe
    const [isWrite, setIsWrite] = useState(false)

    return (
        <ViewContext.Provider
            value={{
                // data
                currentScroll,
                setNewFictionCover,
                setAdjustViewText,
                adjustViewText,
                episodePostId,
                setEpisodePostId,
                fictionPostId,
                setFictionPostId,

                // viewData
                viewData,
                setViewData,
                curEpisodeCount,
                setCurEpisodeCount,
                // isMe
                isWrite,
                setIsWrite,
                // fictionData
                viewFictionData,
                setViewFictionData,
            }}>
            {children}
        </ViewContext.Provider>
    )
}
