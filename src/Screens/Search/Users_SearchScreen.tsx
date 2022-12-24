import React from 'react';
import UsersSearch from '~/Components/Search/UsersSearch';

export default function UsersSearchScreen({ navigation }: any): JSX.Element {
  return <UsersSearch navigation={navigation} type="user" />;
}
