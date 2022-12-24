import React from 'react';

// components
import UserBoard from '~/Components/Board/UserBoard';

export default function UserBoardScreen({ navigation, route }): JSX.Element {
  return <UserBoard navigation={navigation} route={route} />;
}
