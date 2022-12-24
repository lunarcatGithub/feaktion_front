import React from 'react';
import useFetch from '@Hooks/useAxiosFetch';
import { useQuery } from 'react-query';

// components
import ContentArchive from '~/Components/ContentsArchive/ContentArchive';

export default function ContentsContinueScreen({
  navigation,
  route,
}: any): JSX.Element {
  const { data } = useQuery(['readed'], () =>
    useFetch({ url: `/feaktion/readed`, method: 'get' }),
  );

  return (
    <ContentArchive
      navigation={navigation}
      route={null}
      type="Continue"
      data={data}
    />
  );
}
