import React from 'react';
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBarProps,
} from '@react-navigation/material-top-tabs';

// screens
import LatestSearchScreen from '~/Screens/Search/Latest_SearchScreen';
import TrendSearchScreen from '~/Screens/Search/Trend_SearchScreen';
import UsersSearchScreen from '~/Screens/Search/Users_SearchScreen';

// components
import TabBar from '~/Components/TabBar/TabBar';

const SearchTopTabs = createMaterialTopTabNavigator();
const SearchTopTabList = [
  //   { key: 0, name: 'TrendSearch', component: TrendSearchScreen },
  { key: 1, name: 'LatestSearch', component: LatestSearchScreen },
  {
    key: 2,
    name: 'UsersSearch',
    component: UsersSearchScreen,
  },
];

export const SearchTopTabRouter = (): JSX.Element => (
  <SearchTopTabs.Navigator
    backBehavior="none"
    tabBar={(props: MaterialTopTabBarProps) => (
      <TabBar {...props} type="Search" />
    )}>
    {SearchTopTabList?.map(searchTopTab => (
      <SearchTopTabs.Screen {...searchTopTab} />
    ))}
  </SearchTopTabs.Navigator>
);
