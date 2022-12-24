import React from 'react';
import { useQuery } from 'react-query';
import useFetch from '@Hooks/useAxiosFetch';

// components
import ContentArchive from '~/Components/ContentsArchive/ContentArchive';

export default function ContentsPreferredScreen({ navigation, route }: any) {
  const { data } = useQuery(['favorite'], () =>
    useFetch({ url: `/feaktion/favorite`, method: 'get' }),
  );

  return (
    <ContentArchive
      navigation={navigation}
      type="Preferred"
      data={data}
      route={route}
    />
  );
}
