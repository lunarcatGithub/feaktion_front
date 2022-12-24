import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

// screens
import GenreScreen from '~/Screens/Genre/GenreScreen'
import ViewScreen from '~/Screens/View/ViewScreen'
import UploadCoverScreen from '~/Screens/Upload/UploadCoverScreen'
import UploadCoverEditScreen from '~/Screens/Upload/UploadCoverEditScreen'
import EditorWorkCheckScreen from '~/Screens/Upload/EditorWorkCheck'
import ReplyScreen from '~/Screens/Comment/ReplyScreen'
import FictionEditorScreen from '~/Screens/Upload/FictionEditorScreen'
import FictionSceneScreen from '~/Screens/Upload/FictionSceneScreen'
import SavedWorkScreen from '~/Screens/Upload/SavedWorkScreen'
import UserNoticeScreen from '~/Screens/Upload/UserNoticeScreen'
import UserNoticeUploadScreen from '~/Screens/Upload/UserNoticeUploadScreen'
import InheritFictionScreen from '~/Screens/Upload/InheritFictionScreen'
import CommentScreen from '~/Screens/Comment/CommentScreen'

const UploadStack = createNativeStackNavigator()
const UploadStackList = [
  { key: 0, name: 'GenreSelect', component: GenreScreen },
  { key: 1, name: 'UploadCover', component: UploadCoverScreen },
  { key: 2, name: 'UploadCoverEdit', component: UploadCoverEditScreen },
  { key: 3, name: 'FictionEditor', component: FictionEditorScreen },
  { key: 4, name: 'FictionScene', component: FictionSceneScreen },
  { key: 5, name: 'EditorWorkCheck', component: EditorWorkCheckScreen },
  { key: 6, name: 'Comment', component: CommentScreen },
  { key: 7, name: 'Reply', component: ReplyScreen },
  { key: 8, name: 'SavedWork', component: SavedWorkScreen },
  { key: 9, name: 'InheritFiction', component: InheritFictionScreen },
  { key: 10, name: 'Preview', component: ViewScreen },
  { key: 11, name: 'UserNotice', component: UserNoticeScreen },
  { key: 12, name: 'UserNoticeUpload', component: UserNoticeUploadScreen },
]

export const UploadStackRouter = (): JSX.Element => (
  <UploadStack.Navigator>
    {UploadStackList?.map(uploadStack => (
      <UploadStack.Screen
        {...uploadStack}
        options={{
          headerShown: false,
        }}
      />
    ))}
  </UploadStack.Navigator>
)
