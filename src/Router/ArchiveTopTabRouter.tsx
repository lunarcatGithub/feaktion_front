import React from 'react';
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBarProps,
} from '@react-navigation/material-top-tabs';

// component
import TabBar from '~/Components/TabBar/TabBar';
// screens
import ContentsPreferredScreen from '~/Screens/ContentsArchive/ContentsPreferredScreen';
import ContentsContinueScreen from '~/Screens/ContentsArchive/ContentsContinueScreen';

const ArchiveTopTabs = createMaterialTopTabNavigator();
const ArchiveTopTabList = [
  { key: 0, name: 'Preferred', component: ContentsPreferredScreen },
  { key: 1, name: 'Continue', component: ContentsContinueScreen },
];

export const ArchiveTopTabRouter = (): JSX.Element => (
  <ArchiveTopTabs.Navigator
    backBehavior="none"
    tabBar={(props: MaterialTopTabBarProps) => (
      <TabBar {...props} type="ContentsArchive" />
    )}>
    {ArchiveTopTabList?.map(archiveTopTabStack => (
      <ArchiveTopTabs.Screen {...archiveTopTabStack} />
    ))}
  </ArchiveTopTabs.Navigator>
);
