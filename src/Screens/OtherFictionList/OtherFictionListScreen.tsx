import React from 'react';

// components
import OtherFictionList from '~/Components/FictionList/OtherFictionList';
import { SideBottomNavigationStackProps } from '~/Router/types/SideBottomStackRouterTypes';

export default function OtherFictionListScreen({
  navigation,
  route,
}: SideBottomNavigationStackProps): JSX.Element {
  return <OtherFictionList navigation={navigation} route={route} />;
}
