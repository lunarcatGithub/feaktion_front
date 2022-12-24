import React from 'react';
import { MyFictionNavigationStackProps } from '~/Router/types/MyFictionRouterTypes';
import { RouterMoveType } from '~/Router/types/RouterType';

// components

// data
import OtherFictionList from './OtherFictionList';

export default function MyFictionList({
  navigation,
}: MyFictionNavigationStackProps): JSX.Element {
  const params = { params: { type: RouterMoveType.MYFICTION } };

  return <OtherFictionList navigation={navigation} route={params} />;
}
