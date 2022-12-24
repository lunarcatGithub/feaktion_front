import React from 'react';
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBarProps,
} from '@react-navigation/material-top-tabs';

// screens
import AllNotificationScreen from '~/Screens/Notification/All_NotificationScreen';
import CommentNotificationScreen from '~/Screens/Notification/Comment_NotificationScreen';
import PreferenceNotificationScreen from '~/Screens/Notification/Preference_NotificationScreen';
import NoticeNotificationScreen from '~/Screens/Notification/Notice_NotificationScreen';

// components
import TabBar from '~/Components/TabBar/TabBar';

const NotificationTopTabs = createMaterialTopTabNavigator();
const UploadStackList = [
  { key: 0, name: 'AllNotification', component: AllNotificationScreen },
  { key: 1, name: 'CommentNotification', component: CommentNotificationScreen },
  {
    key: 2,
    name: 'FeaktionNotification',
    component: PreferenceNotificationScreen,
  },
  { key: 3, name: 'NoticeNotification', component: NoticeNotificationScreen },
];

export const NotificationTopTabRouter = (): JSX.Element => (
  <NotificationTopTabs.Navigator
    backBehavior="none"
    tabBar={(props: MaterialTopTabBarProps) => (
      <TabBar {...props} type="Notification" />
    )}>
    {UploadStackList?.map(uploadStack => (
      <NotificationTopTabs.Screen {...uploadStack} />
    ))}
  </NotificationTopTabs.Navigator>
);
